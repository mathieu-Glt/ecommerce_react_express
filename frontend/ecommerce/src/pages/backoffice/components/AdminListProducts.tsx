import { useEffect, useState } from "react";
import { useProduct } from "../../../hooks/useProduct";
import PageLoader from "../../../components/LoaderPage/PageLoader";
// import ProductCard from "../productCard/productCard";
import { Pagination } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "../../styles/admin-list-products.css";
import { useFilter } from "../../../context/FilterSearchBarContext";
import { useNavigate } from "react-router-dom";
import AdminProductCard from "./AdminProductCard";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
export const AdminListProduct = () => {
  const navigate = useNavigate();
  const { products, loading, getAllProducts, getProductById, deleteProduct } =
    useProduct();
  const {
    getProducts,
    getProductsByCategory,
    getProductsBySubsCategory,
    getProductsByAverageRate,
    getProductsByPriceRange,
  } = useFilter();

  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [listProducts, setListProducts] = useState<boolean>(false);
  const [backList, setBackList] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchProducts, setSearchProducts] = useState(getProducts);
  const [fade, setFade] = useState(true);
  const pageSize = 3;
  const [clicked, setClicked] = useState(false);

  // State for the delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

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
    if (getProductsByPriceRange && getProductsByPriceRange.length > 0) {
      setSearchProducts(getProductsByPriceRange);
      setClicked(!clicked);
    }
  }, [getProductsByPriceRange]);

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

  // Open the delete modal
  const handleOpenDeleteModal = (product: any) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Close the delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Confirm the deletion
  const handleConfirmDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      // Reload the product list
      await getAllProducts();
      // Close the modal
      handleCloseDeleteModal();
    } catch (error) {
      // The error is already handled in the modal
      throw error;
    }
  };

  if (loading) return <PageLoader />;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = (
    searchProducts && searchProducts.length > 0 ? searchProducts : products
  ).slice(startIndex, endIndex);

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Liste des produits</h1>
      <h3></h3>
      {clicked && (
        <button
          onClick={() => setBackList(!backList)}
          className="toggle-list-button"
        >
          Product List
        </button>
      )}

      <div className={`product-cards-wrapper ${fade ? "" : "fade-out"}`}>
        {paginatedProducts.flat().map((product) => (
          <AdminProductCard
            key={product._id}
            product={product}
            getProductById={getProductById}
            onDelete={handleOpenDeleteModal}
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
      {/* Delete confirmation modal */}
      {productToDelete && (
        <DeleteConfirmModal
          product={productToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          isOpen={showDeleteModal}
        />
      )}
    </div>
  );
};
