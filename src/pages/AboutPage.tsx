import { teamMembers, companyValues, caseStudies } from "../data/siteContent";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";
import { AnimatedCounter } from "../components/common/AnimatedCounter";

export function AboutPage() {
  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionReveal>
            <p className="eyebrow mb-4">About Nexus</p>
            <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-6xl">
              Gifting with purpose since 2010
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/60 dark:text-paper/60">
              Nexus is a name that represents trust, superior craftsmanship, extravagant
              designs, international aesthetics, and unrivalled quality. Trusted by more than
              500 enterprise clients, we have evolved into a gifting hub preferred by India's
              best corporates.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {[
                { to: 15, suffix: "+", label: "Years of excellence" },
                { to: 500, suffix: "+", label: "Enterprise clients" },
                { to: 2000, suffix: "+", label: "Products curated" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-ink/8 p-8 text-center dark:border-paper/10"
                >
                  <p className="font-display text-4xl text-gold-deep">
                    <AnimatedCounter to={stat.to} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-ink/50 dark:text-paper/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </SectionReveal>

          <div className="mt-24 grid gap-12 lg:grid-cols-2">
            <SectionReveal>
              <h2 className="font-display text-3xl text-ink dark:text-paper">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-ink/60 dark:text-paper/60">
                To transform corporate gifting from a transactional necessity into a strategic
                brand differentiator — delivering premium experiences that build lasting
                relationships.
              </p>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="font-display text-3xl text-ink dark:text-paper">Our Vision</h2>
              <p className="mt-4 leading-relaxed text-ink/60 dark:text-paper/60">
                To be India's most trusted corporate gifting partner — setting the global
                standard for quality, customization, and enterprise-scale delivery.
              </p>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.15}>
            <div className="mt-20">
              <h2 className="mb-10 font-display text-3xl text-ink dark:text-paper">Our Values</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {companyValues.map((v) => (
                  <div
                    key={v.title}
                    className="rounded-2xl bg-cloud p-6 dark:bg-ink-soft/50"
                  >
                    <h3 className="font-display text-xl text-ink dark:text-paper">{v.title}</h3>
                    <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="mt-24">
              <p className="eyebrow mb-4">Leadership</p>
              <h2 className="font-display text-3xl text-ink dark:text-paper">Meet the team</h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="group text-center">
                    <div className="mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-3xl">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-xl text-ink dark:text-paper">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gold-deep">{member.role}</p>
                    <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.25}>
            <div className="mt-24">
              <p className="eyebrow mb-4">Success Stories</p>
              <div className="grid gap-6 lg:grid-cols-3">
                {caseStudies.map((cs) => (
                  <div
                    key={cs.id}
                    className="rounded-2xl border border-ink/8 p-6 dark:border-paper/10"
                  >
                    <p className="text-xs text-gold-deep">{cs.client}</p>
                    <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">{cs.solution}</p>
                    <p className="mt-4 font-display text-2xl text-gold-deep">{cs.results.metric}</p>
                    <p className="text-xs text-ink/50">{cs.results.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </PageTransition>
  );
}
