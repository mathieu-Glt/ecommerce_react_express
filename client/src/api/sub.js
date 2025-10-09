import { privateApi, publicApi } from "./config/api";

export const getSubs = async () => {
  try {
    const response = await publicApi.get(`/sub/subs`);
    console.log("Réponse getSubs:", response);
    return response; // L'intercepteur retourne déjà response.data
  } catch (error) {
    console.error("Erreur getSubs:", error.response?.data || error.message);
    throw error;
  }
};

export const getSubBySlug = async (slug) => {
  return await publicApi.get(`/sub/sub/${slug}`);
};

export const createSub = async (sub) => {
  return await privateApi.post(`/sub/sub`, sub);
};

export const updateSub = async (slug, sub) => {
  return await privateApi.put(`/sub/sub/${slug}`, sub);
};

export const deleteSub = async (slug) => {
  return await privateApi.delete(`/sub/sub/${slug}`);
};
