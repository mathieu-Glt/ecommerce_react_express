import { useCallback } from "react";
import { useProduct } from "../../hooks/useProduct";
import PageLoader from "../LoaderPage/PageLoader";
import type { ProductDetail as ProductDetailType } from "../../interfaces/product.interface";
import { Link } from "react-router-dom";
import RateComponent from "../rateComponent/RateComponent";
import "./product-detail.css";

export const ProductDetail = ({
  selectedProduct,
}: {
  selectedProduct: ProductDetailType;
}) => {
  const { rateProduct, checkRateProductByUser } = useProduct(); // ✅ récupère la méthode du hook

  // Callback appelé quand l'utilisateur clique sur une étoile
  const onRateChange = useCallback(
    async (newRating: number) => {
      try {
        console.log(
          `⭐ Nouvelle note pour le produit ${selectedProduct._id}: ${newRating}`
        );
        const hasRated = await checkRateProductByUser(product._id);
        console.log("Has user rated this product before?", hasRated);
        const isUpdate = hasRated ? true : false;

        // Appelle la fonction du hook
        const success = await rateProduct(
          selectedProduct._id,
          newRating,
          isUpdate
        );

        if (success) {
          console.log("✅ Note enregistrée avec succès !");
        } else {
          console.error("❌ Échec de la mise à jour de la note.");
        }
      } catch (error) {
        console.error("Erreur lors de la notation :", error);
      }
    },
    [selectedProduct, rateProduct]
  );

  if (!selectedProduct) return <PageLoader />;

  return (
    <div className="product-detail-text-container">
      {selectedProduct.images?.[0] && (
        <img
          src={selectedProduct.images[0]}
          alt={selectedProduct.title}
          className="product-detail-image"
        />
      )}

      <div className="product-detail-container">
        <RateComponent
          rate={Number(selectedProduct.averageRating) || 1}
          editable={true}
          starColor="#FFD700"
          emptyStarColor="#DDDDDD"
          onRateChange={onRateChange} // ✅ On passe le handler ici
        />

        <h1 className="product-detail-title">{selectedProduct.title}</h1>
        <p className="product-detail-description">
          {selectedProduct.description}
        </p>
        <p className="product-detail-price">{selectedProduct.price} €</p>

        <Link
          to={`/cart/add/${selectedProduct._id}`}
          className="add-to-cart-button"
        >
          Add to Cart
        </Link>
      </div>
    </div>
  );
};
