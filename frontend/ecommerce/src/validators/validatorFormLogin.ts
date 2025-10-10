import * as Yup from "yup";
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const signInValidationSchema = Yup.object().shape({
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
  rememberMe: Yup.boolean(),
});

export type SignInFormValues = Yup.InferType<typeof signInValidationSchema>;
