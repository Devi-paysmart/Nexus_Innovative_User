import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "../common/SectionReveal";
import { processSteps } from "../../data/siteContent";

export function ProcessPreview() {
  return (
    <section className="bg-cloud py-24 dark:bg-ink-soft/20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <div className="mb-16 text-center">
            <p className="eyebrow mb-4">How We Work</p>
            <h2 className="font-display text-4xl text-ink dark:text-paper lg:text-5xl">
              From brief to delivery
            </h2>
          </div>
        </SectionReveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <SectionReveal key={step.step} delay={i * 0.1}>
              <div className="group relative rounded-2xl border border-ink/8 bg-paper p-6 transition-shadow hover:shadow-luxe-sm dark:border-paper/10 dark:bg-ink-soft/50">
                <span className="font-display text-4xl text-gold/30">{step.step}</span>
                <h3 className="mt-4 font-display text-xl text-ink dark:text-paper">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55 dark:text-paper/55">
                  {step.description}
                </p>
                {i < processSteps.length - 1 && (
                  <ArrowRight
                    size={16}
                    className="absolute -right-4 top-1/2 hidden text-gold/40 lg:block"
                  />
                )}
              </div>
            </SectionReveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/how-we-work" className="text-sm font-medium text-gold-deep hover:underline">
            Explore our full process →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function NewsletterCTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <div className="rounded-3xl border border-ink/8 bg-gradient-to-br from-cloud to-paper p-10 text-center lg:p-16 dark:border-paper/10 dark:from-ink-soft dark:to-ink">
            <p className="eyebrow mb-4">Stay Inspired</p>
            <h2 className="font-display text-3xl text-ink dark:text-paper lg:text-4xl">
              Gifting trends & catalogue updates
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-ink/55 dark:text-paper/55">
              Join 2,000+ HR and marketing leaders receiving curated gifting insights.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Work email address"
                className="flex-1 rounded-full border border-ink/10 bg-white px-5 py-3 text-sm outline-none focus:border-gold-deep dark:border-paper/15 dark:bg-ink-soft dark:text-paper"
              />
              <button
                type="submit"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-shadow hover:shadow-gold-glow"
              >
                Subscribe
              </button>
            </form>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
