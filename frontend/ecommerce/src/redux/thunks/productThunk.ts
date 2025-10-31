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
} from "../../services/api/product";
import type { Product, Rating } from "../../interfaces/product.interface";

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await getProducts();
    console.log("Fetched products:", response);

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
    console.log("Fetched product by ID:", response);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error fetching product");
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
 * Recherche un ou plusieurs produits selon un titre (query)
 * ou un slug unique.
 *
 * Exemple d'utilisation :
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
    console.log("Search products response:", response);
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
 *  Récupère les derniers produits ajoutés.
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
  Partial<Product>,
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
  { id: string; data: Partial<Product> },
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
    const userId = "l'id utilisateur"; // à récupérer depuis ton store
    const userAlreadyRated = productRating?.some(
      (r) => r.postedBy?._id === userId
    );
    const isUpdate = !!userAlreadyRated;

    const response = isUpdate
      ? await updateProductRating(id, star)
      : await addProductRating(id, star);

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Erreur lors du rating");
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
    console.log("Fetch products by category ID response:", response);
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
 * Recherche un ou plusieurs produits selon une sous categorie
 *
 * Exemple d'utilisation :
 *  - dispatch(searchProduct({ query: "samsung" }))
 */
export const fetchProductsBySubsCategoryId = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("products/fetchBySubsCategoryId", async (subsCategoryId, thunkAPI) => {
  try {
    const response = await getProductsBySubsCategoryIdApi(subsCategoryId);
    console.log("Fetch products by subs category ID response:", response);
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
  console.log(
    "Thunk - Fetching products by average rate with minRate:",
    minRate,
    "and maxRate:",
    maxRate
  );
  try {
    const response = await getProductsByAverageRateRange(minRate, maxRate);
    console.log("Fetch products by average rate response thunk:", response);
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
  console.log(
    "Thunk - Fetching products by price range with minPrice:",
    minPrice,
    "and maxPrice:",
    maxPrice
  );
  try {
    const response = await getProductsByPriceRangeApi(minPrice, maxPrice);
    console.log("Fetch products by price range response thunk:", response);
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return response.results;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error fetching products by price range"
    );
  }
});
