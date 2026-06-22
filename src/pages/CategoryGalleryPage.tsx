import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCategoryBySlug } from "../data/categories";
import type { Product } from "../data/categories";
import { ProductDetailModal } from "../components/gallery/GalleryComponents";
import { PageTransition } from "../components/common/PageTransition";

export function CategoryGalleryPage() {
  const { category: slug } = useParams<{ category: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug === "welcome-Gifts") {
      navigate("/collections/tech-gifts", { replace: true });
    }
  }, [slug, navigate]);

  const category = getCategoryBySlug(slug ?? "");
  const [selected, setSelected] = useState<Product | null>(null);

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
            <div className="flex-shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold text-ink px-6 py-3.5 text-sm font-medium transition-all hover:bg-gold-deep dark:hover:bg-gold-light hover:shadow-gold-glow cursor-pointer shadow-luxe-sm"
              >
                Enquire
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product) => (
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
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-ink/40 dark:text-paper/40">
            Click any image to view details in full resolution
          </p>
        </div>
      </div>

      <ProductDetailModal product={selected} onClose={() => setSelected(null)} />
    </PageTransition>
  );
}
