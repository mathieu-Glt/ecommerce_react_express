import { useState } from "react";
import { Modal, Rate, Input, Button, message, Spin } from "antd";
import { useSelector } from "react-redux";
import type { CommentsModalProps } from "../../interfaces/comment.interface";
import "./create-comment.css";
import { useComment } from "../../hooks/useComment";
import { useAppSelector } from "../../hooks/useReduxHooks";
import type { User } from "../../interfaces/user.interface";
import { useParams } from "react-router-dom";

const { TextArea } = Input;

export default function AddCommentModal({
  productId,
  open,
  onClose,
}: CommentsModalProps) {
  const { createComment } = useComment();
  const params = useParams<{}>();
  const { productId: paramProductId } = params as { productId: string };
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user?._id) {
      message.warning("You must be logged in to leave a comment.");
      return;
    }

    if (!rating || text.trim() === "") {
      message.warning("Please provide a rating and write a comment.");
      return;
    }

    try {
      setLoading(true);

      const result = await createComment({
        productId,
        userId: user._id,
        text,
        rating,
      });
      if (result.error) {
        throw new Error(result.error);
      }
      result.success("Comment added successfully!");
      setText("");
      setRating(0);
      onClose();
    } catch (err: any) {
      message.error(err?.message || "Erreur lors de l’ajout du commentaire.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Leave a review"
      footer={null}
      centered
      width={500}
      className="add-comment-modal"
    >
      <div className="add-comment-body">
        <p className="text-gray-600 mb-2">Your rating:</p>
        <Rate value={rating} onChange={setRating} />

        <p className="text-gray-600 mt-4 mb-2">Your comment:</p>
        <TextArea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience..."
        />

        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            className="btn-submit"
          >
            Publier
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
