// interfaces/category.interface.ts

import type { SubCategory } from "./subCategory.interface";

/**
 * Represents a product category.
 *
 * Mirrors the backend Mongoose `Category` schema.
 */
export interface Category {
  /** MongoDB ID */
  _id: string;

  /** Category name */
  name: string;

  /** URL-friendly unique identifier */
  slug: string;

  /** Array of sub-category IDs (or populated sub-objects) */
  subs?: (string | SubCategory)[];

  /** Auto-generated timestamps */
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}
