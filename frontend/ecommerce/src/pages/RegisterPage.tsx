import React, { useState } from "react";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { signUpValidationSchema } from "../../validators/validatorFormRegister";
import type { RegisterFormData } from "../interfaces/regsiterProps.interface";
import type { RegisterProps } from "../../interfaces/registerProps.interface";
import "./register.css";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/thunks/authThunk";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type {
  ExtractRegisterResponse,
  User,
} from "../interfaces/user.interface";
import RegisterForm from "../components/form/RegisterForm";

/**
 * RegisterForm with Formik and Yup validation
 * Integrates with React Bootstrap styling
 * @param props - Props including handleRegister, loading, error
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

  const initialValues: RegisterFormData = {
    firstname: "",
    lastname: "",
    email: "",
    picture: "",
    password: "",
    confirmPassword: "",
  };

  const handleRegister = async (
    values: RegisterFormData,
    formikHelpers?: any
  ): Promise<void> => {
    setValidated(true);
    console.log("Form values:", values);

    const result = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(result)) {
      const { user } = result.payload as ExtractRegisterResponse;
      navigate("/login");
    } else {
      console.error("Registration failed:", result.payload);
    }
  };

  return (
    <div className="register-container">
      <h2 className="mb-4">Create an Account</h2>
      <RegisterForm
        handleRegister={handleRegister}
        loading={loading}
        error={error}
        validated={validated}
      />
    </div>
  );
};
