import React from "react";
import { GoogleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

/**
 * Composant bouton de connexion Google
 */

const GoogleLoginButton = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    className="btn btn-danger flex items-center justify-center gap-2"
    disabled={loading}
  >
    <GoogleOutlined />
    {loading ? "Connecting..." : "Login with Google"}
  </button>
);

export default GoogleLoginButton;

GoogleLoginButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
