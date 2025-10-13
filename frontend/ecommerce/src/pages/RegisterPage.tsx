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
    // console.log("Form values:", values);

    try {
      if (values.password !== values.confirmPassword) {
        setErrors({ success: false, error: "Passwords do not match" });
        setValidated(false);
        return;
      }
      // const result = await dispatch(registerUser(values));
      const result = await register(values);
      console.log("Registration result:", result);
      //
      // const result = await dispatch(registerUser(values));
      // console.log("Registration result:", result);

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
    <div className="register-container">
      <h2>Create an Account</h2>

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
  );
};
