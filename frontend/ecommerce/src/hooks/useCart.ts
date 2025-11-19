// src/hooks/useCart.ts
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import useToast from "./usetoast";
import type { AddToCartPayload, Cart } from "../interfaces/cart.interface";
import {
  addItemToCartThunk,
  clearCartThunk,
  fetchUserCartThunk,
  removeItemFromCartThunk,
  updateCartItemThunk,
} from "../redux/thunks/cartThunk";

/**
 * Custom hook to manage cart state and CRUD operations.
 *
 * @returns {object} Cart context (state + actions)
 *
 * @example
 * const { cart, addToCart, removeFromCart, clearCart, updateCartItem } = useCart();
 */
export const useCart = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  // SSelection of state from Redux
  // useCart.ts
  const { items: cart, orderedBy } = useAppSelector((state) => state.cart);

  // ============================================
  // FETCH USER CART
  // ============================================
  const getUserCart = useCallback(async (): Promise<void> => {
    try {
      await dispatch(fetchUserCartThunk()).unwrap();
      toast.showSuccess("Cart loaded successfully");
    } catch (err: any) {
      toast.showError(err?.message || "Failed to fetch cart");
    }
  }, [dispatch, toast]);

  // ============================================
  // ADD ITEM TO CART
  // ============================================
  const addToCart = useCallback(
    // async (productId: string, quantity = 1): Promise<void> => {
    async (datasCart: AddToCartPayload): Promise<void> => {
      try {
        await dispatch(addItemToCartThunk(datasCart)).unwrap();
        toast.showSuccess("Product added to cart");
      } catch (err: any) {
        toast.showError(err?.message || "Failed to add product to cart");
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // REMOVE ITEM FROM CART
  // ============================================
  const removeFromCart = useCallback(
    async (productId: string): Promise<void> => {
      try {
        await dispatch(removeItemFromCartThunk(productId)).unwrap();
        toast.showSuccess("Product removed from cart");
      } catch (err: any) {
        toast.showError(err?.message || "Failed to remove product from cart");
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // UPDATE ITEM QUANTITY
  // ============================================
  const updateCartItem = useCallback(
    async (productId: string, quantity: number): Promise<void> => {
      try {
        await dispatch(updateCartItemThunk({ productId, quantity })).unwrap();
        toast.showSuccess("Cart updated successfully");
      } catch (err: any) {
        toast.showError(err?.message || "Failed to update cart item");
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // CLEAR CART
  // ============================================
  const clearCart = useCallback(async (): Promise<void> => {
    try {
      await dispatch(clearCartThunk()).unwrap();
      toast.showSuccess("Cart cleared successfully");
    } catch (err: any) {
      toast.showError(err?.message || "Failed to clear cart");
    }
  }, [dispatch, toast]);

  // ============================================
  // MEMOIZED RETURN VALUE
  // ============================================
  const cartContextValue = useMemo(
    () => ({
      cart,
      getUserCart,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
    }),
    [cart, getUserCart, addToCart, removeFromCart, updateCartItem, clearCart]
  );

  return cartContextValue;
};
