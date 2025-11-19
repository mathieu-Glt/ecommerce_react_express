import React, { useState } from "react";
import ForgotPasswordForm from "../components/form/ForgotPasswordForm";
import { useAuth } from "../hooks/useAuth";
import { useAppSelector } from "../hooks/useReduxHooks";

function ForgotPasswordPage() {
  const { forgotResetPassword } = useAuth();
  const { loading, error, success } = useAppSelector(
    (state) => state.forgotPassword
  );

  const handleForgotPassword = async (email: string): Promise<void> => {
    // setLoading(true);
    // setLoading(false);
    await forgotResetPassword(email);
  };
  return (
    <div className="login-container">
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
