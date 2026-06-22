import { processSteps, caseStudies } from "../data/siteContent";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";

export function HowWeWorkPage() {
  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionReveal>
            <p className="eyebrow mb-4">How We Work</p>
            <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-6xl">
              Discover → Curate → Customize → Deliver
            </h1>
          </SectionReveal>

          <div className="relative mt-20">
            <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-gold via-gold/30 to-transparent lg:block" />
            <div className="space-y-16">
              {processSteps.map((step, i) => (
                <SectionReveal key={step.step} delay={i * 0.1}>
                  <div className="flex flex-col gap-6 lg:flex-row lg:gap-16">
                    <div className="flex items-start gap-6 lg:w-48 lg:shrink-0">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold/15 font-display text-2xl text-gold-deep">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1 rounded-3xl border border-ink/8 p-8 transition-shadow hover:shadow-luxe-sm dark:border-paper/10">
                      <h3 className="font-display text-3xl text-ink dark:text-paper">{step.title}</h3>
                      <p className="mt-4 max-w-xl text-ink/60 dark:text-paper/60">{step.description}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>

          <SectionReveal delay={0.2}>
            <div className="mt-24">
              <p className="eyebrow mb-4">Case Studies</p>
              <h2 className="font-display text-3xl text-ink dark:text-paper lg:text-4xl">
                Proven results at enterprise scale
              </h2>
              <div className="mt-10 grid gap-8 lg:grid-cols-3">
                {caseStudies.map((cs) => (
                  <article
                    key={cs.id}
                    className="group overflow-hidden rounded-3xl border border-ink/8 dark:border-paper/10"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={cs.image}
                        alt={cs.client}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-gold-deep">{cs.client}</p>
                      <h3 className="mt-2 font-display text-xl text-ink dark:text-paper">
                        Challenge
                      </h3>
                      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{cs.challenge}</p>
                      <div className="mt-4 border-t border-ink/8 pt-4 dark:border-paper/10">
                        <p className="font-display text-3xl text-gold-deep">{cs.results.metric}</p>
                        <p className="text-xs text-ink/50 dark:text-paper/50">{cs.results.label}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </PageTransition>
  );
}
