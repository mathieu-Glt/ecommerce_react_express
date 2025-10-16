import React, { useState } from "react";
import ForgotPasswordForm from "../components/form/ForgotPasswordForm";
import { useAuth } from "../hooks/useAuth";
import { useAppSelector } from "../hooks/useReduxHooks";

function ForgotPasswordPage() {
  const { forgotResetPassword } = useAuth();
  const { loading, error, success } = useAppSelector(
    (state) => state.forgotPassword
  );

  //   const [loading, error, success] = useAppSelector(
  //     (state) => state.forgotPassword
  //   );

  const handleForgotPassword = async (
    e: React.FormEvent,
    email: string
  ): Promise<void> => {
    e.preventDefault();
    // setLoading(true);
    // setLoading(false);
    const result = await forgotResetPassword(email);
    console.log("Login result:", result.payload);

    try {
    } catch (error) {
        console.error("Forgot password failed:", result.payload);
      //   setError(error as string);
    }
  };
  return (
    <div className="login-container">
      <h2>Forgot Password</h2>
      <div className="login-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <ForgotPasswordForm
        handleForgotPassword={handleForgotPassword}
        loading={loading}
        error={error}
        success={success}
      />
    </div>
  );
}

export default ForgotPasswordPage;
