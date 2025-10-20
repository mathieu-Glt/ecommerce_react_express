import { useEffect } from "react";
import { useProduct } from "../../hooks/useProduct";
import PageLoader from "../LoaderPage/PageLoader";
import type { ProductDetail as ProductDetailType } from "../../interfaces/product.interface";
import "./product-detail.css";
export const ProductDetail = ({
  selectedProduct,
}: {
  selectedProduct: ProductDetailType;
}) => {
  return (
    <div className="product-detail-container">
      <h1 className="product-detail-title">{selectedProduct.title}</h1>
      {selectedProduct.images && selectedProduct.images[0] && (
        <img
          src={selectedProduct.images[0]}
          alt={selectedProduct.title}
          className="product-detail-image"
        />
      )}
      <p className="product-detail-description">
        {selectedProduct.description}
      </p>
      <p className="product-detail-price">{selectedProduct.price} €</p>
      <button className="add-to-cart-button">Add to Cart</button>
    </div>
  );
};
