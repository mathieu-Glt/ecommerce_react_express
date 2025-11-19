import React from "react";
import { useFormik } from "formik";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { signInValidationSchema } from "../../validators/validatorFormLogin";
import type { SignInFormValues } from "../../validators/validatorFormLogin";
import type { LoginProps } from "../../interfaces/loginProps.interface";
import "./login.css";

/**
 * LoginForm with useFormik hook and Yup validation
 * Integrates with React Bootstrap styling
 * @param props - Props including handleLogin, loading, error
 */
const LoginForm: React.FC<LoginProps> = ({
  handleLogin,
  loading,
  error,
  onGoogleLogin,
  onAzureLogin,
}) => {
  // Initial form values
  const initialValues: SignInFormValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  // Using the useFormik hook instead of the Formik component
  const formik = useFormik({
    initialValues,
    validationSchema: signInValidationSchema,
    onSubmit: handleLogin,
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <div className="login-page-container">
      <div className="login-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Card de login */}
      <div className="login-card-wrapper">
        <div className="login-card">
          {/* Header with logo */}
          <div className="login-header">
            <div className="login-logo">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h1 className="login-title">Welcome!</h1>
            <p className="login-subtitle">Log in to your account</p>
          </div>

          {/* Login form */}
          <div className="login-form-wrapper">
            {/* Global error from API */}
            {error && (
              <Alert variant="danger" dismissible className="mb-3">
                <Alert.Heading>Login Error</Alert.Heading>
                <p>{error}</p>
              </Alert>
            )}

            <Form noValidate onSubmit={formik.handleSubmit}>
              {/* Email Field */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                  isValid={formik.touched.email && !formik.errors.email}
                  disabled={loading}
                />
                {formik.touched.email && formik.errors.email && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                )}
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
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

              {/* Remember Me Checkbox */}
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  name="rememberMe"
                  label="Remember me"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  disabled={loading}
                />
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
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center mb-3">
                <a href="/forgot-password" className="text-muted">
                  Forgot password?
                </a>
              </div>
            </Form>

            {/* OAuth Options */}
            {(typeof onGoogleLogin === "function" ||
              typeof onAzureLogin === "function") && (
              <>
                <div className="divider my-4">
                  <span className="divider-text">OR</span>
                </div>

                <div className="oauth-buttons">
                  {onGoogleLogin && (
                    <Button
                      variant="outline-secondary"
                      className="w-100 mb-2"
                      onClick={onGoogleLogin}
                      disabled={loading}
                    >
                      <i className="bi bi-google me-2"></i>
                      Continue with Google
                    </Button>
                  )}

                  {onAzureLogin && (
                    <Button
                      variant="outline-secondary"
                      className="w-100"
                      onClick={onAzureLogin}
                      disabled={loading}
                    >
                      <i className="bi bi-microsoft me-2"></i>
                      Continue with Azure
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* Register Link */}
            <div className="text-center mt-4">
              <p className="text-muted">
                Don't have an account?{" "}
                <a href="/register" className="text-primary">
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Ombre décorative */}
        <div className="login-card-shadow"></div>
      </div>
    </div>
  );
};

// React.memo to prevent unnecessary re-renders if props don't change
export default React.memo(LoginForm);
