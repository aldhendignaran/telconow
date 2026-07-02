import NextLink from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-panel px-4 text-center">
      {/* Wordmark */}
      <NextLink href="/" className="mb-12 text-xl font-bold tracking-tight text-text-inverse">
        Telco<span className="text-accent-tint2">Now</span>
      </NextLink>

      {/* Decorative concentric circles */}
      <div className="pointer-events-none mb-8 opacity-20" aria-hidden="true">
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="79" stroke="white" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="59" stroke="white" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="39" stroke="white" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="19" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      <p className="mb-2 text-[72px] font-bold leading-none tracking-tight text-text-inverse">
        404
      </p>
      <p className="mb-1 text-xl font-semibold text-text-inverse">Page not found</p>
      <p className="mb-8 text-sm text-text-onDarkMuted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <NextLink
        href="/"
        className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Back to home
      </NextLink>
    </div>
  );
}
