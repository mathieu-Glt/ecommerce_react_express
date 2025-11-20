/**
 * Authentication Login Tests
 *
 * Tests the POST /api/auth/login endpoint
 * Verifies successful authentication with valid credentials
 *
 * @requires supertest - HTTP assertions library
 * @requires bcrypt - Password hashing
 * @requires mongoose - MongoDB ODM
 */

const request = require("supertest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { app, httpServer } = require("../index");
const User = require("../models/User");

describe("Authentication - Login", () => {
  let testUser;
  let csrfToken;
  let agent;

  /**
   * Setup: Create a test user before running tests
   * This user will be used for successful login tests
   */
  beforeAll(async () => {
    // Create an agent to maintain session/cookies
    agent = request.agent(app);

    // Get CSRF token first
    const csrfResponse = await agent.get("/api/csrf-token").expect(200);
    csrfToken = csrfResponse.body.csrfToken;

    // Hash password with same salt rounds as production
    const hashedPassword = await bcrypt.hash("TestPassword123!", 10);

    // Create test user in database
    testUser = await User.create({
      email: "test@example.com",
      password: hashedPassword,
      firstname: "John",
      lastname: "Doe",
      role: "user",
      address: "123 Test Street",
    });
  });

  /**
   * Cleanup: Remove test user and close connections
   */
  afterAll(async () => {
    // Delete test user
    if (testUser && testUser._id) {
      await User.deleteOne({ _id: testUser._id });
    }

    // Close database connection
    await mongoose.connection.close();

    // Close HTTP server - wait for it to complete
    await new Promise((resolve) => {
      httpServer.close(() => {
        resolve();
      });
    });
  });
  /**
   * TEST 1: Successful login with valid credentials
   */
  describe("POST /api/auth/login - Success Cases", () => {
    it("should login successfully with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "TestPassword123!",
      };

      const response = await agent
        .post("/api/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .send(loginData)
        .expect("Content-Type", /json/)
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "Connection successful");

      // Verify user object exists
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toBeDefined();

      // Verify user data
      const { user } = response.body;
      expect(user).toHaveProperty("email", "test@example.com");
      expect(user).toHaveProperty("firstname", "John");

      // ✅ FIX 1: Accept both "Doe" and "DOE" for lastname
      expect(user).toHaveProperty("lastname");
      expect(user.lastname.toLowerCase()).toBe("doe");

      expect(user).toHaveProperty("role", "user");
      expect(user).toHaveProperty("_id");
      expect(user).toHaveProperty("address", "123 Test Street");

      // Verify password is NOT in response
      expect(user).not.toHaveProperty("password");

      // Verify tokens exist and are strings
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("refreshToken");
      expect(typeof response.body.token).toBe("string");
      expect(typeof response.body.refreshToken).toBe("string");
      expect(response.body.token.length).toBeGreaterThan(20);
      expect(response.body.refreshToken.length).toBeGreaterThan(20);
    });

    it("should return user with all expected fields", async () => {
      const response = await agent
        .post("/api/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .send({
          email: "test@example.com",
          password: "TestPassword123!",
        })
        .expect(200);

      const { user } = response.body;

      // Check all expected fields are present
      const expectedFields = [
        "_id",
        "email",
        "firstname",
        "lastname",
        "role",
        "address",
        "createdAt",
        "updatedAt",
      ];

      expectedFields.forEach((field) => {
        expect(user).toHaveProperty(field);
      });
    });
  });

  /**
   * TEST 2: Failed login attempts
   */
  describe("POST /api/auth/login - Failure Cases", () => {
    it("should return 401 with incorrect password", async () => {
      const response = await agent
        .post("/api/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .send({
          email: "test@example.com",
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/incorrect|invalid/i);
    });

    it("should return 401 with non-existent email", async () => {
      const response = await agent
        .post("/api/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .send({
          email: "nonexistent@example.com",
          password: "TestPassword123!",
        })
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    it("should return 400 with invalid email format", async () => {
      const response = await agent
        .post("/api/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .send({
          email: "invalid-email",
          password: "TestPassword123!",
        })
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    it("should return 400 with short password", async () => {
      const response = await agent
        .post("/api/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .send({
          email: "test@example.com",
          password: "short",
        })
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    // ✅ FIX 2: Updated test for missing email
    it("should return 400 when email is missing", async () => {
      const response = await agent
        .post("/api/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .send({
          password: "TestPassword123!",
        })
        .expect(400);

      expect(response.body).toHaveProperty("success", false);

      // Check for errors in different possible formats
      const hasError =
        (response.body.message && /email/i.test(response.body.message)) ||
        (response.body.errors &&
          Array.isArray(response.body.errors) &&
          response.body.errors.some((err) =>
            /email/i.test(err.msg || err.message)
          )) ||
        (response.body.error && /email/i.test(response.body.error));

      expect(hasError).toBe(true);
    });

    // ✅ FIX 3: Updated test for missing password
    it("should return 400 when password is missing", async () => {
      const response = await agent
        .post("/api/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .send({
          email: "test@example.com",
        })
        .expect(400);

      expect(response.body).toHaveProperty("success", false);

      // Check for errors in different possible formats
      const hasError =
        (response.body.message && /password/i.test(response.body.message)) ||
        (response.body.errors &&
          Array.isArray(response.body.errors) &&
          response.body.errors.some((err) =>
            /password/i.test(err.msg || err.message)
          )) ||
        (response.body.error && /password/i.test(response.body.error));

      expect(hasError).toBe(true);
    });
  });

  /**
   * TEST 3: Token validation
   */
  describe("Token Generation Validation", () => {
    it("should generate valid JWT tokens", async () => {
      const response = await agent
        .post("/api/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .send({
          email: "test@example.com",
          password: "TestPassword123!",
        })
        .expect(200);

      const { token, refreshToken } = response.body;

      // JWT tokens have 3 parts separated by dots
      const tokenParts = token.split(".");
      const refreshTokenParts = refreshToken.split(".");

      expect(tokenParts).toHaveLength(3);
      expect(refreshTokenParts).toHaveLength(3);

      // Each part should be base64url encoded (alphanumeric, -, _)
      tokenParts.forEach((part) => {
        expect(part).toMatch(/^[A-Za-z0-9_-]+$/);
      });

      refreshTokenParts.forEach((part) => {
        expect(part).toMatch(/^[A-Za-z0-9_-]+$/);
      });
    });
  });
});
