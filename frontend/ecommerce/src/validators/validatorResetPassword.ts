import * as Yup from "yup";
// password reset regex pattern
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      PASSWORD_REGEX,
      "Password must contain uppercase, lowercase, number and special character"
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .min(8, "ConfirmPassword must be at least 8 characters")
    .matches(
      PASSWORD_REGEX,
      "ConfirmPassword must contain uppercase, lowercase, number and special character"
    )
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("ConfirmPassword is required"),
});

export default resetPasswordSchema;
export type ResetPasswordFormValues = Yup.InferType<typeof resetPasswordSchema>;
