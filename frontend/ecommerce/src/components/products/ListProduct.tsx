import { useEffect, useState } from "react";
import { useProduct } from "../../hooks/useProduct";
import PageLoader from "../LoaderPage/PageLoader";
import ProductCard from "../productCard/productCard";
import { Pagination } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./list-products.css";
import { useFilter } from "../../context/FilterSearchBarContext";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ROUTES } from "../../services/constants/api-routes";
export const ListProduct = () => {
  const navigate = useNavigate();
  console.log("navigate : ", navigate);
  const { products, loading, getAllProducts, getProductById } = useProduct();
  const {
    getProducts,
    getProductsByCategory,
    getProductsBySubsCategory,
    getProductsByAverageRate,
  } = useFilter();
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [listProducts, setListProducts] = useState<boolean>(false);
  const [backList, setBackList] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchProducts, setSearchProducts] = useState(getProducts);
  const [fade, setFade] = useState(true);
  const pageSize = 3;
  const [clicked, setClicked] = useState(false);

  // console.log("Products in ListProduct : ", getProducts);
  // console.log("listProducts state : ", listProducts);
  // console.log("products state : ", products);
  // console.log("searchProducts state : ", searchProducts);
  if (backList) {
    window.location.reload();
  }
  useEffect(() => {
    getAllProducts();
  }, [listProducts]);

  useEffect(() => {
    if (getProducts && getProducts.length > 0) {
      setSearchProducts(getProducts);
      setClicked(!clicked);
    }
  }, [getProducts]);

  useEffect(() => {
    if (getProductsByCategory && getProductsByCategory.length > 0) {
      setSearchProducts(getProductsByCategory);
      setClicked(!clicked);
    }
  }, [getProductsByCategory]);

  useEffect(() => {
    if (getProductsBySubsCategory && getProductsBySubsCategory.length > 0) {
      setSearchProducts(getProductsBySubsCategory);
      setClicked(!clicked);
    }
  }, [getProductsBySubsCategory]);

  useEffect(() => {
    if (getProductsByAverageRate && getProductsByAverageRate.length > 0) {
      setSearchProducts(getProductsByAverageRate);
      setClicked(!clicked);
    }
  }, [getProductsByAverageRate]);

  useEffect(() => {
    if (!searchProducts || searchProducts.length === 0) {
      setSearchProducts(products);
    }
  }, [products]);

  const handleChangePage = (page) => {
    setFade(false);
    setTimeout(() => {
      setCurrentPage(page);
      setFade(true);
    }, 200);
  };

  if (loading) return <PageLoader />;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = (
    searchProducts && searchProducts.length > 0 ? searchProducts : products
  ).slice(startIndex, endIndex);
  console.log("Current Products : ", paginatedProducts);

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Liste des produits</h1>
      <h3></h3>
      {clicked && (
        <button
          onClick={() => setBackList(!backList)}
          className="toggle-list-button"
        >
          Liste de produits
        </button>
      )}

      <div className={`product-cards-wrapper ${fade ? "" : "fade-out"}`}>
        {paginatedProducts.flat().map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            getProductById={getProductById}
          />
        ))}
      </div>

      <div
        className="pagination-wrapper"
        style={{ marginTop: 20, textAlign: "center" }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={products.length}
          onChange={handleChangePage}
          showSizeChanger={false}
          showQuickJumper
          itemRender={(page, type) => {
            if (type === "prev")
              return <LeftOutlined style={{ fontSize: 16 }} />;
            if (type === "next")
              return <RightOutlined style={{ fontSize: 16 }} />;
            return <span>{page}</span>;
          }}
        />
      </div>
    </div>
  );
};
