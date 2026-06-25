import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SectionReveal } from "../common/SectionReveal";
import { MagneticButton } from "../common/MagneticButton";
import { clientLogos } from "../../data/siteContent";
import { EnquiryModal } from "../common/EnquiryModal";

/* ── ClientLogos ──────────────────────────────────────────────── */
export function ClientLogos() {
  const doubled = [...clientLogos, ...clientLogos];

  return (
    <section className="border-y border-ink/5 bg-cloud py-16 dark:border-paper/5 dark:bg-ink-soft/30">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <p className="eyebrow mb-8 text-center">Trusted by India's leading enterprises</p>
        </SectionReveal>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-16 whitespace-nowrap">
            {doubled.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-display text-xl text-ink/25 dark:text-paper/25 lg:text-2xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── BudgetCTA ────────────────────────────────────────────────── */
export function BudgetCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionReveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-center lg:px-20 lg:py-24">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative">
                <p className="eyebrow mb-4 text-gold-light">Whatever your budget</p>
                <h2 className="mx-auto max-w-3xl font-display text-3xl text-paper lg:text-5xl">
                  Corporate gifts Starting from ₹1,000 — we have the solution for you
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-paper/60">
                  We ensure gifting becomes a strategic differentiation for you rather than
                  an outsourced function.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <MagneticButton onClick={() => setOpen(true)}>Enquire Now</MagneticButton>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <AnimatePresence>
        {open && <EnquiryModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
