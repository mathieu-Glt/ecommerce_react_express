// interfaces/subCategory.interface.ts

import type { Category } from "./category.interface";

/**
 * Represents a sub-category belonging to a parent category.
 *
 * Mirrors the backend Mongoose `Sub` schema.
 */
export interface SubCategory {
  /** MongoDB ID */
  _id: string;

  /** Sub-category name */
  name: string;

  /** URL-friendly unique identifier */
  slug: string;

  /** Reference to parent category (ObjectId string) */
  parent: string;

  /** Virtual populated field (when expanded by API) */
  category?: Category;

  /** Auto-generated timestamps */
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategoryState {
  subCategories: SubCategory[];
  selectedSubCategory: SubCategory | null;
  loading: boolean;
  error: string | null;
}
