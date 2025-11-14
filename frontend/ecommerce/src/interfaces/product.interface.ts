// interfaces/product.interface.ts

import type { Category } from "./category.interface";
import type { SubCategory } from "./subCategory.interface";

export interface Product {
  /** Unique identifier (MongoDB ObjectId as string) */
  _id: string;

  /** Product title */
  title: string;

  /** URL-friendly slug (unique) */
  slug: string;

  /** Product price */
  price: number;

  /** Product description */
  description: string;

  /** Reference to category (ObjectId string) */
  category: string;

  /** Reference to sub-category (ObjectId string) */
  sub: string;

  /** Stock quantity */
  quantity?: number;

  /** Number of units sold */
  sold?: number;

  /** Array of image URLs or Cloudinary info */
  images?: string[] | Array<{ url: string; public_id?: string }>;

  /** Whether shipping is available */
  shipping?: "Yes" | "No";

  /** Color of the product */
  color?: "Black" | "Brown" | "Silver" | "Blue" | "White" | "Green";

  /** Product brand */
  brand?:
    | "Apple"
    | "Samsung"
    | "Microsoft"
    | "Lenovo"
    | "Asus"
    | "Dell"
    | "HP"
    | "Acer";

  /** Timestamps */
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  averageRating?: number;

  /** Virtual populated fields (optional) */
  categoryInfo?: Category;
  subInfo?: SubCategory;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export interface ProductDetail {
  title?: string;
  images?: string[];
  description?: string;
  price?: number | string;
}

export interface Rating {
  star: number;
  postedBy: {
    _id: string;
    id?: string;
  };
}

export interface ProductCard {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
}
export interface ProductProps {
  product: Product;
  getProductById: (id: string) => Promise<Product | null>;
  onDelete: (product: Product) => void;
}

export interface ProductDetailInterface {
  _id: string;
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  brand: string;
  category: string;
  sub: string;
  color: string;
  images: string[];
  quantity: number;
  sold: number;
  shipping: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
