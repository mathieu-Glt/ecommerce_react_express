const { Server } = require("socket.io");

let ioInstance;

/**
 * Initialize the Socket.IO server with session middleware and CORS configuration.
 * Ensures a singleton instance of Socket.IO.
 * @param {http.Server} httpServer - The HTTP server to attach Socket.IO to.
 * @param {function} sessionMiddleware - Express session middleware to integrate sessions with sockets.
 * @returns {Server} The Socket.IO instance.
 * some links:
 * - https://socket.io/docs/v4/migrating-from-3-x-to-4-0/
 * - https://socket.io/docs/v4/server-initialization/
 */
function initSocket(httpServer, sessionMiddleware) {
  // Return existing instance if already initialized
  if (ioInstance) return ioInstance;

  // Create new Socket.IO server
  // https://socket.io/docs/v4/server-options/#cors
  ioInstance = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    },
    pingTimeout: 60000, // Disconnect after 60s without ping
    pingInterval: 25000, // Ping clients every 25s
    transports: ["websocket", "polling"], // Transport methods
  });

  // Integrate session middleware with Socket.IO
  // https://socket.io/docs/v4/middlewares/#compatibility-with-express-middleware
  ioInstance.engine.use(sessionMiddleware);

  // Handle new socket connections
  ioInstance.on("connection", (socket) => {
    const session = socket.request.session;
    const sessionId = session?.id;

    if (!session) {
      socket.emit("auth:required", { reason: "no_session" });
      return socket.disconnect(true);
    }

    // Handle pending notifications (if any)
    if (!session.user && session.pendingSocketNotification) {
      const notification = session.pendingSocketNotification;

      if (notification.data && notification.data.user) {
        session.user = notification.data.user;
        session.token = notification.data.token;
        session.refreshToken = notification.data.refreshToken;

        // Clear the pending notification
        delete session.pendingSocketNotification;

        // Save session
        session.save((err) => {
          if (err) {
          } else {
          }
        });
      }
    }

    // Final validation: ensure session has a user
    if (!session.user) {
      socket.emit("auth:required", {
        reason: "no_user_in_session",
        debug: {
          sessionId: sessionId,
          sessionKeys: Object.keys(session),
        },
      });
      return socket.disconnect(true);
    }

    // Join rooms for the session and user
    socket.join(sessionId);
    socket.join(`user:${session.user.id}`);

    // Notify client of successful connection
    const connectionData = {
      user: session.user,
      token: session.token,
      refreshToken: session.refreshToken,
      socketId: socket.id,
      timestamp: Date.now(),
    };

    socket.emit("user:connected", connectionData);

    // Disconnect listener
    socket.on("disconnect", (reason) => {});
  });

  return ioInstance;
}

/**
 * Get the current Socket.IO instance.
 * @throws Will throw an error if Socket.IO is not initialized.
 */
function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.IO is not initialized. Call initSocket first.");
  }
  return ioInstance;
}

/**
 * Emit an event to a specific user by user ID.
 * @param {string} userId - Target user ID.
 * @param {string} event - Event name.
 * @param {Object} data - Event payload.
 */
function emitToUser(userId, event, data) {
  const io = getIO();
  io.to(`user:${userId}`).emit(event, data);
}

/**
 * Emit an event to a specific session by session ID.
 * @param {string} sessionId - Target session ID.
 * @param {string} event - Event name.
 * @param {Object} data - Event payload.
 */
function emitToSession(sessionId, event, data) {
  const io = getIO();
  io.to(sessionId).emit(event, data);
}

module.exports = { initSocket, getIO, emitToUser, emitToSession };
