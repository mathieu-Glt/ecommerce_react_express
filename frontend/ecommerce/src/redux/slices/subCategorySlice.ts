import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Slice } from "@reduxjs/toolkit";
import type { SubCategoryState } from "../../interfaces/subCategory.interface";
import {
  fetchSubCategories,
  fetchSubCategoryById,
} from "../thunks/subCategoryThunk";
// import {
//   fetchSubCategories,
//   fetchSubCategoryById,
//   createSubCategory,
//   updateSubCategory,
//   deleteSubCategory,
// } from "../thunks/subCategoryThunk";

// ====================================================
// 🧠 INITIAL STATE
// ====================================================
const initialState: SubCategoryState = {
  subCategories: [],
  selectedSubCategory: null,
  loading: false,
  error: null,
};

// ====================================================
// 🧩 SUB-CATEGORY SLICE
// ====================================================
const subCategorySlice: Slice<SubCategoryState> = createSlice({
  name: "subCategories",
  initialState,

  // ----------------------------------------------------
  // 🔹 Synchronous reducers
  // ----------------------------------------------------
  reducers: {
    /**
     * Completely clears the list of sub-categories
     * (useful during logout or a full refresh)
     */
    clearSubCategories: (state) => {
      state.subCategories = [];
      state.selectedSubCategory = null;
      state.loading = false;
      state.error = null;
    },

    /**
     * Sets a selected sub-category (e.g., detail page)
     */
    setSelectedSubCategory: (state, action: PayloadAction<any>) => {
      state.selectedSubCategory = action.payload;
    },
  },

  // ----------------------------------------------------
  // 🔸 Extra asynchronous reducers (thunks)
  // ----------------------------------------------------
  extraReducers: (builder) => {
    builder
      // ==========================================
      // FETCH SUB-CATEGORIES
      // ==========================================
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sub-categories";
      });

    // ==========================================
    // FETCH SUB-CATEGORY BY ID
    // ==========================================
    builder
      .addCase(fetchSubCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubCategory = action.payload;
      })
      .addCase(fetchSubCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch sub-category by ID";
      });
  },
});

// ====================================================
// 🧾 EXPORTS
// ====================================================
export const { clearSubCategories, setSelectedSubCategory } =
  subCategorySlice.actions;

export default subCategorySlice.reducer;
