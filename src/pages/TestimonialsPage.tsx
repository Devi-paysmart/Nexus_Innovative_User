import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "../data/siteContent";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";

export function TestimonialsPage() {
  const [active, setActive] = useState(0);

  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionReveal>
            <p className="eyebrow mb-4">Testimonials</p>
            <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-6xl">
              Trusted by industry leaders
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              {testimonials.map((t) => (
                <article
                  key={t.id}
                  className="glass rounded-3xl p-8 shadow-luxe-sm dark:glass-dark"
                >
                  <Quote className="mb-4 text-gold/30" size={32} />
                  <blockquote className="font-display text-xl leading-relaxed text-ink dark:text-paper">
                    "{t.quote}"
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4 border-t border-ink/8 pt-6 dark:border-paper/10">
                    <img src={t.image} alt={t.author} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-ink dark:text-paper">{t.author}</p>
                      <p className="text-sm text-ink/50 dark:text-paper/50">
                        {t.role}, {t.company}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="mt-20 overflow-hidden rounded-3xl bg-ink p-10 lg:p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <p className="font-display text-2xl text-paper lg:text-4xl">
                    "{testimonials[active].quote}"
                  </p>
                  <p className="mt-6 text-gold-light">{testimonials[active].author}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === active ? "w-8 bg-gold" : "w-2 bg-paper/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </PageTransition>
  );
}
