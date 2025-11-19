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
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const {
    token,
    refreshToken,
    setToken,
    setRefreshToken,
    setUserStorage,
    clearTokens,
  } = useLocalStorage();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [validated, setValidated] = useState(false);
  const handleLogin = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<void> => {
    try {
      const result = await login(email, password);

      // Directly check success property
      if (result.success) {
        if (rememberMe) {
          // Store in localStorage via useLocalStorage
          setUserStorage(result.results.user);
          setToken(result.results.token);
          setRefreshToken(result.results.refreshToken);
        }

        navigate("/");
      } else {
        console.error("Login failed:", result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };
  // Wrapper to match expected signature
  const handleLoginForm = async (
    values: { email: string; password: string; rememberMe: boolean },
    formikHelpers?: FormikHelpers<{ email: string; password: string }>
  ) => {
    setValidated(true);
    const { email, password, rememberMe } = values;
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
        onGoogleLogin={() => {}}
        onAzureLogin={() => {}}
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
