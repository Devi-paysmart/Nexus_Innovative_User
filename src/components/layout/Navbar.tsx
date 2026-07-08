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

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoriesQuery = queryParams.get("categories");
  const urlSelectedSlugs = categoriesQuery ? categoriesQuery.split(",") : [];

  const activeCategory = categories.find((c) => urlSelectedSlugs.includes(c.slug));
  const activeCategoryName = activeCategory ? activeCategory.name : "All";

  const handleSelectCategory = (slug: string) => {
    setCategoryDropdownOpen(false);
    const newParams = new URLSearchParams(location.search);

    if (slug === "All") {
      newParams.delete("categories");
    } else {
      newParams.set("categories", slug);
    }

    if (searchQuery.trim()) {
      newParams.set("search", searchQuery.trim());
    } else {
      newParams.delete("search");
    }

    navigate(`/collections?${newParams.toString()}`);
  };

  // Link active state checker
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
      const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/user/products/list_products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY || "",
          },
        });
        if (res.ok) {
          const data = await res.json();
          const dbProducts = data.products || [];
          const mapped = dbProducts
            .filter((p: any) => p.status === "active")
            .map((p: any) => ({
              id: String(p.id),
              title: p.name,
              description: p.description,
              categoryId: p.category_id,
              custom_prod_id: p.custom_prod_id,
            }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Error fetching products in navbar:", err);
      }
    };
    fetchProducts();
  }, []);

  const searchResults = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return false;

    if (urlSelectedSlugs.length > 0) {
      const matchedCats = categories.filter((c) => urlSelectedSlugs.includes(c.slug));
      const matchedIds = matchedCats.map((c) => c.id);
      if (!matchedIds.includes(p.categoryId)) {
        return false;
      }
    }

    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.custom_prod_id && p.custom_prod_id.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    setSearchQuery(queryParams.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("nexus_token"));
  }, [location]);

  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val);
    setCategoryDropdownOpen(false);
    setSearchOpen(true);
  };

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);



  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass border-b border-ink/5 dark:border-white/10 shadow-luxe-sm py-3.5" : "py-5 bg-transparent"
      )}
    >
      <div
        className="w-full flex items-center justify-between px-8 lg:px-12 transition-all duration-500"
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
          <div ref={searchRef} className="relative hidden md:block search-container w-72 lg:w-80">
            <div
              className="relative flex items-center bg-[#f3f4f6] dark:bg-[#1e293b] rounded-xl border border-ink/10 dark:border-white/10 shadow-sm h-9 pr-1 w-full"
            >
              {/* Category dropdown button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryDropdownOpen(!categoryDropdownOpen);
                  if (!categoryDropdownOpen) {
                    setSearchOpen(false);
                  }
                }}
                className="h-full px-3.5 text-xs font-semibold text-[#374151] dark:text-[#cbd5e1] hover:bg-[#e5e7eb] dark:hover:bg-[#334155] border-r border-[#d1d5db] dark:border-[#475569] flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap rounded-l-xl"
              >
                <span className="max-w-[70px] truncate">{activeCategoryName}</span>
                <ChevronDown size={12} className={cn("transition-transform text-ink/50 dark:text-paper/50", categoryDropdownOpen && "rotate-180")} />
              </button>

              {/* Input field */}
              <input
                ref={inputRef}
                type="text"
                placeholder={activeCategoryName !== "All" ? `Search in ${activeCategoryName}...` : "Search premium products..."}
                value={searchQuery}
                onChange={(e) => handleSearchQueryChange(e.target.value)}
                onFocus={() => {
                  setSearchOpen(true);
                  setCategoryDropdownOpen(false);
                }}
                className="flex-1 h-full bg-transparent px-3 text-xs outline-none text-[#0f172a] dark:text-paper placeholder:text-[#9ca3af]"
              />

              {searchQuery.trim() ? (
                <button
                  onClick={() => handleSearchQueryChange("")}
                  className="p-1.5 hover:bg-ink/5 dark:hover:bg-white/5 rounded-full text-ink/40 dark:text-paper/40 hover:text-ink dark:hover:text-paper transition-colors mr-1 cursor-pointer flex items-center justify-center"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : (
                <Search size={14} className="text-ink/30 dark:text-paper/30 mr-2" />
              )}

              {/* Category dropdown menu */}
              {categoryDropdownOpen && (
                <div className="absolute left-0 right-0 w-full top-full mt-2 rounded-xl bg-white dark:bg-[#1e293b] border border-ink/10 dark:border-white/10 shadow-lg py-1.5 z-50 text-xs text-ink dark:text-paper">
                  <div
                    onClick={() => handleSelectCategory("All")}
                    className={cn(
                      "px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155] cursor-pointer font-medium transition-colors",
                      activeCategoryName === "All" && "text-gold-deep dark:text-gold font-bold"
                    )}
                  >
                    All
                  </div>
                  <div className="border-t border-ink/5 dark:border-white/5 my-1" />
                  <div className="max-h-[180px] overflow-y-auto">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.slug)}
                        className={cn(
                          "px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155] cursor-pointer truncate transition-colors",
                          urlSelectedSlugs.includes(cat.slug) && "text-gold-deep dark:text-gold font-bold"
                        )}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product search results dropdown */}
            {searchOpen && searchQuery.trim() !== "" && (
              <div className="absolute left-0 right-0 w-full mt-2 rounded-xl p-3 shadow-luxe bg-white/95 dark:bg-ink-soft/98 backdrop-blur-xl border border-ink/5 dark:border-white/10 z-[100] text-xs text-ink dark:text-paper max-h-[320px] overflow-y-auto flex flex-col gap-1.5">
                <div className="px-2 pb-1.5 border-b border-ink/5 dark:border-white/5 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-ink/40 dark:text-paper/40">
                  <span>Products</span>
                  <span>{searchResults.length} found</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="text-center py-6 text-ink/40 dark:text-paper/40 font-medium">
                    No products found matching "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        navigate(`/product/${p.id}`);
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#f3f4f6] dark:hover:bg-[#334155] cursor-pointer transition-colors text-left flex flex-col"
                    >
                      <p className="font-semibold truncate">{p.title}</p>
                      {p.custom_prod_id && <p className="text-[10px] text-gold-deep dark:text-gold font-mono mt-0.5">{p.custom_prod_id}</p>}
                    </div>
                  ))
                )}
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
              <div className="mb-4 px-3 relative" ref={searchRef}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center bg-[#f3f4f6] dark:bg-[#1e293b] rounded-xl border border-ink/10 dark:border-white/10 shadow-sm overflow-hidden h-9 pr-1">
                    {/* Category dropdown button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryDropdownOpen(!categoryDropdownOpen);
                        if (!categoryDropdownOpen) {
                          setSearchOpen(false);
                        }
                      }}
                      className="h-full px-3 text-xs font-semibold text-[#374151] dark:text-[#cbd5e1] hover:bg-[#e5e7eb] dark:hover:bg-[#334155] border-r border-[#d1d5db] dark:border-[#475569] flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap rounded-l-xl"
                    >
                      <span className="max-w-[70px] truncate">{activeCategoryName}</span>
                      <ChevronDown size={12} className={cn("transition-transform text-ink/50 dark:text-paper/50", categoryDropdownOpen && "rotate-180")} />
                    </button>

                    {/* Input field */}
                    <input
                      type="text"
                      placeholder={activeCategoryName !== "All" ? `Search in ${activeCategoryName}...` : "Search premium products..."}
                      value={searchQuery}
                      onChange={(e) => handleSearchQueryChange(e.target.value)}
                      className="flex-1 h-full bg-transparent px-3 text-xs outline-none text-[#0f172a] dark:text-paper placeholder:text-[#9ca3af]"
                    />

                    {searchQuery.trim() && (
                      <button
                        onClick={() => handleSearchQueryChange("")}
                        className="p-1 text-ink/40 dark:text-paper/40 hover:text-ink dark:hover:text-paper transition-colors cursor-pointer"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {categoryDropdownOpen && (
                    <div className="absolute left-3 right-3 top-full mt-1 rounded-xl bg-white dark:bg-[#1e293b] border border-ink/10 dark:border-white/10 shadow-lg py-1.5 z-[100] text-xs text-ink dark:text-paper max-h-[160px] overflow-y-auto">
                      <div
                        onClick={() => handleSelectCategory("All")}
                        className={cn(
                          "px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155] cursor-pointer font-medium transition-colors",
                          activeCategoryName === "All" && "text-gold-deep dark:text-gold font-bold"
                        )}
                      >
                        All
                      </div>
                      <div className="border-t border-ink/5 dark:border-white/5 my-1" />
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.slug)}
                          className={cn(
                            "px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155] cursor-pointer truncate transition-colors",
                            urlSelectedSlugs.includes(cat.slug) && "text-gold-deep dark:text-gold font-bold"
                          )}
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  )}

                  {searchQuery.trim() !== "" && !categoryDropdownOpen && (
                    <div className="absolute left-3 right-3 top-full mt-1 rounded-xl bg-white dark:bg-[#1e293b] border border-ink/10 dark:border-white/10 shadow-lg py-1.5 z-[100] text-xs text-ink dark:text-paper max-h-[220px] overflow-y-auto flex flex-col gap-1.5">
                      <div className="px-2 pb-1.5 border-b border-ink/5 dark:border-white/5 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-ink/40 dark:text-paper/40">
                        <span>Products</span>
                        <span>{searchResults.length} found</span>
                      </div>
                      {searchResults.length === 0 ? (
                        <div className="text-center py-4 text-ink/40 dark:text-paper/40 font-medium">
                          No products found matching "{searchQuery}"
                        </div>
                      ) : (
                        searchResults.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setMobileOpen(false);
                              setSearchQuery("");
                              navigate(`/product/${p.id}`);
                            }}
                            className="p-2 rounded-xl hover:bg-[#f3f4f6] dark:hover:bg-[#334155] cursor-pointer transition-colors text-left flex flex-col"
                          >
                            <p className="font-semibold truncate text-[11px]">{p.title}</p>
                            {p.custom_prod_id && <p className="text-[9px] text-gold-deep dark:text-gold font-mono mt-0.5">{p.custom_prod_id}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
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
              {!isLoggedIn ? (
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
              ) : (
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
              )}
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
