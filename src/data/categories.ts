export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  cardImage: string;
  products: Product[];
}

export const categories: Category[] = [];

export function getCategoryBySlug(_slug: string): Category | undefined {
  return undefined;
}
