// src/routes/index.js
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import Loadable from "./components/Loadable"; // SPINNER AU CHARGEMENT COMPOSANT
// Guards
import RequireAuth from "../guards/RequireAuth";
import RequireRoleAdmin from "../guards/RequireRoleAdmin";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import SettingsAdmin from "../pages/Admin/SettingsAdmin";
import AdminLayout from "./layout/AdminLayout";
import ResetForgotPassword from "../pages/auth/ResetForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import CategoryAdmin from "../pages/Admin/AdminCategory";
import CouponsAdmin from "../pages/Admin/AdminCoupons";
import ProductAdmin from "../pages/Admin/AdminProduct";
import ManageUsersApp from "../pages/Admin/ManageUsersApp";
import AdminSub from "../pages/Admin/AdminSub";
import EditCategory from "../pages/Admin/EditCategory";
import EditProduct from "../pages/Admin/EditProduct";
import EditUser from "../pages/Admin/EditUser";
import { UserProvider } from "../contexts/userContext";

// Authentication
const Register = Loadable(lazy(() => import("../pages/auth/Register")));
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const ForgotPassword = Loadable(
  lazy(() => import("../pages/auth/ForgotPassword"))
);

// Pages principales
const Home = Loadable(lazy(() => import("../pages/Home")));
const Products = Loadable(lazy(() => import("../pages/Products")));
const ProductDetail = Loadable(lazy(() => import("../pages/ProductDetail")));
const Cart = Loadable(lazy(() => import("../components/Cart/Cart")));
const ElementNotFound = Loadable(
  lazy(() => import("../components/404NotFound/HandleRouteNotFound"))
);

export default function AppRoutes() {
  return (
    <UserProvider>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/products" element={<Products />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path="/shopping-cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        {/* Route temporaire pour debug */}
        {/* <Route path="/session-test" element={<SessionTest />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Routes admin protégées par le guard RequireRoleAdmin */}
        <Route
          path="/admin/*"
          element={
            <RequireRoleAdmin>
              <AdminLayout />
            </RequireRoleAdmin>
          }
        >
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="category" element={<CategoryAdmin />} />
          <Route path="category/edit/:categoryId" element={<EditCategory />} />
          <Route path="coupons" element={<CouponsAdmin />} />
          <Route path="products" element={<ProductAdmin />} />
          <Route path="product/edit/:productId" element={<EditProduct />} />
          <Route path="users" element={<ManageUsersApp />} />
          <Route path="user/edit/:userId" element={<EditUser />} />
          <Route path="sub" element={<AdminSub />} />
        </Route>

        <Route path="*" element={<ElementNotFound />} />
      </Routes>
    </UserProvider>
  );
}
