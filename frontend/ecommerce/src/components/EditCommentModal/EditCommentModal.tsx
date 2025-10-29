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
  console.log("user dans edit comment :", user?._id);

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
    console.log("Mise à jour du commentaire :", comment);
    if (!comment?._id) return;
    console.log("Nouveau texte :", text);
    console.log("Nouvelle note :", rating);

    if (!text.trim() || !rating) {
      message.warning("Veuillez donner une note et un texte valide.");
      return;
    }

    try {
      setLoading(true);
      // Appelle la fonction pour mettre à jour le commentaire
      const result = await updateComment(comment._id, {
        text,
        rating,
      });
      result.success("✅ Commentaire mis à jour avec succès !");
      onClose();
    } catch (err: any) {
      console.error("❌ Erreur lors de la mise à jour :", err);
      message.error(err?.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="✏️ Modifier votre commentaire"
      footer={null}
      centered
      width={500}
      className="edit-comment-modal"
    >
      <div className="edit-comment-body">
        <p className="text-gray-600 mb-2">Votre note :</p>
        <Rate value={rating} onChange={setRating} />

        <p className="text-gray-600 mt-4 mb-2">Votre commentaire :</p>
        <TextArea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Modifiez votre avis..."
        />

        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleUpdate}
            className="btn-submit"
          >
            Mettre à jour
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
