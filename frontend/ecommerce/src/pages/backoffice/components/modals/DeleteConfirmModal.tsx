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
      // The parent will close the modal after success
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close the modal if clicking on the backdrop (not on the content)
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content delete-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>🗑️ Confirm Deletion</h2>
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
            <strong>Warning!</strong>
            <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
              This action is irreversible and will permanently delete the
              product.
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
            Do you really want to delete this product?
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
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">{product.price} €</span>
                </div>
                {product.brand && (
                  <div className="detail-item">
                    <span className="detail-label">Brand:</span>
                    <span className="detail-value">{product.brand}</span>
                  </div>
                )}
                {product.color && (
                  <div className="detail-item">
                    <span className="detail-label">Color:</span>
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
              <li>The product will be permanently deleted</li>
              <li>All images will be deleted</li>
              <li>Associated reviews will be lost</li>
              <li>This action cannot be undone</li>
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
            Cancel
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
                Deleting...
              </>
            ) : (
              <>
                <span>🗑️</span>
                Delete permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
