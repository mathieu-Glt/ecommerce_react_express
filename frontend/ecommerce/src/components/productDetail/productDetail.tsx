import { useCallback, useState } from "react";
import { useProduct } from "../../hooks/useProduct";
import PageLoader from "../LoaderPage/PageLoader";
import type { ProductDetail as ProductDetailType } from "../../interfaces/product.interface";
import { Link } from "react-router-dom";
import RateComponent from "../rateComponent/RateComponent";
import "./product-detail.css";
import avisVerified from "../../assets/avis-verifies.png";
import CommentsModal from "../CommentModal/CommentModal";
import { Button } from "antd";
import AddCommentModal from "../AddCommentModal/AddCommentModal";
import EditCommentModal from "../EditCommentModal/EditCommentModal";
import { useCart } from "../../hooks/useCart";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export const ProductDetail = ({
  selectedProduct,
}: {
  selectedProduct: ProductDetailType;
}) => {
  const {
    cart,
    loading,
    error,
    getUserCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    addToCart,
  } = useCart();
  const { rateProduct, checkRateProductByUser } = useProduct();
  const { user } = useLocalStorage();

  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  // Callback appelé quand l'utilisateur clique sur ajouter au panier
  const onAddToCart = useCallback(async () => {
    const datasCart = {
      productId: selectedProduct,
      quantity: 1,
      ordersBy: user?._id || "",
    };
    try {
      await addToCart(datasCart);
      console.log("✅ Produit ajouté au panier !");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout au panier :", error);
    }
  }, [selectedProduct, addToCart]);
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
        <Button className="button-logo-verified">
          <img
            src={avisVerified}
            alt="Logo"
            width="50px"
            className="logo-avis-verified"
            onClick={() => setOpen(true)}
          />
          Voir les avis
        </Button>
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
        {/* <Link
          to={`/cart/add/${selectedProduct._id}`}
          className="add-to-cart-button"
        >
          Add to Cart
        </Link> */}
        <button className="add-to-cart-button" onClick={onAddToCart}>
          Add to cart
        </button>
        <Button
          type="primary"
          onClick={() => setOpenCreate(true)}
          className="view-comments-button"
        >
          Ajoute un commentaire
        </Button>
      </div>
      <CommentsModal
        productId={selectedProduct._id}
        open={open}
        onClose={() => setOpen(false)}
      />
      <AddCommentModal
        productId={selectedProduct._id}
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </div>
  );
};
