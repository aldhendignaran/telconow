# Auth Spec

NextAuth.js v4 with a credentials provider. JWT session strategy.

---

## Why v4, not v5

Auth.js v5 shipped as stable in 2025 but is a **complete API rewrite** —
`getServerSession` replaced by `auth()`, different config export pattern,
different middleware integration. Migrating mid-project is a breaking change
across every Server Component and Server Action that reads the session.

v4 is in maintenance mode (security fixes only, no new features) and is
stable. It is the correct choice for this project. Install with `next-auth@4`
to pin the major version — `npm install next-auth` without a pin will install
v5 and nothing in this spec will work.

Migrate to v5 on the next greenfield project, not this one.

---

## Session strategy

JWT-based (`strategy: "jwt"`). No DB session table required.

- Token is httpOnly, signed with `NEXTAUTH_SECRET` — never readable by JS
- Token max age: 30 days
- Token rotation: every 24 hours (`updateAge`)
- On rotation: re-fetches customer from DB so plan/usage changes propagate
  without forcing re-login
- If customer no longer exists on rotation: token cleared → user is
  effectively signed out on next request

---

## Types

All interfaces (`TCustomerPlan`, `TActivity`, `TCustomer`, `TCustomerPublic`,
plus usage/billing/addon/ticket types) live in `brief/data-model.md` —
that's the single source, implemented in `types/data-model.ts` (see
`.claude/stubs/auth-scaffold.md` File 1b). Don't re-paste type blocks
elsewhere.

The shape to know for this spec: `TCustomerPublic` is now identity +
plan only (`id`, `name`, `email`, `plan`) — `passwordHash` never leaves
`authorize()`. Usage, billing, and activity are no longer part of the
session/JWT — see `data-model.md`'s "why the session shape shrank"
section for the reasoning.

---

## Auth flow

```
1. User submits /login form
2. signIn("credentials", { email, password, callbackUrl: "/dashboard" })
3. NextAuth → authorize()
   a. findCustomerByEmail(email)  — null → return null (CredentialsSignin error)
   b. bcrypt.compare(password, hash)  — false → return null
   c. Strip passwordHash → return TCustomerPublic
4. jwt() callback: encode TCustomerPublic into token.customer
5. session() callback: assign token.customer to session.user
6. httpOnly JWT cookie set
7. Redirect to callbackUrl (/dashboard)
```

---

## Error handling on /login

NextAuth surfaces auth failures as `?error=CredentialsSignin` on the
`pages.error` route (set to `/login`). The login form reads this query
param and shows an inline error message. No full-page reload required.

Do not expose which field failed (email not found vs wrong password) —
return the same generic message for both.

**Generic message:** "Incorrect email or password. Please try again."

---

## Security checklist

- [x] `passwordHash` stripped in `authorize()` before returning — enforced by `TCustomerPublic` type
- [x] `NEXTAUTH_SECRET` min 32 random bytes — generate with `openssl rand -base64 32`
- [x] CSRF protection on by default for credentials provider in NextAuth v4 — do not disable
- [x] JWT is httpOnly cookie — never accessible via `document.cookie`
- [x] `debug: true` only in development
- [x] Session data only exposed via `useSession()` / `getServerSession()` — never serialised to props manually
- [ ] NEXTAUTH_SECRET must be rotated if exposed — invalidates all sessions

---

## CRITICAL — rate limiting on `/login`

The `authorize()` callback as specced has no rate limiting. A credentials
provider with no throttling is open to credential stuffing — an attacker
can script unlimited login attempts against `findCustomerByEmail` +
`bcrypt.compare` with no friction.

**Fix:** add rate limiting at the `authorize()` level, keyed by email +
IP. Two options depending on infra:

- **Simple (no new infra):** in-memory token bucket in `lib/auth.ts`,
  reset on server restart. Fine for a single-region Vercel deployment
  with low traffic, not fine if you scale to multiple regions (each
  instance has its own bucket).
- **Correct for production:** Vercel KV or Upstash Redis-backed rate
  limiter (`@upstash/ratelimit`), shared across all serverless instances.
  Limit: 5 attempts per email per 15 minutes, 20 attempts per IP per hour.

```typescript
// lib/rate-limit.ts — sketch, wire to Upstash before production
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
});

export async function checkLoginRateLimit(email: string) {
  const { success } = await ratelimit.limit(`login:${email.toLowerCase()}`);
  return success;
}
```

Call `checkLoginRateLimit(credentials.email)` as the first line of
`authorize()` in `.claude/stubs/auth-scaffold.md` File 3 — return `null` immediately if
it fails, before touching the DB or bcrypt.

---

## WARNING — account lockout

Beyond rate limiting (which slows an attacker), there's no lockout
behaviour after repeated failures on a *specific* account. Decide now,
don't leave it implicit:

- **Recommended for this project size:** no hard lockout (avoids a DoS
  vector where an attacker locks out a real customer by deliberately
  failing their login). Rely on rate limiting above instead.
- If the business wants lockout anyway, it needs a `failedAttempts` +
  `lockedUntil` field on `TCustomer` and a support-team unlock flow —
  that's a real feature, not a checkbox. Flag to the client before
  committing to it.

---

## ASSUMPTION — session invalidation on password change

Not addressed anywhere: if a customer changes their password (a feature
not yet built, but implied by "forgot password" placeholder), what
happens to their *existing* JWT sessions on other devices?

JWT sessions are stateless — there's no server-side session table to
invalidate. A password change does **not** automatically kill existing
tokens under the current `strategy: "jwt"` design.

**Decide before building password reset:** either (a) accept that old
sessions remain valid until natural expiry (30 days) after a password
change — acceptable for a low-stakes telco portal, document it as a
known limitation — or (b) move to `strategy: "database"` sessions so
sessions can be revoked server-side, which is a bigger architectural
change than it sounds (requires a sessions table, adapter, DB writes
on every request). Don't discover this mid-build.
