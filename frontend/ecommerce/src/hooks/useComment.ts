import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import useToast from "./usetoast";
import {
  getAllComments,
  getCommentsByProduct,
  getCommentsByUser,
  createNewComment,
  deleteExistingComment,
  updateExistingComment,
} from "../redux/thunks/commentThunk";
import type { Comment } from "../interfaces/comment.interface";

/**
 * Custom hook to manage product state and CRUD operations.
 *
 * @returns {object} Product context (state + actions)
 *
 * @example
 * const { comments, loading, error, getAllComments, createNewComment } = useComment();
 */

export const useComment = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  // Select state from Redux
  const { comments, loading, error } = useAppSelector(
    (state) => state.comments
  );
  // ============================================
  // FETCH ALL COMMENTS
  // ============================================
  const fetchAllComments = useCallback(async (): Promise<void> => {
    try {
      await dispatch(getAllComments()).unwrap();
      toast.showSuccess("Comments loaded successfully");
    } catch (err: any) {
      toast.showError(err?.message || "Failed to fetch comments");
    }
  }, [dispatch, toast]);

  // ============================================
  // FETCH COMMENTS BY PRODUCT ID
  // ============================================
  const fetchCommentsByProductId = useCallback(
    async (productId: string): Promise<void> => {
      try {
        await dispatch(getCommentsByProduct(productId)).unwrap();
        toast.showSuccess("Comments for product loaded successfully");
      } catch (err: any) {
        toast.showError(err?.message || "Failed to fetch comments for product");
      }
    },
    [dispatch, toast]
  );
  // ============================================
  // FETCH COMMENTS BY USER ID
  // ============================================
  const fetchCommentsByUserId = useCallback(
    async (userId: string): Promise<void> => {
      try {
        await dispatch(getCommentsByUser(userId)).unwrap();
        toast.showSuccess("Comments for user loaded successfully");
      } catch (err: any) {
        toast.showError(err?.message || "Failed to fetch comments for user");
      }
    },
    [dispatch, toast]
  );
  // ============================================
  // CREATE NEW COMMENT
  // ============================================
  const createComment = useCallback(
    async (commentData: Partial<Comment>): Promise<void> => {
      const { productId, userId, text, rating } = commentData;
      if (!productId || !userId || !text || rating === undefined) {
        toast.showError("Missing required fields to create comment");
        return;
      }
      try {
        await dispatch(
          createNewComment({
            productId,
            userId,
            text,
            rating,
          })
        ).unwrap();
        toast.showSuccess("Comment created successfully");
      } catch (err: any) {
        toast.showError(err?.message || "Failed to create comment");
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // UPDATE COMMENT
  // ============================================
  const updateComment = useCallback(
    async (commentId: string, commentData: Partial<Comment>): Promise<void> => {
      try {
        const result = await dispatch(
          updateExistingComment({ commentId, ...commentData })
        ).unwrap();
        if (result) {
          toast.showSuccess("Comment updated successfully");
        }
      } catch (err: any) {
        toast.showError(err?.message || "Failed to update comment");
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // DELETE COMMENT
  // ============================================
  const deleteComment = useCallback(
    async (commentId: string): Promise<void> => {
      try {
        await dispatch(deleteExistingComment(commentId)).unwrap();
        toast.showSuccess("Comment deleted successfully");
      } catch (err: any) {
        toast.showError(err?.message || "Failed to delete comment");
      }
    },
    [dispatch, toast]
  );
  return useMemo(
    () => ({
      comments,
      loading,
      error,
      fetchAllComments,
      fetchCommentsByProductId,
      fetchCommentsByUserId,
      createComment,
      updateComment,
      deleteComment,
    }),
    [
      comments,
      loading,
      error,
      fetchAllComments,
      fetchCommentsByProductId,
      fetchCommentsByUserId,
      createComment,
      updateComment,
      deleteComment,
    ]
  );
};
