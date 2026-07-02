"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-bg mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 9v4M12 17h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#EF4444" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mb-2 text-[28px] font-bold tracking-tight text-text-primary">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-sm text-sm text-text-secondary">
        An unexpected error occurred. Try again — if the problem persists, contact support.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-bg"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
