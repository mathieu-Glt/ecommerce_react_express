import Typewriter from "typewriter-effect";
// import "./banner-last-products.css";
import { useProduct } from "../../hooks/useProduct";
import { useEffect } from "react";
import PageLoader from "../LoaderPage/PageLoader";
import { Carousel } from "antd";
import "antd/dist/reset.css";

export default function BannerLastProductsOutillage() {
  const {
    products,
    loading,
    getLatestProducts,
    fetchProductsByCategoryOutillageHook,
  } = useProduct();

  useEffect(() => {
    fetchProductsByCategoryOutillageHook();
  }, [getLatestProducts]);

  if (loading) return <PageLoader />;

  return (
    <div className="banner-last-products">
      <Typewriter
        options={{
          strings: [
            "New Arrival Products",
            "Last trend Products for Outillage",
          ],
          autoStart: true,
          loop: true,
        }}
      />

      <Carousel autoplay dots>
        {products.map((product) => (
          <div key={product._id}>
            <div className="card-slide">
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="product-image"
              />
              <div className="product-info">
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <span className="price">${product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
