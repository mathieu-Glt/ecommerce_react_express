import type { Product } from "./product.interface";

export interface ApiSuccessResponse<T> {
  success: true;
  results: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ProductListResponse = ApiResponse<Product[]>;
