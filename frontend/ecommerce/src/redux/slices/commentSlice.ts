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
// 🧩 SLICE COMMENTAIRES
// ====================================================

const commentSlice: Slice<CommentState> = createSlice({
  name: "comments",
  initialState,

  // ----------------------------------------------------
  // 🔹 Reducers synchrones
  // ----------------------------------------------------
  reducers: {
    /**
     * Vide complètement la liste des commentaires
     */
    clearComments: (state) => {
      state.comments = [];
      state.loading = false;
      state.error = null;
    },

    /**
     * Définit une erreur manuellement
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Définit l’état de chargement manuellement
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },

  // ----------------------------------------------------
  // 🔹 Extra reducers — Thunks async (API)
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
        console.log(
          "✅ [commentSlice] Tous les commentaires récupérés:",
          action.payload
        );
        state.loading = false;
        state.comments = action.payload || [];
      })
      .addCase(fetchAllCommentsThunk.rejected, (state, action) => {
        console.error(
          "❌ [commentSlice] Erreur récupération commentaires:",
          action.payload
        );
        state.loading = false;
        state.error =
          (action.payload as string) || "Erreur récupération commentaires";
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
        console.log(
          "✅ [commentSlice] Commentaires du produit récupérés:",
          action.payload
        );
        state.loading = false;
        state.comments = action.payload || [];
      })
      .addCase(fetchCommentsByProductThunk.rejected, (state, action) => {
        console.error(
          "❌ [commentSlice] Erreur récupération commentaires produit:",
          action.payload
        );
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Erreur récupération commentaires produit";
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
        console.log(
          "✅ [commentSlice] Commentaires utilisateur récupérés:",
          action.payload
        );
        state.loading = false;
        state.comments = action.payload || [];
      })
      .addCase(fetchCommentsByUserThunk.rejected, (state, action) => {
        console.error(
          "❌ [commentSlice] Erreur récupération commentaires utilisateur:",
          action.payload
        );
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Erreur récupération commentaires utilisateur";
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
        console.log("✅ [commentSlice] Commentaire ajouté:", action.payload);
        state.loading = false;
        if (action.payload) state.comments.push(action.payload);
      })
      .addCase(postCommentThunk.rejected, (state, action) => {
        console.error(
          "❌ [commentSlice] Erreur ajout commentaire:",
          action.payload
        );
        state.loading = false;
        state.error = (action.payload as string) || "Erreur ajout commentaire";
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
        console.log("✅ [commentSlice] Commentaire supprimé:", action.payload);
        state.loading = false;
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        console.error(
          "❌ [commentSlice] Erreur suppression commentaire:",
          action.payload
        );
        state.loading = false;
        state.error =
          (action.payload as string) || "Erreur suppression commentaire";
      });
  },
});

// ====================================================
// 🧭 EXPORTS
// ====================================================

export const { clearComments, setError, setLoading } = commentSlice.actions;

export default commentSlice.reducer;
