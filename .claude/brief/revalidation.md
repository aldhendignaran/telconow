# Revalidation

One topic: the `/api/revalidate` webhook route that keeps Contentful
content fresh on the homepage without a redeploy.

Referenced by `vercel-setup.md` (deployment config: env var, webhook
registration) and `contentful-setup.md` (data side: cache tag usage in
`lib/contentful.ts`). This file is the single source for the route
implementation itself — don't duplicate it elsewhere.

---

## How it works

```
Contentful publish webhook
  → POST /api/revalidate (Authorization: Bearer secret)
  → revalidateTag('homepage')
  → Next.js purges cached Contentful fetches tagged 'homepage'
```

The `'homepage'` tag is set in every Contentful fetch call
(`lib/contentful.ts` — see `contentful-setup.md`). This route is the
only thing that invalidates it.

---

## Route — `app/api/revalidate/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.CONTENTFUL_REVALIDATE_SECRET ?? ""}`;

  // timingSafeEqual prevents secret leakage via response-time side-channel
  const authBuf = Buffer.from(auth);
  const expectedBuf = Buffer.from(expected);
  const valid =
    authBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(authBuf, expectedBuf);

  if (!valid) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  revalidateTag("homepage");

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
```

---

## Contentful webhook registration

Configure in Contentful → Settings → Webhooks:

| Setting | Value |
|---|---|
| URL | `https://your-project.vercel.app/api/revalidate` |
| Method | POST |
| Trigger | Entry published, Entry unpublished |
| Header | `Authorization: Bearer <CONTENTFUL_REVALIDATE_SECRET>` |

`CONTENTFUL_REVALIDATE_SECRET` — generate with `openssl rand -base64 24`.
Set in Vercel env vars (see `vercel-setup.md`) and in the Contentful
webhook header above. Must match exactly.

---

## Testing locally

Webhooks can't reach `localhost`. To test the route directly:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-secret-here"
```

Expected response: `{ "revalidated": true, "at": "..." }`

Wrong secret → `401 { "error": "Unauthorised" }`

---

## WARNING — no rate limit on this endpoint

The route only checks the `Authorization` header — it has no rate
limiting of its own. If `CONTENTFUL_REVALIDATE_SECRET` ever leaks (logged
accidentally, committed to a public repo, exposed in a misconfigured
client bundle), an attacker can hit this endpoint in a tight loop and
force `revalidateTag('homepage')` repeatedly, which forces a fresh
Contentful fetch on every subsequent homepage request — a cheap way to
drive up Contentful API usage and degrade homepage TTFB for real users.

**Fix:** this is a low-traffic internal endpoint — it should never see
more than a handful of calls per day from the legitimate Contentful
webhook. Add a simple fixed-window rate limit (e.g. 10 requests per
minute) using the same rate-limiting approach as `auth-spec.md`'s
`/login` fix, keyed by IP rather than by secret (since the secret is the
thing that might be compromised). This is defense in depth, not the
primary control — secret rotation is the real fix if it leaks.
