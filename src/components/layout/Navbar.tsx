import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import { primaryNav } from "../../data/navigation";
import { cn } from "../../utils/cn";
import { useCart } from "../../context/CartContext";
import { useCategories } from "../../context/CategoriesContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { categories } = useCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-6"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 transition-all duration-500",
          scrolled ? "glass shadow-luxe-sm py-2.5" : "py-1"
        )}
      >
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Nexus Logo"
            className="h-12 lg:h-16 w-auto object-contain transition-all duration-300"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="text-sm font-medium text-ink/80 dark:text-paper/80 transition-colors hover:text-gold-deep dark:hover:text-gold"
          >
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <Link
              to="/collections"
              className="flex items-center gap-1 text-sm font-medium text-ink/80 dark:text-paper/80 transition-colors hover:text-gold-deep dark:hover:text-gold"
            >
              Collections
              <ChevronDown size={14} className={cn("transition-transform", megaOpen && "rotate-180")} />
            </Link>

            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-1/2 top-full mt-3 w-[440px] -translate-x-1/2 rounded-2xl p-6 shadow-luxe bg-white/95 dark:bg-ink-soft/98 backdrop-blur-xl border border-ink/5 dark:border-white/10"
                >
                  <p className="eyebrow mb-4">Shop by category</p>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/collections/${c.slug}`}
                        className="rounded-xl px-3 py-2 text-sm text-ink/80 dark:text-paper/80 transition-colors hover:bg-gold/10 dark:hover:bg-gold/20 hover:text-gold-deep dark:hover:text-gold"
                        onClick={() => setMegaOpen(false)}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {primaryNav.slice(1).map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-ink/80 dark:text-paper/80 transition-colors hover:text-gold-deep dark:hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            aria-label="View cart"
            className="relative rounded-full p-2.5 text-ink/70 dark:text-paper/70 transition-colors hover:bg-ink/5 dark:hover:bg-paper/5 hover:text-gold-deep dark:hover:text-gold"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink px-1 shadow-sm">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2.5 text-ink/70 dark:text-paper/70 hover:bg-ink/5 dark:hover:bg-paper/5 lg:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>



      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 flex h-full w-72 flex-col gap-1 bg-paper dark:bg-ink p-6 shadow-luxe"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="mb-6 self-end rounded-full p-2 hover:bg-ink/5 dark:hover:bg-paper/5 dark:text-paper"
              >
                <X size={18} />
              </button>
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-ink/80 dark:text-paper/80 hover:bg-gold/10 dark:hover:bg-gold/20 hover:text-gold-deep dark:hover:text-gold"
              >
                Home
              </Link>
              {primaryNav.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-ink/80 dark:text-paper/80 hover:bg-gold/10 dark:hover:bg-gold/20 hover:text-gold-deep dark:hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-ink/80 dark:text-paper/80 hover:bg-gold/10 dark:hover:bg-gold/20 hover:text-gold-deep dark:hover:text-gold flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                Cart
                {totalItems > 0 && (
                  <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink px-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
