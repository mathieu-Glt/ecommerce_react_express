import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import type { ExtractLoginResponse, User } from "../interfaces/user.interface";
import { loginUser } from "../redux/thunks/authThunk";
import LoginForm from "../components/form/LoginForm";
import { useState } from "react";
import { signInValidationSchema } from "../validators/validatorFormLogin";

export const LoginPage = () => {
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
  const [tokenStorage, setTokenStorage] = useLocalStorage<string | null>(
    "token",
    ""
  );
  const [refreshTokenStorage, setRefreshTokenStorage] = useLocalStorage<
    string | null
  >("refreshToken", "");

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        const { user, token, refreshToken } =
          result.payload as ExtractLoginResponse;

        setUserStorage(user);
        setTokenStorage(token);
        setRefreshTokenStorage(refreshToken);

        navigate("/dashboard");
      } else {
        console.error("Login failed:", result.payload);
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
    }
  };
  // Wrapper to match expected signature
  const handleLoginForm = async (
    values: { rememberMe?: boolean; email: string; password: string },
    formikHelpers?: any
  ) => {
    setValidated(true);
    const { email, password } = values;
    console.log("Form values:", values);
    await handleLogin(email, password);
  };

  return (
    <div className="login-container">
      <h1>Sign In</h1>
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
