import React, { useState, useEffect } from "react";
import { useUserContext } from "../../context/userContext";
import useSessionManager from "../../hooks/useSessionManager";

/**
 * SessionExpiryModal Component
 *
 * Displays a warning modal when the user's session is about to expire
 * or has expired, with options to refresh the session or logout.
 */
const SessionModal: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(30);
  const { user } = useUserContext();
  const {
    sessionExpired,
    showWarning,
    timeUntilExpiry,
    refreshSession,
    forceLogout,
  } = useSessionManager();

  // Countdown timer for auto-logout
  useEffect(() => {
    if (!showWarning) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto logout after countdown reaches 0
      forceLogout();
    }
  }, [showWarning, countdown, forceLogout]);

  // Reset countdown when warning appears
  useEffect(() => {
    if (showWarning) {
      setCountdown(30);
    }
  }, [showWarning]);

  // Handle session refresh
  const handleRefreshSession = (): void => {
    refreshSession();
    setCountdown(30);
  };

  // Handle logout
  const handleLogout = (): void => {
    forceLogout();
  };

  // Format time remaining
  const formatTimeRemaining = (): string => {
    const minutes = Math.floor(timeUntilExpiry / 60);
    const seconds = (timeUntilExpiry % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Don't render if warning is not shown
  if (!showWarning) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{ zIndex: 9999 }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {sessionExpired ? "Session Expired" : "Session Expiring Soon"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleLogout}
                aria-label="Close"
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* User greeting */}
              <div className="alert alert-info mb-3">
                <p className="mb-0">
                  <strong>Hello {user?.firstname}!</strong>
                </p>
                <p className="mb-0 mt-2">
                  {sessionExpired
                    ? "Your session has expired. Would you like to stay connected?"
                    : "Your session will expire soon. Would you like to extend it?"}
                </p>
              </div>

              {/* Time display */}
              <div className="text-center mb-3">
                <i className="fas fa-clock fa-3x text-warning mb-2"></i>
                <h6>
                  {sessionExpired
                    ? `Auto-logout in ${countdown} seconds`
                    : `Session expires in ${formatTimeRemaining()}`}
                </h6>
              </div>

              {/* Progress bar */}
              <div className="progress mb-3" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{ width: `${(countdown / 30) * 100}%` }}
                  aria-valuenow={countdown}
                  aria-valuemin={0}
                  aria-valuemax={30}
                />
              </div>

              {/* Info message */}
              <div className="alert alert-warning mb-0">
                <small>
                  <i className="fas fa-info-circle me-1"></i>
                  {sessionExpired
                    ? "If you don't act, you'll be automatically logged out."
                    : "Sessions expire after 2 minutes of inactivity."}
                </small>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleRefreshSession}
              >
                <i className="fas fa-refresh me-2"></i>
                {sessionExpired ? "Restore Session" : "Continue Session"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 9998 }} />
    </>
  );
};

export default SessionModal;
