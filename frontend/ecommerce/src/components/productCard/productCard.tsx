import { Link } from "react-router-dom";
import { EyeTwoTone, ShoppingCartOutlined } from "@ant-design/icons";
import RateComponent from "../rateComponent/RateComponent";
import type { ProductProps } from "../../interfaces/product.interface";
import { useProduct } from "../../hooks/useProduct";
import { useCallback } from "react";
import { useCart } from "../../context/cartContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function ProductCard({ product }: ProductProps) {
  const { rateProduct, checkRateProductByUser } = useProduct();
  const { user } = useLocalStorage();
  const { addToCart } = useCart();

  // Fonction appelée quand l'utilisateur change la notes
  const onRateChange = async (newRating: number) => {
    try {
      console.log(
        `⭐ Nouvelle note pour le produit ${product._id}: ${newRating}`
      );
      const hasRated = await checkRateProductByUser(product._id);
      console.log("Has user rated this product before?", hasRated);
      const isUpdate = hasRated ? true : false;
      const success = await rateProduct(product._id, newRating, product.rating);
      console.log("success : ", success);
      console.log(`Rating ${isUpdate ? "updated" : "added"}:`, success);
    } catch (error) {
      console.error("Erreur lors de la notation du produit :", error);
    }
  };

  // Callback appelé quand l'utilisateur clique sur ajouter au panier
  const onAddToCart = useCallback(async () => {
    if (!user?._id) {
      console.warn("❌ Aucun utilisateur connecté !");
      return;
    }

    const datasCart = {
      product,
      quantity: 1,
      orderBy: user._id,
    };
    console.log("🛒 addToCart datas:", datasCart);
    try {
      await addToCart(datasCart);
      console.log("✅ Produit ajouté au panier !");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout au panier :", error);
    }
  }, [product, user]);
  return (
    <div key={String(product._id)} className="product-card">
      {/* ⭐ Composant de notation */}
      <RateComponent
        rate={Number(product.averageRating) || 1}
        editable={true}
        starColor="#FFD700"
        emptyStarColor="#DDDDDD"
        onRateChange={onRateChange} // ✅ on passe notre handler
      />

      {/* 🖼️ Image du produit */}
      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-image"
          width="200"
        />
      )}

      {/* 📦 Infos produit */}
      <div className="product-info">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-description">
          {product.description?.slice(0, 60)}...
        </p>
        <p className="product-price">{product.price} €</p>

        {/* ⚙️ Actions */}
        <div
          className="product-action"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          {/* 🛒 Ajouter au panier */}
          <button className="add-to-cart-button" onClick={onAddToCart}>
            Ajouter au panier
            <ShoppingCartOutlined
              style={{ fontSize: "26px", color: "#f32400ff" }}
            />
          </button>
          {/* 👁️ Voir les détails */}
          <Link
            to={`/products/${product._id}`}
            className="product-details-button"
            title="Voir les détails"
          >
            <EyeTwoTone style={{ fontSize: "26px", color: "#f33900ff" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
