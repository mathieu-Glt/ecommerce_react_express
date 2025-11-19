import { useEffect, useState, useCallback } from "react";
import { Modal, Spin, Empty, Rate, Button } from "antd";
import type { CommentsModalProps } from "../../interfaces/comment.interface";
import { useComment } from "../../hooks/useComment";
import EditCommentModal from "../EditCommentModal/EditCommentModal";
import type { User } from "../../interfaces/user.interface";
import "./commentsModal.css";
import { useConfirmModal } from "../../hooks/useConfirmModal";

export default function CommentsModal({
  productId,
  open,
  onClose,
}: CommentsModalProps) {
  const { comments, fetchCommentsByProductId, deleteComment, loading } =
    useComment();
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const { confirm, ConfirmModal } = useConfirmModal();
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  useEffect(() => {
    if (open && productId) {
      fetchCommentsByProductId(productId).catch((err) =>
      );
    }
  }, [open, productId, fetchCommentsByProductId]);

  const handleEditClick = (comment: any) => {
    setSelectedComment(comment);
    setOpenEdit(true);
  };

  const handleDeleteClick = useCallback(
    (commentId: string) => {
      confirm(
        "Delete the comment ?",
        "This action is irreversible.",
        async () => {
          await deleteComment(commentId);
          await fetchCommentsByProductId(productId);
        }
      );
    },
    [deleteComment, fetchCommentsByProductId, productId]
  );

  return (
    <>
      <Modal
        open={open}
        title="User Reviews"
        onCancel={onClose}
        footer={null}
        centered
        width={700}
        className="comments-modal"
        bodyStyle={{ padding: 18 }}
      >
        {loading ? (
          <div className="spin-wrap">
            <Spin size="large" />
          </div>
        ) : comments.length === 0 ? (
          <Empty description="No comments for this product" />
        ) : (
          <div className="modal-comments-wrapper">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-card">
                <div className="meta">
                  {comment.user?.picture ? (
                    <img
                      className="avatar"
                      src={`${BASE_URL}${comment.user.picture}`}
                      alt="user"
                    />
                  ) : (
                    <div className="avatar">
                      {comment.user?.firstname?.[0] || "U"}
                    </div>
                  )}
                  <div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div className="author">
                        {comment.user
                          ? `${comment.user.firstname} ${comment.user.lastname}`
                          : "Anonymous User"}
                      </div>
                      <Rate disabled defaultValue={comment.rating} />
                    </div>
                    <div className="subtitle">{comment.user?.email || ""}</div>
                  </div>
                </div>

                <div className="comment-text">{comment.text}</div>
                <div className="comment-footer">
                  <div className="timestamp">
                    Posté le{" "}
                    {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>

                {comment.user?._id === user?._id && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleEditClick(comment)}
                      className="edit-comments-button"
                    >
                      Edit your comment
                    </Button>
                    <Button
                      danger
                      onClick={() => handleDeleteClick(comment._id)}
                      className="delete-comments-button"
                    >
                      Delete this comment
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>

      {selectedComment && (
        <EditCommentModal
          productId={productId}
          open={openEdit}
          comment={selectedComment}
          onClose={() => setOpenEdit(false)}
        />
      )}
      <ConfirmModal />
    </>
  );
}
