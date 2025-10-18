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
  const [userStorage, setUserStorage] = useLocalStorage<User | null>(
    "user",
    null
  );

  const handleRegister = async (values: RegisterFormData): Promise<void> => {
    console.log("Starting registration with values:", values);
    setValidated(true);

    try {
      // Validation frontend des mots de passe
      if (values.password !== values.confirmPassword) {
        setErrors({ error: "Passwords do not match" });
        setValidated(false);
        return;
      }

      const result = await register(values);
      console.log("Registration result:", result);

      // 🔍 DEBUG : Logger pour comprendre la structure
      console.log("Result payload:", result.payload);
      console.log("Result error:", result.error);
      console.log("Full result:", JSON.stringify(result, null, 2));

      if (registerUser.fulfilled.match(result)) {
        const { user } = result.payload as ExtractRegisterResponse;
        setUserStorage(user);
        navigate("/login");
      } else {
        // ✅ EXTRACTION ROBUSTE : Essayer plusieurs chemins possibles
        let errorMessage = "Registration failed";

        // Chemin 1 : result.payload.error (format backend direct)
        if (result.payload?.error) {
          errorMessage = result.payload.error;
        }
        // Chemin 2 : result.payload.message
        else if (result.payload?.message) {
          errorMessage = result.payload.message;
        }
        // Chemin 3 : result.payload est directement une string
        else if (typeof result.payload === "string") {
          errorMessage = result.payload;
        }
        // Chemin 4 : result.error.message (Redux Toolkit)
        else if (result.error?.message) {
          errorMessage = result.error.message;
        }
        // Chemin 5 : result.payload.data.error (réponse axios imbriquée)
        else if ((result.payload as any)?.data?.error) {
          errorMessage = (result.payload as any).data.error;
        }

        console.log("Extracted error message:", errorMessage);

        setErrors({ error: errorMessage });
        setValidated(false);
      }
    } catch (err) {
      console.error("Unexpected error during registration:", err);
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
