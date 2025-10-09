import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  DashboardOutlined,
  SettingOutlined,
  ShopOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Logout from "../../components/Logout/Logout";
import useLocalStorage from "../../hooks/useLocalStorage";

const adminId =
  process.env.REACT_APP_APP_ID_USER_ADMIN || "LDP6PxtauQMAz9eVTSxpUrTrAEm1";
function AdminLayout() {
  const [user, setUser, removeUser, clearAll, hasUser] = useLocalStorage(
    "user",
    null
  );

  console.log("user: ", user?.uid);
  console.log("adminId: ", adminId);

  const paths = [
    {
      label: "Dashboard",
      to: "/admin/dashboard",
      icon: <DashboardOutlined />,
    },
    {
      label: "Settings",
      to: "/admin/settings",
      icon: <SettingOutlined />,
    },
    {
      label: "Products",
      to: "/admin/products",
      icon: <ShopOutlined />,
    },
    {
      label: "Logout",
      to: "/logout",
      icon: <LogoutOutlined />,
      component: <Logout />,
    },
    // Condition d’affichage avec includes
    ...(user?.uid === adminId
      ? [
          {
            label: "Test",
            to: "/admin/test",
            icon: <UserOutlined />,
          },
        ]
      : []),
  ];

  console.log("paths: ", paths);

  return (
    <div className="admin-layout">
      <header className="admin-header bg-dark text-white p-3 d-flex align-items-center">
        <h1 className="me-4">Admin Panel</h1>
        <nav className="d-flex gap-3">
          {paths.map((item) => (
            <span key={item.label}>
              {item.component ? (
                item.component
              ) : (
                <Link to={item.to} className="text-white">
                  {item.icon} {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
