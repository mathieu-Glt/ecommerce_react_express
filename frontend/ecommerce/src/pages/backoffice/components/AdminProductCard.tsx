import type { ProductProps } from "../../../interfaces/product.interface";
// import { useProduct } from "../../../hooks/useProduct";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { Link } from "react-router-dom";

export default function AdminProductCard({ product, onDelete }: ProductProps) {
  //   const { rateProduct, checkRateProductByUser } = useProduct();
  const { user } = useLocalStorage();

  return (
    <div key={String(product._id)} className="product-card">
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
        ></div>
        <div className="product-admin-container">
          {/* Link Edit Product */}
          <div className="product-edit-info">
            {/* <button className="product-edit-button">Edit Product</button> */}
            <Link
              to={`/admin/products/edit/${product._id}`}
              className="product-edit-button"
            >
              Edit Product
            </Link>
          </div>
          {/* 📦 Bouton suppression du produit */}
          <div className="product-delete-info">
            {/* <button className="product-delete-button">Delete Product</button> */}
            <button
              onClick={() => onDelete(product)}
              className="product-delete-button"
              type="button"
            >
              🗑️ Delete Product
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
