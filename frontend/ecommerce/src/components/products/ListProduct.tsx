import { useEffect } from "react";
import { useProduct } from "../../hooks/useProduct";
import PageLoader from "../LoaderPage/PageLoader";
import "./list-products.css";
import { Link } from "react-router-dom";

export const ListProduct = () => {
  const { products, loading, getAllProducts, deleteProduct, getProductById } =
    useProduct();
  console.log("Products in ListProduct:", products);
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  if (loading) return <PageLoader />;

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Liste des produits</h1>

      <div className="product-cards-wrapper">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            {p.images && p.images[0] && (
              <img src={p.images[0]} alt={p.title} className="product-image" />
            )}

            <div className="product-info">
              <h2 className="product-title">{p.title}</h2>
              <p className="product-description">
                {p.description?.slice(0, 60)}...
              </p>
              <p className="product-price">{p.price} €</p>
              <Link className="product-delete-button" to={`/products/${p._id}`}>
                Details
              </Link>{" "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
