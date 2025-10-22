import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { useApi } from "../../hooks/useApi";
import type { ProductListResponse } from "../../interfaces/responseProduct.interface";
import { API_ROUTES } from "../constants/api-routes";

// Define BASE_URL or import from your config
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:5173";
// eslint-disable-next-line react-hooks/rules-of-hooks
const api: AxiosInstance = useApi();

/**
 * Fetches the list of products from the API.
 *
 * @returns A promise that resolves to the list of products.
 * @throws {Error} If the request fails or the response indicates an error.
 *
 * @example
 * const products = await getProducts();
 */
export async function getProducts(): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.LIST
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch products"
      );
    }
    throw new Error("Failed to fetch products");
  }
}

/**
 * Creates a new product in the API.
 * @param body - Product information (name, description, price, etc.)
 * @returns Created product data and success message
 * @throws {Error} If data is invalid or creation fails
 * @example
 * const response = await createProduct({
 *   name: "New Product",
 *   description: "Product description",
 *  price: 99.99
 * });
 */
export async function createProduct(
  body: Record<string, any> | FormData
): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.post(
      API_ROUTES.PRODUCTS.CREATE,
      body
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to create product"
      );
    }
    throw new Error("Failed to create product");
  }
}

/**
 * Retrieves a product by its ID from the API.
 * @param id - Product ID to retrieve
 * @returns Product data
 * @throws {Error} If product is not found or request fails
 * @example
 * const product = await getProductById("productId");
 * */
export async function getProductById(id: string): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.DETAILS_ID(id)
    );
    console.log("Response data for product ID:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to fetch product");
    }
    throw new Error("Failed to fetch product");
  }
}

/**
 * Retrieves a product by its SLUG from the API.
 * @param slug - Product ID to retrieve
 * @returns Product data
 * @throws {Error} If product is not found or request fails
 * @example
 * const product = await getProductBySlug("productSlug");
 * */
export async function getProductBySlug(
  slug: string
): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.DETAILS_SLUG(slug)
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to fetch product");
    }
    throw new Error("Failed to fetch product");
  }
}

/**
 * Searches for products by title (query) or slug.
 *
 * @param params - Object containing search parameters
 * @param params.query - Optional search string for product title
 * @param params.slug - Optional slug of the product
 * @returns Promise resolving to the list of matching products
 *
 * @example
 * const result = await searchProduct({ query: "macbook" });
 * const result = await searchProduct({ slug: "macbook-pro-2024" });
 */
export async function searchProductsApi(params: {
  query?: string;
  slug?: string;
}): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.SEARCH,
      { params }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to search products"
      );
    }
    throw new Error("Failed to search products");
  }
}

/**
 * Fetches the latest products from the API.
 *
 * @param limit - Number of latest products to retrieve (default: 3)
 * @returns Promise resolving to the list of latest products
 *
 * @example
 * const latestProducts = await getLatestProducts(3);
 */
export async function getLatestProducts(
  limit: number
): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.post(
      API_ROUTES.PRODUCTS.LATEST,
      { limit } // correspond au param attendu côté backend
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch latest products"
      );
    }
    throw new Error("Failed to fetch latest products");
  }
}

/**
 * Updates an existing product in the API.
 * @param id - Product ID to update
 * @param body - Updated product information
 * @returns Updated product data and success message
 * @throws {Error} If data is invalid or update fails
 * @example
 * const response = await updateProduct("productId", {
 *   name: "Updated Product Name",
 *  price: 79.99
 * });
 * /
 * */
export async function updateProduct(
  id: string,
  body: Record<string, any> | FormData
): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.put(
      API_ROUTES.PRODUCTS.UPDATE(id),
      body
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to update product"
      );
    }
    throw new Error("Failed to update product");
  }
}

/**
 * Deletes a product from the API.
 * @param id - Product ID to delete
 * @returns Success message
 * @throws {Error} If deletion fails
 * @example
 * const response = await deleteProduct("productId");
 * */
export async function deleteProduct(id: string): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.delete(
      API_ROUTES.PRODUCTS.DELETE(id)
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to delete product"
      );
    }
    throw new Error("Failed to delete product");
  }
}
