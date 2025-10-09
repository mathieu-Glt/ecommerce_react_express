import React from "react";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { signInValidationSchema } from "../../validators/validatorFormLogin";
import type { SignInFormValues } from "../../validators/validatorFormLogin";
import type { LoginProps } from "../../interfaces/loginProps.interface";
import "./login.css";

/**
 * LoginForm with Formik and Yup validation
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

  console.log("Initial form values:", initialValues);

  return (
    <div className="login-form-wrapper">
      {/* Global error from API */}
      {error && (
        <Alert variant="danger" dismissible className="mb-3">
          <Alert.Heading>Login Failed</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={signInValidationSchema}
        onSubmit={handleLogin}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          errors,
          touched,
          isValid,
          dirty,
          values,
          handleChange,
          handleBlur,
        }) => {
          console.log("Formik state:", {
            values,
            errors,
            touched,
            isValid,
            dirty,
          });
          return (
            <FormikForm noValidate>
              {/* Email Field */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && !!errors.email}
                  isValid={touched.email && !errors.email}
                  disabled={loading}
                />
                <ErrorMessage name="email">
                  {(msg) => (
                    <Form.Control.Feedback type="invalid">
                      {msg}
                    </Form.Control.Feedback>
                  )}
                </ErrorMessage>
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
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && !!errors.password}
                  isValid={touched.password && !errors.password}
                  disabled={loading}
                  minLength={8}
                />
                <ErrorMessage name="password">
                  {(msg) => (
                    <Form.Control.Feedback type="invalid">
                      {msg}
                    </Form.Control.Feedback>
                  )}
                </ErrorMessage>
              </Form.Group>

              {/* Remember Me Checkbox */}
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  name="rememberMe"
                  label="Remember me"
                  checked={values.rememberMe}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={loading || !isValid || !dirty}
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
            </FormikForm>
          );
        }}
      </Formik>

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
  );
};
// React.memo to prevent unnecessary re-renders if props don't change
// REACT.memo wrapp compoennt LoginForm
export default React.memo(LoginForm);
