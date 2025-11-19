import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { useApi } from "../../hooks/useApi";
import type { CategoryListResponse as CategoryResponse } from "../../interfaces/responseCategory.interface";
import { API_ROUTES } from "../constants/api-routes";

// Axios instance avec hook personnalisé (ajout token si besoin)
const api: AxiosInstance = useApi();

/**
 * Fetch all categories
 * @returns Promise resolving to the list of categories
 * @throws Error if request fails
 */
export async function getCategories(): Promise<CategoryResponse> {
  try {
    const response: AxiosResponse<CategoryResponse> = await api.get(
      API_ROUTES.CATEGORIES.LIST
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
    throw new Error("Failed to fetch categories");
  }
}

/**
 * Fetch a category by its ID
 * @param id - Category ID
 */
export async function getCategoryById(id: string): Promise<CategoryResponse> {
  try {
    const response: AxiosResponse<CategoryResponse> = await api.get(
      API_ROUTES.CATEGORIES.DETAILS_ID(id)
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch category by ID"
      );
    }
    throw new Error("Failed to fetch category by ID");
  }
}

/**
 * Fetch a category by its slug
 * @param slug - Category slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryResponse> {
  try {
    const response: AxiosResponse<CategoryResponse> = await api.get(
      API_ROUTES.CATEGORIES.DETAILS_SLUG(slug)
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch category by slug"
      );
    }
    throw new Error("Failed to fetch category by slug");
  }
}

/**
 * Create a new category
 * @param body - Category data
 */
export async function createCategory(
  body: Record<string, any> | FormData
): Promise<CategoryResponse> {
  try {
    const response: AxiosResponse<CategoryResponse> = await api.post(
      API_ROUTES.CATEGORIES.CREATE,
      body
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create category"
      );
    }
    throw new Error("Failed to create category");
  }
}

/**
 * Update an existing category
 * @param id - Category ID
 * @param body - Updated category data
 */
export async function updateCategory(
  id: string,
  body: Record<string, any> | FormData
): Promise<CategoryResponse> {
  try {
    const response: AxiosResponse<CategoryResponse> = await api.put(
      API_ROUTES.CATEGORIES.UPDATE(id),
      body
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update category"
      );
    }
    throw new Error("Failed to update category");
  }
}

/**
 * Delete a category
 * @param id - Category ID
 */
export async function deleteCategory(id: string): Promise<CategoryResponse> {
  try {
    const response: AxiosResponse<CategoryResponse> = await api.delete(
      API_ROUTES.CATEGORIES.DELETE(id)
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete category"
      );
    }
    throw new Error("Failed to delete category");
  }
}
