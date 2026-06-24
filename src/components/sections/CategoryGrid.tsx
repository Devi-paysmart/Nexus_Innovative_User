import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCategories } from "../../context/CategoriesContext";
import type { Category } from "../../data/categories";
import { SectionReveal } from "../common/SectionReveal";

export function CategoryGrid() {
  const { categories, loading } = useCategories();

  const Card = ({ cat }: { cat: Category }) => (
    <div className="w-[280px] sm:w-[340px] shrink-0">
      <Link to={`/collections/${cat.slug}`} className="group block">
        <motion.article
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl shadow-luxe-sm"
        >
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={cat.cardImage}
              alt={cat.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 whitespace-normal text-left">
            <p className="eyebrow mb-2 text-gold-light">{cat.tagline}</p>
            <h3 className="font-display text-2xl text-paper">{cat.name}</h3>
            <span className="mt-4 inline-flex items-center gap-1 text-sm text-paper/80 opacity-0 transition-opacity group-hover:opacity-100">
              Explore gallery <ArrowUpRight size={14} />
            </span>
          </div>
          <div className="absolute right-4 top-4 rounded-full bg-gold/90 px-3 py-1 text-xs font-medium text-ink opacity-0 transition-opacity group-hover:opacity-100">
            View
          </div>
        </motion.article>
      </Link>
    </div>
  );

  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-16">
        <SectionReveal>
          <div className="flex flex-col items-center text-center gap-4">
            <p className="eyebrow">Top Preferred Gifts</p>
            <h2 className="font-display text-4xl text-ink dark:text-paper lg:text-5xl">
              Curated for every occasion
            </h2>
            <Link
              to="/collections"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gold-deep hover:underline"
            >
              View all collections <ArrowUpRight size={16} />
            </Link>
          </div>
        </SectionReveal>
      </div>

      <div className="relative w-full">
        {/* Left and Right premium fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-paper to-transparent dark:from-ink pointer-events-none sm:w-24" />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-paper to-transparent dark:from-ink pointer-events-none sm:w-24" />

        {/* Marquee slider container */}
        <div className="flex w-full overflow-hidden py-4 select-none">
          {loading ? (
            <div className="flex gap-6 px-6 shrink-0 w-full justify-center">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-[280px] sm:w-[340px] aspect-[4/5] rounded-3xl bg-ink/5 dark:bg-paper/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex animate-marquee hover:[animation-play-state:paused] pointer-events-auto">
              {/* First sequence */}
              <div className="flex gap-6 pr-6 shrink-0">
                {categories.map((cat) => (
                  <Card key={cat.slug} cat={cat} />
                ))}
              </div>
              {/* Second sequence */}
              <div className="flex gap-6 pr-6 shrink-0">
                {categories.map((cat) => (
                  <Card key={`${cat.slug}-duplicate`} cat={cat} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
