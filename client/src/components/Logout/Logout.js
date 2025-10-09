import React from "react";
import { useUser } from "../../contexts/userContext";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../hooks/useToast";
// import { clearAuthData } from "../../utils/auth";
import useAuth from "../../hooks/useAuth";

const Logout = () => {
  const { user, userLocalStorage } = useUser();
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const reduxUser = reduxState?.user?.user;
  const { auth: authMessages, showError, showSuccess } = useToast();

  // Utiliser Redux comme source principale d'authentification
  // Vérifier que l'utilisateur a des données réelles (pas un objet vide)
  const hasValidUser = (userData) => {
    return (
      userData &&
      typeof userData === "object" &&
      Object.keys(userData).length > 0
    );
  };

  const authenticatedUser =
    hasValidUser(reduxUser) ||
    hasValidUser(userLocalStorage) ||
    hasValidUser(user);

  console.log("Logout component - user:", user);
  console.log("Logout component - userLocalStorage:", userLocalStorage);
  console.log("Logout component - reduxUser:", reduxUser);
  console.log("Logout component - authenticatedUser:", authenticatedUser);

  const handleLogout = () => {
    try {
      // Appeler la fonction logout du UserContext
      // (elle fait déjà auth.signOut() et nettoie le localStorage)
      logout();

      // Nettoyer le state Redux
      dispatch({ type: "LOGOUT", payload: null });
      // clearAuthData();
      // Afficher un message de succès avec le hook useToast
      showSuccess(authMessages.logoutSuccess);
      // La redirection sera gérée automatiquement par RequireAuth
      // quand l'utilisateur sera déconnecté
    } catch (error) {
      console.error("Error in logout:", error);
      showError("Error in logout");
    }
  };

  // Si l'utilisateur n'est pas connecté, ne pas afficher le bouton
  if (!authenticatedUser) {
    return null;
  }

  return (
    <button
      onClick={handleLogout}
      className="btn btn-outline-danger"
      style={{ marginLeft: "10px" }}
    >
      <i className="fas fa-sign-out-alt"></i> Déconnexion
    </button>
  );
};

export default Logout;
