import type { Comment } from "./comment.interface";

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  results: T;
}
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type CommentListResponse = ApiResponse<Comment[]>;
// export interface CommentResponse {
//   success: boolean;
//   message: string;
//   results: {
//     comments: Comment[];
//   };
// }

// export type CommentsResponse = CommentResponse;
