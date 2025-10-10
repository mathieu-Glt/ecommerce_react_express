// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";

export const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Header en haut */}
      <Header />

      {/* Contenu dynamique (pages) */}
      <main className="main-content">
        <Outlet /> {/* Toutes les pages de l'application s'affichent ici */}
      </main>

      {/* Footer en bas */}
      <Footer />
    </div>
  );
};
