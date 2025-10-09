import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "../../components/auth/LoginForm";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import useAuth from "../../hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "../../validator/validationLogin";
import {
  loginWithAzureAction,
  loginWithGoogleAction,
} from "../../actions/authActions";

function Login() {
  const { user: reduxUser } = useSelector((state) => state.user);
  const { user, loading, error, loginWithEmail, loginWithGoogle } = useAuth();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const location = useLocation();

  // Récupère la page demandée avant redirection
  const from = location.state?.from?.pathname || "/";
  console.log("from (login): ", from);

  useEffect(() => {
    console.log("Redux user: ", reduxUser);
  }, [reduxUser]);

  useEffect(() => {
    const email = user?.emailForRegistration;
    if (email) {
      setFormData({ email, password: "" });
    }
  }, [user]);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (data) => {
    try {
      await loginWithEmail(data.email, data.password, from);
      console.log("handleSubmit :", data);
    } catch (err) {
      console.error("Erreur de connexion:", err);
    }
  };

  // Gestionnaire de connexion Google
  const handleGoogleLogin = async () => {
    try {
      console.log("handleGoogleLogin from:", from);
      dispatch(loginWithGoogleAction(from));
    } catch (err) {
      console.error("Erreur de connexion Google:", err);
    }
  };

  // Gestionnaire de connexion Azure AD
  const handleAzureLogin = async () => {
    try {
      console.log("clic azure");
      console.log("handleAzureLogin from:", from);
      dispatch(loginWithAzureAction());
    } catch (error) {
      console.error("Erreur de connexion Azure:", error);
    }
  };

  return (
    <div className="login-page">
      {/* Formulaire de connexion avec style moderne */}
      <LoginForm
        onSubmit={handleSubmit}
        loading={loading}
        formData={formData}
        onFormDataChange={setFormData}
        onGoogleLogin={handleGoogleLogin}
        onAzureLogin={handleAzureLogin}
      />
    </div>
  );
}

export default Login;
