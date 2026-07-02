import { Container } from "@/components/layout/Container";
import { Cluster } from "@/components/layout/Cluster";

function GiftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="8" width="18" height="13" rx="2" stroke="#460073" strokeWidth="1.8" />
      <path d="M3 12h18" stroke="#460073" strokeWidth="1.8" />
      <path d="M12 8V21" stroke="#460073" strokeWidth="1.8" />
      <path
        d="M12 8C12 8 9 8 9 5.5C9 4 10 3 11.5 3C13 3 12 5 12 8Z"
        stroke="#460073"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 8C12 8 15 8 15 5.5C15 4 14 3 12.5 3C11 3 12 5 12 8Z"
        stroke="#460073"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

const referBtnClasses =
  "inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-text-inverse transition-colors hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

export function PromoBanner() {
  return (
    <section className="w-full border-y border-accent-tint2 bg-accent-tint">
      <Container>
        <div className="flex h-[120px] items-center justify-between gap-8">
          <Cluster className="gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-tint2">
              <GiftIcon />
            </div>
            <div>
              <h2 className="mb-1 text-[22px] font-bold tracking-tight text-text-primary">
                Refer a friend, get one month free.
              </h2>
              <p className="text-[15px] text-text-secondary">
                Share your code. When they sign up, you both win.
              </p>
            </div>
          </Cluster>

          <a href="#" className={referBtnClasses}>
            Refer now
          </a>
        </div>
      </Container>
    </section>
  );
}
