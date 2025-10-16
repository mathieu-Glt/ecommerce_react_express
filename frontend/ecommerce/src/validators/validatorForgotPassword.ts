import * as Yup from "yup";
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .matches(EMAIL_REGEX, "Invalid email format")
    .required("Email is required"),
});

export default forgotPasswordSchema;
export type ForgotPasswordFormValues = Yup.InferType<
  typeof forgotPasswordSchema
>;
