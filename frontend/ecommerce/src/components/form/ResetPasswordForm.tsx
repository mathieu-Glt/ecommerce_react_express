import React from "react";
import "./forgotPassword.css";
import type { ForgotPasswordFormValues } from "../../validators/validatorForgotPassword";
import { useFormik } from "formik";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import type { ResetPasswordProps } from "../../interfaces/resetPassowrdProps";
import type { ResetPasswordFormValues } from "../../validators/validatorResetPassword";
import resetPasswordSchema from "../../validators/validatorResetPassword";

/**
 * ForgotPasswordForm with useFormik hook and Yup validation
 * Integrates with React Bootstrap styling
 */
const ResetPasswordForm: React.FC<ResetPasswordProps> = ({
  handleResetPassword,
  loading,
  error,
  success,
}) => {
  const initialValues: ResetPasswordFormValues = {
    password: "",
    confirmPassword: "",
  };

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, formikHelpers) => {
      // Appel du handler passé via props
      handleResetPassword(values.password, values.confirmPassword);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <div className="login-page-container">
      {/* Formes d'arrière-plan animées */}
      {/* <div className="login-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div> */}

      {/* Form card */}
      <div className="login-card-wrapper">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h1 className="login-title">Changez votre mot de passe</h1>
            <p className="login-subtitle">
              Entrez votre nouveau mot de passe pour le réinitialiser
            </p>
          </div>

          {/* Form */}
          <div className="login-form-wrapper">
            {error && (
              <Alert variant="danger" dismissible className="mb-3">
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-3">
                <Alert.Heading>Success</Alert.Heading>
                <p>{success}</p>
              </Alert>
            )}

            <Form noValidate onSubmit={formik.handleSubmit}>
              {/* Password Field */}
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.password && !!formik.errors.password
                  }
                  isValid={formik.touched.password && !formik.errors.password}
                  disabled={loading}
                  minLength={8}
                />
                {formik.touched.password && formik.errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.confirmPassword &&
                    !!formik.errors.confirmPassword
                  }
                  isValid={
                    formik.touched.confirmPassword &&
                    !formik.errors.confirmPassword
                  }
                  disabled={loading}
                  minLength={8}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.confirmPassword}
                    </Form.Control.Feedback>
                  )}
              </Form.Group>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={loading || !formik.isValid || !formik.dirty}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Sending...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ResetPasswordForm);
