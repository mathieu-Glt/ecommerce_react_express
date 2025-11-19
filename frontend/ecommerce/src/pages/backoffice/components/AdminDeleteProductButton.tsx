// src/pages/backoffice/AdminProductDeletePage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/admin-product-create.css";
import { useProduct } from "../../hooks/useProduct";

const AdminProductDeletePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, deleteProduct, product } = useProduct();

  // State UI
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState("");

  // ==================== FETCH PRODUCT ====================
  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoadingProduct(true);
      await getProduct(productId);
    } catch (err) {
      setError("Error occurred while loading the product");
    } finally {
      setLoadingProduct(false);
    }
  };

  // ==================== DELETE HANDLER ====================
  const handleDelete = async () => {
    if (!id) return;

    // Double confirmation
    const confirmed = window.confirm(
      `⚠️ Are you ABSOLUTELY SURE you want to delete "${product?.title}"?\n\n` +
        "This action is IRREVERSIBLE and will delete:\n" +
        "- The product\n" +
        "- All its images\n" +
        "- All associated reviews\n\n" +
        "Type OK to confirm."
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const success = await deleteProduct(id);

      if (success) {
        // Redirection immédiate vers la liste
        navigate("/admin/products", {
          state: { message: "Product deleted successfully" },
        });
      } else {
        setError("Failed to delete the product");
      }
    } catch (err: any) {
      setError(err?.message || "Error occurred while deleting the product");
    } finally {
      setLoading(false);
    }
  };

  // ==================== CANCEL HANDLER ====================
  const handleCancel = () => {
    navigate("/admin/products");
  };

  // ==================== LOADING STATE ====================
  if (loadingProduct) {
    return (
      <div className="product-create-page">
        <div className="page-header">
          <h1>⏳ Loading...</h1>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  // ==================== NOT FOUND ====================
  if (!product || product._id !== id) {
    return (
      <div className="product-create-page">
        <div className="page-header">
          <h1>❌ Product not found</h1>
          <p>The product you are looking for does not exist.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/products")}
        >
          Back to list
        </button>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="product-create-page">
      <div className="page-header">
        <h1>🗑️ Delete Product</h1>
        <p>Confirm the deletion of this product</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          {error}
        </div>
      )}

      {/* Warning */}
      <div className="alert alert-error" style={{ marginBottom: "2rem" }}>
        <span className="alert-icon">⚠️</span>
        <div>
          <strong>WARNING: This action is irreversible!</strong>
          <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
            Deleting this product will also delete all its images, reviews, and associated data.
          </p>
        </div>
      </div>

      {/* Product details to delete */}
      <div className="form-section">
        <h2 className="section-title">📝 Product Information</h2>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <strong>Titre :</strong>
            <p>{product.title}</p>
          </div>

          <div>
            <strong>Price:</strong>
            <p>{product.price} €</p>
          </div>

          <div>
            <strong>Description:</strong>
            <p>{product.description}</p>
          </div>

          <div>
            <strong>Brand:</strong>
            <p>{product.brand}</p>
          </div>

          <div>
            <strong>Color:</strong>
            <p>{product.color}</p>
          </div>

          <div>
            <strong>Stock Quantity:</strong>
            <p>{product.quantity}</p>
          </div>

          <div>
            <strong>Shipping:</strong>
            <p>
              {product.shipping === "Yes" ? "Disponible" : "Non disponible"}
            </p>
          </div>

          {/* Images */}
          {product.images && product.images.length > 0 && (
            <div>
              <strong>Images ({product.images.length}) :</strong>
              <div className="image-previews" style={{ marginTop: "1rem" }}>
                {product.images.map((img: any, index: number) => (
                  <div key={index} className="image-preview-item">
                    <img src={img.url} alt={`Product ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Average Rating */}
          {product.averageRating !== undefined && (
            <div>
              <strong>Average Rating:</strong>
              <p>
                {product.averageRating > 0
                  ? `⭐ ${product.averageRating.toFixed(1)} / 5`
                  : "Pas encore d'avis"}
              </p>
            </div>
          )}

          {/* Number of Reviews */}
          {product.rating && product.rating.length > 0 && (
            <div>
              <strong>Number of Reviews:</strong>
              <p>{product.rating.length} reviews</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          ← Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleDelete}
          disabled={loading}
          style={{
            backgroundColor: "#dc3545",
            borderColor: "#dc3545",
          }}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Deletion in progress...
            </>
          ) : (
            <>
              <span>🗑️</span>
              Delete permanently
            </>
          )}
        </button>
      </div>

      {/* Additional Information */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "1rem", fontWeight: 600 }}>
          ℹ️ Informations
        </h3>
        <ul style={{ marginBottom: 0, paddingLeft: "1.5rem" }}>
          <li>This deletion is permanent and cannot be undone</li>
          <li>Images will be deleted from Cloudinary</li>
          <li>Associated customer reviews will be lost</li>
          <li>
            The order history will retain a reference to the deleted product
          </li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(AdminProductDeletePage);
