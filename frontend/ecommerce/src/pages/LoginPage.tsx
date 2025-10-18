import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import type { ExtractLoginResponse, User } from "../interfaces/user.interface";
import { loginUser } from "../redux/thunks/authThunk";
import LoginForm from "../components/form/LoginForm";
import { useState } from "react";
import { signInValidationSchema } from "../validators/validatorFormLogin";
import type { FormikHelpers } from "../interfaces/formikHelpers.interface";
import { useAuth } from "../hooks/useAuth";
export const LoginPage = () => {
  const { login } = useAuth();
  const { loading, error, user, token, refreshToken } = useAppSelector(
    (state) => state.auth
  );
  console.log("LoginPage - auth state:", {
    loading,
    error,
    user,
    token,
    refreshToken,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [validated, setValidated] = useState(false);
  const [userStorage, setUserStorage] = useLocalStorage<User | null>(
    "user",
    null
  );
  const [tokenStorage, setTokenStorage] = useLocalStorage<string>("token", "");
  const [refreshTokenStorage, setRefreshTokenStorage] = useLocalStorage<string>(
    "refreshToken",
    ""
  );
  const handleLogin = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<void> => {
    try {
      const result = await login(email, password);
      console.log("Login result:", result);

      // Vérifie directement le succès
      if (result.success) {
        if (rememberMe) {
          // Stocke dans le localStorage via useLocalStorage
          setUserStorage(result.results.user);
          setTokenStorage(result.results.token);
          setRefreshTokenStorage(result.results.refreshToken);
        }

        console.log(
          "Login successful:",
          result.results.user,
          result.results.token,
          result.results.refreshToken
        );

        navigate("/");
      } else {
        console.error("Login failed:", result);
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
    }
  };
  // Wrapper to match expected signature
  const handleLoginForm = async (
    values: { email: string; password: string; rememberMe: boolean },
    formikHelpers?: FormikHelpers<{ email: string; password: string }>
  ) => {
    setValidated(true);
    const { email, password, rememberMe } = values;
    console.log("Form values:", values);
    await handleLogin(email, password, rememberMe);
  };

  return (
    <div className="login-container">
      <div className="login-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <LoginForm
        handleLogin={handleLoginForm}
        loading={loading}
        formData={{ email: "", password: "" }}
        onFormDataChange={() => {}}
        onGoogleLogin={() => {
          console.log("Google login clicked");
        }}
        onAzureLogin={() => {
          console.log("Azure login clicked");
        }}
        error={
          typeof error === "string" || error === null
            ? error
            : JSON.stringify(error)
        }
        validated={validated}
      />
    </div>
  );
};
