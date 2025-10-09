import { privateApi, publicApi } from "./config/api";

export const getProducts = async () => {
  try {
    // Utiliser publicApi pour permettre l'accès sans authentification
    const response = await publicApi.get(`/product/products`);
    console.log("Réponse getProducts:", response);
    return response;
  } catch (error) {
    console.error(
      "Erreur getProducts:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getProductBySlug = async (slug) => {
  return await publicApi.get(`/product/product/slug/${slug}`);
};

export const getProductById = async (id) => {
  return await publicApi.get(`/product/product/id/${id}`);
};

export const createProduct = async (product) => {
  try {
    const response = await privateApi.post(`/product/product`, product);
    console.log("Réponse createProduct:", response);
    return response;
  } catch (error) {
    console.error(
      "Erreur createProduct:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await privateApi.put(`/product/product/${id}`, product);
    console.log("Réponse updateProduct:", response);
    return response;
  } catch (error) {
    console.error(
      "Erreur updateProduct:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteProduct = async (id) => {
  console.log("Appel API deleteProduct avec ID:", id);
  try {
    const response = await privateApi.delete(`/product/product/${id}`);
    console.log("Réponse deleteProduct:", response);
    return response;
  } catch (error) {
    console.error(
      "Erreur deleteProduct:",
      error.response?.data || error.message
    );
    throw error;
  }
};
