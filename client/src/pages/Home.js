import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  // Récupérer le nom de l'utilisateur depuis redux
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log("user in Home :: ", user);

  return (
    <div>
      <h1>
        Welcome to Our E-commerce
        {` ${user?.firstname || ""} !`}
      </h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}

export default Home;
