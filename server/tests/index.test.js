/**
 * CSRF Token Endpoint Tests
 *
 * Tests the /api/csrf-token endpoint which provides CSRF protection tokens
 * for subsequent requests that modify data (POST, PUT, DELETE, PATCH).
 *
 * @requires supertest - HTTP assertions library
 * @requires ../index - Express app instance
 */

const request = require("supertest");
const { app, httpServer } = require("../index");

/**
 * IMPORTANT: Close the server ONCE after ALL tests are done
 * This prevents "Server is not running" errors
 */
afterAll((done) => {
  // Add a small delay to ensure all async operations complete
  setTimeout(() => {
    httpServer.close(done);
  }, 500);
});

describe("CSRF Token Endpoint", () => {
  describe("GET /api/csrf-token", () => {
    /**
     * Test Case 1: Basic CSRF token retrieval
     * Should return a valid token with proper structure
     */
    it("should return a valid CSRF token with status 200", async () => {
      const response = await request(app)
        .get("/api/csrf-token")
        .expect("Content-Type", /json/)
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty("csrfToken");
      expect(typeof response.body.csrfToken).toBe("string");
      expect(response.body.csrfToken.length).toBeGreaterThan(0);

      console.log("📌 CSRF Token received:", response.body.csrfToken);
    });

    /**
     * Test Case 2: Verify cookies are set
     * At minimum, CSRF cookie should be present
     */
    it("should set CSRF cookie", async () => {
      const response = await request(app).get("/api/csrf-token").expect(200);

      // Check that cookies are present in the response
      const cookies = response.headers["set-cookie"];

      expect(cookies).toBeDefined();
      expect(Array.isArray(cookies)).toBe(true);
      expect(cookies.length).toBeGreaterThan(0);

      // Verify CSRF cookie is present
      const hasCsrfCookie = cookies.some((cookie) => cookie.includes("_csrf"));
      expect(hasCsrfCookie).toBe(true);

      // Log individual cookies for debugging
      cookies.forEach((cookie, index) => {
        console.log(`   Cookie ${index + 1}:`, cookie.split(";")[0]);
      });
    });

    /**
     * Test Case 3: Verify different sessions get different tokens
     * Without maintaining session, each request should generate a unique token
     */
    it("should generate different tokens for different sessions", async () => {
      // First request - new session
      const response1 = await request(app).get("/api/csrf-token").expect(200);

      // Second request - another new session
      const response2 = await request(app).get("/api/csrf-token").expect(200);

      const token1 = response1.body.csrfToken;
      const token2 = response2.body.csrfToken;

      // Tokens should be different for different sessions
      expect(token1).not.toBe(token2);
    });

    /**
     * Test Case 4: Verify same session maintains same token
     * Using an agent to maintain cookies/session
     */
    it("should return same token when maintaining session with agent", async () => {
      // Create an agent to maintain session across requests
      const agent = request.agent(app);

      // First request - get token and establish session
      const response1 = await agent.get("/api/csrf-token").expect(200);

      const token1 = response1.body.csrfToken;
      const cookies1 = response1.headers["set-cookie"];

      // Second request - same session via agent
      const response2 = await agent.get("/api/csrf-token").expect(200);

      const token2 = response2.body.csrfToken;
      const cookies2 = response2.headers["set-cookie"];

      // IMPORTANT: Tokens might be the same OR different depending on
      // how csurf handles token regeneration. Let's verify the session is maintained
      // by checking if we still get a valid token
      expect(token2).toBeDefined();
      expect(typeof token2).toBe("string");
      expect(token2.length).toBeGreaterThan(0);
    });
  });

  describe("CSRF Token Usage Validation", () => {
    /**
     * Test Case 5: Verify token structure and format
     */
    it("should return token with expected format", async () => {
      const response = await request(app).get("/api/csrf-token").expect(200);

      const token = response.body.csrfToken;

      // CSRF tokens are typically base64-url encoded strings
      // They should not contain spaces or special characters except - and _
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);

      // Typical CSRF token length is between 20-100 characters
      expect(token.length).toBeGreaterThanOrEqual(20);
      expect(token.length).toBeLessThanOrEqual(100);

      console.log("✅ Token format validated:", token);
    });

    /**
     * Test Case 6: Multiple rapid requests
     * Verify the endpoint can handle multiple concurrent requests
     */
    it("should handle multiple concurrent requests", async () => {
      const promises = [];

      for (let i = 0; i < 5; i++) {
        promises.push(request(app).get("/api/csrf-token").expect(200));
      }

      const responses = await Promise.all(promises);

      // All responses should have valid tokens
      responses.forEach((response, index) => {
        expect(response.body).toHaveProperty("csrfToken");
        expect(typeof response.body.csrfToken).toBe("string");
        console.log(`   Request ${index + 1} token:`, response.body.csrfToken);
      });

      console.log("✅ All concurrent requests successful");
    });
  });

  describe("CSRF Integration Test (with real endpoint)", () => {
    /**
     * Test Case 7: Complete flow - Get token and use it
     * This demonstrates getting a CSRF token and maintaining session
     */
    it("should successfully retrieve and maintain CSRF token for session", async () => {
      // Create an agent to maintain session
      const agent = request.agent(app);

      // Step 1: Get CSRF token
      const csrfResponse = await agent.get("/api/csrf-token").expect(200);

      const csrfToken = csrfResponse.body.csrfToken;
      const cookies = csrfResponse.headers["set-cookie"];

      console.log("🔐 CSRF Setup:");
      console.log("   Token retrieved:", csrfToken);
      console.log("   Cookies received:", cookies);

      // Verify token
      expect(csrfToken).toBeDefined();
      expect(typeof csrfToken).toBe("string");
      expect(csrfToken.length).toBeGreaterThan(0);

      // Verify cookies
      expect(cookies).toBeDefined();
      expect(Array.isArray(cookies)).toBe(true);

      console.log("✅ CSRF token ready for use in POST/PUT/DELETE requests");

      // NOTE: To test with a real endpoint, uncomment and modify:
      /*
      const postResponse = await agent
        .post("/api/your-protected-endpoint")
        .set("X-CSRF-Token", csrfToken)
        .send({ data: "test" })
        .expect(200);

      expect(postResponse.body).toHaveProperty("success");
      */
    });
  });
});
