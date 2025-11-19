import BannerBestSelling from "../components/BannerBestSelling/bannerBestSelling";
import { useUserContext } from "../context/userContext";
import BannerLastProducts from "../components/BannerLastProduct/bannerLastProducts";
import "./styles/homePage.css";
import BannerLastProductsOutillage from "../components/BannerListOutillage/BannerListOutillage";
import BannerListAcessoriesProduct from "../components/BannerListProductsAccessories/BannerListAccessoriesProduct";
export const HomePage = () => {
  // Use context for take user, token and refreshToken
  const { user, token, isAuthenticated, refreshToken } = useUserContext();

  return (
    <div className="container-banner">
      {isAuthenticated ? (
        <p>Welcome, {user?.name || "User"}!</p>
      ) : (
        <p>Please log in.</p>
      )}
      <div className="">
        <BannerBestSelling />
        <BannerLastProducts />
        {/* <BannerListAcessoriesProduct />
        <BannerLastProductsOutillage /> */}
      </div>
    </div>
  );
};
