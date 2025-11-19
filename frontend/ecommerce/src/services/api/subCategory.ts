import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { useApi } from "../../hooks/useApi";
import type { SubCategoryListResponse as SubCategoryResponse } from "../../interfaces/responseSubCategory.interface";
import { API_ROUTES } from "../constants/api-routes";

// Define BASE_URL or import from config
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:8000";
// eslint-disable-next-line react-hooks/rules-of-hooks
const api: AxiosInstance = useApi();

/**
 * Fetches all sub-categories.
 *
 * @returns A promise that resolves to the list of sub-categories.
 * @throws {Error} If the request fails.
 */
export async function getSubs(): Promise<SubCategoryResponse> {
  try {
    const response: AxiosResponse<SubCategoryResponse> = await api.get(
      API_ROUTES.SUB_CATEGORIES.LIST
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to fetch subs");
    }
    throw new Error("Failed to fetch subs");
  }
}

/**
 * Fetches a sub-category by slug.
 *
 * @param slug - The slug of the sub-category.
 * @returns Sub-category details.
 */
export async function getSubBySlug(slug: string): Promise<SubCategoryResponse> {
  try {
    const response: AxiosResponse<SubCategoryResponse> = await api.get(
      API_ROUTES.SUB_CATEGORIES.DETAILS_SLUG(slug)
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to fetch sub");
    }
    throw new Error("Failed to fetch sub");
  }
}

/**
 * Creates a new sub-category.
 *
 * @param body - Sub-category data (name, parent category, etc.)
 * @returns Created sub-category data.
 */
export async function createSub(
  body: Record<string, any> | FormData
): Promise<SubCategoryResponse> {
  try {
    const response: AxiosResponse<SubCategoryResponse> = await api.post(
      API_ROUTES.SUB_CATEGORIES.CREATE,
      body
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to create sub");
    }
    throw new Error("Failed to create sub");
  }
}

/**
 * Updates an existing sub-category.
 *
 * @param slug - Sub-category slug to update.
 * @param body - Updated data.
 * @returns Updated sub-category.
 */
export async function updateSub(
  slug: string,
  body: Record<string, any> | FormData
): Promise<SubCategoryResponse> {
  try {
    const response: AxiosResponse<SubCategoryResponse> = await api.put(
      API_ROUTES.SUB_CATEGORIES.UPDATE(slug),
      body
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to update sub");
    }
    throw new Error("Failed to update sub");
  }
}

/**
 * Deletes a sub-category.
 *
 * @param slug - Sub-category slug to delete.
 * @returns Success message.
 */
export async function deleteSub(slug: string): Promise<SubCategoryResponse> {
  try {
    const response: AxiosResponse<SubCategoryResponse> = await api.delete(
      API_ROUTES.SUB_CATEGORIES.DELETE(slug)
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to delete sub");
    }
    throw new Error("Failed to delete sub");
  }
}
