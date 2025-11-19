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
// importe de cette façon dans le fichier routes/index.ts
// car pas "default" pour l'export de ce composant ({ default: m.LoginPage }))
export const RegisterPage = () => {
  const { register } = useAuth();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const [errors, setErrors] = useState<ErrorObject | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [validated, setValidated] = useState(false);
  const { setUserStorage } = useLocalStorage<User | null>("user", null);

  const handleRegister = async (values: RegisterFormData): Promise<void> => {
    setValidated(true);

    try {
      // Frontend validation of passwords
      if (values.password !== values.confirmPassword) {
        setErrors({ error: "Passwords do not match" });
        setValidated(false);
        return;
      }

      const result = await register(values);

      if (registerUser.fulfilled.match(result)) {
        const { user } = result.payload as ExtractRegisterResponse;
        setUserStorage(user);
        navigate("/login");
      } else {
        // ✅ ROBUST EXTRACTION: Try multiple possible paths to get error message
        let errorMessage = "Registration failed";

        // Path 1: result.payload.error (direct backend format)
        if (result.payload?.error) {
          errorMessage = result.payload.error;
        }
        // Path 2: result.payload.message
        else if (result.payload?.message) {
          errorMessage = result.payload.message;
        }
        // Path 3: result.payload is directly a string
        else if (typeof result.payload === "string") {
          errorMessage = result.payload;
        }
        // Path 4: result.error.message (Redux Toolkit)
        else if (result.error?.message) {
          errorMessage = result.error.message;
        }
        // Path 5: result.payload.data.error (nested axios response)
        else if ((result.payload as any)?.data?.error) {
          errorMessage = (result.payload as any).data.error;
        }

        setErrors({ error: errorMessage });
        setValidated(false);
      }
    } catch (err) {
      setErrors({
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
      setValidated(false);
    }
  };

  return (
    <div className="register-page-container">
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
            <h1 className="register-title">Create your account</h1>
            <p className="register-subtitle">Join us today!</p>
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
