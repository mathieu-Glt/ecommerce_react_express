import type { Category } from "./category.interface";

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  results: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type CategoryListResponse = ApiResponse<Category[]>;

// export interface CategoryResponse {
//   success: boolean;
//   message: string;
//   results: {
//     categories: Category[];
//   };
// }
