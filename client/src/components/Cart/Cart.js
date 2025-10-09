import React, { useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";

function Cart() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  console.log("user in Cart :: ", user);
  console.log("isAuthenticated in Cart :: ", isAuthenticated);

  // Rediriger vers la connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log("Utilisateur non connecté, redirection vers login");
      navigate("/login", { state: { from: "/cart" } });
    }
  }, [isAuthenticated, user, navigate]);

  // Afficher un message de chargement si l'utilisateur n'est pas encore chargé
  if (!isAuthenticated || !user) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>My Cart</h1>
      <p>Welcome {user?.firstname || user?.name || user?.email || "User"} !</p>
      <div className="alert alert-info">Your cart is empty for the moment.</div>

      {/* Debug info */}
      <div className="mt-4 p-3 bg-light rounded">
        <h6>Debug Info:</h6>
        <p>
          <strong>User ID:</strong> {user?._id || user?.uid || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "N/A"}
        </p>
        <p>
          <strong>Name:</strong> {user?.name || user?.firstname || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {user?.role || "N/A"}
        </p>
        <p>
          <strong>Profile:</strong> {JSON.stringify(user, null, 2)}
        </p>
      </div>
    </div>
  );
}

export default Cart;
