import { privateApi } from "./config/api";

export const getUsers = async () => {
  console.log("Appel API getUsers");
  try {
    const response = await privateApi.get(`/user/users`);
    console.log("Réponse getUsers:", response);
    return response;
  } catch (error) {
    console.error("Erreur getUsers:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserById = async (id) => {
  console.log("Appel API getUserById avec ID:", id);
  try {
    const response = await privateApi.get(`/user/users/${id}`);
    console.log("Réponse getUserById:", response);
    return response;
  } catch (error) {
    console.error("Erreur getUserById:", error.response?.data || error.message);
    throw error;
  }
};

export const getUsersByEmail = async (email) => {
  try {
    const response = await privateApi.get(`/user/user/${email}`);
    console.log("Réponse getUsersByEmail:", response);
    return response;
  } catch (error) {
    console.error(
      "Erreur getUsersByEmail:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await privateApi.put(`/user/user/${id}`, userData);
    console.log("Réponse updateUser:", response);
    return response;
  } catch (error) {
    console.error("Erreur updateUser:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await privateApi.delete(`/user/user/${id}`);
    console.log("Réponse deleteUser:", response);
    return response;
  } catch (error) {
    console.error("Erreur deleteUser:", error.response?.data || error.message);
    throw error;
  }
};
