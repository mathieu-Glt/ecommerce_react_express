import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/thunks/authThunk";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type {
  ExtractRegisterResponse,
  User,
} from "../interfaces/user.interface";
import RegisterForm from "../components/form/RegisterForm";
import type { RegisterFormData } from "../interfaces/regsiterProps.interface";

/**
 * RegisterPage component
 * Handles user registration flow
 */
export const RegisterPage = () => {
  const { loading, error, user } = useAppSelector((state) => state.auth);
  console.log("RegisterPage - auth state:", { loading, error, user });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [validated, setValidated] = useState(false);
  const [userStorage, setUserStorage] = useLocalStorage<User | null>(
    "user",
    null
  );
  const [formData, setFormData] = useState<RegisterFormData>({
    // Initialize with default values as per RegisterFormData interface
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: "",
    address: "",
  });

  const handleRegister = async (values: RegisterFormData): Promise<void> => {
    setValidated(true);
    console.log("Form values:", values);

    // Ensure 'picture' is always a string
    const safeValues = {
      ...values,
      picture: values.picture ?? "",
    };

    try {
      const result = await dispatch(registerUser(safeValues));

      if (registerUser.fulfilled.match(result)) {
        const { user } = result.payload as ExtractRegisterResponse;
        setUserStorage(user);

        // Rediriger vers la page de login après inscription réussie
        navigate("/login");
      } else {
        console.error("Registration failed:", result.payload);
      }
    } catch (err) {
      console.error("Unexpected error during registration:", err);
    }
  };

  const handleFormDataChange = (updatedData: Partial<RegisterFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <RegisterForm
        handleRegister={handleRegister}
        loading={loading}
        error={
          typeof error === "string" || error === null
            ? error
            : JSON.stringify(error)
        }
        validated={validated}
        formData={formData}
        onFormDataChange={handleFormDataChange}
      />
    </div>
  );
};
