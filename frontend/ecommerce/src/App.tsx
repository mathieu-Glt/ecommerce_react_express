import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/userContext";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/index";
import SearchFilterModal from "./components/SearchFilterModal/SearchFilterModal";
import { FilterProvider, useFilter } from "./context/FilterSearchBarContext";
import SearchFilterDrawer from "./components/SearchFilterModal/SearchFilterModal";

function AppContent() {
  const { openBarFilter, toggleBarFilter, onSubmitSearchBar  } =
    useFilter()

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
      <FilterProvider>
        <BrowserRouter>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </BrowserRouter>
      </FilterProvider>
    </div>
  );
}

export default App;
