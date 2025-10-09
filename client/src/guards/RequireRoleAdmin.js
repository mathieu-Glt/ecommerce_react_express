import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireRoleAdmin = ({ redirectTo = "/login" }) => {
  // Récupération utilisateur dans Redux
  const user = useSelector((state) => state.user?.user);
  const loading = useSelector((state) => state.user?.loading);

  console.log("RequireRoleAdmin - user:", user);

  // Si Redux est encore en cours de chargement
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>{" "}
          {/* UTILISER LE SPINNER lOADER */}
        </div>
        <p className="mt-2">Checking permissions...</p>
      </div>
    );
  }

  // Pas d'utilisateur connecté → redirection
  if (!user) {
    console.log("RequireRoleAdmin - No user, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // Vérification du rôle
  const userRole = user?.role || user?._doc?.role; // Support pour Mongoose et autres
  const isAdmin = userRole === "admin";

  if (!isAdmin) {
    console.log("RequireRoleAdmin - Access denied, role:", userRole);
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Access denied: You must have the "admin" role to access this page.
          <br />
          <strong>Your current role:</strong> {userRole}
        </div>
        <div className="mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => window.history.back()}
          >
            Retour
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </button>
        </div>
      </div>
    );
  }
  // Rôle admin confirmé
  return <Outlet />;
};

export default RequireRoleAdmin;
