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
// 🧠 INITIAL STATE
// ====================================================
const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};
// ====================================================
// 🧩 CATEGORY SLICE
// ====================================================
const categorySlice: Slice<CategoryState> = createSlice({
  name: "categories",
  initialState,
  // ----------------------------------------------------
  // 🔹 Synchronous reducers
  // ----------------------------------------------------
  reducers: {
    /**
     * Completely clears the list of categories
     * (useful during logout or a full refresh)
     */
    clearCategories: (state) => {
      state.categories = [];
      state.selectedCategory = null;
      state.loading = false;
      state.error = null;
    },
    /**
     * Sets a selected category (e.g., detail page)
     */
    setSelectedCategory: (state, action: PayloadAction<any>) => {
      state.selectedCategory = action.payload;
    },
  },
  // ----------------------------------------------------
  // 🔸 Extra asynchronous reducers (thunks)
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
