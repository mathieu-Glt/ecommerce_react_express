import React from "react";
import { useSelector } from "react-redux";

function DashboardAdmin() {
  // Récupérer le nom de l'utilisateur depuis redux
  const { user } = useSelector((state) => state.user);
  console.log("user in Dashboard :: ", user);

  return (
    <div>
      <h1>
        Welcome to the admin dashboard {user ? `${user.firstname} !` : "Site!"}
      </h1>
      <p>Welcome to the admin dashboard!</p>
    </div>
  );
}

export default DashboardAdmin;
