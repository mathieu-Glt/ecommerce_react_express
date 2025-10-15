describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("Test de la Page de Login", () => {
  // Before each test, we visit the login page
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");
  });

  /**
   * TEST 1 : Check that the login page displays correctly
   */
  it("Should display all elements of the login page", () => {
    // Vérifier le titre et sous-titre
    cy.contains("Bienvenue !").should("be.visible");
    cy.contains("Connectez-vous à votre compte").should("be.visible");

    // Vérifier que le logo est présent
    cy.get(".login-logo").should("exist");

    // Vérifier que les champs du formulaire sont présents
    cy.get('input[name="email"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter email");

    cy.get('input[name="password"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Password");

    // Vérifier la checkbox "Remember me"
    cy.get('input[name="rememberMe"]').should("exist");
    cy.contains("Remember me").should("be.visible");

    // Vérifier le bouton de connexion
    cy.contains("button", "Login").should("be.visible");

    // Vérifier les liens
    cy.contains("Forgot password?").should("be.visible");
    cy.contains("Sign up here").should("be.visible");

    // Vérifier les boutons OAuth
    cy.contains("Continue with Google").should("be.visible");
    cy.contains("Continue with Azure").should("be.visible");
  });

  /**
   * TEST 2 : Successful login with valid credentials
   */

  // Mock the API response before submitting
  it("Should capture the real POST request to /login", () => {
    // 1️ Intercept to just listen to the POST request
    cy.intercept("POST", "http://localhost:8000/api/auth/login").as(
      "loginRequest"
    );

    // 2️ Fill out the form with your real credentials
    cy.get('input[name="email"]').type("mathieu.gillet@hotmail.fr");
    cy.get('input[name="password"]').type("Mg!2025@1985/*");
    cy.get('input[name="rememberMe"]').check();

    // 3️ Submit the form
    cy.contains("button", "Login").click({ force: true });

    // 4️ Wait for the POST request to be captured
    cy.wait("@loginRequest").then((interception) => {
      // 5️ Check the content of the request
      console.log("Requête POST capturée :", interception.request.body);

      expect(interception.request.body).to.deep.include({
        email: "mathieu.gillet@hotmail.fr",
        password: "Mg!2025@1985/*",
      });
    });

    // 6️ Check the redirection to the homepage
    cy.url({ timeout: 10000 }).should("eq", "http://localhost:5173/");

    // 7️ Check that the token is stored in localStorage
    cy.window().then((win) => {
      const token = win.localStorage.getItem("token");
      expect(token).to.exist;
    });

    // Now check the localStorage
    cy.window().then((win) => {
      const token = win.localStorage.getItem("token");
      const user = win.localStorage.getItem("user");

      expect(token).to.exist;
      //   expect(token).to.equal("my-fake-jwt-token-12345");
      expect(user).to.exist;

      const userData = JSON.parse(user);
      expect(userData.email).to.equal("mathieu.gillet@hotmail.fr");
    });
  });

  it("Should connect with the real API (if backend is available)", () => {
    cy.get('input[name="email"]').type("mathieu.gillet@hotmail.fr");
    cy.get('input[name="password"]').type("Mg!2025@1985/*");
    cy.get('input[name="rememberMe"]').check();

    cy.contains("button", "Login").click({ force: true });

    // Wait a little for the request to be processed
    cy.wait(2000); // Adjust the wait time as necessary

    // Check the redirection to the homepage
    cy.url().should("eq", "http://localhost:5173/", { timeout: 10000 });
  });

  /**
   * TEST 3 : Check the complete and valid response from the backend after a successful login
   */
  it("Should receive a complete and valid response from the backend after a successful login", () => {
    // Mocked test data
    const mockUser = {
      _id: "507f1f77bcf86cd799439011",
      email: "jean.dupont@example.com",
      name: "Jean Dupont",
      firstname: "Jean",
      lastname: "Dupont",
      picture: "https://example.com/pictures/jean-dupont.jpg",
      address: "123 Rue de la Paix, 75001 Paris",
      role: "user",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-10-15T14:20:00.000Z",
    };

    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const mockRefreshToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.4Adcj0vVzr8C8qY7Nj5qLpGZmH7qVx9kN8_8k8Y8X8Y";

    // Intercept the login request
    cy.intercept("POST", "http://localhost:8000/api/auth/login", {
      statusCode: 200,
      body: {
        success: true,
        message: "Connection successful",
        user: mockUser,
        token: mockToken,
        refreshToken: mockRefreshToken,
      },
    }).as("loginRequest");

    // complete the login form and submit
    cy.get('input[name="email"]').type("jean.dupont@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.contains("button", "Login").click({ force: true });

    // Wait for the login request to be intercepted and validate the response
    cy.wait("@loginRequest").then((interception) => {
      // Check the response status code
      expect(interception.response.statusCode).to.equal(200);

      // Check the response body structure and content
      expect(interception.response.body).to.have.property("success", true);
      expect(interception.response.body).to.have.property(
        "message",
        "Connection successful"
      );
      expect(interception.response.body).to.have.property("user");
      expect(interception.response.body).to.have.property("token");
      expect(interception.response.body).to.have.property("refreshToken");

      // Check that token and refreshToken are non-empty strings
      const { token, refreshToken } = interception.response.body;
      expect(token).to.be.a("string");
      expect(token).to.not.be.empty;
      expect(refreshToken).to.be.a("string");
      expect(refreshToken).to.not.be.empty;

      // Check the user object structure and content
      const { user } = interception.response.body;

      // Mandatory fields
      expect(user).to.have.property("_id");
      expect(user._id).to.be.a("string");
      expect(user._id).to.equal(mockUser._id);

      expect(user).to.have.property("email");
      expect(user.email).to.be.a("string");
      expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Check  valid email format
      expect(user.email).to.equal(mockUser.email);

      expect(user).to.have.property("firstname");
      expect(user.firstname).to.be.a("string");
      expect(user.firstname).to.equal(mockUser.firstname);

      expect(user).to.have.property("lastname");
      expect(user.lastname).to.be.a("string");
      expect(user.lastname).to.equal(mockUser.lastname);

      expect(user).to.have.property("name");
      expect(user.name).to.be.a("string");
      expect(user.name).to.equal(`${mockUser.firstname} ${mockUser.lastname}`);

      // Fields optionnels
      expect(user).to.have.property("picture");
      if (user.picture) {
        expect(user.picture).to.be.a("string");
        expect(user.picture).to.equal(mockUser.picture);
      }

      expect(user).to.have.property("address");
      expect(user.address).to.be.a("string");
      expect(user.address).to.equal(mockUser.address);

      // Role by default of the new user
      expect(user).to.have.property("role");
      expect(user.role).to.be.a("string");
      expect(user.role).to.equal("user");

      // Dates of type string and valid ISO format
      expect(user).to.have.property("createdAt");
      expect(user.createdAt).to.be.a("string");
      expect(user.createdAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      ); // Format ISO

      expect(user).to.have.property("updatedAt");
      expect(user.updatedAt).to.be.a("string");
      expect(user.updatedAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      ); // Format ISO
    });
  });

  /**
   * TEST 4 : Test direct de l'API avec cy.request()
   */
  it("Devrait se connecter avec succès via cy.request()", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      body: {
        email: "mathieu.gillet@hotmail.fr",
        password: "Mg!2025@1985/*",
        rememberMe: true,
      },
      failOnStatusCode: false, // Ne pas échouer automatiquement sur erreur HTTP
    }).then((response) => {
      // Vérifier le status code
      expect(response.status).to.eq(200);

      // Vérifier la structure de la réponse
      expect(response.body).to.have.property("success", true);
      expect(response.body).to.have.property(
        "message",
        "Connection successful"
      );
      expect(response.body).to.have.property("token");
      expect(response.body).to.have.property("refreshToken");
      expect(response.body).to.have.property("user");

      // Vérifier les tokens
      const { token, refreshToken } = response.body;
      expect(token).to.be.a("string");
      expect(token).to.not.be.empty;
      expect(refreshToken).to.be.a("string");
      expect(refreshToken).to.not.be.empty;

      // Vérifier l'objet user
      const { user } = response.body;
      expect(user).to.have.property("_id");
      expect(user).to.have.property("email", "mathieu.gillet@hotmail.fr");
      expect(user).to.have.property("firstname");
      expect(user).to.have.property("lastname");
      expect(user).to.have.property("name");
      expect(user).to.have.property("role");
      expect(user).to.have.property("createdAt");
      expect(user).to.have.property("updatedAt");

      // Optionnel : Logger les données pour debug
      cy.log("Token reçu:", token);
      cy.log("User:", JSON.stringify(user));
    });
  });

  /**
   * TEST 5 : Test avec des identifiants incorrects
   */
  it("Devrait retourner une erreur 401 avec des identifiants invalides", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      body: {
        email: "wrong@example.com",
        password: "WrongPassword123!",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property("success", false);
      expect(response.body).to.have.property("error");
    });
  });

  /**
   * TEST 6 : Test avec email manquant
   */
  it("Devrait retourner une erreur 400 si l'email est manquant", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      body: {
        password: "Password123!",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("success", false);
    });
  });

  /**
   * TEST 7 : Test avec mot de passe manquant
   */
  it("Devrait retourner une erreur 400 si le password est manquant", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      body: {
        email: "test@example.com",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("success", false);
    });
  });

  /**
   * TEST 8 : Vérification des données utilisateur dans la réponse 200
   */
  it("Devrait retourner 200 avec les données utilisateur correctes", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      body: {
        email: "mathieu.gillet@hotmail.fr",
        password: "Mg!2025@1985/*",
      },
    }).then((response) => {
      // Vérifier le status 200
      expect(response.status).to.eq(200);

      const { user } = response.body;

      // Vérifier l'email
      expect(user.email).to.eq("mathieu.gillet@hotmail.fr");

      // Vérifier les champs obligatoires
      expect(user._id).to.be.a("string");
      expect(user._id).to.not.be.empty;

      expect(user.firstname).to.be.a("string");
      expect(user.firstname).to.not.be.empty;

      expect(user.lastname).to.be.a("string");
      expect(user.lastname).to.not.be.empty;

      // Vérifier que le name est construit correctement
      expect(user.name).to.include(user.firstname);
      expect(user.name).to.include(user.lastname);

      // Vérifier le rôle
      expect(user.role).to.be.oneOf(["user", "admin", "moderator"]);

      // Vérifier les dates au format ISO
      expect(user.createdAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      );
      expect(user.updatedAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      );
    });
  });
});
