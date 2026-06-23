import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../data/categories";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";
import { cn } from "../utils/cn";

export function CollectionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const filtered =
    activeTab === "all" ? categories : categories.filter((c) => c.slug === activeTab);

  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionReveal>
            <p className="eyebrow mb-4">Our Collections</p>
            <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-6xl">
              Premium corporate gifting
            </h1>
            <p className="mt-4 max-w-2xl text-ink/60 dark:text-paper/60">
              Explore curated categories designed for every corporate occasion — from onboarding
              to festivals, tech to sustainability.
            </p>
          </SectionReveal>

          <div className="mt-10 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                activeTab === "all"
                  ? "bg-ink text-paper"
                  : "border border-ink/10 text-ink/70 hover:border-gold-deep dark:border-paper/15 dark:text-paper/70"
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveTab(c.slug)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                  activeTab === c.slug
                    ? "bg-ink text-paper"
                    : "border border-ink/10 text-ink/70 hover:border-gold-deep dark:border-paper/15 dark:text-paper/70"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {filtered.flatMap((cat) =>
              cat.products.map((product, i) => (
                <SectionReveal key={product.id} delay={(i % 3) * 0.05}>
                  <Link to={`/collections/${cat.slug}`} className="group mb-6 block break-inside-avoid">
                    <motion.div whileHover={{ y: -4 }} className="overflow-hidden rounded-2xl shadow-luxe-sm">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ aspectRatio: i % 2 === 0 ? "4/5" : "1/1" }}
                      />
                      <div className="bg-paper p-4 dark:bg-ink-soft">
                        <p className="text-xs text-gold-deep">{cat.name}</p>
                        <p className="font-display text-lg text-ink dark:text-paper">{product.title}</p>
                      </div>
                    </motion.div>
                  </Link>
                </SectionReveal>
              ))
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
