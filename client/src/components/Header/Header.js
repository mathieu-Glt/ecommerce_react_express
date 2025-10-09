import React, { useState } from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserOutlined,
  LogoutOutlined,
  MailOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Navigation from "../Navigation/Navigation";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import Logout from "../Logout/Logout";
import { useSelector } from "react-redux";

function Header() {
  const [currentUrl, setCurrentUrl] = useState("/");
  const { user, userLocalStorage } = useUser();
  // Récupérer l'utilisateur Redux
  const reduxState = useSelector((state) => state);
  const reduxUser = reduxState?.user?.user;
  console.log("reduxUser", reduxUser);

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
  console.log("Header - user:", user);
  console.log("Header - userLocalStorage:", userLocalStorage);
  console.log("Header - reduxUser:", reduxUser);
  console.log("Header - authenticatedUser:", authenticatedUser);

  const handleClick = (e) => {
    setCurrentUrl(e.key);
  };

  const paths = [
    {
      label: <Link to="/">Home</Link>,
      key: "home",
      icon: <AppstoreOutlined />,
    },
    {
      // élément vide invisible pour pousser le suivant vers la droite
      label: <span style={{ flex: 1 }}></span>,
      key: "spacer",
      disabled: true,
    },

    // Afficher Register/Login seulement si l'utilisateur n'est pas connecté
    ...(!authenticatedUser
      ? [
          {
            label: <Link to="/register">Register</Link>,
            key: "register",
            icon: <UserAddOutlined />,
          },
          {
            label: <Link to="/login">Login</Link>,
            key: "login",
            icon: <UserOutlined />,
          },
          {
            label: <Link to="/products">Products</Link>,
            key: "products",
            icon: <ShoppingCartOutlined />,
          },
        ]
      : []),
    // Afficher le panier et logout seulement si l'utilisateur est connecté
    ...(authenticatedUser
      ? [
          {
            label: <Link to="/products">Products</Link>,
            key: "products",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: <Logout />,
            key: "logout",
            icon: <LogoutOutlined />,
          },
          // {
          //   label: <Link to="/admin">Test</Link>,
          //   key: "admin",
          //   icon: <SettingOutlined />,
          // },
          {
            label: <Link to="/shopping-cart">My shopping cart</Link>,
            key: "shopping-cart",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: <Link to="/test">Test</Link>,
            key: "test",
            icon: <SettingOutlined />,
          },
        ]
      : []),
    ...(authenticatedUser && reduxUser?._doc?.role.includes("admin")
      ? [
          {
            label: <Link to="/admin/dashboard">Admin Dashboard</Link>,
            key: "admin-dashboard",
            icon: <SettingOutlined />,
          },
          {
            label: <Link to="/admin/settings">Admin Settings</Link>,
            key: "admin-settings",
            icon: <SettingOutlined />,
          },
          {
            label: <Link to="/admin/category">Admin Category</Link>,
            key: "admin-category",
            icon: <SettingOutlined />,
          },
          {
            label: <Link to="/admin/coupons">Admin Coupons</Link>,
            key: "admin-coupons",
            icon: <SettingOutlined />,
          },
          {
            label: <Link to="/admin/products">Admin Product</Link>,
            key: "admin-product",
            icon: <SettingOutlined />,
          },
          {
            label: <Link to="/admin/users">Admin Users</Link>,
            key: "admin-users",
            icon: <SettingOutlined />,
          },
          {
            label: <Link to="/admin/sub">Admin Sub</Link>,
            key: "admin-sub",
            icon: <SettingOutlined />,
          },
          {
            label: <Link to="/admin/products">Admin Products</Link>,
            key: "admin-products",
            icon: <SettingOutlined />,
          },
        ]
      : []),
  ];

  return (
    <div>
      {/* Utiliser la navigation personnalisée au lieu d'Ant Design */}
      <Navigation
        paths={paths}
        authenticatedUser={authenticatedUser}
        user={user}
        handleClick={handleClick}
        currentUrl={currentUrl}
      />

      {/* Ancienne navigation Ant Design (commentée) */}
      {/* <Navigation
        handleClick={handleClick}
        currentUrl={currentUrl}
        paths={paths}
      /> */}
    </div>
  );
}

export default Header;
