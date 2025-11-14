import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/userContext";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/index";
import SearchFilterDrawer from "./components/SearchFilterModal/SearchFilterModal";
import { FilterProvider, useFilter } from "./context/FilterSearchBarContext";
import { CartProvider } from "./context/cartContext";
import { fetchCsrfToken } from "./hooks/useApi";

function AppContent() {
  const { openBarFilter, toggleBarFilter, onSubmitSearchBar } = useFilter();

  // ✅ CORRECTION : Déplacer dans useEffect avec []
  useEffect(() => {
    fetchCsrfToken()
      .then(() => {
        console.log("✅ CSRF token fetched on app load");
        console.log("🍪 Cookies:", document.cookie);
      })
      .catch((error) => {
        console.error("❌ Error fetching CSRF token on app load:", error);
      });
  }, []); // ✅ Tableau vide - n'exécuter qu'UNE SEULE FOIS

  return (
    <>
      <AppRoutes />
      {openBarFilter && (
        <SearchFilterDrawer
          onClose={toggleBarFilter}
          onSubmit={onSubmitSearchBar ?? ((filters: any) => {})}
        />
      )}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <CartProvider>
        <FilterProvider>
          <BrowserRouter>
            <UserProvider>
              <AppContent />
            </UserProvider>
          </BrowserRouter>
        </FilterProvider>
      </CartProvider>
    </div>
  );
}

export default App;
