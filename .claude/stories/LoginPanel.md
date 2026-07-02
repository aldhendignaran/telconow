# Story: LoginPanel

**Story ID:** TN-007
**Component:** `LoginPanel.tsx`
**Design reference:** `/designs/TelcoNow_Login_dc.html` → "Full login page"
**Stub data:** None — calls NextAuth `signIn("credentials", ...)` directly

---

## Story

As a TelcoNow customer
I want to sign in with my email and password
So that I can access my account dashboard

---

## Acceptance criteria

### Happy path

```
Given I am on /login and not authenticated
When the page loads
Then I see a two-panel layout:
  - Left 45%: dark purple bg-panel background, TelcoNow wordmark,
    eyebrow label "YOUR ACCOUNT", h2 "Your account. Your data. Always in control.",
    3 check bullets (View real-time usage / Manage your plan / Pay your bill),
    decorative SVG at the bottom of the panel
  - Right 55%: white bg-surface background, h1 "Welcome back.",
    subtitle "Sign in to your TelcoNow account",
    email field, password field with show/hide toggle,
    "Forgot password?" link aligned right of the password label,
    full-width "Sign in" button,
    "Don't have an account? Get started →" link at the bottom
```

```
Given I enter a valid email and password and click "Sign in"
When NextAuth authorize() succeeds
Then I am redirected to /dashboard
```

```
Given the password field is visible and I click the show/hide toggle
When the toggle is clicked once
Then the password field switches to type="text" (characters visible)
When clicked again
Then the field returns to type="password"
And the toggle uses an eye SVG icon matching the design
```

### Loading state (submit)

```
Given I have entered my email and password
When I click "Sign in"
Then the button shows a loading/disabled state (opacity reduced, pointer-events none)
And the button text changes to "Signing in…"
And the form cannot be submitted again while in-flight
```

_Note: this component is a form, not a data-fetching component. No skeleton
loader is required. The "loading state" is the in-flight submit state only._

### Error state (auth failure)

```
Given NextAuth returns ?error=CredentialsSignin in the URL
When the page renders
Then an inline error banner appears above the Sign in button
And the message reads: "Incorrect email or password. Please try again."
And the banner is announced via aria-live="polite"
And no full-page reload occurs
```

```
Given the email field is empty and I submit the form
Then the email field shows a validation error: "Email is required"
```

```
Given the password field is empty and I submit the form
Then the password field shows a validation error: "Password is required"
```

### Edge cases

```
Given I am already authenticated (valid session exists)
When I navigate to /login
Then I am redirected to /dashboard immediately
And the login form is never rendered
```

```
Given I am on /login?callbackUrl=/dashboard/billing
When I sign in successfully
Then I am redirected to /dashboard/billing, not just /dashboard
```

```
Given I am on a viewport narrower than 768px (md breakpoint)
Then the left decorative panel is hidden
And the right form panel occupies the full width
And the form is horizontally centred
```

---

## Out of scope

- "Forgot password" link functionality — renders as `href="#"` placeholder only
- "Get started" link functionality — renders as `href="#"` placeholder only; no signup flow specced
- Rate limiting UI — handled server-side in `authorize()`, no UI feedback beyond the generic error message
- Account lockout UI — not in scope per `auth-spec.md`

---

## Notes for developer

- **`"use client"` required** — component owns `useState` for password visibility
  and loading state, and reads `useSearchParams()` for the `?error=` param
- **File:** `src/app/login/_components/login-form.tsx` for the form (client);
  `src/app/login/page.tsx` is a Server Component that wraps it and handles
  the already-authenticated redirect via `getServerSession(authOptions)`
- **Left panel SVG** — copy verbatim from `/designs/TelcoNow_Login_dc.html`.
  Do not reconstruct. Convert HTML attrs to JSX camelCase only.
- **Token classes** — left panel bg: `bg-panel`; right panel bg: `bg-surface`;
  heading on left: `text-text-inverse`; muted on left: `text-text-onDarkMuted`;
  eyebrow: `text-xs font-medium uppercase tracking-wide` + `text-text-onDarkMuted`;
  h1 on right: `text-[32px] font-bold tracking-tight` (no named token at 32px — use custom size, same pattern as BlogSection h2)
- **Atoms to use** — `FormField` for both fields, `Button` for submit,
  `Stack` for form layout; `Input` already has a `suffix` prop for the
  show/hide toggle — use it
- **Check bullet circle** — `bg-accent/35 border border-accent/60 rounded-full`
  with inline check SVG copied from the design (not a lucide icon)
- **Password suffix button** — plain `<button type="button">` inside the
  Input `suffix` prop; `text-text-secondary hover:text-accent transition-colors`
- **signIn call** — `signIn("credentials", { email, password, redirect: false })`
  then check `result.error` for inline display; if `result.ok` call
  `router.push(callbackUrl ?? "/dashboard")`
- **callbackUrl** — read from `useSearchParams().get("callbackUrl")`, pass
  through to the redirect on success
- **`aria-live` region** — wrap the inline error in
  `<div role="alert" aria-live="polite">` so screen readers announce it
  without a page reload
