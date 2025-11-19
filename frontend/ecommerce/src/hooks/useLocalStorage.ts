import { useState, useCallback } from "react";
import type { User } from "../interfaces/user.interface";

/**
 * Custom hook for managing JWT access and refresh tokens in localStorage
 * Provides synchronized state and utility functions for easier usage
 */
export function useLocalStorage() {
  // Access token
  const [token, setTokenState] = useState<string | null>(
    () => localStorage.getItem("token") // initialize from localStorage
  );

  // Refresh token
  const [refreshToken, setRefreshTokenState] = useState<string | null>(
    () => localStorage.getItem("refreshToken") // initialize from localStorage
  );
  // user
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  //cart
  const [cart, setCartState] = useState<[]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const setUserStorage = useCallback((newUser: User | null) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(newUser);
  }, []);

  /**
   * Set access token
   * Updates both state and localStorage
   * @param newToken - JWT access token or null to remove
   */
  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken); // save token
    } else {
      localStorage.removeItem("token"); // remove token
    }
    setTokenState(newToken); // update state
  }, []);

  /**
   * Set refresh token
   * Updates both state and localStorage
   * @param newToken - JWT refresh token or null to remove
   */
  const setRefreshToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("refreshToken", newToken); // save refresh token
    } else {
      localStorage.removeItem("refreshToken"); // remove refresh token
    }
    setRefreshTokenState(newToken); // update state
  }, []);

  /**
   * Clear both access and refresh tokens
   * Removes from state and localStorage
   */
  const clearTokens = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setTokenState(null);
    setRefreshTokenState(null);
  }, []);

  return {
    token,
    refreshToken,
    user,
    cart,
    setCartState,
    setToken,
    setRefreshToken,
    setUserStorage,
    clearTokens,
  };
}
