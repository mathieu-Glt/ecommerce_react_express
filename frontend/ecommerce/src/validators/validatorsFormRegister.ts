import * as Yup from "yup";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
/**
 * Validation schema for registration form
 */
export const signUpValidationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),

  lastname: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .matches(EMAIL_REGEX, "Email format is invalid")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      PASSWORD_REGEX,
      "Password must contain uppercase, lowercase, number and special character"
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),

  picture: Yup.string().url("Must be a valid URL").optional(),

  address: Yup.string()
    .max(200, "Address must not exceed 200 characters")
    .optional(),
});

export type RegisterFormValues = Yup.InferType<typeof signUpValidationSchema>;
