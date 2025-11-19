import React from "react";
import { useFormik } from "formik";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import type {
  RegisterFormData,
  RegisterProps,
} from "../../interfaces/regsiterProps.interface";
import "./register.css";
import { signUpValidationSchema } from "../../validators/validatorsFormRegister";

/**
 * RegisterForm with useFormik hook and Yup validation
 * Integrates with React Bootstrap styling
 */
const RegisterForm: React.FC<RegisterProps> = ({
  handleRegister,
  loading,
  error,
  errors,
  validated,
}) => {
  // Initial form values
  const initialValues: RegisterFormData = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: null,
    address: "",
  };

  // Hook useFormik
  const formik = useFormik({
    initialValues,
    validationSchema: signUpValidationSchema,
    onSubmit: async (values, { setErrors, setFieldError }) => {
      try {
        // Prepare data for API (without confirmPassword)
        const { confirmPassword, ...registerData } = values;

        // Pass data directly with the File
        await handleRegister({
          ...values,
          confirmPassword: values.confirmPassword ?? "",
        });
      } catch (error: any) {
        // Handle backend errors
        if (error.response?.data?.errors) {
          // If the backend returns field-specific errors
          setErrors(error.response.data.errors);
        } else if (error.response?.data?.error) {
          // If it's a global error, display it on email (or another field)
          setFieldError("email", error.response.data.error);
        }
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Handler for file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("picture", file);
      formik.setFieldTouched("picture", true);
    } else {
      formik.setFieldValue("picture", null);
    }
  };

  return (
    <div className="register-form-wrapper">
      {/* Local error (errors) */}
      {errors && errors.error && (
        <Alert variant="danger" dismissible className="mb-3">
          <Alert.Heading>Registration Failed</Alert.Heading>
          <p>{errors.error}</p>
        </Alert>
      )}

      {/* Redux error (error) - fallback */}
      {!errors && error && (
        <Alert variant="danger" dismissible className="mb-3">
          <Alert.Heading>Registration Failed</Alert.Heading>
          <p>
            {typeof error === "string"
              ? error
              : (error as any).error || "An error occurred"}
          </p>
        </Alert>
      )}
      <Form
        noValidate
        validated={validated}
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
      >
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

        {/* Picture Upload */}
        <Form.Group className="mb-3" controlId="formPicture">
          <Form.Label>Profile Picture (optional)</Form.Label>
          <Form.Control
            type="file"
            name="picture"
            accept="image/*"
            onChange={handleFileChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.picture && !!formik.errors.picture}
            isValid={formik.touched.picture && !formik.errors.picture}
            disabled={loading}
          />
          {formik.values.picture && (
            <Form.Text className="text-success d-block mt-2">
              ✓ File selected: {(formik.values.picture as File).name}
            </Form.Text>
          )}
          {formik.touched.picture && formik.errors.picture && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.picture}
            </Form.Control.Feedback>
          )}
          <Form.Text className="text-muted">
            Upload your profile picture (JPEG, PNG, GIF, WebP - max 5MB).
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
