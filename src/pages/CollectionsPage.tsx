import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";
import { cn } from "../utils/cn";
import { ProductCardImageCarousel } from "../components/gallery/GalleryComponents";

export function CollectionsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoriesQuery = queryParams.get("categories");
  const selectedSlugs = categoriesQuery ? categoriesQuery.split(",") : [];
  const searchQuery = queryParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setFetching(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

      try {
        const headers = {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY || "",
        };

        const [categoriesRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/user/products/list_categories`, {
            method: "GET",
            headers,
          }),
          fetch(`${API_BASE_URL}/api/v1/user/products/list_products`, {
            method: "GET",
            headers,
          }),
        ]);

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error("Failed to load categories or products");
        }

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        const dbCategories = categoriesData.categories || [];
        const dbProducts = productsData.products || [];

        const mappedCategories = dbCategories.map((c: any) => {
          const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return {
            id: c.id,
            name: c.name,
            slug: slug,
          };
        });
        setCategories(mappedCategories);

        const filteredProducts = dbProducts
          .filter((p: any) => p.status === "active")
          .filter((p: any) => {
            if (selectedSlugs.length > 0) {
              const matchedCats = mappedCategories.filter((c: any) => selectedSlugs.includes(c.slug));
              const matchedIds = matchedCats.map((c: any) => c.id);
              if (!matchedIds.includes(p.category_id)) return false;
            }
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase().trim();
              const cat = dbCategories.find((c: any) => c.id === p.category_id);
              const catName = cat ? cat.name.toLowerCase() : "";
              return (
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                (p.custom_prod_id && p.custom_prod_id.toLowerCase().includes(q)) ||
                catName.includes(q)
              );
            }
            return true;
          })
          .map((p: any) => {
            const cat = dbCategories.find((c: any) => c.id === p.category_id);
            const catSlug = cat
              ? cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
              : "";
            return {
              id: String(p.id),
              title: p.name,
              description: p.description,
              image: (p.images && p.images[0]) || "/sus-mug.jpg",
              images: p.images || [],
              categoryName: cat ? cat.name : "",
              categorySlug: catSlug,
              custom_prod_id: p.custom_prod_id,
            };
          });

        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setFetching(false);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);



  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="w-full px-8 lg:px-12">
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

          {loading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div
                  key={n}
                  className="w-full aspect-[4/5] rounded-3xl bg-ink/5 dark:bg-paper/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="mt-10 flex flex-wrap gap-2">
                <button
                  onClick={() => navigate("/collections")}
                  className={cn(
                    "rounded-xl px-5 py-2 text-sm font-medium transition-colors",
                    selectedSlugs.length === 0
                      ? "bg-ink text-paper"
                      : "border border-ink/10 text-ink/70 hover:border-gold-deep dark:border-paper/15 dark:text-paper/70"
                  )}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => navigate(`/collections?categories=${c.slug}`)}
                    className={cn(
                      "rounded-xl px-5 py-2 text-sm font-medium transition-colors",
                      selectedSlugs.includes(c.slug)
                        ? "bg-ink text-paper"
                        : "border border-ink/10 text-ink/70 hover:border-gold-deep dark:border-paper/15 dark:text-paper/70"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className={cn(
                "mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 transition-opacity duration-200",
                fetching && "opacity-40"
              )}>
                {products.length === 0 ? (
                  <p className="col-span-full text-center text-ink/50 py-12">
                    No products found in this category.
                  </p>
                ) : (
                  products.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: (i % 3) * 0.05, ease: "easeOut" }}
                    >
                      <Link to={`/product/${product.id}`} className="group block">
                        <motion.div whileHover={{ y: -4 }} className="overflow-hidden rounded-2xl shadow-luxe-sm h-full flex flex-col">
                          <ProductCardImageCarousel
                            images={product.images || [product.image]}
                            alt={product.title}
                            aspectClassName="aspect-[4/5]"
                          />
                          <div className="bg-paper p-4 dark:bg-ink-soft flex-1">
                            <div className="flex items-center justify-between text-xs text-gold-deep">
                              <span>{product.categoryName}</span>
                              {product.custom_prod_id && <span className="font-mono text-ink/40 dark:text-paper/40">{product.custom_prod_id}</span>}
                            </div>
                            <p className="font-display text-lg text-ink dark:text-paper mt-1">{product.title}</p>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
