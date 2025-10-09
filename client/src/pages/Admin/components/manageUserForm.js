import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function ManageUserForm({ onSubmit, initialData = {}, submitLabel }) {
  const [role, setRole] = useState(initialData.role || "user");
  const [isActive, setIsActive] = useState(initialData.isActive || false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRole(initialData.role || "user");
    setIsActive(initialData.isActive || false);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role.trim()) {
      setError("Role is required");
      return;
    }
    onSubmit({ role: role.trim(), isActive: isActive });
    setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Status</label>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isActive">
            Actif
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Rôle</label>
        <select
          className="form-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        {submitLabel || "Enregistrer"}
      </button>
    </form>
  );
}

ManageUserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    role: PropTypes.string,
    isActive: PropTypes.bool,
  }),
  submitLabel: PropTypes.string,
};

export default ManageUserForm;
