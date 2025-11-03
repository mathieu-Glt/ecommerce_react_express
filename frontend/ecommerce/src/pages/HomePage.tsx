import BannerBestSelling from "../components/BannerBestSelling/bannerBestSelling";
import { useUserContext } from "../context/userContext";
import BannerLastProducts from "../components/BannerLastProduct/bannerLastProducts";
import "./styles/homePage.css";
import BannerLastProductsOutillage from "../components/BannerListOutillage/BannerListOutillage";
import BannerListAcessoriesProduct from "../components/BannerListProductsAccessories/BannerListAccessoriesProduct";
export const HomePage = () => {
  // Use context for take user, token and refreshToken
  const { user, token, isAuthenticated, refreshToken } = useUserContext();
  console.log("👤 User:", user);
  console.log("🔑 Token:", token);
  console.log("♻️ Refresh Token:", refreshToken);
  console.log("✅ Authenticated:", isAuthenticated);

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name || "User"}!</p>
      ) : (
        <p>Please log in.</p>
      )}
      <div className="container-banner">
        <BannerBestSelling />
        <BannerLastProducts />
        {/* <BannerListAcessoriesProduct />
        <BannerLastProductsOutillage /> */}
      </div>
    </div>
  );
};
