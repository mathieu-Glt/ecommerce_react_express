import { useEffect } from "react";
import PageLoader from "../components/LoaderPage/PageLoader";
import { useProduct } from "../hooks/useProduct";

export const ProductPage = () => {
  const { products, loading, getAllProducts, deleteProduct } = useProduct();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  if (loading) return <PageLoader />;

  return (
    <div>
      {products.map((p) => (
        <div key={p._id}>
          {p.title} - {p.price}€
          <button onClick={() => deleteProduct(p._id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
};
