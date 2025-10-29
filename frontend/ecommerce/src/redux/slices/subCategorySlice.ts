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
// 🧠 ÉTAT INITIAL
// ====================================================
const initialState: SubCategoryState = {
  subCategories: [],
  selectedSubCategory: null,
  loading: false,
  error: null,
};

// ====================================================
// 🧩 SLICE SOUS-CATÉGORIES
// ====================================================
const subCategorySlice: Slice<SubCategoryState> = createSlice({
  name: "subCategories",
  initialState,

  // ----------------------------------------------------
  // 🔹 Reducers synchrones
  // ----------------------------------------------------
  reducers: {
    /**
     * Vide complètement la liste des sous-catégories
     * (utile lors du logout ou d’un refresh complet)
     */
    clearSubCategories: (state) => {
      state.subCategories = [];
      state.selectedSubCategory = null;
      state.loading = false;
      state.error = null;
    },

    /**
     * Définit une sous-catégorie sélectionnée (ex: page détail)
     */
    setSelectedSubCategory: (state, action: PayloadAction<any>) => {
      state.selectedSubCategory = action.payload;
    },
  },

  // ----------------------------------------------------
  // 🔸 Extra reducers asynchrones (thunks)
  // ----------------------------------------------------
  extraReducers: (builder) => {
    builder
      // ==========================================
      // FETCH SOUS-CATÉGORIES
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
    // FETCH SOUS-CATÉGORIE PAR ID
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
