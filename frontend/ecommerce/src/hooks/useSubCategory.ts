import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import useToast from "./usetoast";
import {
  fetchSubCategories,
  fetchSubCategoryBySlug,
  createNewSubCategory,
  updateExistingSubCategory,
  deleteExistingSubCategory,
} from "../redux/thunks/subCategoryThunk";
import type { SubCategory } from "../interfaces/subCategory.interface";

/**
 * Custom hook to manage SubCategory state and CRUD operations.
 *
 * @returns {object} SubCategory context (state + actions)
 */
export const useSubCategory = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { subCategories, selectedSubCategory, loading, error } = useAppSelector(
    (state) => state.sub
  );

  // ============================================
  // FETCH ALL SUB-CATEGORIES
  // ============================================
  const getAllSubCategories = useCallback(async (): Promise<void> => {
    try {
      await dispatch(fetchSubCategories()).unwrap();
      toast.showSuccess("Sub-categories loaded successfully");
    } catch (err: any) {
      toast.showError(err?.message || "Failed to fetch sub-categories");
    }
  }, [dispatch, toast]);

  // ============================================
  // FETCH SUB-CATEGORY BY SLUG
  // ============================================
  const getSubCategoryBySlug = useCallback(
    async (slug: string): Promise<SubCategory | null> => {
      try {
        const result = await dispatch(fetchSubCategoryBySlug(slug)).unwrap();
        return result;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to fetch sub-category");
        return null;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // CREATE SUB-CATEGORY
  // ============================================
  const createSubCategory = useCallback(
    async (
      data: Record<string, any> | FormData
    ): Promise<SubCategory | null> => {
      try {
        const result = await dispatch(createNewSubCategory(data)).unwrap();
        toast.showSuccess("Sub-category created successfully");
        return result;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to create sub-category");
        return null;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // UPDATE SUB-CATEGORY
  // ============================================
  const updateSubCategory = useCallback(
    async (
      slug: string,
      data: Record<string, any> | FormData
    ): Promise<boolean> => {
      try {
        await dispatch(updateExistingSubCategory({ slug, data })).unwrap();
        toast.showSuccess("Sub-category updated successfully");
        return true;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to update sub-category");
        return false;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // DELETE SUB-CATEGORY
  // ============================================
  const deleteSubCategory = useCallback(
    async (slug: string): Promise<boolean> => {
      try {
        await dispatch(deleteExistingSubCategory(slug)).unwrap();
        toast.showSuccess("Sub-category deleted successfully");
        return true;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to delete sub-category");
        return false;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // MEMOIZED RETURN VALUE
  // ============================================
  const subCategoryContextValue = useMemo(
    () => ({
      subCategories,
      selectedSubCategory,
      loading,
      error,
      getAllSubCategories,
      getSubCategoryBySlug,
      createSubCategory,
      updateSubCategory,
      deleteSubCategory,
    }),
    [
      subCategories,
      selectedSubCategory,
      loading,
      error,
      getAllSubCategories,
      getSubCategoryBySlug,
      createSubCategory,
      updateSubCategory,
      deleteSubCategory,
    ]
  );

  return subCategoryContextValue;
};

export default useSubCategory;
