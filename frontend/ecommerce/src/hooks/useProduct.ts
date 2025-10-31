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
  searchProducts,
  fetchProductsByCategoryId,
  fetchProductsBySubsCategoryId,
  fetchProductsByAverageRate,
  fetchProductsByPriceRangeThunk,
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
  // SEARCH PRODUCTS (by title or slug)
  // ============================================
  const searchProductsHook = useCallback(
    async (params: { title?: string; slug?: string }): Promise<Product[]> => {
      try {
        const results = await dispatch(searchProducts(params)).unwrap();
        console.log("✅ Search products results:", results);
        if (results.length === 0) {
          toast.showInfo("No matching products found");
        } else {
          toast.showSuccess("Products found successfully");
        }
        return results;
      } catch (err: any) {
        console.error("❌ Failed to search products:", err);
        toast.showError(err?.message || "Failed to search products");
        return [];
      }
    },
    [dispatch, toast]
  );
  // ============================================
  // SEARCH PRODUCTS by CATEGORY ID
  // ============================================
  const searchProductsByCategoryIdHook = useCallback(
    async (categoryId: string): Promise<Product[]> => {
      try {
        const results = await dispatch(
          fetchProductsByCategoryId(categoryId)
        ).unwrap();
        console.log("✅ Search products by category ID results:", results);
        if (results.length === 0) {
          toast.showInfo("No matching products found for this category");
        } else {
          toast.showSuccess("Products found successfully for this category");
        }
        return results;
      } catch (err: any) {
        console.error("❌ Failed to search products by category ID:", err);
        toast.showError(
          err?.message || "Failed to search products by category ID"
        );
        return [];
      }
    },
    [dispatch, toast]
  );
  // ============================================
  // SEARCH PRODUCTS by SUBS CATEGORY ID
  // ============================================
  const searchProductsBySubsCategoryIdHook = useCallback(
    async (subsCategoryId: string): Promise<Product[]> => {
      try {
        const results = await dispatch(
          fetchProductsBySubsCategoryId(subsCategoryId)
        ).unwrap();
        console.log("✅ Search products by sub-category ID results:", results);
        if (results.length === 0) {
          toast.showInfo("No matching products found for this sub-category");
        } else {
          toast.showSuccess(
            "Products found successfully for this sub-category"
          );
        }
        return results;
      } catch (err: any) {
        console.error("❌ Failed to search products by sub-category ID:", err);
        toast.showError(
          err?.message || "Failed to search products by sub-category ID"
        );
        return [];
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // SEARCH PRODUCTS by rate average rate max and min
  // ============================================
  const searchProductsByAverageRateHook = useCallback(
    async (minRate: number, maxRate: number): Promise<Product[]> => {
      console.log(
        " useProdcut - Searching products by average rate with minRate:",
        minRate,
        "and maxRate:",
        maxRate
      );
      try {
        const results = await dispatch(
          fetchProductsByAverageRate({ minRate, maxRate })
        ).unwrap();
        console.log(
          "✅ Search products by average rate results useProduct:",
          results
        );
        if (results.length === 0) {
          toast.showInfo("No matching products found for this average rate");
        } else {
          toast.showSuccess(
            "Products found successfully for this average rate"
          );
        }
        return results;
      } catch (err: any) {
        console.error("❌ Failed to search products by average rate:", err);
        toast.showError(
          err?.message || "Failed to search products by average rate"
        );
        return [];
      }
    },
    [dispatch, toast]
  );
  //===========================================
  // SEARCH PRODUCTS by PRICE RANGE
  //===========================================
  const searchProductsByPriceRangeHook = useCallback(
    async (minPrice: number, maxPrice: number): Promise<Product[]> => {
      console.log(
        " useProdcut - Searching products by price range with minPrice:",
        minPrice,
        "and maxPrice:",
        maxPrice
      );
      try {
        const results = await dispatch(
          fetchProductsByPriceRangeThunk({ minPrice, maxPrice })
        ).unwrap();
        console.log(
          "✅ Search products by price range results useProduct:",
          results
        );
        if (results.length === 0) {
          toast.showInfo("No matching products found for this price range");
        } else {
          toast.showSuccess("Products found successfully for this price range");
        }
        return results;
      } catch (err: any) {
        console.error("❌ Failed to search products by price range:", err);
        toast.showError(
          err?.message || "Failed to search products by price range"
        );
        return [];
      }
    },
    [dispatch, toast]
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
      searchProductsHook,
      searchProductsByCategoryIdHook,
      searchProductsBySubsCategoryIdHook,
      searchProductsByAverageRateHook,
      searchProductsByPriceRangeHook,
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
      searchProductsHook,
      searchProductsByCategoryIdHook,
      searchProductsBySubsCategoryIdHook,
      searchProductsByAverageRateHook,
      searchProductsByPriceRangeHook,
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
