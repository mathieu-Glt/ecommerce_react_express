import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { useApi } from "../../hooks/useApi";
import type { ProductListResponse } from "../../interfaces/responseProduct.interface";
import { API_ROUTES } from "../constants/api-routes";

// Define BASE_URL or import from your config
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:8000";
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
  title?: string;
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

    const response: AxiosResponse<ProductListResponse> = await api.get(
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
 * Fetches the  products  better sold from the API.
 *
 * @param limit - Number of latest products to retrieve (default: 3)
 * @returns Promise resolving to the list of latest products
 *
 * @example
 * const latestProducts = await getLatestProducts(3);
 */
export async function getBestSoldProducts(): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.BEST_SOLD
      // { limit }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch best sold products"
      );
    }
    throw new Error("Failed to fetch best sold products");
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

/**
 * Rates a product by adding a new rating.
 * @param id - Product ID to rate
 * @param star - Rating value (1-5)
 * @returns Updated product data with new rating
 * @throws {Error} If rating fails
 * @example
 * const response = await addProductRating("productId", 4);
 * */
export async function addProductRating(
  id: string,
  star: number,
  isUpdate?: boolean
): Promise<ProductListResponse> {

  try {
    const response: AxiosResponse<ProductListResponse> = await api.post(
      API_ROUTES.PRODUCTS.RATE_ADD(id),
      { star }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to rate product");
    }
    throw new Error("Failed to rate product");
  }
}

/**
 * Updates an existing product rating.
 * @param id - Product ID to update rating
 * @param star - New rating value (1-5)
 * @returns Updated product data with updated rating
 * @throws {Error} If update fails
 * @example
 * const response = await updateProductRating("productId", 5);
 * */
export async function updateProductRating(
  id: string,
  star: number,
  isUpdate?: boolean
): Promise<ProductListResponse> {
  try {
    // Axios instance will automatically add the token from useApi
    const response: AxiosResponse<ProductListResponse> = await api.put(
      API_ROUTES.PRODUCTS.RATE_UPDATE(id),
      { star }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to update product rating"
      );
    }
    throw new Error("Failed to update product rating");
  }
}

/**
 * Check if the logged-in user has already rated a product
 * @param id - Product ID
 * @returns true if the user has rated the product, false otherwise
 * @throws {Error} If the request fails
 * @example
 * const hasRated = await hasUserRatedProduct("productId");
 */
export async function hasUserRatedProduct(id: string): Promise<{}> {
  try {
    const response: AxiosResponse<{ success: boolean }> = await api.get(
      API_ROUTES.PRODUCTS.RATE_CHECK(id)
    );

    // The backend returns true/false
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to check user rating"
      );
    }
    throw new Error("Failed to check user rating");
  }
}

/**
 * Retrieves products by category ID.
 *
 * @param categoryIdOrSlug - The category ID (MongoDB _id).
 * @returns List of products belonging to the specified .
 * @throws {Error} If the request fails.
 *
 * @example
 * const products = await getProductsByCategory("68af1360ad37cf7ede6bd1ea");
 * const products = await getProductsByCategory("smartphones");
 */
export async function getProductsByCategoryId(
  categoryId: string
): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.BY_CATEGORY_ID(categoryId)
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch products by category"
      );
    }
    throw new Error("Failed to fetch products by category");
  }
}

/**
 * Retrieves products by subs category ID.
 *
 * @param categoryIdOrSlug - The subs category ID (MongoDB _id).
 * @returns List of products belonging to the specified .
 * @throws {Error} If the request fails.
 *
 * @example
 * const products = await getProductsByCategory("68af1360ad37cf7ede6bd1ea");
 * const products = await getProductsByCategory("samsung");
 */
export async function getProductsBySubsCategoryIdApi(
  subsCategoryId: string
): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.BY_SUBS_CATEGORY_ID(subsCategoryId)
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to fetch products by subs category"
      );
    }
    throw new Error("Failed to fetch products by subs category");
  }
}

/**
 * Fetch products filtered by average rating range
 *
 * @param {number} [minRate=0] - Minimum average rating (inclusive)
 * @param {number} [maxRate=5] - Maximum average rating (inclusive)
 * @returns {Promise<Product[]>} List of products within the average rating range
 *
 * @example
 * const products = await getProductsByAverageRateRange(3, 5, 1, 10);
 */
export async function getProductsByAverageRateRange(
  minRate: number = 0,
  maxRate: number = 5
): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.BY_AVERAGE_RATE,
      {
        params: { minRate, maxRate },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to fetch products by average rate range"
      );
    }
    throw new Error("Failed to fetch products by average rate range");
  }
}

/**
 * Fetch products filtered by price range
 *
 * @param {number} [minPrice=0] - Minimum price (inclusive)
 * @param {number} [maxPrice=Infinity] - Maximum price (inclusive)
 * @returns {Promise<Product[]>} List of products within the price range
 * * @example
 * const products = await getProductsByPriceRange(100, 500);
 */
export async function getProductsByPriceRangeApi(
  minPrice: number = 0,
  maxPrice: number = Infinity
): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.BY_PRICE_RANGE,
      {
        params: { minPrice, maxPrice },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch products by price range"
      );
    }
    throw new Error("Failed to fetch products by price range");
  }
}

/**
 * Retrieves products by category acesories.
 *
 * @param categoryIdOrSlug - The category ID (MongoDB _id).
 * @returns List of products belonging to the specified .
 * @throws {Error} If the request fails.
 *
 * @example
 * const products = await getProductsByCategory("68af1360ad37cf7ede6bd1ea");
 * const products = await getProductsByCategory("smartphones");
 */

export async function getProductsByCategoryAcesories(): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.BY_CATEGORY_SLUG("accessories")
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to fetch products by category Acesories"
      );
    }
    throw new Error("Failed to fetch products by category Acesories");
  }
}

/**
 * Retrieves products by category acesories.
 *
 * @param categoryIdOrSlug - The category ID (MongoDB _id).
 * @returns List of products belonging to the specified .
 * @throws {Error} If the request fails.
 *
 * @example
 * const products = await getProductsByCategory("68af1360ad37cf7ede6bd1ea");
 * const products = await getProductsByCategory("smartphones");
 */
export async function getProductsByCategoryOutillage(): Promise<ProductListResponse> {
  try {
    const response: AxiosResponse<ProductListResponse> = await api.get(
      API_ROUTES.PRODUCTS.BY_CATEGORY_SLUG("outillage")
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to fetch products by category Outillage"
      );
    }
    throw new Error("Failed to fetch products by category Outillage");
  }
}
