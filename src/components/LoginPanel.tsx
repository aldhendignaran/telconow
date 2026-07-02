"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Stack } from "@/components/layout/Stack";
import { Button } from "@/components/ui/atoms/Button";
import { Label } from "@/components/ui/atoms/Label";
import { Input } from "@/components/ui/atoms/Input";
import { FormField } from "@/components/ui/molecules/FormField";

function CheckBullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[15px] leading-[1.5] text-text-inverse/[0.92]">
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-accent/60 bg-accent/35">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l3 3 5-5"
            stroke="#E5CCFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span>{children}</span>
    </div>
  );
}

export function LoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError ? "Incorrect email or password. Please try again." : null
  );
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(undefined);
    setPasswordError(undefined);
    setError(null);

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
    } else if (result?.ok) {
      router.push(callbackUrl ?? "/dashboard");
    }
  }

  return (
    <div className="flex h-screen min-h-[600px] overflow-hidden">

      {/* ── Left panel ── */}
      <div className="relative hidden flex-col overflow-hidden bg-panel md:flex md:w-[45%]">

        {/* Wordmark */}
        <div className="relative z-[2] shrink-0 px-9 py-8">
          <span className="text-[20px] font-bold tracking-tight text-text-inverse">
            Telco<span className="text-accent-tint2">Now</span>
          </span>
        </div>

        {/* Centre content */}
        <div className="relative z-[2] flex flex-1 flex-col justify-center gap-8 px-12 pb-20">
          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.06em] text-text-onDarkMuted">
              Your account
            </p>
            <h2 className="text-[28px] font-semibold leading-[1.3] tracking-tight text-text-inverse">
              Your account.<br />
              Your data.<br />
              Always in control.
            </h2>
          </div>

          <Stack gap={4}>
            <CheckBullet>View real-time usage</CheckBullet>
            <CheckBullet>Manage your plan</CheckBullet>
            <CheckBullet>Pay your bill</CheckBullet>
          </Stack>
        </div>

        {/* Decorative SVG — verbatim from TelcoNow_Login_dc.html, attrs camelCased */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1]">
          <svg
            width="100%"
            viewBox="0 0 540 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <circle cx="60" cy="320" r="120" stroke="rgba(161,0,255,0.2)"   strokeWidth="1" fill="none" />
            <circle cx="60" cy="320" r="180" stroke="rgba(161,0,255,0.14)"  strokeWidth="1" fill="none" />
            <circle cx="60" cy="320" r="240" stroke="rgba(161,0,255,0.09)"  strokeWidth="1" fill="none" />
            <circle cx="60" cy="320" r="300" stroke="rgba(161,0,255,0.06)"  strokeWidth="1" fill="none" />
            <circle cx="460" cy="300" r="80" stroke="rgba(229,204,255,0.08)" strokeWidth="1" fill="none" />
            <circle cx="460" cy="300" r="50" stroke="rgba(229,204,255,0.12)" strokeWidth="1" fill="none" />
            <g stroke="rgba(161,0,255,0.22)" strokeWidth="0.8" fill="none">
              <polygon points="300,200 326,215 326,245 300,260 274,245 274,215" />
              <polygon points="326,215 352,230 352,260 326,275 300,260 300,230" />
              <polygon points="274,215 300,230 300,260 274,275 248,260 248,230" />
              <polygon points="352,260 378,275 378,305 352,320 326,305 326,275" />
              <polygon points="300,260 326,275 326,305 300,320 274,305 274,275" />
              <polygon points="248,260 274,275 274,305 248,320 222,305 222,275" />
            </g>
            <path d="M 480 0 Q 480 80 400 120"   stroke="rgba(161,0,255,0.3)"  strokeWidth="1.5" fill="none" />
            <path d="M 540 0 Q 540 120 430 170"  stroke="rgba(161,0,255,0.2)"  strokeWidth="1.2" fill="none" />
            <path d="M 540 40 Q 520 140 450 195" stroke="rgba(161,0,255,0.15)" strokeWidth="1"   fill="none" />
            <circle cx="400" cy="120" r="4" fill="#A100FF" opacity="0.7" />
            <circle cx="430" cy="170" r="3" fill="#7500C0" opacity="0.5" />
            <circle cx="352" cy="215" r="3" fill="#E5CCFF" opacity="0.4" />
            <circle cx="300" cy="200" r="4" fill="#A100FF" opacity="0.5" />
            <rect x="0" y="200" width="540" height="120" fill="url(#bottomFade)" />
            <defs>
              <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#460073" stopOpacity="0" />
                <stop offset="100%" stopColor="#460073" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex w-full items-center justify-center bg-surface p-12 md:w-[55%]">
        <div className="w-full max-w-[400px]">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="mb-2 text-[32px] font-bold tracking-tight text-text-primary">
              Welcome back.
            </h1>
            <p className="text-[15px] leading-[1.5] text-text-secondary">
              Sign in to your TelcoNow account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap={5}>

              {/* Email */}
              <FormField
                id="email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />

              {/* Password — custom header row for the "Forgot password?" link */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-[13px] font-medium text-accent transition-colors hover:text-accent-hover hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-text-secondary transition-colors hover:text-accent"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                          d="M1 9C1 9 4 3 9 3C14 3 17 9 17 9C17 9 14 15 9 15C4 15 1 9 1 9Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                  }
                />
              </div>

              {/* Inline auth error */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="mt-1 w-full"
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>

            </Stack>
          </form>

          {/* Sign-up footer */}
          <p className="mt-8 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="font-semibold text-accent transition-colors hover:text-accent-hover hover:underline"
            >
              Get started →
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
