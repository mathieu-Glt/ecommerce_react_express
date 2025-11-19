import React from "react";
import "./forgotPassword.css";
import type { ForgotPasswordProps } from "../../interfaces/forgotPasswordProps";
import type { ForgotPasswordFormValues } from "../../validators/validatorForgotPassword";
import { useFormik } from "formik";
import forgotPasswordSchema from "../../validators/validatorForgotPassword";
import { Alert, Button, Form, Spinner } from "react-bootstrap";

/**
 * ForgotPasswordForm with useFormik hook and Yup validation
 * Integrates with React Bootstrap styling
 */
const ForgotPasswordForm: React.FC<ForgotPasswordProps> = ({
  handleForgotPassword,
  loading,
  error,
  success,
}) => {
  const initialValues: ForgotPasswordFormValues = { email: "" };

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, formikHelpers) => {
      // Appel du handler passé via props
      handleForgotPassword(values.email);
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

      {/* Card du formulaire */}
      <div className="login-card-wrapper">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h1 className="login-title">Forgot password</h1>
            <p className="login-subtitle">
              Enter your email to reset your password
            </p>
          </div>

          {/* Formulaire */}
          <div className="login-form-wrapper">
            {error && (
              <Alert variant="danger" dismissible className="mb-3">
                <Alert.Heading>Erreur</Alert.Heading>
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
              {/* Email Field */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
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
                  We will never share your email.
                </Form.Text>
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

export default React.memo(ForgotPasswordForm);
