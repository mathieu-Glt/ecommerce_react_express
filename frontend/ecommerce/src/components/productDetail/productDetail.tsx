import { useEffect } from "react";
import { useProduct } from "../../hooks/useProduct";
import PageLoader from "../LoaderPage/PageLoader";
import type { ProductDetail as ProductDetailType } from "../../interfaces/product.interface";
import "./product-detail.css";
import { Link, useParams } from "react-router-dom";
import RateComponent from "../rateComponent/RateComponent";
export const ProductDetail = ({
  selectedProduct,
}: {
  selectedProduct: ProductDetailType;
}) => {
  console.log("Product selectedProduct:", selectedProduct);
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

  if (!selectedProduct) return <PageLoader />;
  return (
    <div className="product-detail-text-container">
      {selectedProduct.images && selectedProduct.images[0] && (
        <img
          src={selectedProduct.images[0]}
          alt={selectedProduct.title}
          className="product-detail-image"
        />
      )}{" "}
      <div className="product-detail-container">
        {" "}
        <RateComponent
          rate={Number(selectedProduct.averageRating) || 1}
          editable={true}
          starColor="#FFD700"
          emptyStarColor="#DDDDDD"
          onRateChange={onRatechange}
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
