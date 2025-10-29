import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Slice } from "@reduxjs/toolkit";
import type { CategoryState } from "../../interfaces/category.interface";
import { fetchCategories, fetchCategoryById } from "../thunks/categoryThunk";
// import {
//   fetchCategories,
//   fetchCategoryById,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// } from "../thunks/categoryThunk";

// ====================================================
// 🧠 ÉTAT INITIAL
// ====================================================
const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};
// ====================================================
// 🧩 SLICE CATÉGORIES
// ====================================================
const categorySlice: Slice<CategoryState> = createSlice({
  name: "categories",
  initialState,
  // ----------------------------------------------------
  // 🔹 Reducers synchrones
  // ----------------------------------------------------
  reducers: {
    /**
     * Vide complètement la liste des catégories
     * (utile lors du logout ou d’un refresh complet)
     */
    clearCategories: (state) => {
      state.categories = [];
      state.selectedCategory = null;
      state.loading = false;
      state.error = null;
    },
    /**
     * Définit une catégorie sélectionnée (ex: page détail)
     */
    setSelectedCategory: (state, action: PayloadAction<any>) => {
      state.selectedCategory = action.payload;
    },
  },
  // ----------------------------------------------------
  // 🔸 Extra reducers asynchrones (thunks)
  // ----------------------------------------------------
  extraReducers: (builder) => {
    builder
      // ==========================================
      // FETCH CATEGORIES
      // ==========================================
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
    // ==========================================
    // GET CATEGORY BY ID
    // ==========================================
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch category by ID";
      });
  },
});

// Export des actions synchrones
export const { clearCategories, setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
