import { Component, lazy, Suspense } from "react";
import { useRoutes, Navigate, replace } from "react-router-dom";
import { RequireAuthAccess } from "../guards/RequireAuthAccess";
import { MainLayout } from "./layout/MainLayout";
import { AdminLayout } from "./layout/AdminLayout";
import PageLoader from "../components/LoaderPage/PageLoader";
import React from "react";
import { RequireAdminRoleAccess } from "../guards/RequireAdminRoleAccess";
import create from "@ant-design/icons/lib/components/IconFont";

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
const PaypalSuccessPage = lazy(() =>
  import("../pages/PaypalSuccessPage").then((m) => ({
    default: m.default,
  }))
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
const MerciPagePaypal = lazy(() =>
  import("../pages/PaypalSuccessPage").then((m) => ({
    default: m.default,
  }))
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
    default: m.default,
  }))
);
const AdminProductEditPage = lazy(() =>
  import("../pages/backoffice/AdminProductEditPage").then((m) => ({
    default: m.default,
  }))
);

const AdminPageProducts = lazy(() =>
  import("../pages/backoffice/AdminPageProducts").then((m) => ({
    default: m.AdminProductPage,
  }))
);

const AdminCouponPage = lazy(() =>
  import("../pages/backoffice/AdminCouponPage").then((m) => ({
    default: m.AdminCouponPage,
  }))
);
const ProductDetailPage = lazy(() =>
  import("../pages/productDetailPage").then((m) => ({
    default: m.ProductDetailPage,
  }))
);
const ThankYouPaymentSuccess = lazy(() =>
  import("../pages/ThankYouPaymentSuccess").then((m) => ({
    default: m.default,
  }))
);

const FailedTransctionPaypal = lazy(() =>
  import("../pages/FailedTransctionPaypal").then((m) => ({
    default: m.default,
  }))
);

// ==================== ROUTES CONFIGURATION ====================
export const AppRoutes = () => {
  const routes = useRoutes([
    // ==================== ROUTES WITH HEADER + FOOTER ====================
    {
      element: React.createElement(
        // RequireAuthAccess,
        // null,
        // React.createElement(MainLayout)
        MainLayout
      ),
      children: [
        // PUBLIC ROUTES
        { path: "/", element: SuspenseWrapper(HomePage) },
        { path: "/products", element: SuspenseWrapper(ProductPage) },
        {
          path: "/products/:productId",
          element: SuspenseWrapper(ProductDetailPage),
        },
        { path: "/cart", element: SuspenseWrapper(CartPage) },
        {
          path: "/paypal/success",
          element: SuspenseWrapper(PaypalSuccessPage),
        },
        {
          path: "/cancel",
          element: SuspenseWrapper(FailedTransctionPaypal),
        },
        {
          path: "/order-confirmation",
          element: SuspenseWrapper(OrderConfirmationPage),
        },
        {
          path: "/merci",
          element: SuspenseWrapper(ThankYouPaymentSuccess),
        },
        {
          path: "/merci-paypal",
          element: SuspenseWrapper(MerciPagePaypal),
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

        { path: "/login", element: SuspenseWrapper(LoginPage) },
        { path: "/register", element: SuspenseWrapper(RegisterPage) },
      ],
    },

    // ==================== ADMIN ROUTES (Layout with RequireAdminRoleAccess) ====================
    {
      path: "/admin",
      element: React.createElement(
        RequireAdminRoleAccess,
        null,
        React.createElement(AdminLayout)
      ),
      children: [
        {
          path: "",
          element: React.createElement(Navigate, {
            to: "dashboard",
            replace: true,
          }),
        },
        {
          path: "dashboard",
          element: SuspenseWrapper(AdminDashboardPage),
        },
        {
          path: "products/create",
          element: SuspenseWrapper(AdminProductCreatePage),
        },
        {
          path: "products/edit/:id",
          element: SuspenseWrapper(AdminProductEditPage),
        },
        {
          path: "coupons",
          element: SuspenseWrapper(AdminCouponPage),
        },
        {
          path: "products",
          element: SuspenseWrapper(AdminPageProducts),
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
  LOGOUT: "/logout",
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    CREATE_PRODUCTS: "/admin/products/create",
    EDIT_PRODUCTS: "/admin/products/edit",
    LIST_PRODUCTS: "/admin/products",
    // CREATE_PRODUCT: "/admin/products/create",
    EDIT_PRODUCT: (id: string) => `/admin/products/edit/${id}`,
    COUPONS: "/admin/coupons",
  },
};
