// src/hooks/useProduct.ts
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import useToast from "./usetoast";
import {
  fetchProducts,
  fetchProductById,
  fetchProductBySlug,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  fetchLatestProducts,
  rateProduct,
} from "../redux/thunks/productThunk";
import type { Product, Rating } from "../interfaces/product.interface";
import { hasUserRatedProduct } from "../services/api/product";

/**
 * Custom hook to manage product state and CRUD operations.
 *
 * @returns {object} Product context (state + actions)
 *
 * @example
 * const { products, loading, error, getAllProducts, createProduct } = useProduct();
 */
export const useProduct = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  // Select state from Redux
  const { products, selectedProduct, loading, error } = useAppSelector(
    (state) => state.products
  );

  // ============================================
  // FETCH ALL PRODUCTS
  // ============================================
  const getAllProducts = useCallback(async (): Promise<void> => {
    try {
      await dispatch(fetchProducts()).unwrap();
      toast.showSuccess("Products loaded successfully");
    } catch (err: any) {
      console.error("❌ Failed to fetch products:", err);
      toast.showError(err?.message || "Failed to fetch products");
    }
  }, [dispatch, toast]);

  // ============================================
  // FETCH LATEST PRODUCTS
  // ============================================

  const getLatestProducts = useCallback(
    async (limit: number): Promise<void> => {
      try {
        await dispatch(fetchLatestProducts(limit)).unwrap();
        toast.showSuccess("Latest products loaded successfully");
      } catch (err: any) {
        console.error("❌ Failed to fetch latest products:", err);
        toast.showError(err?.message || "Failed to fetch latest products");
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // FETCH BY ID
  // ============================================
  const getProductById = useCallback(
    async (id: string): Promise<Product | null> => {
      console.log("Getting product by ID:", id);
      try {
        const result = await dispatch(fetchProductById(id)).unwrap();
        console.log("Fetched product:", result);
        return result;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to fetch product");
        return null;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // FETCH BY SLUG
  // ============================================
  const getProductBySlug = useCallback(
    async (slug: string): Promise<Product | null> => {
      try {
        const result = await dispatch(fetchProductBySlug(slug)).unwrap();
        return result;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to fetch product");
        return null;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // CREATE PRODUCT
  // ============================================
  const createProduct = useCallback(
    async (data: Record<string, any> | FormData): Promise<Product | null> => {
      try {
        const result = await dispatch(createNewProduct(data)).unwrap();
        toast.showSuccess("Product created successfully");
        return result;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to create product");
        return null;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // UPDATE PRODUCT
  // ============================================
  const updateProduct = useCallback(
    async (
      id: string,
      data: Record<string, any> | FormData
    ): Promise<boolean> => {
      try {
        await dispatch(updateExistingProduct({ id, data })).unwrap();
        toast.showSuccess("Product updated successfully");
        return true;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to update product");
        return false;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // DELETE PRODUCT
  // ============================================
  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await dispatch(deleteExistingProduct(id)).unwrap();
        toast.showSuccess("Product deleted successfully");
        return true;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to delete product");
        return false;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // RATE PRODUCT
  // ============================================
  const rateProductHook = useCallback(
    async (
      id: string,
      star: number,
      productRating?: Rating[]
    ): Promise<boolean> => {
      try {
        await dispatch(rateProduct({ id, star, productRating })).unwrap();
        toast.showSuccess("Product rated successfully");
        return true;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to rate product");
        return false;
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // CHECK RATE PRODUCT BY USER AUTHENTICATED
  // ============================================
  const checkRateProductByUser = useCallback(
    async (productId: string): Promise<{} | null> => {
      try {
        const checkRateProductByUser = await hasUserRatedProduct(productId);
        console.log(
          `Check if user has rated product ${productId}:`,
          checkRateProductByUser
        );
        return checkRateProductByUser;
      } catch (err: any) {
        toast.showError(err?.message || "Failed to check product rating");
        return null;
      }
    },
    [toast]
  );

  // ============================================
  // MEMOIZED RETURN VALUE
  // ============================================
  const productContextValue = useMemo(
    () => ({
      products,
      selectedProduct,
      loading,
      error,
      getLatestProducts,
      checkRateProductByUser,
      getAllProducts,
      getProductById,
      getProductBySlug,
      createProduct,
      updateProduct,
      deleteProduct,
      rateProduct: rateProductHook,
    }),
    [
      products,
      selectedProduct,
      loading,
      error,
      getAllProducts,
      checkRateProductByUser,
      getLatestProducts,
      getProductById,
      getProductBySlug,
      createProduct,
      updateProduct,
      deleteProduct,
      rateProductHook,
    ]
  );

  return productContextValue;
};
