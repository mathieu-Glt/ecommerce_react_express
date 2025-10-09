// src/socket/socket.js
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (options = {}) => {
  if (socket?.connected) {
    console.log("🔌 Socket déjà connecté");
    return socket;
  }

  const defaultOptions = {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: false, // Réutilise la connexion existante
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    ...options,
  };

  if (!socket) {
    socket = io("http://localhost:8000", defaultOptions);

    // Événements de debugging
    socket.on("connect", () => {
      console.log("🔌 Socket connecté:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket déconnecté:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Erreur connexion socket:", error);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnecté après", attemptNumber, "tentatives");
    });
  }

  socket.connect();
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket non initialisé, création automatique...");
    return connectSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Fermeture socket...");
    socket.disconnect();
    socket = null;
  }
};
