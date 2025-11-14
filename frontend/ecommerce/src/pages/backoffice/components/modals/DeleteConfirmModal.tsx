// src/components/modals/DeleteConfirmModal.tsx
import React, { useState } from "react";
import "./DeleteConfirmModal.css";

interface Product {
  _id: string;
  title: string;
  price: number;
  brand?: string;
  color?: string;
  quantity?: number;
  images?: Array<{ url: string }>;
}

interface DeleteConfirmModalProps {
  product: Product;
  onConfirm: (productId: string) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  onConfirm,
  onCancel,
  isOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    try {
      await onConfirm(product._id);
      // Le parent fermera le modal après succès
    } catch (err: any) {
      console.error("❌ Error deleting product:", err);
      setError(err?.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fermer le modal si on clique sur le backdrop (pas sur le contenu)
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content delete-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>🗑️ Confirmer la suppression</h2>
          {!loading && (
            <button
              className="modal-close"
              onClick={onCancel}
              aria-label="Fermer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Alert */}
        <div className="alert alert-warning">
          <span className="alert-icon">⚠️</span>
          <div>
            <strong>Attention !</strong>
            <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
              Cette action est irréversible et supprimera définitivement le
              produit.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">❌</span>
            {error}
          </div>
        )}

        {/* Product Details */}
        <div className="modal-body">
          <p className="confirmation-text">
            Voulez-vous vraiment supprimer ce produit ?
          </p>

          <div className="product-preview">
            {/* Image */}
            {product.images && product.images.length > 0 && (
              <div className="product-preview-image">
                <img src={product.images[0].url} alt={product.title} />
              </div>
            )}

            {/* Info */}
            <div className="product-preview-info">
              <h3>{product.title}</h3>
              <div className="product-preview-details">
                <div className="detail-item">
                  <span className="detail-label">Prix :</span>
                  <span className="detail-value">{product.price} €</span>
                </div>
                {product.brand && (
                  <div className="detail-item">
                    <span className="detail-label">Marque :</span>
                    <span className="detail-value">{product.brand}</span>
                  </div>
                )}
                {product.color && (
                  <div className="detail-item">
                    <span className="detail-label">Couleur :</span>
                    <span className="detail-value">{product.color}</span>
                  </div>
                )}
                {product.quantity !== undefined && (
                  <div className="detail-item">
                    <span className="detail-label">Stock :</span>
                    <span className="detail-value">{product.quantity}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="consequences-info">
            <p className="consequences-title">
              <strong>Conséquences :</strong>
            </p>
            <ul className="consequences-list">
              <li>Le produit sera supprimé définitivement</li>
              <li>Toutes les images seront supprimées</li>
              <li>Les avis associés seront perdus</li>
              <li>Cette action ne peut pas être annulée</li>
            </ul>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Suppression...
              </>
            ) : (
              <>
                <span>🗑️</span>
                Supprimer définitivement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
