import { Award, Gift, Globe } from "lucide-react";
import { loyaltySteps } from "../data/siteContent";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";
import { AnimatedCounter } from "../components/common/AnimatedCounter";

const icons = { award: Award, gift: Gift, globe: Globe };

export function LoyaltyPage() {
  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionReveal>
            <p className="eyebrow mb-4">Loyalty Program & Microsite</p>
            <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-6xl">
              Reward programs that inspire
            </h1>
            <p className="mt-4 max-w-2xl text-ink/60 dark:text-paper/60">
              A complete employee and client rewards ecosystem with a branded redemption
              microsite, analytics, and 200+ gift options.
            </p>
          </SectionReveal>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {loyaltySteps.map((step, i) => {
              const Icon = icons[step.icon as keyof typeof icons];
              return (
                <SectionReveal key={step.step} delay={i * 0.12}>
                  <div className="glass rounded-3xl p-8 shadow-luxe-sm dark:glass-dark">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15">
                      <Icon className="text-gold-deep" size={24} />
                    </div>
                    <span className="text-sm font-medium text-gold-deep">Step {step.step}</span>
                    <h3 className="mt-2 font-display text-2xl text-ink dark:text-paper">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                      {step.description}
                    </p>
                  </div>
                </SectionReveal>
              );
            })}
          </div>

          <SectionReveal delay={0.2}>
            <div className="mt-20 overflow-hidden rounded-3xl bg-ink p-8 lg:p-12">
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <p className="eyebrow mb-4 text-gold-light">Dashboard Preview</p>
                  <h2 className="font-display text-3xl text-paper">Your branded gifting hub</h2>
                  <p className="mt-4 text-sm text-paper/60">
                    Real-time analytics, budget tracking, approval workflows, and personalized
                    redemption experiences — all under your brand.
                  </p>
                  <div className="mt-8 flex gap-8">
                    <div>
                      <p className="font-display text-3xl text-gold">
                        <AnimatedCounter to={200} suffix="+" />
                      </p>
                      <p className="text-xs text-paper/50">Gift options</p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-gold">
                        <AnimatedCounter to={98} suffix="%" />
                      </p>
                      <p className="text-xs text-paper/50">Redemption rate</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {["Rewards earned", "Gifts redeemed", "Budget utilized"].map((label, i) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-xs text-paper/60">
                        <span>{label}</span>
                        <span>{[78, 62, 45][i]}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-paper/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold-light transition-all duration-1000"
                          style={{ width: `${[78, 62, 45][i]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </PageTransition>
  );
}
