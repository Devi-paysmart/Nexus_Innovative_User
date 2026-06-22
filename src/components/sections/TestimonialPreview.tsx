import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "../../data/siteContent";
import { SectionReveal } from "../common/SectionReveal";

export function TestimonialPreview() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const prev = () => setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <div className="mb-12 text-center">
            <p className="eyebrow mb-4">Client Stories</p>
            <h2 className="font-display text-4xl text-ink dark:text-paper lg:text-5xl">What they say</h2>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="glass relative rounded-3xl p-8 shadow-luxe-sm lg:p-12 dark:glass-dark">
            <Quote className="mb-6 text-gold/40" size={40} />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <blockquote className="font-display text-2xl leading-relaxed text-ink dark:text-paper lg:text-3xl">
                  "{current.quote}"
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <img
                    src={current.image}
                    alt={current.author}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-ink dark:text-paper">{current.author}</p>
                    <p className="text-sm text-ink/50 dark:text-paper/50">
                      {current.role}, {current.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="rounded-full border border-ink/10 p-2.5 transition-colors hover:border-gold-deep hover:text-gold-deep dark:border-paper/15"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="rounded-full border border-ink/10 p-2.5 transition-colors hover:border-gold-deep hover:text-gold-deep dark:border-paper/15"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </SectionReveal>

        <div className="mt-12 text-center">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep hover:underline hover:text-gold transition-colors"
          >
            Explore all testimonials →
          </Link>
        </div>
      </div>
    </section>
  );
}
