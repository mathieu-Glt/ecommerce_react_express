import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/thunks/authThunk";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "../hooks/useAuth";
import type {
  ExtractRegisterResponse,
  User,
} from "../interfaces/user.interface";
import RegisterForm from "../components/form/RegisterForm";
import type { RegisterFormData } from "../interfaces/regsiterProps.interface";
import type { ErrorObject } from "../interfaces/regsiterProps.interface";

export const RegisterPage = () => {
  const { register } = useAuth();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const [errors, setErrors] = useState<ErrorObject | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [validated, setValidated] = useState(false);
  const [userStorage, setUserStorage] = useLocalStorage<User | null>(
    "user",
    null
  );

  const handleRegister = async (values: RegisterFormData): Promise<void> => {
    console.log("Starting registration with values:", values);
    setValidated(true);

    try {
      if (values.password !== values.confirmPassword) {
        setErrors({ success: false, error: "Passwords do not match" });
        setValidated(false);
        return;
      }

      const result = await register(values);
      console.log("Registration result:", result);

      if (registerUser.fulfilled.match(result)) {
        const { user } = result.payload as ExtractRegisterResponse;
        setUserStorage(user);
        navigate("/login");
      } else {
        const errorPayload = result.payload?.error;
        setErrors(
          typeof errorPayload === "string"
            ? { message: errorPayload }
            : errorPayload || { message: "Registration failed" }
        );
        setValidated(false);
      }
    } catch (err) {
      console.error("Unexpected error during registration:", err);
    }
  };

  return (
    <div className="register-page-container">
      {/* Formes d'arrière-plan animées */}
      <div className="register-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Card de register */}
      <div className="register-card-wrapper">
        <div className="register-card">
          {/* Header avec logo */}
          <div className="register-header">
            <div className="register-logo">
              {/* Icône de création de compte - utilisez Bootstrap Icons */}
              <i className="bi bi-person-plus-fill"></i>
            </div>
            <h1 className="register-title">Créez votre compte</h1>
            <p className="register-subtitle">
              Rejoignez-nous dès aujourd'hui !
            </p>
          </div>

          {/* Formulaire d'inscription */}
          <RegisterForm
            errors={errors}
            handleRegister={handleRegister}
            loading={loading}
            error={
              typeof error === "object" || error === null
                ? error
                : JSON.stringify(error)
            }
            validated={validated}
          />
        </div>

        {/* Ombre décorative */}
        <div className="register-card-shadow"></div>
      </div>
    </div>
  );
};
