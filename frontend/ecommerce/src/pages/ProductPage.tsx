import { useEffect } from "react";
import PageLoader from "../components/LoaderPage/PageLoader";
import { useProduct } from "../hooks/useProduct";
import { ListProduct } from "../components/products/ListProduct";

export const ProductPage = () => {
  return (
    <div>
      {/* <h1>Page des Produits</h1> */}
      <ListProduct />
    </div>
  );
};
