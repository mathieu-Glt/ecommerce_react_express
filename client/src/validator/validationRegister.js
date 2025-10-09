import * as Yup from "yup";

export const validationRegisterSchema = Yup.object().shape({
  firstname: Yup.string().required("The firstname is required"),
  lastname: Yup.string().required("The lastname is required"),
  address: Yup.string().required("The address is required"),
  email: Yup.string().email("Email invalid").required("The email is required"),
  password: Yup.string()
    .min(8, "The password must be at least 8 characters")
    .required("The password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});
