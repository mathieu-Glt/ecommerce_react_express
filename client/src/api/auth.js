import { privateApi, publicApi } from "./config/api";

export const createOrUpdateUser = async () => {
  return await privateApi.post(`/auth/create-or-update-user`, {});
};

export const registerOrUpdateUser = async (user) => {
  return await privateApi.post(`/user/register-user`, user);
};

// export const currentUser = async () => {
//   return await privateApi.get(`/auth/current-user`);
// };

export const loginWithGoogle = () => {
  window.location.href = "http://localhost:8000/api/auth/google";
};

export const loginWithAzure = () => {
  window.location.href = "http://localhost:8000/api/auth/azure";
};

export const fetchGoogleUser = async () => {
  return await publicApi.get("http://localhost:8000/api/auth/user", {
    withCredentials: true,
  });
};

export const loginWithGoogleCallback = async () => {
  return await publicApi.get(`/api/auth/google/callback`);
};

export const loginWithEmail = async (email, password) => {
  console.log("loginWithEmail ~ auth.js :", email, password);
  return await publicApi.post(`/auth/login`, { email, password });
};

export const updateUserProfile = async (user) => {
  return await privateApi.put(`/auth/profile`, user);
};

export const register = async (userData) => {
  return await publicApi.post(`/auth/register`, userData);
};

export const logoutUser = async () => {
  return await privateApi.post(`/auth/logout`);
};
// Login with Google - Utilise Firebase Auth
// export const loginWithGoogle = async () => {
//   // Cette fonction utilise Firebase Auth directement
//   // Elle sera gérée par AuthService.loginWithGoogle()
//   throw new Error("loginWithGoogle should be called through AuthService");
// };
