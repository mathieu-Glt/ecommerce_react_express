import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { ToastContainer } from "react-toastify";
import { UserProvider, useUser } from "./contexts/userContext";
import { useSelector } from "react-redux";
import AppRoutes from "./routes";
import SessionExpiryModal from "./components/SessionExpiryModal";
import AdminLayout from "./routes/layout/AdminLayout";
// import { currentUser } from "./api/auth";

function App() {
  const { token } = useSelector((state) => state.user);
  console.log("token: ", token);
  const [userRole, setUserRole] = useState(null);
  console.log("userRole: ", userRole);
  // Récupérer le rôle de l'utilisateur pour afficher le layout admin ou non
  // React.useEffect(() => {
  //   if (token) {
  //     currentUser(token)
  //       .then((roleUser) => {
  //         console.log("roleUser resolved: ", roleUser);
  //         setUserRole(roleUser);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching user role:", err);
  //         setUserRole(null);
  //       });
  //   }
  // }, [token]);

  return (
    <div className="App">
      <ToastContainer />
      <UserProvider>
        <Router>
          {/* Afficher le layout correspondant au rôle de l'utilisateur */}
          {userRole?.data?.role === "admin" ? (
            <AdminLayout />
          ) : (
            <>
              <Header />
            </>
          )}
          <AppRoutes /> {/* toutes les routes de l'application sont ici */}
          <SessionExpiryModal /> {/* Modal de gestion de session */}
        </Router>
      </UserProvider>
      <Footer />
    </div>
  );
}

export default App;
