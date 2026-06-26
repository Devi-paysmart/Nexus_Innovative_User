import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Category, Product } from "../data/categories";

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  getCategoryBySlug: (slug: string) => Category | undefined;
  refreshData: () => Promise<void>;
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
  images: string[];
  category_id: number;
  status: string;
}

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
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

      const dbCategories: DBCategory[] = categoriesData.categories || [];
      const dbProducts: DBProduct[] = productsData.products || [];

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
            image: (p.images && p.images[0]) || "/sus-mug.jpg",
            images: p.images || [],
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

  useEffect(() => {
    refreshData();
  }, []);

  const getCategoryBySlug = (slug: string) => {
    return categories.find((c) => c.slug === slug);
  };

  return (
    <CategoriesContext.Provider value={{ categories, loading, error, getCategoryBySlug, refreshData }}>
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
