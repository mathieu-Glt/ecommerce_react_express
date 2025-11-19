import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api/category";
import type { Category } from "../../interfaces/category.interface";

/**
 * Fetch all categories
 */
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await getCategories(); // ← array directly

    // If it’s indeed an array, return it directly
    if (Array.isArray(response)) {
      return response;
    }

    // Otherwise handle the classic error case
    if (!response || !response.success) {
      return thunkAPI.rejectWithValue(
        response?.message || "Invalid response format"
      );
    }

    return response.results || [];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching categories"
    );
  }
});

/**
 * Fetch category by ID
 */
export const fetchCategoryById = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>("categories/fetchById", async (id, thunkAPI) => {
  try {
    const response = await getCategoryById(id);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching category by ID"
    );
  }
});

/**
 * Fetch category by slug
 */
export const fetchCategoryBySlug = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>("categories/fetchBySlug", async (slug, thunkAPI) => {
  try {
    const response = await getCategoryBySlug(slug);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching category by slug"
    );
  }
});

/**
 * Create a new category
 */
export const createNewCategory = createAsyncThunk<
  Category,
  Partial<Category>,
  { rejectValue: string }
>("categories/create", async (data, thunkAPI) => {
  try {
    const response = await createCategory(data);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error creating category");
  }
});

/**
 * Update a category
 */
export const updateExistingCategory = createAsyncThunk<
  Category,
  { id: string; data: Partial<Category> },
  { rejectValue: string }
>("categories/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await updateCategory(id, data);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error updating category");
  }
});

/**
 * Delete a category
 */
export const deleteExistingCategory = createAsyncThunk<
  string, // on renvoie juste l’ID supprimé
  string, // argument = ID
  { rejectValue: string }
>("categories/delete", async (id, thunkAPI) => {
  try {
    const response = await deleteCategory(id);
    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }
    return id; // renvoie l’ID supprimé
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error deleting category");
  }
});
