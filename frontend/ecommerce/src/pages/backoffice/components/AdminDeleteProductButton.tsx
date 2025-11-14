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
      console.error("❌ Error fetching product:", err);
      setError("Erreur lors du chargement du produit");
    } finally {
      setLoadingProduct(false);
    }
  };

  // ==================== DELETE HANDLER ====================
  const handleDelete = async () => {
    if (!id) return;

    // Double confirmation
    const confirmed = window.confirm(
      `⚠️ Êtes-vous ABSOLUMENT SÛR de vouloir supprimer "${product?.title}" ?\n\n` +
        "Cette action est IRRÉVERSIBLE et supprimera :\n" +
        "- Le produit\n" +
        "- Toutes ses images\n" +
        "- Tous les avis associés\n\n" +
        "Tapez OK pour confirmer."
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      console.log("🗑️ Deleting product with ID:", id);
      const success = await deleteProduct(id);

      if (success) {
        // Redirection immédiate vers la liste
        navigate("/admin/products", {
          state: { message: "Produit supprimé avec succès" },
        });
      } else {
        setError("Échec de la suppression du produit");
      }
    } catch (err: any) {
      console.error("❌ Error deleting product:", err);
      setError(err?.message || "Erreur lors de la suppression du produit");
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
          <h1>⏳ Chargement...</h1>
          <p>Chargement du produit en cours...</p>
        </div>
      </div>
    );
  }

  // ==================== NOT FOUND ====================
  if (!product || product._id !== id) {
    return (
      <div className="product-create-page">
        <div className="page-header">
          <h1>❌ Produit non trouvé</h1>
          <p>Le produit que vous cherchez n'existe pas.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/products")}
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="product-create-page">
      <div className="page-header">
        <h1>🗑️ Supprimer le produit</h1>
        <p>Confirmez la suppression de ce produit</p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          {error}
        </div>
      )}

      {/* Avertissement */}
      <div className="alert alert-error" style={{ marginBottom: "2rem" }}>
        <span className="alert-icon">⚠️</span>
        <div>
          <strong>ATTENTION : Cette action est irréversible !</strong>
          <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
            La suppression de ce produit entraînera également la suppression de
            toutes ses images, avis et données associées.
          </p>
        </div>
      </div>

      {/* Détails du produit à supprimer */}
      <div className="form-section">
        <h2 className="section-title">📝 Informations du produit</h2>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <strong>Titre :</strong>
            <p>{product.title}</p>
          </div>

          <div>
            <strong>Prix :</strong>
            <p>{product.price} €</p>
          </div>

          <div>
            <strong>Description :</strong>
            <p>{product.description}</p>
          </div>

          <div>
            <strong>Marque :</strong>
            <p>{product.brand}</p>
          </div>

          <div>
            <strong>Couleur :</strong>
            <p>{product.color}</p>
          </div>

          <div>
            <strong>Quantité en stock :</strong>
            <p>{product.quantity}</p>
          </div>

          <div>
            <strong>Livraison :</strong>
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

          {/* Note moyenne */}
          {product.averageRating !== undefined && (
            <div>
              <strong>Note moyenne :</strong>
              <p>
                {product.averageRating > 0
                  ? `⭐ ${product.averageRating.toFixed(1)} / 5`
                  : "Pas encore d'avis"}
              </p>
            </div>
          )}

          {/* Nombre d'avis */}
          {product.rating && product.rating.length > 0 && (
            <div>
              <strong>Nombre d'avis :</strong>
              <p>{product.rating.length} avis</p>
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
          ← Annuler
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
              Suppression en cours...
            </>
          ) : (
            <>
              <span>🗑️</span>
              Supprimer définitivement
            </>
          )}
        </button>
      </div>

      {/* Informations supplémentaires */}
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
          <li>Cette suppression est définitive et ne peut pas être annulée</li>
          <li>Les images seront supprimées de Cloudinary</li>
          <li>Les avis clients associés seront perdus</li>
          <li>
            L'historique des commandes conservera une référence au produit
            supprimé
          </li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(AdminProductDeletePage);
