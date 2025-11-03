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
    // ➕ Ajouter un produit
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

      // On cherche si ce produit est déjà dans le panier pour ce user
      const existing = state.items.find(
        (item) => item.product._id === product._id && item.orderBy === orderBy
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        // ✅ Ici, on pousse un vrai CartItem (product + quantity + orderBy)
        state.items.push({ product, quantity, orderBy });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // ===========================================
    // 🔁 Mettre à jour la quantité d’un produit
    // ===========================================
    updateToCart: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      console.log("updateToCart action payload:", action.payload);
      const item = state.items.find(
        (i) => i.product._id === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    // ===========================================
    // ❌ Supprimer un produit
    // ===========================================
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // ===========================================
    // 🧹 Vider le panier
    // ===========================================
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
      localStorage.removeItem("orderedBy");
      state.orderedBy = null;
    },

    // ===========================================
    // 👤 Définir l’utilisateur lié au panier
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
    // (à compléter plus tard pour les thunks si besoin)
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
