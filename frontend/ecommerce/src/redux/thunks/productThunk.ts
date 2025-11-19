import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  searchProductsApi,
  getLatestProducts,
  updateProductRating,
  addProductRating,
  getProductsByCategoryId,
  getProductsBySubsCategoryIdApi,
  getProductsByAverageRateRange,
  getProductsByPriceRangeApi,
  getBestSoldProducts,
  getProductsByCategoryAcesories,
  getProductsByCategoryOutillage,
} from "../../services/api/product";
import type { Product, Rating } from "../../interfaces/product.interface";

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await getProducts();

    if (!response.success) {
      return thunkAPI.rejectWithValue(response.message);
    }

    return response.results; // return the Product[] payload
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error fetching products");
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchById", async (id, thunkAPI) => {
  try {
    const response = await getProductById(id);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error fetching product");
  }
});

export const fetchProductsTopRated = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchTopRated", async (_, thunkAPI) => {
  try {
    const response = await getBestSoldProducts();
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error fetching products");
  }
});

export const fetchProductBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchBySlug", async (slug, thunkAPI) => {
  try {
    const response = await getProductBySlug(slug);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error fetching product");
  }
});

/**
 * Redux Thunk: searchProduct
 *
 * Search for one or more products by title (query)
 * or a unique slug.
 *
 * Example usage:
 *  - dispatch(searchProduct({ query: "macbook" }))
 *  - dispatch(searchProduct({ slug: "macbook-pro-2024" }))
 */
export const searchProducts = createAsyncThunk<
  Product[],
  { title?: string; slug?: string },
  { rejectValue: string }
>("products/search", async (params, thunkAPI) => {
  try {
    const response = await searchProductsApi(params);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error searching products"
    );
  }
});

/**
 *  Redux Thunk: getLatestProducts
 *
 *  Fetches the latest added products.
 *
 */
export const fetchLatestProducts = createAsyncThunk<
  Product[],
  number,
  { rejectValue: string }
>("products/latest", async (limit, thunkAPI) => {
  try {
    const response = await getLatestProducts(limit);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching latest products"
    );
  }
});

export const createNewProduct = createAsyncThunk<
  Product,
  FormData | Record<string, any>,
  { rejectValue: string }
>("products/create", async (productData, thunkAPI) => {
  try {
    const response = await createProduct(productData);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error creating product");
  }
});

export const updateExistingProduct = createAsyncThunk<
  Product,
  { id: string; data: Partial<Product> | FormData },
  { rejectValue: string }
>("products/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await updateProduct(id, data);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error updating product");
  }
});

export const deleteExistingProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("products/delete", async (id, thunkAPI) => {
  try {
    const response = await deleteProduct(id);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error deleting product");
  }
});

export const rateProduct = createAsyncThunk<
  Product,
  { id: string; star: number; productRating?: Rating[] },
  { rejectValue: string }
>("products/rateProduct", async ({ id, star, productRating }, thunkAPI) => {
  try {
    const userId = "user id"; // to be retrieved from your store
    const userAlreadyRated = productRating?.some(
      (r) => r.postedBy?._id === userId
    );
    const isUpdate = !!userAlreadyRated;

    const response = isUpdate
      ? await updateProductRating(id, star)
      : await addProductRating(id, star);

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error rating product");
  }
});

/**
 * Redux Thunk: searchProduct by category ID
 *
 * Recherche un ou plusieurs produits selon une categorie
 *
 * Exemple d'utilisation :
 *  - dispatch(searchProduct({ query: "macbook" }))
 *  - dispatch(searchProduct({ slug: "macbook-pro-2024" }))
 */
export const fetchProductsByCategoryId = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("products/fetchByCategoryId", async (categoryId, thunkAPI) => {
  try {
    const response = await getProductsByCategoryId(categoryId);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching products by category ID"
    );
  }
});

/**
 * Redux Thunk: searchProduct by subs category ID
 *
 * Search for one or more products by a subcategory
 *
 * Example usage:
 *  - dispatch(searchProduct({ query: "samsung" }))
 */
export const fetchProductsBySubsCategoryId = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("products/fetchBySubsCategoryId", async (subsCategoryId, thunkAPI) => {
  try {
    const response = await getProductsBySubsCategoryIdApi(subsCategoryId);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching products by subs category ID"
    );
  }
});

/**
 * Fetch products filtered by average rating range max rate and min rate
 * Example of use:
 *  - dispatch(fetchProductsByAverageRate({ minRate: 3, maxRate: 5 }))
 */
export const fetchProductsByAverageRate = createAsyncThunk<
  Product[],
  { minRate: number; maxRate: number },
  { rejectValue: string }
>("products/fetchByAverageRate", async ({ minRate, maxRate }, thunkAPI) => {
  try {
    const response = await getProductsByAverageRateRange(minRate, maxRate);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching products by average rate"
    );
  }
});

/**
 * Fetch products filtered by price range min price and max price
 * Example of use:
 *  - dispatch(fetchProductsByPriceRange({ minPrice: 100, maxPrice: 500 }))
 */
export const fetchProductsByPriceRangeThunk = createAsyncThunk<
  Product[],
  { minPrice: number; maxPrice: number },
  { rejectValue: string }
>("products/fetchByPriceRange", async ({ minPrice, maxPrice }, thunkAPI) => {
  try {
    const response = await getProductsByPriceRangeApi(minPrice, maxPrice);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching products by price range"
    );
  }
});

/**
 * Fetch products by category accessories
 * Example of use:
 *  - dispatch(fetchProductsByPriceRange({ minPrice: 100, maxPrice: 500 }))
 */
export const fetchProductsByCategoryAcesories = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchByCategoryAcesories", async (_, thunkAPI) => {
  try {
    const response = await getProductsByCategoryAcesories();
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching products by category acesories"
    );
  }
});

/**
 * Fetch products by category tool
 * Example of use:
 *  - dispatch(fetchProductsByPriceRange({ minPrice: 100, maxPrice: 500 }))
 */
export const fetchProductsByCategoryOutillage = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchByCategoryOutillage", async (_, thunkAPI) => {
  try {
    const response = await getProductsByCategoryOutillage();
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching products by category outillage"
    );
  }
});
