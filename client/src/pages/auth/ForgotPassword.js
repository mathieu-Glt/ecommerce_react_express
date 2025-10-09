import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    // URL de redirection - utiliser une URL par défaut si la variable d'environnement n'est pas définie
    const redirectUrl =
      process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL ||
      "http://localhost:3000/login";

    const config = {
      url: redirectUrl,
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, config);
      toast.success(`Password reset email sent to ${email}`);
      setEmail("");
      // Optionnel : rediriger vers login après quelques secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error sending password reset email:", error);

      // Gestion des erreurs Firebase spécifiques
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("No account found with this email address");
          break;
        case "auth/invalid-email":
          toast.error("Please enter a valid email address");
          break;
        case "auth/too-many-requests":
          toast.error("Too many requests. Please try again later");
          break;
        default:
          toast.error("Failed to send reset email. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Forgot Password</h1>
          <p className="text-muted">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Sending...
                </>
              ) : (
                "Send Reset Password Email"
              )}
            </button>
          </form>

          <div className="mt-3 text-center">
            <Link to="/login" className="text-decoration-none">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
