import { useEffect, useState } from "react";
import { Modal, Rate, Input, Button, message, Spin } from "antd";
import type {
  Comment,
  CommentsModalProps,
} from "../../interfaces/comment.interface";
import "./edit-comment.css";
import { useComment } from "../../hooks/useComment";
import type { User } from "../../interfaces/user.interface";

const { TextArea } = Input;

export default function EditCommentModal({
  productId,
  userId,
  handleEdit,
  open,
  onClose,
  comment,
}: CommentsModalProps) {
  const { updateComment } = useComment();
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // Pré-remplit les champs quand la modale s'ouvre
  useEffect(() => {
    if (comment) {
      setText(comment.text);
      setRating(comment.rating);
    }
  }, [comment]);

  const handleUpdate = async () => {
    if (!comment?._id) return;

    if (!text.trim() || !rating) {
      message.warning("Please provide a valid rating and text.");
      return;
    }

    try {
      setLoading(true);
      // Appelle la fonction pour mettre à jour le commentaire
      const result = await updateComment(comment._id, {
        text,
        rating,
      });
      result.success("Comment updated successfully!");
      onClose();
    } catch (err: any) {
      message.error(err?.message || "Error updating comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Edit your comment"
      footer={null}
      centered
      width={500}
      className="edit-comment-modal"
    >
      <div className="edit-comment-body">
        <p className="text-gray-600 mb-2">Your rating:</p>
        <Rate value={rating} onChange={setRating} />

        <p className="text-gray-600 mt-4 mb-2">Your comment:</p>
        <TextArea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Modifiez votre avis..."
        />

        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleUpdate}
            className="btn-submit"
          >
            Update Comment
          </Button>
        </div>
      </div>

      {loading && (
        <div className="overlay">
          <Spin size="large" />
        </div>
      )}
    </Modal>
  );
}
