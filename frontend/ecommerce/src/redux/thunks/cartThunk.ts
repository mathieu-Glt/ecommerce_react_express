// src/redux/thunks/cartThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store"; // adapte le chemin selon ton store
import type { Product } from "../../interfaces/product.interface";
import type { CartItem } from "../slices/cartSlice";

// We import the synchronous actions from the slice (they handle localStorage)
import {
  addToCart as addToCartAction,
  updateToCart as updateToCartAction, // corrected: 'update' instead of 'upodate'
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  addToCart,
  updateToCart,
} from "../slices/cartSlice";

/**
 * NOTE:
 * These thunks MUST NOT touch localStorage.
 * They only dispatch the synchronous reducers (which handle persistence).
 * Then, they return the updated state (items) via thunkAPI.getState().
 */

// ===== Fetch cart (simply returns current items from state) =====
export const fetchUserCartThunk = createAsyncThunk<CartItem[]>(
  "cart/fetchUserCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      return state.cart.items;
    } catch (err: any) {
      return rejectWithValue("Failed to get cart from state");
    }
  }
);

// ===== Add item to cart (dispatch slice reducer) =====
export const addItemToCartThunk = createAsyncThunk<
  CartItem[],
  { product: Product; quantity?: number; orderBy?: string }
>(
  "cart/addItemToCart",
  async (datasCart, { dispatch, getState, rejectWithValue }) => {
    const { product, quantity = 1, orderBy } = datasCart;
    try {
      // Dispatch the synchronous addToCart reducer with the product payload.
      // Here we send the already destructured values (quantity has a default value here).
      dispatch(addToCart({ product, quantity, orderBy }));

      const state = getState() as RootState;
      return state.cart.items;
    } catch (err: any) {
      return rejectWithValue("Failed to add item to cart");
    }
  }
);

// ===== Update item quantity (dispatch the slice reducer that updates quantity) =====
export const updateCartItemThunk = createAsyncThunk<
  CartItem[],
  { productId: string; quantity: number }
>(
  "cart/updateCartItem",
  async ({ productId, quantity }, { dispatch, getState, rejectWithValue }) => {
    try {
      // We dispatch the slice's synchronous action that updates the quantity and writes to localStorage
      dispatch(updateToCart({ productId, quantity }));
      const state = getState() as RootState;
      return state.cart.items;
    } catch (err: any) {
      return rejectWithValue("Failed to update cart item");
    }
  }
);

// ===== Remove item from cart =====
export const removeItemFromCartThunk = createAsyncThunk<CartItem[], string>(
  "cart/removeItemFromCart",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(removeFromCartAction(productId));
      const state = getState() as RootState;
      return state.cart.items;
    } catch (err: any) {
      return rejectWithValue("Failed to remove item from cart");
    }
  }
);

// ===== Clear cart =====
export const clearCartThunk = createAsyncThunk<CartItem[]>(
  "cart/clearCart",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(clearCartAction());
      const state = getState() as RootState;
      return state.cart.items; // devrait être []
    } catch (err: any) {
      return rejectWithValue("Failed to clear cart");
    }
  }
);
