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
      return thunkAPI.rejectWithValue("No comments found for this product");
    }

    return comments;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error loading comments for the product"
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
      return thunkAPI.rejectWithValue("No comments found for this user");
    }

    return comments;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Error loading comments for the user"
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
      return thunkAPI.rejectWithValue("Failed to create comment");
    }

    return newComment;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error creating comment");
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
  const commentData = { text, rating };
  try {
    // Here you would call an API to update the comment
    const result = await updateComment(commentId, commentData);
    if (!result) {
      return thunkAPI.rejectWithValue("Failed to update comment");
    }

    return result;

    // For demonstration, we'll just return a mock updated comment
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error updating comment");
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
      return thunkAPI.rejectWithValue("Failed to delete comment");
    }

    return commentId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Error deleting comment");
  }
});
