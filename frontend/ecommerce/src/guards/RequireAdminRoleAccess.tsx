import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import React from "react";
import PageLoader from "../components/LoaderPage/PageLoader";

interface RequireAdminRoleAccessProps {
  children: React.ReactNode;
}

export const RequireAdminRoleAccess: React.FC<RequireAdminRoleAccessProps> = ({
  children,
}) => {
  const { user, isAuthenticated, loading } = useUserContext();

  // Wait loading state
  if (loading) {
    return <PageLoader />;
  }

  // Not authenticated → Redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  // Not admin → Redirect to home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
