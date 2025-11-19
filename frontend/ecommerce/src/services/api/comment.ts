import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { useApi } from "../../hooks/useApi";
import type { Comment } from "../../interfaces/comment.interface";
import type { CommentsResponse } from "../../interfaces/responseComment.interface";
import { API_ROUTES } from "../constants/api-routes";

// Define BASE_URL or import from your config
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:8000";
// eslint-disable-next-line react-hooks/rules-of-hooks
const api: AxiosInstance = useApi();

export const fetchAllComments = async (): Promise<Comment[]> => {
  try {
    const response: AxiosResponse<CommentsResponse> = await api.get(
      API_ROUTES.COMMENTS.LIST
    );
    if (response.data.success) {
      return response.data.results.comments;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error("Error while fetching comments: " + axiosError.message);
  }
};

export const fetchCommentsByProduct = async (
  productId: string
): Promise<Comment[]> => {
  try {
    const response: AxiosResponse<CommentsResponse> = await api.get(
      API_ROUTES.COMMENTS.LIST_BY_PRODUCT(productId)
    );
    if (response.data.success) {
      return response.data.results.comments;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error("Error while fetching comments: " + axiosError.message);
  }
};

export const fetchCommentsByUser = async (
  userId: string
): Promise<Comment[]> => {
  try {
    const response: AxiosResponse<CommentsResponse> = await api.get(
      API_ROUTES.COMMENTS.LIST_BY_USER(userId)
    );
    if (response.data.success) {
      return response.data.results.comments;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(axiosError.message);
  }
};

export const postComment = async (
  productId: string,
  text: string,
  rating: number
): Promise<Comment | null> => {
  try {
    const response: AxiosResponse<CommentsResponse> = await api.post(
      API_ROUTES.COMMENTS.CREATE,
      { productId, text, rating }
    );
    if (response.data.success) {
      return response.data.results.comments[0];
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(axiosError.message);
  }
};

export const updateComment = async (
  commentId: string,
  updatedData: Partial<Comment>
): Promise<Comment | null> => {
  try {
    const response: AxiosResponse<any> = await api.put(
      API_ROUTES.COMMENTS.UPDATE(commentId),
      updatedData
    );
    if (response.data.success) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    return null;
  }
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  try {
    const response: AxiosResponse<CommentsResponse> = await api.delete(
      API_ROUTES.COMMENTS.DELETE(commentId)
    );
    return response.data.success;
  } catch (error) {
    const axiosError = error as AxiosError;
    return false;
  }
};
