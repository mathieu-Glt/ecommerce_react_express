import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { useApi } from "../../hooks/useApi";
import { API_ROUTES } from "../constants/api-routes";

// Define BASE_URL or import from your config
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:5173";
// eslint-disable-next-line react-hooks/rules-of-hooks
const api: AxiosInstance = useApi();
/**
 * Fetches the current user's cart from the API.
 *
 * @returns A promise that resolves to the cart data.
 */
export async function getCart(): Promise<any> {
  try {
    const response: AxiosResponse<any> = await api.get(
      API_ROUTES.CART.GET_CART
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to fetch cart");
    }
    throw new Error("Failed to fetch cart");
  }
}

/**
 * Updates the user's cart in the API.
 *
 * @param body - Cart information (items, quantities, etc.)
 * @returns Updated cart data and success message
 * @throws {Error} If data is invalid or update fails
 * @example
 * const response = await updateCart({
 *   items: [{ productId: "123", quantity: 2 }],
 * });
 * /
 * /
 */
export async function updateCart(
  body: Record<string, any> | FormData
): Promise<any> {
  try {
    const response: AxiosResponse<any> = await api.put(
      API_ROUTES.CART.UPDATE_CART,
      body
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to update cart");
    }
    throw new Error("Failed to update cart");
  }
}

/**
 * Clears the user's cart in the API.
 * @returns Success message
 * @throws {Error} If clearing fails
 * @example
 * const response = await clearCart();
 * /
 */
export async function clearCart(): Promise<any> {
  try {
    const response: AxiosResponse<any> = await api.delete(
      API_ROUTES.CART.CLEAR_CART
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to clear cart");
    }
    throw new Error("Failed to clear cart");
  }
}

/**
 * Add an item to the user's cart in the API.
 * @param body - Item information (productId, quantity, etc.)
 * @returns Updated cart data and success message
 * @throws {Error} If data is invalid or addition fails
 * @example
 * const response = await addItemToCart({
 *  productId: "123",
 *  quantity: 1
 * });
 */
export async function addItemToCart(
  body: Record<string, any> | FormData
): Promise<any> {
  try {
    const response: AxiosResponse<any> = await api.post(
      API_ROUTES.CART.ADD_ITEM,
      body
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to add item to cart"
      );
    }
    throw new Error("Failed to add item to cart");
  }
}

/**
 * Removes a specific item from the user's cart in the API.
 * @param productId - The ID of the product to remove
 * @returns Updated cart data and success message
 * @throws {Error} If removal fails
 * @example
 * const response = await removeItemFromCart("123");
 */
export async function removeItemFromCart(productId: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await api.delete(
      `${API_ROUTES.CART.REMOVE_ITEM}/${productId}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to remove item from cart"
      );
    }
    throw new Error("Failed to remove item from cart");
  }
}
