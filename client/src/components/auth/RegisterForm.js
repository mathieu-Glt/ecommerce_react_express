import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./RegisterForm.css";

const RegisterForm = ({
  onSubmit,
  loading,
  formData,
  errors,
  imagePreview,
  handleFieldChange,
  handleImageInputChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2>Create Account</h2>
        <p className="register-subtitle">
          Join us and start your shopping journey
        </p>

        <form onSubmit={onSubmit} className="register-form">
          {/* Prénom */}
          <div className="form-group">
            <label htmlFor="firstname">First Name *</label>
            <input
              type="text"
              id="firstname"
              value={formData.firstname}
              onChange={(e) => handleFieldChange("firstname", e.target.value)}
              className={errors.firstname ? "error" : ""}
              placeholder="Enter your first name"
              disabled={loading}
            />
            {errors.firstname && (
              <p className="error-message">{errors.firstname}</p>
            )}
          </div>

          {/* Nom */}
          <div className="form-group">
            <label htmlFor="lastname">Last Name *</label>
            <input
              type="text"
              id="lastname"
              value={formData.lastname}
              onChange={(e) => handleFieldChange("lastname", e.target.value)}
              className={errors.lastname ? "error" : ""}
              placeholder="Enter your last name"
              disabled={loading}
            />
            {errors.lastname && (
              <p className="error-message">{errors.lastname}</p>
            )}
          </div>

          {/* Adresse */}
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              className={errors.address ? "error" : ""}
              placeholder="Enter your address"
              disabled={loading}
            />
            {errors.address && (
              <p className="error-message">{errors.address}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          {/* Mot de passe */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                className={errors.password ? "error" : ""}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleFieldChange("confirmPassword", e.target.value)
                }
                className={errors.confirmPassword ? "error" : ""}
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Image de profil */}
          <div className="form-group">
            <label htmlFor="picture">Profile Picture</label>
            <input
              type="file"
              id="picture"
              accept="image/*"
              onChange={handleImageInputChange}
              className="file-input"
              disabled={loading}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            {errors.picture && (
              <p className="error-message">{errors.picture}</p>
            )}
            <small className="file-help">
              Supported formats: JPEG, PNG, GIF, WebP. Max size: 2MB
            </small>
          </div>

          {/* Bouton submit */}
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Lien login */}
        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  formData: PropTypes.shape({
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    address: PropTypes.string,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  imagePreview: PropTypes.string,
  handleFieldChange: PropTypes.func.isRequired,
  handleImageInputChange: PropTypes.func.isRequired,
};

export default RegisterForm;
