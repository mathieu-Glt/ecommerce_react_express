import { Component, lazy, Suspense } from "react";
import { useRoutes, Navigate, replace } from "react-router-dom";
import { RequireAuthAccess } from "../guards/RequireAuthAccess";
import { MainLayout } from "./layout/MainLayout";
import { AdminLayout } from "./layout/AdminLayout";
import PageLoader from "../components/LoaderPage/PageLoader";
import React from "react";

// ==================== SUSPENSE WRAPPER ====================
export function SuspenseWrapper(Component: React.ComponentType<any>) {
  return React.createElement(
    Suspense,
    { fallback: React.createElement(PageLoader) },
    React.createElement(Component)
  );
}

// ==================== PUBLIC PAGES ====================
const HomePage = lazy(() =>
  import("../pages/HomePage").then((m) => ({ default: m.HomePage }))
);
const ProductPage = lazy(() =>
  import("../pages/ProductPage").then((m) => ({ default: m.ProductPage }))
);
const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("../pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const CartPage = lazy(() =>
  import("../pages/CartPage").then((m) => ({ default: m.CartPage }))
);
const OrderConfirmationPage = lazy(() =>
  import("../pages/OrderConfirmationPage").then((m) => ({ default: m.default }))
);
const NotFoundPage = lazy(() =>
  import("../services/utils/NotFoundPage").then((m) => ({ default: m.default }))
);
const ForgotPasswordPage = lazy(() =>
  import("../pages/ForgotPasswordPage").then((m) => ({ default: m.default }))
);

const ResetPasswordPage = lazy(() =>
  import("../pages/ResetPasswordPage").then((m) => ({ default: m.default }))
);

// ==================== PROTECTED PAGES (USER) ====================
const UserProfilePage = lazy(() =>
  import("../pages/UserProfilePage").then((m) => ({ default: m.default }))
);

// ==================== ADMIN PAGES ====================
const AdminDashboardPage = lazy(() =>
  import("../pages/backoffice/AdminDashboardPage").then((m) => ({
    default: m.default,
  }))
);
const AdminProductCreatePage = lazy(() =>
  import("../pages/backoffice/AdminProductCreatePage").then((m) => ({
    default: m.AdminProductPage,
  }))
);
const AdminCouponPage = lazy(() =>
  import("../pages/backoffice/AdminCouponPage").then((m) => ({
    default: m.AdminCouponPage,
  }))
);

// ==================== ROUTES CONFIGURATION ====================
export const AppRoutes = () => {
  const routes = useRoutes([
    // ==================== ROUTES AVEC HEADER + FOOTER ====================
    {
      element: React.createElement(MainLayout),
      children: [
        // PUBLIC ROUTES
        { path: "/", element: SuspenseWrapper(HomePage) },
        { path: "/products/:id", element: SuspenseWrapper(ProductPage) },
        { path: "/cart", element: SuspenseWrapper(CartPage) },
        {
          path: "/order-confirmation",
          element: SuspenseWrapper(OrderConfirmationPage),
        },

        // USER ROUTES (Protégées par RequireAuthAccess)
        {
          path: "/profile",
          element: React.createElement(
            RequireAuthAccess,
            null,
            SuspenseWrapper(UserProfilePage)
          ),
        },
        {
          path: "/forgot-password",
          element: SuspenseWrapper(ForgotPasswordPage),
        },
        {
          path: "/reset-password/:token",
          element: SuspenseWrapper(ResetPasswordPage),
        },

        // ==================== ROUTES SANS HEADER/FOOTER (Auth) ====================
        { path: "/login", element: SuspenseWrapper(LoginPage) },
        { path: "/register", element: SuspenseWrapper(RegisterPage) },
      ],
    },

    // ==================== ADMIN ROUTES (Layout avec RequireAdminRoleAccess) ====================
    {
      path: "/admin",
      element: React.createElement(AdminLayout),
      children: [
        {
          path: "",
          element: React.createElement(Navigate, {
            to: "/admin/dashboard",
            replace: true,
          }),
        },
        {
          path: "dashboard",
          element: SuspenseWrapper(AdminDashboardPage),
        },
        {
          path: "products",
          element: SuspenseWrapper(AdminProductCreatePage),
        },
        {
          path: "coupons",
          element: SuspenseWrapper(AdminCouponPage),
        },
      ],
    },

    // ==================== NOT FOUND ====================
    { path: "*", element: SuspenseWrapper(NotFoundPage) },
  ]);

  return routes;
};

// ==================== URL ROUTES APP ====================
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  LOGIN: "/login",
  REGISTER: "/register",
  CART: "/cart",
  ORDER_CONFIRMATION: "/order-confirmation",
  PROFILE: "/profile",
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    PRODUCTS: "/admin/products",
    COUPONS: "/admin/coupons",
  },
};
