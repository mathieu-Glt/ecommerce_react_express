import type { SubCategory } from "./subCategory.interface";

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

export type SubCategoryListResponse = ApiResponse<SubCategory[]>;
