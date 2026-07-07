import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, ShoppingBag, User, Search } from "lucide-react";
import { primaryNav } from "../../data/navigation";
import { cn } from "../../utils/cn";
import { useCart } from "../../context/CartContext";
import { useCategories } from "../../context/CategoriesContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { categories, refreshData } = useCategories();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("nexus_token"));

  // Search states
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoriesQuery = queryParams.get("categories");
  const urlSelectedSlugs = categoriesQuery ? categoriesQuery.split(",") : [];

  // Link active state checker
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");

  useEffect(() => {
    setSearchQuery(queryParams.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("nexus_token"));
  }, [location]);

  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(location.search);
    if (val.trim()) {
      newParams.set("search", val.trim());
    } else {
      newParams.delete("search");
    }
    navigate(`/collections?${newParams.toString()}`);
  };

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allSlugs = categories.map((c) => c.slug);
      navigate(`/collections?categories=${allSlugs.join(",")}`);
    } else {
      navigate("/collections");
    }
  };

  const handleToggleCategorySlug = (slug: string) => {
    let newSlugs: string[];
    if (urlSelectedSlugs.includes(slug)) {
      newSlugs = urlSelectedSlugs.filter((s) => s !== slug);
    } else {
      newSlugs = [...urlSelectedSlugs, slug];
    }

    if (newSlugs.length === 0) {
      navigate("/collections");
    } else {
      navigate(`/collections?categories=${newSlugs.join(",")}`);
    }
  };

  // Get all active categories matching search input
  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  });

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
            className={cn(
              "text-sm font-medium transition-all duration-300 relative py-1 hover:text-gold-deep dark:hover:text-gold",
              isLinkActive("/") ? "text-gold-deep dark:text-gold font-semibold" : "text-ink/80 dark:text-paper/80"
            )}
          >
            Home
            {isLinkActive("/") && (
              <motion.span
                layoutId="activeNavIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <Link
              to="/collections"
              onClick={refreshData}
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-all duration-300 relative py-1 hover:text-gold-deep dark:hover:text-gold",
                isLinkActive("/collections") ? "text-gold-deep dark:text-gold font-semibold" : "text-ink/80 dark:text-paper/80"
              )}
            >
              Collections
              <ChevronDown size={14} className={cn("transition-transform", megaOpen && "rotate-180")} />
              {isLinkActive("/collections") && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
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

          {primaryNav.slice(1).map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 relative py-1 hover:text-gold-deep dark:hover:text-gold",
                  active ? "text-gold-deep dark:text-gold font-semibold" : "text-ink/80 dark:text-paper/80"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 relative">
          {/* Search container */}
          <div ref={searchRef} className="relative hidden md:block search-container">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3.5 text-ink/50 dark:text-paper/50 pointer-events-none" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => handleSearchQueryChange(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="rounded-full border border-ink/10 bg-ink/5 dark:border-white/10 dark:bg-white/5 pl-9 pr-4 py-1.5 focus:border-gold-deep outline-none text-xs text-ink dark:text-paper w-40 focus:w-52 transition-all duration-300 placeholder:text-ink/40 dark:placeholder:text-paper/40"
              />
            </div>

            {/* Search Dropdown */}
            {searchOpen && (
              <div
                className="absolute left-0 top-full mt-3 w-64 rounded-2xl p-4 shadow-luxe bg-white/95 dark:bg-ink-soft/98 backdrop-blur-xl border border-ink/5 dark:border-white/10 flex flex-col gap-4 z-[100] text-ink dark:text-paper"
              >
                {/* Header with Select All */}
                <div className="flex items-center justify-between border-b border-ink/5 dark:border-white/10 pb-2">
                  <span className="eyebrow uppercase text-[9px] tracking-wider text-ink/40 dark:text-paper/40">Categories</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-gold-deep dark:text-gold hover:underline font-semibold">
                    <input
                      type="checkbox"
                      checked={urlSelectedSlugs.length === categories.length && categories.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-ink/10 dark:border-white/10 text-gold focus:ring-gold w-3 h-3 cursor-pointer"
                    />
                    Select All
                  </label>
                </div>

                {/* Categories List */}
                <div className="overflow-y-auto max-h-[140px] space-y-2.5 pr-1">
                  {filteredCategories.length === 0 ? (
                    <div className="flex items-center justify-center py-6 text-xs text-ink/40 dark:text-paper/40">
                      No categories found
                    </div>
                  ) : (
                    filteredCategories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer text-xs text-ink/80 dark:text-paper/80 hover:text-ink dark:hover:text-paper group w-full py-0.5">
                        <input
                          type="checkbox"
                          checked={urlSelectedSlugs.includes(cat.slug)}
                          onChange={() => handleToggleCategorySlug(cat.slug)}
                          className="rounded border-ink/10 dark:border-white/10 text-gold focus:ring-gold w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="group-hover:text-gold-deep dark:group-hover:text-gold transition-colors truncate font-medium">{cat.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
          {isLoggedIn ? (
            <Link
              to="/profile"
              aria-label="User Profile"
              className="rounded-full p-2.5 text-ink/70 dark:text-paper/70 transition-colors hover:bg-ink/5 dark:hover:bg-paper/5 hover:text-gold-deep dark:hover:text-gold"
            >
              <User size={18} />
            </Link>
          ) : (
            <Link
              to="/signin"
              className="text-xs font-semibold px-4.5 py-2 border border-gold bg-white dark:bg-ink rounded-xl shadow-gold-glow hover:bg-gold hover:text-ink dark:hover:bg-gold dark:hover:text-ink transition-all text-gold-deep dark:text-gold cursor-pointer"
            >
              Sign In
            </Link>
          )}
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
              {/* Mobile Search */}
              <div className="mb-4 px-3 relative">
                <div className="flex items-center gap-2 rounded-xl border border-ink/10 bg-ink/5 dark:border-white/10 dark:bg-white/5 px-3 py-2">
                  <Search size={16} className="text-ink/50 dark:text-paper/50" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => handleSearchQueryChange(e.target.value)}
                    className="bg-transparent text-xs text-ink dark:text-paper outline-none w-full placeholder:text-ink/40 dark:placeholder:text-paper/40"
                  />
                </div>
                {searchQuery.trim() && (
                  <div className="absolute left-3 right-3 top-full mt-1 bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-3 shadow-lg z-50 max-h-[200px] overflow-y-auto space-y-2 text-ink dark:text-paper">
                    {filteredCategories.slice(0, 5).map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setMobileOpen(false);
                          setSearchQuery("");
                          navigate(`/collections/${cat.slug}`);
                        }}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gold/10 dark:hover:bg-gold/20 cursor-pointer"
                      >
                        <span className="text-xs font-semibold">{cat.name}</span>
                        <span className="text-[10px] text-gold-deep dark:text-gold">Go →</span>
                      </div>
                    ))}
                    {filteredCategories.length === 0 && (
                      <p className="text-[10px] text-center text-ink/40">No categories found</p>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                  isLinkActive("/")
                    ? "bg-gold/10 text-gold font-semibold border-l-2 border-gold rounded-l-none"
                    : "text-ink/80 dark:text-paper/80 hover:bg-gold/10 dark:hover:bg-gold/20 hover:text-gold-deep dark:hover:text-gold"
                )}
              >
                Home
              </Link>
              {primaryNav.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => {
                      setMobileOpen(false);
                      if (link.href === "/collections") {
                        refreshData();
                      }
                    }}
                    className={cn(
                      "rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-gold/10 text-gold font-semibold border-l-2 border-gold rounded-l-none"
                        : "text-ink/80 dark:text-paper/80 hover:bg-gold/10 dark:hover:bg-gold/20 hover:text-gold-deep dark:hover:text-gold"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-medium transition-colors flex items-center gap-2",
                  isLinkActive("/signin")
                    ? "bg-gold/10 text-gold font-semibold border-l-2 border-gold rounded-l-none"
                    : "text-ink/80 dark:text-paper/80 hover:bg-gold/10 dark:hover:bg-gold/20 hover:text-gold-deep dark:hover:text-gold flex items-center gap-2"
                )}
              >
                <User size={16} />
                Sign In
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-medium transition-colors flex items-center gap-2",
                  isLinkActive("/profile")
                    ? "bg-gold/10 text-gold font-semibold border-l-2 border-gold rounded-l-none"
                    : "text-ink/80 dark:text-paper/80 hover:bg-gold/10 dark:hover:bg-gold/20 hover:text-gold-deep dark:hover:text-gold flex items-center gap-2"
                )}
              >
                <User size={16} />
                Profile
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-medium transition-colors flex items-center gap-2",
                  isLinkActive("/cart")
                    ? "bg-gold/10 text-gold font-semibold border-l-2 border-gold rounded-l-none"
                    : "text-ink/80 dark:text-paper/80 hover:bg-gold/10 dark:hover:bg-gold/20 hover:text-gold-deep dark:hover:text-gold flex items-center gap-2"
                )}
              >
                <ShoppingBag size={16} />
                Cart
                {totalItems > 0 && (
                  <span className={cn(
                    "ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full text-[10px] font-bold px-1",
                    isLinkActive("/cart") ? "bg-ink text-gold" : "bg-gold text-ink"
                  )}>
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
