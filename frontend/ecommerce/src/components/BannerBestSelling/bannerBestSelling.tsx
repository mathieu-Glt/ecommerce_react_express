import Typewriter from "typewriter-effect";
import "./banner-best-product.css";

export default function BannerBestSelling() {
  return (
    <div className="banner-best-products">
      <Typewriter
        options={{
          strings: ["Best Selling Product "],
          autoStart: true,
          loop: true,
        }}
      />
      {/* affichage meilleur vente produit */}
    </div>
  );
}
