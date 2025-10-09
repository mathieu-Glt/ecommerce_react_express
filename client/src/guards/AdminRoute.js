// https://reactrouter.com/home
// https://www.robinwieruch.de/react-router/
// https://cyberphinix.de/blog/react-router-7-protection/
// >https://dev.to/ra1nbow1/building-reliable-protected-routes-with-react-router-v7-1ka0
// https://medium.com/%40tessintaiwan/how-to-implement-route-guard-in-react-router-fe3cbae142b5

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// https://medium.com/%40sustiono19/how-to-create-a-protected-route-in-react-with-react-router-dom-v7-6680dae765fb
const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  if (!user || user.role !== "admin") {
    console.log(
      "AdminRoute - Redirection vers /login car l'utilisateur n'est pas admin"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log("AdminRoute - Utilisateur admin, affichage du contenu");
  return children;
};

export default AdminRoute;
