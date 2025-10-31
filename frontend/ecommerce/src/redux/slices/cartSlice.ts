import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../interfaces/product.interface";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  orderedBy?: string | null; // ID de l'utilisateur ayant ajouté au panier
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
  orderedBy: localStorage.getItem("orderedBy") || null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ===========================================
    // ➕ Ajouter un produit
    // ===========================================
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((i) => i._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
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
      const item = state.items.find((i) => i._id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    // ===========================================
    // ❌ Supprimer un produit
    // ===========================================
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
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
