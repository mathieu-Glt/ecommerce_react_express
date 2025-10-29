// export interface Comment {
//   _id: string;
//   text: string;
//   rating: number;
//   user?: {
//     firstname?: string;
//     lastname?: string;
//     picture?: string;
//   };
//   createdAt: string;
// }

export interface CommentsModalProps {
  productId: string;
  open: boolean;
  openCreate?: boolean;
  userId?: string;
  comment?: Comment | null;
  onClose: () => void;
  handleEdit?: (comment: Comment) => void;
}

export interface AddCommentProps {
  productId: string;
  open: boolean;
  userId: string;
  text: string;
  rating: number;
  onCommentAdded: () => void;
  onCancel: () => void;
}

export interface Comment {
  _id: string;
  text: string;
  rating: number;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}
