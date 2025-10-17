import { useAuth } from "../hooks/useAuth";
import { useAppSelector } from "../hooks/useReduxHooks";
import ResetPasswordForm from "../components/form/resetPasswordForm";
import { useParams } from "react-router-dom";

function ResetPasswordPage() {
  const params = useParams();
  const { resetPasswordAuth } = useAuth();
  const { loading, error, success } = useAppSelector(
    (state) => state.forgotPassword
  );

  const handleResetPassword = async (
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    const datas = {
      password,
      confirmPassword,
      token: params?.token ?? "",
    };

    console.log("ResetPasswordPage datas:", datas);

    try {
      await resetPasswordAuth(datas);
    } catch (error) {
      console.error("Forgot password failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <ResetPasswordForm
        handleResetPassword={handleResetPassword} //Formik enverra les valeurs ici
        loading={loading}
        error={error}
        success={success}
      />
    </div>
  );
}

export default ResetPasswordPage;
