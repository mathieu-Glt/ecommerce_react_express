import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/userContext";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/index";
function App() {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
