import { Link } from "react-router-dom";
import { footerNav } from "../../data/navigation";
import { useCategories } from "../../context/CategoriesContext";

export function Footer() {
  const { categories } = useCategories();
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      {/* Oversized watermark word */}
      <div className="pointer-events-none absolute -bottom-10 left-1/2 w-full -translate-x-1/2 select-none text-center font-display text-[18vw] leading-none text-paper/[0.03]">
        Nexus
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 border-b border-paper/10 pb-16 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="Nexus Logo"
                className="h-7 w-auto object-contain"
              />
              <p className="font-display text-2xl">Nexus Gifting</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Curated corporate gifting for enterprises that treat every
              touchpoint as a brand moment.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4 text-gold-light">Company</p>
            <ul className="space-y-3">
              {footerNav.company.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-paper/70 hover:text-gold-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4 text-gold-light">Collections</p>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/collections/${c.slug}`} className="text-sm text-paper/70 hover:text-gold-light">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4 text-gold-light">Stay in the loop</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 p-1.5"
            >
              <input
                type="email"
                required
                placeholder="Work email"
                className="w-full bg-transparent px-3 py-2 text-sm text-paper outline-none placeholder:text-paper/40"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-gold px-4 py-2 text-xs font-medium text-ink transition-colors hover:bg-gold-light"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-paper/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Nexus Gifting. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-paper/70">Privacy</Link>
            <Link to="/" className="hover:text-paper/70">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
