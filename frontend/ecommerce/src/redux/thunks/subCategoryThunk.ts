import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSubs,
  getSubBySlug,
  createSub,
  updateSub,
  deleteSub,
} from "../../services/api/subCategory";
import type { SubCategory } from "../../interfaces/subCategory.interface";

/**
 * ===========================================================
 * 🔹 FETCH ALL SUB-CATEGORIES
 * ===========================================================
 */
export const fetchSubCategories = createAsyncThunk<
  SubCategory[], // résultat attendu
  void, // pas d’argument
  { rejectValue: string }
>("subCategories/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await getSubs();
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    // Certains endpoints renvoient un objet { results: [...] } ou { results: { subs: [...] } }
    // Adapte si besoin selon la structure exacte
    const results = Array.isArray(response.results)
      ? response.results
      : response.results?.subs || [];
    return results as SubCategory[];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching sub-categories"
    );
  }
});

/**
 * ===========================================================
 * 🔹 FETCH SUB-CATEGORY BY ID
 * ===========================================================
 */
export const fetchSubCategoryById = createAsyncThunk<
  SubCategory,
  string, // id
  { rejectValue: string }
>("subCategories/fetchById", async (id, thunkAPI) => {
  try {
    const response = await getSubBySlug(id);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    return response.results as SubCategory;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching sub-category by ID"
    );
  }
});

/**
 * ===========================================================
 * 🔹 FETCH SUB-CATEGORY BY SLUG
 * ===========================================================
 */
export const fetchSubCategoryBySlug = createAsyncThunk<
  SubCategory,
  string, // slug
  { rejectValue: string }
>("subCategories/fetchBySlug", async (slug, thunkAPI) => {
  try {
    const response = await getSubBySlug(slug);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    // La plupart du temps `results` contient directement le SubCategory
    return response.results as SubCategory;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching sub-category by slug"
    );
  }
});

/**
 * ===========================================================
 * 🔹 CREATE NEW SUB-CATEGORY
 * ===========================================================
 */
export const createNewSubCategory = createAsyncThunk<
  SubCategory,
  Record<string, any> | FormData,
  { rejectValue: string }
>("subCategories/create", async (data, thunkAPI) => {
  try {
    const response = await createSub(data);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    return response.results as SubCategory;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error creating sub-category"
    );
  }
});

/**
 * ===========================================================
 * 🔹 UPDATE EXISTING SUB-CATEGORY
 * ===========================================================
 */
export const updateExistingSubCategory = createAsyncThunk<
  SubCategory,
  { slug: string; data: Record<string, any> | FormData },
  { rejectValue: string }
>("subCategories/update", async ({ slug, data }, thunkAPI) => {
  try {
    const response = await updateSub(slug, data);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    return response.results as SubCategory;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error updating sub-category"
    );
  }
});

/**
 * ===========================================================
 * 🔹 DELETE SUB-CATEGORY
 * ===========================================================
 */
export const deleteExistingSubCategory = createAsyncThunk<
  string, // on renvoie le slug supprimé
  string, // argument = slug
  { rejectValue: string }
>("subCategories/delete", async (slug, thunkAPI) => {
  try {
    const response = await deleteSub(slug);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    return slug;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error deleting sub-category"
    );
  }
});
