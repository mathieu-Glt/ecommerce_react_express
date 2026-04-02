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

  // Function called when the user changes the rating
  const onRateChange = async (newRating: number) => {
    try {
      const hasRated = await checkRateProductByUser(product._id);
      const isUpdate = hasRated ? true : false;
      const success = await rateProduct(product._id, newRating, product.rating);
    } catch (error) {
      console.warn("Error while rating the product:", error);
    }
  };

  // Callback called when the user clicks on add to cart
  const onAddToCart = useCallback(async () => {
    if (!user?._id) {
      return;
    }

    const datasCart = {
      product,
      quantity: 1,
      orderBy: user._id,
    };
    try {
      await addToCart(datasCart);
    } catch (error) {
      console.warn("❌ Error while adding to cart:", error);
      return;
    }
  }, [product, user]);
  return (
    <div key={String(product._id)} className="product-card">
      {/* Rating component */}
      <RateComponent
        rate={Number(product.averageRating) || 1}
        editable={true}
        starColor="#FFD700"
        emptyStarColor="#DDDDDD"
        onRateChange={onRateChange} // passing our handler
      />

      {/* Product image */}
      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-image"
          width="200"
        />
      )}

      {/* Product info */}
      <div className="product-info">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-description">
          {product.description?.slice(0, 60)}...
        </p>
        <p className="product-price">{product.price} €</p>

        {/* Actions */}
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
          {/* Add to cart */}
          <button className="add-to-cart-button" onClick={onAddToCart}>
            Add to cart
            <ShoppingCartOutlined
              style={{ fontSize: "26px", color: "#f32400ff" }}
            />
          </button>
          {/* View details */}
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
