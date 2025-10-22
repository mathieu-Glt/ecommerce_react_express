import { useEffect, useState } from "react";
import { useProduct } from "../../hooks/useProduct";
import PageLoader from "../LoaderPage/PageLoader";
import ProductCard from "../productCard/productCard";
import { Pagination } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./list-products.css";

export const ListProduct = () => {
  const { products, loading, getAllProducts, getProductById } = useProduct();

  const [currentPage, setCurrentPage] = useState(1);
  const [fade, setFade] = useState(true);
  const pageSize = 3;

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const handleChangePage = (page) => {
    setFade(false); // déclenche fade-out
    setTimeout(() => {
      setCurrentPage(page);
      setFade(true); // déclenche fade-in
    }, 200); // correspond à la durée de l'animation CSS
  };

  if (loading) return <PageLoader />;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Liste des produits</h1>

      <div className={`product-cards-wrapper ${fade ? "" : "fade-out"}`}>
        {currentProducts.map((product) => (
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
            if (type === "prev") {
              return <LeftOutlined style={{ fontSize: 16 }} />;
            }
            if (type === "next") {
              return <RightOutlined style={{ fontSize: 16 }} />;
            }
            return <span>{page}</span>; // cercles de page
          }}
        />
      </div>
    </div>
  );
};
