import React from "react";
import PropTypes from "prop-types";
import { WindowsOutlined } from "@ant-design/icons";

const AzureLoginButton = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    className="btn btn-primary flex items-center justify-center gap-2"
    disabled={loading}
  >
    <WindowsOutlined />
    {loading ? "Connecting..." : "Login with Azure AD"}
  </button>
);

AzureLoginButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AzureLoginButton;
