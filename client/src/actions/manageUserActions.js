import { getUsers, updateUser, deleteUser } from "../api/user";

// Récupérer tous les utilisateurs
export const fetchUsers = (token) => async (dispatch) => {
  console.log(
    "🚀 Début fetchUsers avec token:",
    token ? "Présent" : "Manquant"
  );
  dispatch({ type: "FETCH_USERS_START" });
  try {
    const data = await getUsers(token);
    dispatch({ type: "FETCH_USERS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "FETCH_USERS_ERROR", payload: err.message });
  }
};

// Créer un utilisateur - Fonction temporaire en attendant l'implémentation API
export const createNewUser = (token, userData) => async (dispatch) => {
  dispatch({ type: "CREATE_USER_START" });
  try {
    // TODO: Implémenter createUser dans l'API user
    // Pour l'instant, on simule une création réussie
    const mockUser = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "CREATE_USER_SUCCESS", payload: mockUser });
    console.warn("createUser not implemented in API - using mock data");
  } catch (err) {
    dispatch({ type: "CREATE_USER_ERROR", payload: err.message });
  }
};

// Mettre à jour un utilisateur
export const updateExistingUser = (token, id, userData) => async (dispatch) => {
  dispatch({ type: "UPDATE_USER_START" });
  try {
    const data = await updateUser(token, id, userData);
    dispatch({ type: "UPDATE_USER_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "UPDATE_USER_ERROR", payload: err.message });
  }
};

// Supprimer un utilisateur
export const deleteExistingUser = (token, id) => async (dispatch) => {
  dispatch({ type: "DELETE_USER_START" });
  try {
    await deleteUser(token, id);
    dispatch({ type: "DELETE_USER_SUCCESS", payload: id });
  } catch (err) {
    dispatch({ type: "DELETE_USER_ERROR", payload: err.message });
  }
};
