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
} from "../../services/api/product";
import type { Product } from "../../interfaces/product.interface";

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
  { query?: string; slug?: string },
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
