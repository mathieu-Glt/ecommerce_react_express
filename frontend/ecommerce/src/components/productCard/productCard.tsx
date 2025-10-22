import { Link, useParams } from "react-router-dom";
import type { ProductProps } from "../../interfaces/product.interface";
import { EyeTwoTone, ShoppingCartOutlined } from "@ant-design/icons";
import RateComponent from "../rateComponent/RateComponent";

export default function ProductCard({ product, getProductById }: ProductProps) {
  const { params } = useParams();
  console.log("Rendering ProductCard for product:", params);
  console.log("Product details:", product);

  const onRatechange = async (newRating: number) => {
    console.log(`New rating for product ${product._id}: ${newRating}`);
    // try {
    //   const prod = await getProductById(product._id);
    //   if (prod) {
    //     console.log(
    //       `New rating for product ${prod._id} (${prod.title}): ${newRating}`
    //     );
    //   } else {
    //     console.error("Product not found for rating update.");
    //   }
    // } catch (error) {
    //   console.error("Error fetching product for rating update:", error);
  };
  return (
    <div key={String(product._id)} className="product-card">
      <RateComponent
        rate={Number(product.averageRating) || 1}
        editable={true}
        starColor="#FFD700"
        emptyStarColor="#DDDDDD"
        onRateChange={onRatechange}
      />
      {/* Image du produit */}
      {product.images && product.images[0] && (
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-image"
          width={"200px"}
        />
      )}

      {/* Infos produit */}
      <div className="product-info">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-description">
          {product.description?.slice(0, 60)}...
        </p>
        <p className="product-price">{product.price} €</p>

        {/* Actions (icônes + liens) */}
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
          {/* Bouton ajouter au panier */}
          <Link
            to={`/cart/add/${product._id}`}
            className="product-cart-button"
            title="Ajouter au panier"
          >
            <ShoppingCartOutlined
              style={{ fontSize: "26px", color: "#f32400ff" }}
            />
          </Link>

          {/* Bouton voir détails */}
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
