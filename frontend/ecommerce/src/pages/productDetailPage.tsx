import { useParams } from "react-router-dom";
import PageLoader from "../components/LoaderPage/PageLoader";
import { ProductDetail } from "../components/productDetail/productDetail";
import { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import type { ProductDetailInterface } from "../interfaces/product.interface";

export const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  console.log("Product ID from params:", productId);
  const { selectedProduct, loading, getProductById } = useProduct();
  console.log("Selected product in ProductDetail:", selectedProduct);

  useEffect(() => {
    if (!productId) return;
    getProductById(productId);
  }, [getProductById, productId]);

  if (loading) return <PageLoader />;
  if (!selectedProduct) return <div>Product not found</div>;

  if (!productId) {
    return <PageLoader />;
  }

  return (
    <div>
      <ProductDetail
        selectedProduct={selectedProduct as ProductDetailInterface}
      />
    </div>
  );
};
