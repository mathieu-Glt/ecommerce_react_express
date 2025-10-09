import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/userContext";
import useSessionManager from "../hooks/useSessionManager";
import { useSelector } from "react-redux";

function SessionExpiryModal() {
  const [countdown, setCountdown] = useState(30);
  const { user } = useSelector((state) => state.user);
  const {
    sessionExpired,
    showWarning,
    timeUntilExpiry,
    refreshSession,
    forceLogout,
  } = useSessionManager();

  // Debug logs
  useEffect(() => {
    console.log("SessionExpiryModal - Debug Info:");
    console.log("  showWarning:", showWarning);
    console.log("  sessionExpired:", sessionExpired);
    console.log("  timeUntilExpiry:", timeUntilExpiry);
    console.log("  user:", user);
    console.log("  countdown:", countdown);
  }, [showWarning, sessionExpired, timeUntilExpiry, user, countdown]);

  // Countdown pour la déconnexion automatique
  useEffect(() => {
    if (showWarning && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (showWarning && countdown === 0) {
      // Déconnexion automatique après 30 secondes
      forceLogout();
    }
  }, [showWarning, countdown, forceLogout]);

  // Réinitialiser le countdown quand l'avertissement apparaît
  useEffect(() => {
    if (showWarning) {
      setCountdown(30);
    }
  }, [showWarning]);

  // const handleStayConnected = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   console.log("SessionExpiryModal - Bouton 'Restaurer la session' cliqué");

  //   // Utiliser setTimeout pour éviter les conflits d'événements
  //   setTimeout(() => {
  //     refreshSession();
  //     setCountdown(30);
  //   }, 100);
  // };

  // const handleLogout = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   console.log("SessionExpiryModal - Bouton 'Se déconnecter' cliqué");

  //   // Utiliser setTimeout pour éviter les conflits d'événements
  //   setTimeout(() => {
  //     forceLogout();
  //   }, 100);
  // };

  // Gestionnaires alternatifs pour les boutons
  const handleStayConnectedAlt = () => {
    console.log(
      "SessionExpiryModal - Bouton 'Restaurer la session' (alt) cliqué"
    );

    // Appeler refreshSession et s'assurer que la modale se ferme
    refreshSession();
    setCountdown(30);

    // Forcer la fermeture de la modale après un délai
    setTimeout(() => {
      console.log("SessionExpiryModal - Fermeture forcée de la modale");
      // La modale devrait se fermer automatiquement grâce à setShowWarning(false) dans refreshSession
    }, 500);
  };

  const handleLogoutAlt = () => {
    console.log("SessionExpiryModal - Bouton 'Se déconnecter' (alt) cliqué");
    forceLogout();
  };

  if (!showWarning) {
    console.log("SessionExpiryModal - showWarning is false, not rendering");
    return null;
  }

  console.log("SessionExpiryModal - Rendering modal");
  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-warning">
            <h5 className="modal-title text-dark">
              {sessionExpired ? "Session expired" : "Session will expire"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleLogoutAlt}
              style={{ cursor: "pointer" }}
            ></button>
          </div>

          <div className="modal-body">
            <div className="text-center mb-3">
              <i className="fas fa-clock fa-3x text-warning mb-3"></i>
              <h6>
                {sessionExpired
                  ? `Your session has expired. You will be logged out in ${countdown} seconds.`
                  : `Your session will expire in ${Math.floor(
                      timeUntilExpiry / 60
                    )}:${(timeUntilExpiry % 60).toString().padStart(2, "0")}`}
              </h6>
            </div>

            <div className="alert alert-info">
              <p className="mb-2">
                <strong>Hello {user?.firstname} !</strong>
              </p>
              <p className="mb-0">
                {sessionExpired
                  ? "Your session has expired. Do you want to stay connected ?"
                  : "Your session will expire soon. Do you want to extend it ?"}
              </p>
              <div className="mt-2">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  <strong>Extend :</strong> Stay connected •{" "}
                  <strong>Log out :</strong> Delete all data
                </small>
              </div>
            </div>

            <div className="progress mb-3" style={{ height: "8px" }}>
              <div
                className="progress-bar bg-warning"
                style={{ width: `${(countdown / 30) * 100}%` }}
              ></div>
            </div>

            {!sessionExpired && (
              <div className="alert alert-warning">
                <small>
                  <i className="fas fa-info-circle me-1"></i>
                  Your session expires automatically after 2 minutes of
                  inactivity.
                </small>
              </div>
            )}

            {sessionExpired && (
              <div className="alert alert-warning">
                <small>
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  <strong>Caution :</strong> If you don't act in {countdown}{" "}
                  seconds, you will be automatically logged out and all your
                  data will be deleted.
                </small>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogoutAlt}
              style={{ cursor: "pointer" }}
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Log out
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleStayConnectedAlt}
              style={{ cursor: "pointer" }}
            >
              <i className="fas fa-clock me-2"></i>
              {sessionExpired ? "Restore session" : "Continue session"}
            </button>
          </div>
        </div>
      </div>

      {/* SUPPRIMER le backdrop pour éviter les conflits de clics */}
      {/* <div className="modal-backdrop fade show" style={{ zIndex: 9998 }}></div> */}
    </div>
  );
}

export default SessionExpiryModal;
