import { Navigate, Outlet } from "react-router-dom";

import { useUserContext } from "../../context/userContext";

interface PrivateRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  redirectPath = "/login",
}) => {
  const { isAuthenticated } = useUserContext();

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};
