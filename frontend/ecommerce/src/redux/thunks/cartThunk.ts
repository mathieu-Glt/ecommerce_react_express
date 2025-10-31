// src/redux/thunks/cartThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store"; // adapte le chemin selon ton store
import type { Product } from "../../interfaces/product.interface";
import type { CartItem } from "../slices/cartSlice";

// On importe les actions synchrones du slice (elles gèrent le localStorage)
import {
  addToCart as addToCartAction,
  updateToCart as updateToCartAction, // corrected: 'update' instead of 'upodate'
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
} from "../slices/cartSlice";

/**
 * NOTE:
 * Ces thunks NE DOIVENT PAS toucher au localStorage.
 * Ils se contentent de dispatcher les reducers synchrones (qui eux font la persistance).
 * Ensuite, ils retournent l'état à jour (items) via thunkAPI.getState().
 */

// ===== Fetch cart (simply returns current items from state) =====
export const fetchUserCartThunk = createAsyncThunk<CartItem[]>(
  "cart/fetchUserCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      return state.cart.items;
    } catch (err: any) {
      console.error("❌ fetchUserCartThunk error:", err);
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
    console.log("datasCart in thunk:", datasCart);
    const { product, quantity = 1, orderBy } = datasCart;
    console.log(
      "Adding to cart - product:",
      product,
      "quantity:",
      quantity,
      "orderBy:",
      orderBy
    );
    try {
      // Dispatch the synchronous addToCart reducer with the product payload.
      // Ici on envoie uniquement le product (le reducer gère la logique quantity par défaut).
      //   for (let i = 0; i < quantity; i++) {
      //     dispatch(addToCartAction(product));
      //   }

      const state = getState() as RootState;
      return state.cart.items;
    } catch (err: any) {
      console.error("❌ addItemToCartThunk error:", err);
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
      // On dispatch l'action syncro du slice qui met à jour la quantité et écrit le localStorage
      dispatch(updateToCartAction({ productId, quantity }));
      const state = getState() as RootState;
      return state.cart.items;
    } catch (err: any) {
      console.error("❌ updateCartItemThunk error:", err);
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
      console.error("❌ removeItemFromCartThunk error:", err);
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
      console.error("❌ clearCartThunk error:", err);
      return rejectWithValue("Failed to clear cart");
    }
  }
);
