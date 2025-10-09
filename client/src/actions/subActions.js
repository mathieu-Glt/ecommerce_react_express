import { getSubs, createSub, updateSub, deleteSub } from "../api/sub";

// Récupérer toutes les sous-catégories
export const fetchSubs = (token) => async (dispatch) => {
  dispatch({ type: "FETCH_SUBS_START" });
  try {
    const { data } = await getSubs(token);
    dispatch({ type: "FETCH_SUBS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "FETCH_SUBS_ERROR", payload: err.message });
  }
};

// Créer une sous-catégorie
export const createNewSub = (subData, token) => async (dispatch) => {
  dispatch({ type: "CREATE_SUB_START" });
  try {
    const { data } = await createSub(subData, token);
    dispatch({ type: "CREATE_SUB_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "CREATE_SUB_ERROR", payload: err.message });
  }
};

// Mettre à jour une sous-catégorie
export const updateExistingSub = (id, subData, token) => async (dispatch) => {
  dispatch({ type: "UPDATE_SUB_START" });
  try {
    const { data } = await updateSub(id, subData, token);
    dispatch({ type: "UPDATE_SUB_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "UPDATE_SUB_ERROR", payload: err.message });
  }
};

// Supprimer une sous-catégorie
export const deleteExistingSub = (id, token) => async (dispatch) => {
  dispatch({ type: "DELETE_SUB_START" });
  try {
    await deleteSub(id, token);
    dispatch({ type: "DELETE_SUB_SUCCESS", payload: id });
  } catch (err) {
    dispatch({ type: "DELETE_SUB_ERROR", payload: err.message });
  }
};
