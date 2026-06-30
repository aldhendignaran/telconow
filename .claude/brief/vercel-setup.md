# Vercel Setup

---

## Environment variables

Set in Vercel → Project Settings → Environment Variables.
All are required in production. Copy `.env.local.example` for local dev.

| Variable | Where to get it | Required |
|---|---|---|
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Yes |
| `NEXTAUTH_URL` | Full app URL, no trailing slash | Yes |
| `CONTENTFUL_SPACE_ID` | Contentful → Settings → API keys | Yes |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful → Settings → API keys (Delivery token) | Yes |
| `CONTENTFUL_REVALIDATE_SECRET` | Generate: `openssl rand -base64 24` | Yes |

`.env.local.example` (committed, never `.env.local`):

```bash
# Generate: openssl rand -base64 32
NEXTAUTH_SECRET=

# Local: http://localhost:3000
# Prod: https://your-project.vercel.app
NEXTAUTH_URL=http://localhost:3000

CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=

# Used to verify Contentful webhook origin in /api/revalidate
CONTENTFUL_REVALIDATE_SECRET=
```

---

## Revalidation webhook

The `/api/revalidate` route and Contentful webhook registration are
specced in `brief/revalidation.md` — that's the single source. This file
only owns the `CONTENTFUL_REVALIDATE_SECRET` env var above.

---

## next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net", // Contentful image CDN
      },
    ],
  },
};

export default nextConfig;
```
