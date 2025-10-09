import React from "react";
import { useSelector } from "react-redux";

function SettingsAdmin() {
  const { user } = useSelector((state) => state.user);
  console.log("user in Dashboard :: ", user);

  return (
    <div>
      <h1>
        Welcome to the admin settings {user ? `${user.firstname} !` : "Site!"}
      </h1>
    </div>
  );
}

export default SettingsAdmin;
