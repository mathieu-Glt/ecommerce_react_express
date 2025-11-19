// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";

export const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Header at the top */}
      <Header />

      {/* Contenu dynamique (pages) */}
      <main className="main-content">
        <Outlet /> {/* All application pages are displayed here */}
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};
