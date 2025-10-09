import { useState, useEffect, useCallback } from "react";
import { useUserContext } from "../context/userContext";
import { useAuth } from "./useAuth";

// Constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_WARNING_TIME = 60 * 1000; // 1 minute avant expiration
const CHECK_INTERVAL = 30 * 1000; // Vérifier toutes les 30 secondes

// Types
interface SessionManagerReturn {
  sessionExpired: boolean;
  showWarning: boolean;
  timeUntilExpiry: number;
  refreshSession: () => void;
  forceLogout: () => void;
}

/**
 * Custom hook for managing user session expiration
 *
 * Monitors user activity and displays warnings before session expires.
 * Automatically logs out users after session timeout.
 *
 * @returns Session state and management functions
 *
 * @example
 * const { showWarning, refreshSession, forceLogout } = useSessionManager();
 */
const useSessionManager = (): SessionManagerReturn => {
  const { user, token } = useUserContext();
  const { logout } = useAuth();

  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);

  /**
   * Get last activity timestamp from sessionStorage
   */
  const getLastActivity = (): number => {
    const lastActivity = sessionStorage.getItem("lastActivity");
    return lastActivity ? parseInt(lastActivity, 10) : Date.now();
  };

  /**
   * Update last activity timestamp
   */
  const updateActivity = useCallback((): void => {
    if (user && token) {
      sessionStorage.setItem("lastActivity", Date.now().toString());

      // Reset warnings if session was previously expiring
      if (showWarning || sessionExpired) {
        setShowWarning(false);
        setSessionExpired(false);
      }
    }
  }, [user, token, showWarning, sessionExpired]);

  /**
   * Check session status and show warnings if needed
   */
  const checkSessionStatus = useCallback((): void => {
    if (!user || !token) return;

    const now = Date.now();
    const lastActivity = getLastActivity();
    const timeSinceLastActivity = now - lastActivity;
    const timeRemaining = SESSION_TIMEOUT - timeSinceLastActivity;

    // Session has expired
    if (timeRemaining <= 0) {
      setSessionExpired(true);
      setShowWarning(true);
      setTimeUntilExpiry(0);
      return;
    }

    // Show warning if session will expire soon
    if (timeRemaining <= SESSION_WARNING_TIME) {
      setShowWarning(true);
      setTimeUntilExpiry(Math.floor(timeRemaining / 1000));
    } else {
      setShowWarning(false);
      setSessionExpired(false);
    }
  }, [user, token]);

  /**
   * Refresh the session and reset the timer
   */
  const refreshSession = useCallback((): void => {
    if (!user || !token) {
      forceLogout();
      return;
    }

    // Update activity timestamp
    sessionStorage.setItem("lastActivity", Date.now().toString());

    // Reset states
    setSessionExpired(false);
    setShowWarning(false);
    setTimeUntilExpiry(0);
  }, [user, token]);

  /**
   * Force logout and clear all session data
   */
  const forceLogout = useCallback((): void => {
    // Clear session storage
    sessionStorage.clear();

    // Reset states
    setSessionExpired(false);
    setShowWarning(false);
    setTimeUntilExpiry(0);

    // Call context logout
    logout();
  }, [logout]);

  /**
   * Track user activity events
   */
  useEffect(() => {
    // Don't track activity if warning modal is shown
    if (showWarning) return;

    const handleUserActivity = (): void => {
      updateActivity();
    };

    // Events to track
    const events = ["click", "keypress", "scroll", "mousemove"];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [updateActivity, showWarning]);

  /**
   * Initialize session on user login
   */
  useEffect(() => {
    if (user && token) {
      sessionStorage.setItem("lastActivity", Date.now().toString());
    }
  }, [user, token]);

  /**
   * Periodically check session status
   */
  useEffect(() => {
    const interval = setInterval(checkSessionStatus, CHECK_INTERVAL);

    // Check immediately on mount
    checkSessionStatus();

    return () => clearInterval(interval);
  }, [checkSessionStatus]);

  return {
    sessionExpired,
    showWarning,
    timeUntilExpiry,
    refreshSession,
    forceLogout,
  };
};

export default useSessionManager;
