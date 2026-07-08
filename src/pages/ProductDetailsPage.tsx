import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";
import { ProductCardImageCarousel } from "../components/gallery/GalleryComponents";
import { useCart } from "../context/CartContext";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any | null>(null);
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
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

        const currentDbProduct = dbProducts.find((p: any) => String(p.id) === id && p.status === "active");

        if (currentDbProduct) {
          const cat = dbCategories.find((c: any) => c.id === currentDbProduct.category_id);
          const catSlug = cat
            ? cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
            : "";

          const mappedProduct = {
            id: String(currentDbProduct.id),
            title: currentDbProduct.name,
            description: currentDbProduct.description,
            image: (currentDbProduct.images && currentDbProduct.images[0]) || "/sus-mug.jpg",
            images: currentDbProduct.images || [],
            categoryName: cat ? cat.name : "Corporate Gifts",
            categorySlug: catSlug,
            categoryId: currentDbProduct.category_id,
            custom_prod_id: currentDbProduct.custom_prod_id,
          };

          setProduct(mappedProduct);

          // Get recommended products: active products in the same category (excluding current product)
          const otherProducts = dbProducts
            .filter((p: any) => p.category_id === currentDbProduct.category_id && String(p.id) !== id && p.status === "active")
            .slice(0, 5)
            .map((p: any) => ({
              id: String(p.id),
              title: p.name,
              description: p.description,
              image: (p.images && p.images[0]) || "/sus-mug.jpg",
              images: p.images || [],
              categoryName: cat ? cat.name : "Corporate Gifts",
              categorySlug: catSlug,
              custom_prod_id: p.custom_prod_id,
            }));

          setRecommended(otherProducts);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1400);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center pt-32">
          <p className="font-display text-2xl text-ink/40 animate-pulse">Loading product details...</p>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center pt-32 px-6 text-center">
          <p className="font-display text-2xl text-ink/40">Product not found</p>
          <Link to="/collections" className="mt-4 text-gold-deep hover:underline font-semibold flex items-center gap-1.5">
            <ArrowLeft size={16} /> Back to collections
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="w-full px-8 lg:px-12">
          {/* Back link */}
          <Link
            to="/collections"
            className="mb-8 inline-flex items-center gap-2 text-sm text-ink/50 hover:text-gold-deep dark:text-paper/50 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Collections
          </Link>

          {/* Product details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 items-start">
            {/* Left: Product Images */}
            <div className="overflow-hidden rounded-2xl shadow-luxe-sm bg-cloud dark:bg-ink-soft">
              <ProductCardImageCarousel
                images={product.images || [product.image]}
                alt={product.title}
                aspectClassName="aspect-[4/3] md:aspect-[4/3]"
              />
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase">
                <span className="text-gold-deep">{product.categoryName}</span>
                {product.custom_prod_id && (
                  <span className="font-mono text-ink/40 dark:text-paper/40 normal-case">
                    {product.custom_prod_id}
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-5xl text-ink dark:text-paper mt-2">
                {product.title}
              </h1>
              
              <div className="mt-6 border-t border-b border-ink/5 dark:border-white/5 py-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink/40 dark:text-paper/40 mb-2">
                  Product Description
                </h3>
                <p className="text-sm leading-relaxed text-ink/70 dark:text-paper/70">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className={`mt-8 flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-all shadow-md w-full md:w-64 ${
                  added
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-gold text-ink hover:bg-gold-deep hover:shadow-gold-glow cursor-pointer"
                }`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
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

          {/* Recommended section */}
          {recommended.length > 0 && (
            <div className="mt-24 border-t border-ink/5 dark:border-white/10 pt-16">
              <SectionReveal>
                <p className="eyebrow mb-4">You may also like</p>
                <h2 className="font-display text-2xl text-ink dark:text-paper lg:text-4xl">
                  Recommended Products
                </h2>
              </SectionReveal>

              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {recommended.map((prod, i) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: (i % 3) * 0.05, ease: "easeOut" }}
                  >
                    <Link to={`/product/${prod.id}`} className="group block">
                      <motion.div whileHover={{ y: -4 }} className="overflow-hidden rounded-2xl shadow-luxe-sm h-full flex flex-col">
                        <ProductCardImageCarousel
                          images={prod.images || [prod.image]}
                          alt={prod.title}
                          aspectClassName="aspect-[4/5]"
                        />
                        <div className="bg-paper p-4 dark:bg-ink-soft flex-1">
                          <p className="text-xs text-gold-deep">{prod.categoryName}</p>
                          <p className="font-display text-lg text-ink dark:text-paper">{prod.title}</p>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
