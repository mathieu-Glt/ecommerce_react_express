import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Slice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  searchProducts,
  fetchProductById,
  fetchLatestProducts,
  rateProduct,
  fetchProductsByCategoryId,
  fetchProductsBySubsCategoryId,
  fetchProductsByAverageRate,
  fetchProductsByPriceRangeThunk,
} from "../thunks/productThunk";
import type { ProductState } from "../../interfaces/product.interface";
// import { loadProductStateFromLocalStorage } from "../middleware/localStorageMiddleware";

// ====================================================
// 🔄 HYDRATION FROM LOCAL STORAGE
// ====================================================

// const persistedProducts = loadProductStateFromLocalStorage();
// ====================================================
// 🧠 INITIAL STATE
// ====================================================

// const initialState: ProductState = persistedProducts || {
const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// ====================================================
// 🧩 PRODUCT SLICE
// ====================================================

const productSlice: Slice<ProductState> = createSlice({
  name: "products",
  initialState,

  // ----------------------------------------------------
  // 🔹 Synchronous reducers
  // ----------------------------------------------------
  reducers: {
    /**
     * Completely clears the list of products
     * (useful during logout or a full refresh)
     */
    clearProducts: (state) => {
      state.products = [];
      state.selectedProduct = null;
      state.loading = false;
      state.error = null;
    },

    /**
     * Sets a selected product (e.g., detail page)
     */
    setSelectedProduct: (state, action: PayloadAction<any>) => {
      state.selectedProduct = action.payload;
    },

    /**
     * Manually sets an error state
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Manually sets the loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },

  // ----------------------------------------------------
  // 🔹 Extra reducers — Async thunks (API)
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
        state.loading = false;
        state.products = action.payload || [];
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
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
        state.loading = false;
        state.products = action.payload.results || [];
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
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
        state.loading = false;
        state.selectedProduct = action.payload || null;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
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
        state.loading = false;
        state.products = action.payload || [];
        state.error = null;
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
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

        // Updates the selected product if it matches
        if (
          state.selectedProduct &&
          state.selectedProduct._id === updatedProduct._id
        ) {
          state.selectedProduct = updatedProduct;
        }

        // Updates the product list if present
        state.products = state.products.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
      })
      .addCase(rateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error rating product";
      });
    //=========================================
    // FETCH PRODUCTS BY CATEGORY ID
    // ==========================================
    builder
      .addCase(fetchProductsByCategoryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategoryId.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
        state.error = null;
      })
      .addCase(fetchProductsByCategoryId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch products by category";
      });
    //=========================================
    // FETCH PRODUCTS BY SUBS CATEGORY ID
    // ==========================================
    builder
      .addCase(fetchProductsBySubsCategoryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsBySubsCategoryId.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
        state.error = null;
      })
      .addCase(fetchProductsBySubsCategoryId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Failed to fetch products by subs category";
      });
    //=========================================
    // FETCH PRODUCTS BY AVERAGE RATE RATE MIN AND MAX
    // ==========================================
    builder
      .addCase(fetchProductsByAverageRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByAverageRate.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
        state.error = null;
      })
      .addCase(fetchProductsByAverageRate.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Failed to fetch products by average rate";
      });
    //=========================================
    // FETCH PRODUCTS BY PRICE MIN AND MAX
    // ==========================================
    builder
      .addCase(fetchProductsByPriceRangeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByPriceRangeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
        state.error = null;
      })
      .addCase(fetchProductsByPriceRangeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Failed to fetch products by price range";
      });
  },
});

// ====================================================
// 🧭 EXPORTS
// ====================================================

export const { clearProducts, setSelectedProduct, setError, setLoading } =
  productSlice.actions;

export default productSlice.reducer;
