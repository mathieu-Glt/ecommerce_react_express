import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllComments,
  fetchCommentsByProduct,
  fetchCommentsByUser,
  postComment,
  deleteComment,
  updateComment,
} from "../../services/api/comment";
import type { Comment } from "../../interfaces/comment.interface";

/**
 * =====================================================
 * 🔹 FETCH ALL COMMENTS
 * =====================================================
 */
export const getAllComments = createAsyncThunk<
  Comment[],
  void,
  { rejectValue: string }
>("comments/fetchAll", async (_, thunkAPI) => {
  try {
    const comments = await fetchAllComments();

    if (!comments) {
      return thunkAPI.rejectWithValue("Aucun commentaire trouvé");
    }

    return comments;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Erreur lors du chargement des commentaires"
    );
  }
});

/**
 * =====================================================
 * 🔹 FETCH COMMENTS BY PRODUCT ID
 * =====================================================
 */
export const getCommentsByProduct = createAsyncThunk<
  Comment[],
  string,
  { rejectValue: string }
>("comments/fetchByProduct", async (productId, thunkAPI) => {
  try {
    const comments = await fetchCommentsByProduct(productId);

    if (!comments) {
      return thunkAPI.rejectWithValue(
        "Aucun commentaire trouvé pour ce produit"
      );
    }

    return comments;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Erreur lors du chargement des commentaires du produit"
    );
  }
});

/**
 * =====================================================
 * 🔹 FETCH COMMENTS BY USER ID
 * =====================================================
 */
export const getCommentsByUser = createAsyncThunk<
  Comment[],
  string,
  { rejectValue: string }
>("comments/fetchByUser", async (userId, thunkAPI) => {
  try {
    const comments = await fetchCommentsByUser(userId);

    if (!comments) {
      return thunkAPI.rejectWithValue(
        "Aucun commentaire trouvé pour cet utilisateur"
      );
    }

    return comments;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Erreur lors du chargement des commentaires utilisateur"
    );
  }
});

/**
 * =====================================================
 * 🔹 CREATE (POST) COMMENT
 * =====================================================
 */
export const createNewComment = createAsyncThunk<
  Comment,
  { productId: string; userId: string; text: string; rating: number },
  { rejectValue: string }
>("comments/create", async ({ productId, text, rating }, thunkAPI) => {
  try {
    const newComment = await postComment(productId, text, rating);

    if (!newComment) {
      return thunkAPI.rejectWithValue("Échec de la création du commentaire");
    }

    return newComment;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Erreur lors de la création du commentaire"
    );
  }
});

/**
 * =====================================================
 * 🔹 UPDATE COMMENT
 * =====================================================
 */
export const updateExistingComment = createAsyncThunk<
  Comment,
  { commentId: string; text?: string; rating?: number },
  { rejectValue: string }
>("comments/update", async ({ commentId, text, rating }, thunkAPI) => {
  console.log("commentId dans thunk :", commentId);
  console.log("text dans thunk :", text);
  console.log("rating dans thunk :", rating);
  const commentData = { text, rating };
  try {
    // Here you would call an API to update the comment
    const result = await updateComment(commentId, commentData);
    console.log("result dans thunk :", result);
    if (!result) {
      return thunkAPI.rejectWithValue("Échec de la mise à jour du commentaire");
    }

    return result;

    // For demonstration, we'll just return a mock updated comment
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Erreur lors de la mise à jour du commentaire"
    );
  }
});

/**
 * =====================================================
 * 🔹 DELETE COMMENT
 * =====================================================
 */
export const deleteExistingComment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("comments/delete", async (commentId, thunkAPI) => {
  try {
    const success = await deleteComment(commentId);

    if (!success) {
      return thunkAPI.rejectWithValue("Échec de la suppression du commentaire");
    }

    return commentId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Erreur lors de la suppression du commentaire"
    );
  }
});
