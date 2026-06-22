import { useState } from "react";
import { customizationServices } from "../data/siteContent";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";

function BeforeAfterSlider({
  before,
  after,
  title,
}: {
  before: string;
  after: string;
  title: string;
}) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
      <img src={after} alt={`${title} after`} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={before}
          alt={`${title} before`}
          className="h-full w-full object-cover"
          style={{ width: `${100 / (position / 100)}%`, maxWidth: "none" }}
        />
      </div>
      <input
        type="range"
        min={5}
        max={95}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-x-4 bottom-4 z-10 w-[calc(100%-2rem)] accent-gold"
        aria-label={`Compare before and after for ${title}`}
      />
      <div
        className="absolute bottom-0 top-0 w-0.5 bg-gold"
        style={{ left: `${position}%` }}
      />
    </div>
  );
}

export function CustomizationPage() {
  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionReveal>
            <p className="eyebrow mb-4">Customization & Branding</p>
            <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-6xl">
              Your brand, beautifully applied
            </h1>
            <p className="mt-4 max-w-2xl text-ink/60 dark:text-paper/60">
              Logo printing, laser engraving, custom packaging, and brand-color integration —
              every touchpoint reflects your identity.
            </p>
          </SectionReveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            {customizationServices.map((service, i) => (
              <SectionReveal key={service.title} delay={i * 0.1}>
                <div>
                  <BeforeAfterSlider
                    before={service.before}
                    after={service.after}
                    title={service.title}
                  />
                  <h3 className="mt-6 font-display text-2xl text-ink dark:text-paper">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                    {service.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.2}>
            <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["Brand Colors", "Product Mockups", "Custom Ribbons", "Gift Inserts"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-ink/8 p-6 text-center dark:border-paper/10"
                >
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gold/15" />
                  <p className="font-medium text-ink dark:text-paper">{item}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </PageTransition>
  );
}
