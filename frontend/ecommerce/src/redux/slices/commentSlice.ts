import { createSlice, type PayloadAction, type Slice } from "@reduxjs/toolkit";
import type { Comment, CommentState } from "../../interfaces/comment.interface";
import {
  getAllComments as fetchAllCommentsThunk,
  getCommentsByProduct as fetchCommentsByProductThunk,
  getCommentsByUser as fetchCommentsByUserThunk,
  createNewComment as postCommentThunk,
  deleteExistingComment as deleteCommentThunk,
} from "../thunks/commentThunk";

// ====================================================
// 🧠 ÉTAT INITIAL
// ====================================================

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// ====================================================
// 🧩 COMMENT SLICE
// ====================================================

const commentSlice: Slice<CommentState> = createSlice({
  name: "comments",
  initialState,

  // ----------------------------------------------------
  // 🔹 Synchronous reducers
  // ----------------------------------------------------
  reducers: {
    /**
     * Completely clears the list of comments
     */
    clearComments: (state) => {
      state.comments = [];
      state.loading = false;
      state.error = null;
    },

    /**
     * Manually sets an error state
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Manually sets the loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },

  // ----------------------------------------------------
  // 🔹 Extra reducers — Async thunks (API)
  // ----------------------------------------------------
  extraReducers: (builder) => {
    // ==========================================
    // FETCH ALL COMMENTS
    // ==========================================
    builder
      .addCase(fetchAllCommentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCommentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload || [];
      })
      .addCase(fetchAllCommentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error fetching comments";
      });

    // ==========================================
    // FETCH COMMENTS BY PRODUCT
    // ==========================================
    builder
      .addCase(fetchCommentsByProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload || [];
      })
      .addCase(fetchCommentsByProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Error fetching comments for product";
      });

    // ==========================================
    // FETCH COMMENTS BY USER
    // ==========================================
    builder
      .addCase(fetchCommentsByUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload || [];
      })
      .addCase(fetchCommentsByUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Error fetching comments for user";
      });

    // ==========================================
    // POST COMMENT
    // ==========================================
    builder
      .addCase(postCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postCommentThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.comments.push(action.payload);
      })
      .addCase(postCommentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error adding comment";
      });

    // ==========================================
    // DELETE COMMENT
    // ==========================================
    builder
      .addCase(deleteCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error deleting comment";
      });
  },
});

// ====================================================
// 🧭 EXPORTS
// ====================================================

export const { clearComments, setError, setLoading } = commentSlice.actions;

export default commentSlice.reducer;
