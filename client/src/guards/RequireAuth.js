import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loadable from "../routes/components/Loadable";
import { fetchCurrentUser } from "../actions/authActions";

const RequireAuth = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!user || !isAuthenticated) {
        const result = await dispatch(fetchCurrentUser());
        console.log(
          "RequireAuth - Résultat de la vérification de l'utilisateur:",
          result.data
        );
        if (!result.success) {
          console.log("RequireAuth - Pas d'utilisateur trouvé");
        }
      }
      setCheckingAuth(false);
    };

    verifyUser();
  }, [dispatch, user, isAuthenticated]);

  if (loading || checkingAuth) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <Loadable />
          <p className="mt-2">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log(
      "RequireAuth - Redirection vers /login car pas d'utilisateur authentifié"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("RequireAuth - Utilisateur authentifié, affichage du contenu");
  return children;
};

export default RequireAuth;
