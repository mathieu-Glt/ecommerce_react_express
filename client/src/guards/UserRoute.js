import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// https://medium.com/%40sustiono19/how-to-create-a-protected-route-in-react-with-react-router-dom-v7-6680dae765fb
const UserRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  if (!user || user.role !== "user") {
    console.log(
      "UserRoute - Redirection vers /login car l'utilisateur n'est pas admin"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log("UserRoute - Utilisateur admin, affichage du contenu");
  return children;
};

export default UserRoute;

/**
 * Utiliser ce middleware comme ceic  ds index.js du dossier Routes
 *  <Route
        path="/admin/dashboard"
        element={
            <AdminRoute>
                <Dashboard />
            </AdminRoute>
         }
    />

 */
