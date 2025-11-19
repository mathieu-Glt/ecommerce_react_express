import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../interfaces/product.interface";
import type { AddToCartPayload } from "../../interfaces/cart.interface";

interface CartItem {
  product: Product;
  quantity: number;
  orderBy: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ===========================================
    // ➕ Add a product to cart
    // ===========================================
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        orderBy: string;
      }>
    ) => {
      const { product, quantity, orderBy } = action.payload;

      // Check if this product is already in the cart for this user
      const existing = state.items.find(
        (item) => item.product._id === product._id && item.orderBy === orderBy
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        // ✅ Here, we push a real CartItem (product + quantity + orderBy)
        state.items.push({ product, quantity, orderBy });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // ===========================================
    // 🔁 Update the quantity of a product
    // ===========================================
    updateToCart: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.product._id === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    // ===========================================
    // ❌ Remove a product from cart
    // ===========================================
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // ===========================================
    // 🧹 Clear the cart
    // ===========================================
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
      localStorage.removeItem("orderedBy");
      state.orderedBy = null;
    },

    // ===========================================
    // 👤 Set the user associated with the cart
    // ===========================================
    setOrderedBy: (state, action: PayloadAction<string | null>) => {
      state.orderedBy = action.payload;
      if (action.payload) {
        localStorage.setItem("orderedBy", action.payload);
      } else {
        localStorage.removeItem("orderedBy");
      }
    },
  },
  extraReducers: (builder) => {
    // (to be completed later for thunks if needed)
  },
});

export const {
  addToCart,
  updateToCart,
  removeFromCart,
  clearCart,
  setOrderedBy,
} = cartSlice.actions;

export default cartSlice.reducer;
