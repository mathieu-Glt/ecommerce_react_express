import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import type {
  RegisterFormData,
  RegisterProps,
} from "../../interfaces/regsiterProps.interface";
import "./register.css";
import { signUpValidationSchema } from "../../validators/validatorsFormRegister";
// Interface pour les données du formulaire
// export interface RegisterFormData {
//   firstname: string;
//   lastname: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   picture?: string;
//   address?: string;
// }

/**
 * RegisterForm with useFormik hook and Yup validation
 * Integrates with React Bootstrap styling
 */
const RegisterForm: React.FC<RegisterProps> = ({
  handleRegister,
  loading,
  error,
  validated,
}) => {
  // Initial form values
  const initialValues: RegisterFormData = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: "",
    address: "",
  };

  // Hook useFormik
  const formik = useFormik({
    initialValues,
    validationSchema: signUpValidationSchema,
    onSubmit: (values) => {
      // Préparer les données pour l'API (sans confirmPassword)
      const { confirmPassword, ...registerData } = values;
      handleRegister(registerData);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  console.log("Formik state:", {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    isValid: formik.isValid,
    dirty: formik.dirty,
  });

  return (
    <div className="register-form-wrapper">
      {/* Global error from API */}
      {error && (
        <Alert variant="danger" dismissible className="mb-3">
          <Alert.Heading>Registration Failed</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Form noValidate validated={validated} onSubmit={formik.handleSubmit}>
        {/* Firstname and Lastname */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formFirstname">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                placeholder="Enter first name"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.firstname && !!formik.errors.firstname
                }
                isValid={formik.touched.firstname && !formik.errors.firstname}
                disabled={loading}
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.firstname}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="formLastname">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                placeholder="Enter last name"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.lastname && !!formik.errors.lastname}
                isValid={formik.touched.lastname && !formik.errors.lastname}
                disabled={loading}
              />
              {formik.touched.lastname && formik.errors.lastname && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.lastname}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Email Field */}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email Address *</Form.Label>
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

        {/* Password Fields */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && !!formik.errors.password}
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
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password *</Form.Label>
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
          </Col>
        </Row>

        {/* Picture URL (optional) */}
        <Form.Group className="mb-3" controlId="formPicture">
          <Form.Label>Profile Picture URL (optional)</Form.Label>
          <Form.Control
            type="url"
            name="picture"
            placeholder="https://example.com/picture.jpg"
            value={formik.values.picture}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.picture && !!formik.errors.picture}
            isValid={formik.touched.picture && !formik.errors.picture}
            disabled={loading}
          />
          {formik.touched.picture && formik.errors.picture && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.picture}
            </Form.Control.Feedback>
          )}
          <Form.Text className="text-muted">
            Enter a URL to your profile picture (optional).
          </Form.Text>
        </Form.Group>

        {/* Address (optional) */}
        <Form.Group className="mb-3" controlId="formAddress">
          <Form.Label>Address (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="address"
            placeholder="Enter your address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.address && !!formik.errors.address}
            isValid={formik.touched.address && !formik.errors.address}
            disabled={loading}
          />
          {formik.touched.address && formik.errors.address && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.address}
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-muted">
            Already have an account?{" "}
            <a href="/login" className="text-primary">
              Sign in here
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default React.memo(RegisterForm);
