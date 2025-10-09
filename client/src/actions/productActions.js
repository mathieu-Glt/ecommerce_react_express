import {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/product";

// Récupérer tous les produits
export const fetchProducts = (token) => async (dispatch) => {
  dispatch({ type: "FETCH_PRODUCTS_START" });
  try {
    const { data } = await getProducts(token);
    dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "FETCH_PRODUCTS_ERROR", payload: err.message });
  }
};

// Récupérer un produit par son slug
export const fetchProductBySlug = (slug, token) => async (dispatch) => {
  dispatch({ type: "FETCH_PRODUCT_BY_SLUG_START" });
  try {
    const { data } = await getProductBySlug(slug, token);
    dispatch({ type: "FETCH_PRODUCT_BY_SLUG_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "FETCH_PRODUCT_BY_SLUG_ERROR", payload: err.message });
  }
};

// Récupérer un produit par son id
export const fetchProductById = (id, token) => async (dispatch) => {
  dispatch({ type: "FETCH_PRODUCT_BY_ID_START" });
  try {
    const { data } = await getProductById(id, token);
    dispatch({ type: "FETCH_PRODUCT_BY_ID_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "FETCH_PRODUCT_BY_ID_ERROR", payload: err.message });
  }
};

// Créer un produit
export const createProduct = (product, token) => async (dispatch) => {
  dispatch({ type: "CREATE_PRODUCT_START" });
  try {
    const { data } = await createProduct(product, token);
    dispatch({ type: "CREATE_PRODUCT_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "CREATE_PRODUCT_ERROR", payload: err.message });
  }
};

// Mettre à jour un produit
export const updateProduct = (id, product, token) => async (dispatch) => {
  dispatch({ type: "UPDATE_PRODUCT_START" });
  try {
    const { data } = await updateProduct(id, product, token);
    dispatch({ type: "UPDATE_PRODUCT_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "UPDATE_PRODUCT_ERROR", payload: err.message });
  }
};

// Supprimer un produit
export const deleteProduct = (id, token) => async (dispatch) => {
  dispatch({ type: "DELETE_PRODUCT_START" });
  try {
    const { data } = await deleteProduct(id, token);
    dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "DELETE_PRODUCT_ERROR", payload: err.message });
  }
};
