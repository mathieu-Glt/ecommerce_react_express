import Typewriter from "typewriter-effect";
import "./banner-best-product.css";
import { useProduct } from "../../hooks/useProduct";
import PageLoader from "../LoaderPage/PageLoader";
import { useEffect } from "react";
import { Carousel } from "antd";
import "antd/dist/reset.css";

export default function BannerBestSelling() {
  const { products, loading, fetchTopRatedProductsHook } = useProduct();

  useEffect(() => {
    fetchTopRatedProductsHook();
  }, [fetchTopRatedProductsHook]);

  if (loading) return <PageLoader />;

  return (
    <div className="banner-best-products">
      <Typewriter
        options={{
          strings: ["Best Selling Product "],
          autoStart: true,
          loop: true,
        }}
      />
      {/* best-selling product display */}

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
