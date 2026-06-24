import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Category, Product } from "../data/categories";

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

const taglines: Record<string, string> = {
  "welcome-gifts": "First impressions that last",
  "festive-gifts": "Celebrate every occasion",
  "tech-gifts": "Innovation meets elegance",
  "sustainable-gifts": "Purpose-driven gifting",
  "vouchers": "Choice, delivered elegantly",
  "premium-gifts": "For your most valued relationships",
};

const getSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

interface DBCategory {
  id: number;
  category_id: string;
  name: string;
  description: string;
  images: string[];
}

interface DBProduct {
  id: number;
  product_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  images: string[];
  category_id: number;
  status: string;
}

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/user/products/list_category_products`,
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
        const dbCategories: DBCategory[] = data.categories || [];
        const dbProducts: DBProduct[] = data.products || [];

        // Map database categories to Category type
        const mappedCategories: Category[] = dbCategories.map((dbCat) => {
          const slug = getSlug(dbCat.name);
          const tagline = taglines[slug] || "Curated collections";
          const coverImage = dbCat.images && dbCat.images[0] ? dbCat.images[0] : "/welcome-gifts.jpg";
          const cardImage = dbCat.images && dbCat.images[0] ? dbCat.images[0] : "/welcome-gifts.jpg";

          // Map associated active products
          const associatedProducts: Product[] = dbProducts
            .filter((p) => p.category_id === dbCat.id && p.status === "active")
            .map((p) => ({
              id: String(p.id),
              title: p.name,
              description: p.description,
              image: p.image_url || (p.images && p.images[0]) || "/sus-mug.jpg",
            }));

          return {
            id: dbCat.id,
            slug,
            name: dbCat.name,
            tagline,
            description: dbCat.description,
            coverImage,
            cardImage,
            products: associatedProducts,
          };
        });

        setCategories(mappedCategories);
        setError(null);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError(err instanceof Error ? err.message : "Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const getCategoryBySlug = (slug: string) => {
    return categories.find((c) => c.slug === slug);
  };

  return (
    <CategoriesContext.Provider value={{ categories, loading, error, getCategoryBySlug }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
}
