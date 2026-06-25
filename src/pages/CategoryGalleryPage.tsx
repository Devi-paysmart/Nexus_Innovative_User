import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCategories } from "../context/CategoriesContext";
import type { Product } from "../data/categories";
import { ProductDetailModal } from "../components/gallery/GalleryComponents";
import { PageTransition } from "../components/common/PageTransition";
import { useCart } from "../context/CartContext";

const STORAGE_URL = import.meta.env.VITE_SUPABASE_STORAGE_URL || 'https://gzekphwepqxmytzrtask.supabase.co/storage/v1/object/public/nexus-images';

const getImageUrl = (pathOrUrl: string | undefined | null) => {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  return `${STORAGE_URL}/${pathOrUrl}`;
};

export function CategoryGalleryPage() {
  const { category: slug } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { getCategoryBySlug, loading } = useCategories();

  const category = getCategoryBySlug(slug ?? "");
  const [selected, setSelected] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  useEffect(() => {
    if (!category) return;

    const fetchCategoryProducts = async () => {
      setFetchingProducts(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/user/products/list_category_products?category_id=${category.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": API_KEY || "",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || `Server error (${response.status})`);
        }

        const data = await response.json();
        const dbProducts = data.products || [];
        const mappedProducts: Product[] = dbProducts
          .filter((p: any) => p.status === "active")
          .map((p: any) => ({
            id: String(p.id),
            title: p.name,
            description: p.description,
            image: getImageUrl(p.images && p.images[0]) || "/sus-mug.jpg",
          }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to fetch category products:", err);
      } finally {
        setFetchingProducts(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1400);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center pt-32">
          <p className="font-display text-2xl text-ink/40 animate-pulse">Loading collection...</p>
        </div>
      </PageTransition>
    );
  }

  if (!category) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center pt-32">
          <p className="font-display text-2xl text-ink/40">Category not found</p>
          <Link to="/collections" className="mt-4 text-gold-deep hover:underline">
            Back to collections
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            to="/collections"
            className="mb-8 inline-flex items-center gap-2 text-sm text-ink/50 hover:text-gold-deep dark:text-paper/50"
          >
            <ArrowLeft size={16} /> All collections
          </Link>

          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gold/10 pb-8">
            <div>
              <p className="eyebrow mb-3">{category.tagline}</p>
              <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-5xl">
                {category.name}
              </h1>
              <p className="mt-4 max-w-2xl text-ink/60 dark:text-paper/60">{category.description}</p>
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => navigate("/contact", { state: { categoryId: category.id } })}
                className="inline-flex items-center gap-2 rounded-xl bg-gold text-ink px-6 py-3.5 text-sm font-medium transition-all hover:bg-gold-deep dark:hover:bg-gold-light hover:shadow-gold-glow cursor-pointer shadow-luxe-sm"
              >
                {category.name} Enquiry
              </button>
            </div>
          </div>

          {fetchingProducts ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-full aspect-[4/3] rounded-3xl bg-ink/5 dark:bg-paper/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const justAdded = addedIds.has(product.id);
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-3xl bg-cloud shadow-luxe-sm dark:bg-ink-soft transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => setSelected(product)}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-xl text-ink dark:text-paper">
                        {product.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink/65 dark:text-paper/65 flex-1">
                        {product.description}
                      </p>
                      
                      {/* Responsive Add to Cart Button on Card Footer */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all shadow-sm ${
                          justAdded
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-gold text-ink hover:bg-gold-deep hover:shadow-gold-glow"
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {justAdded ? (
                            <motion.span
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center gap-1.5"
                            >
                              <Check size={16} /> Added to Cart
                            </motion.span>
                          ) : (
                            <motion.span
                              key="plus"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center gap-1.5"
                            >
                              <Plus size={16} /> Add to Cart
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-12 text-center text-sm text-ink/40 dark:text-paper/40">
            Click any image to view details · Use the Add to Cart button to add items to your cart
          </p>
        </div>
      </div>

      <ProductDetailModal product={selected} onClose={() => setSelected(null)} />
    </PageTransition>
  );
}
