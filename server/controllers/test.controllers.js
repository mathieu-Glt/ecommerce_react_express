// const admin = require("../firebase");

// exports.testAuth = async (req, res) => {
//   try {
//     // Test if Firebase admin is properly initialized
//     const auth = admin.auth();

//     // Test if we can access the project
//     const projectId = admin.app().options.projectId;

//     res.json({
//       status: "success",
//       message: "Firebase Admin SDK is properly configured",
//       projectId: projectId,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Firebase Admin SDK configuration error",
//       error: error.message,
//     });
//   }
// };

// exports.testToken = async (req, res) => {
//   try {
//     if (!req.headers.authorization) {
//       return res.status(400).json({
//         status: "error",
//         message: "No authorization header provided",
//       });
//     }

//     const token = req.headers.authorization.split(" ")[1];

//     // Try to decode the token without verification first
//     const decodedToken = admin.auth().verifyIdToken(token, false);
//     res.json({
//       status: "success",
//       message: "Token verification successful",
//       user: {
//         uid: decodedToken.uid,
//         email: decodedToken.email,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "error",
//       message: "Token verification failed",
//       error: error.message,
//       code: error.code,
//     });
//   }
// };

// exports.testServer = (req, res) => {
//   res.json({
//     status: "success",
//     message: "Server is running correctly",
//     timestamp: new Date().toISOString(),
//   });
// };
