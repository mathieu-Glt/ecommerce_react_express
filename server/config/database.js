const mongoose = require("mongoose");

/**
 * Configuration de la base de données avec support pour différents types
 */
const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    console.log(
      "📍 MongoDB URI:",
      process.env.MONGODB_URI ? "SET ✅" : "MISSING ❌"
    );
    console.log("📍 Database:", process.env.MONGODB_URI?.split("/").pop());

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("═══════════════════════════════════════");
    console.error("❌ MONGODB CONNECTION ERROR:");
    console.error("═══════════════════════════════════════");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    console.error("═══════════════════════════════════════");
    throw error;
  }
};
/**
 * Vérifier la configuration de la base de données
 */
const validateDatabaseConfig = () => {
  const databaseType = process.env.DATABASE_TYPE || "mongoose";

  if (databaseType === "mongoose") {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI environment variable is required for mongoose"
      );
    }
  } else if (databaseType === "mysql") {
    const requiredVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing MySQL environment variables: ${missingVars.join(", ")}`
      );
    }
  }
};

module.exports = { connectDB, validateDatabaseConfig };

// class Database {
//   constructor(databaseType) {
//     this.databaseType = databaseType;
//   }

//   async connectDB() {
//     const databaseType = process.env.DATABASE_TYPE || "mongoose";

//     try {
//       if (databaseType === "mongoose") {
//         const conn = await mongoose.connect(process.env.MONGODB_URI);
//         console.log("✅ Connected to MongoDB");
//         return conn;
//       } else if (databaseType === "mysql") {
//         // Pour MySQL, la connexion sera gérée par le repository
//         console.log("✅ MySQL configuration ready");
//         return null;
//       } else {
//         throw new Error(`Unsupported database type: ${databaseType}`);
//       }
//     } catch (error) {
//       console.error("❌ Error connecting to database:", error);
//       process.exit(1);
//     }
//   }

//   /**
//    * Vérifier la configuration de la base de données
//    */
//   async validateDatabaseConfig() {
//     const databaseType = process.env.DATABASE_TYPE || "mongoose";

//     if (databaseType === "mongoose") {
//       if (!process.env.MONGODB_URI) {
//         throw new Error(
//           "MONGODB_URI environment variable is required for mongoose"
//         );
//       }
//     } else if (databaseType === "mysql") {
//       const requiredVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
//       const missingVars = requiredVars.filter(
//         (varName) => !process.env[varName]
//       );

//       if (missingVars.length > 0) {
//         throw new Error(
//           `Missing MySQL environment variables: ${missingVars.join(", ")}`
//         );
//       }
//     }
//   }
// }

// module.exports = Database;
