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
  let fetchCount = 0;
  // useEffect(() => {
  //   fetchCount++;
  //   fetchCsrfToken()
  //     .then((token) => {
  //     })
  //     .catch((error) => {
  //     });
  // }, []);

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
