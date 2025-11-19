import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import useToast from "./usetoast";
import {
  fetchCategories,
  fetchCategoryById,
  fetchCategoryBySlug,
  createNewCategory,
  updateExistingCategory,
  deleteExistingCategory,
} from "../redux/thunks/categoryThunk";
import type { Category } from "../interfaces/category.interface";

/**
 * Custom hook to manage Category state and CRUD operations.
 *
 * @returns {object} Category context (state + actions)
 *
 * @example
 * const { categories, loading, createCategory } = useCategory();
 */
export const useCategory = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  // Sélecteurs Redux
  const { categories, selectedCategory, loading, error } = useAppSelector(
    (state) => state.category
  );

  // ============================================
  // FETCH ALL CATEGORIES
  // ============================================
  const getAllCategories = useCallback(async (): Promise<
    Category[] | undefined
  > => {
    try {
      const results = await dispatch(fetchCategories()).unwrap();
      toast.showSuccess("Categories loaded successfully");
      return results;
    } catch (err: any) {
      toast.showError(err?.message || "Failed to fetch categories");
    }
  }, [dispatch, toast]);

  // ============================================
  // FETCH CATEGORY BY ID
  // ============================================
  const getCategoryById = useCallback(
    async (id: string): Promise<Category | null> => {
      try {
        const result = await dispatch(fetchCategoryById(id)).unwrap();
        return result;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to fetch category");
        return null;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // FETCH CATEGORY BY SLUG
  // ============================================
  const getCategoryBySlug = useCallback(
    async (slug: string): Promise<Category | null> => {
      try {
        const result = await dispatch(fetchCategoryBySlug(slug)).unwrap();
        return result;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to fetch category");
        return null;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // CREATE CATEGORY
  // ============================================
  const createCategory = useCallback(
    async (data: Record<string, any> | FormData): Promise<Category | null> => {
      try {
        const result = await dispatch(createNewCategory(data)).unwrap();
        toast.showSuccess("Category created successfully");
        return result;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to create category");
        return null;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // UPDATE CATEGORY
  // ============================================
  const updateCategory = useCallback(
    async (
      id: string,
      data: Record<string, any> | FormData
    ): Promise<boolean> => {
      try {
        await dispatch(updateExistingCategory({ id, data })).unwrap();
        toast.showSuccess("Category updated successfully");
        return true;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to update category");
        return false;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // DELETE CATEGORY
  // ============================================
  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await dispatch(deleteExistingCategory(id)).unwrap();
        toast.showSuccess("Category deleted successfully");
        return true;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to delete category");
        return false;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // MEMOIZED RETURN VALUE
  // ============================================
  const categoryContextValue = useMemo(
    () => ({
      categories,
      selectedCategory,
      loading,
      error,
      getAllCategories,
      getCategoryById,
      getCategoryBySlug,
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      categories,
      selectedCategory,
      loading,
      error,
      getAllCategories,
      getCategoryById,
      getCategoryBySlug,
      createCategory,
      updateCategory,
      deleteCategory,
    ]
  );

  return categoryContextValue;
};

export default useCategory;
