import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Slice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  searchProducts,
  fetchProductById,
  fetchLatestProducts,
  rateProduct,
} from "../thunks/productThunk";
import type { ProductState } from "../../interfaces/product.interface";
// import { loadProductStateFromLocalStorage } from "../middleware/localStorageMiddleware";

// ====================================================
// 🔄 HYDRATATION DEPUIS LOCAL STORAGE
// ====================================================

// const persistedProducts = loadProductStateFromLocalStorage();
// console.log("🌊 [productSlice] État persisté chargé:", persistedProducts);

// ====================================================
// 🧠 ÉTAT INITIAL
// ====================================================

// const initialState: ProductState = persistedProducts || {
const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// ====================================================
// 🧩 SLICE PRODUITS
// ====================================================

const productSlice: Slice<ProductState> = createSlice({
  name: "products",
  initialState,

  // ----------------------------------------------------
  // 🔹 Reducers synchrones
  // ----------------------------------------------------
  reducers: {
    /**
     * Vide complètement la liste des produits
     * (utile lors du logout ou d’un refresh complet)
     */
    clearProducts: (state) => {
      state.products = [];
      state.selectedProduct = null;
      state.loading = false;
      state.error = null;
    },

    /**
     * Définit un produit sélectionné (ex: page détail)
     */
    setSelectedProduct: (state, action: PayloadAction<any>) => {
      state.selectedProduct = action.payload;
    },

    /**
     * Définit manuellement une erreur
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Définit l’état de chargement
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },

  // ----------------------------------------------------
  // 🔹 Extra reducers — Thunks async (API)
  // ----------------------------------------------------
  extraReducers: (builder) => {
    builder
      // ==========================================
      // FETCH PRODUCTS
      // ==========================================
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log("✅ [productSlice] Produits récupérés:", action.payload);

        state.loading = false;
        state.products = action.payload || [];
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error(
          "❌ [productSlice] Erreur récupération produits:",
          action.payload
        );

        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch products";
      });
    // ==========================================
    // SEARCH PRODUCTS
    // ==========================================
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        console.log("✅ [productSlice] Produits recherchés:", action.payload);
        state.loading = false;
        state.products = action.payload.results || [];
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        console.error(
          "❌ [productSlice] Erreur recherche produits:",
          action.payload
        );
        state.loading = false;
        state.error = (action.payload as string) || "Failed to search products";
      });
    // ==========================================
    // GET PRODUCT BY ID
    // ==========================================
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        console.log(
          "✅ [productSlice] Produit par ID récupéré:",
          action.payload
        );
        state.loading = false;
        state.selectedProduct = action.payload || null;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        console.error(
          "❌ [productSlice] Erreur récupération produit par ID:",
          action.payload
        );
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch product by ID";
      });
    // ==========================================
    // FECTH LATEST PRODUCTS
    // ==========================================
    builder
      .addCase(fetchLatestProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        console.log(
          "✅ [productSlice] Derniers produits récupérés:",
          action.payload
        );
        state.loading = false;
        state.products = action.payload || [];
        state.error = null;
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        console.error(
          "❌ [productSlice] Erreur récupération derniers produits:",
          action.payload
        );
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch latest products";
      });
    // ==========================================
    // ⭐ RATE PRODUCT
    // ==========================================
    builder
      .addCase(rateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;

        // Met à jour le produit sélectionné
        if (
          state.selectedProduct &&
          state.selectedProduct._id === updatedProduct._id
        ) {
          state.selectedProduct = updatedProduct;
        }

        // Met à jour la liste de produits si présente
        state.products = state.products.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
      })
      .addCase(rateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Erreur lors de la notation du produit";
      });
  },
});

// ====================================================
// 🧭 EXPORTS
// ====================================================

export const { clearProducts, setSelectedProduct, setError, setLoading } =
  productSlice.actions;

export default productSlice.reducer;
