describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("Test de la Page de Login", () => {
  // Avant chaque test, on visite la page de login
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");
  });

  /**
   * TEST 1 : Vérifier que la page de login s'affiche correctement
   */
  it("Devrait afficher tous les éléments de la page de login", () => {
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
   * TEST 2 : Connexion réussie avec des identifiants valides
   */

  // Mocke de la réponse de l'API AVANT de soumettre
  it("Devrait capturer la vraie requête POST vers /login", () => {
    // 1️⃣ Intercept pour juste écouter la requête POST
    cy.intercept("POST", "http://localhost:8000/api/auth/login").as(
      "loginRequest"
    );

    // 2️⃣ Remplir le formulaire avec tes vrais identifiants
    cy.get('input[name="email"]').type("mathieu.gillet@hotmail.fr");
    cy.get('input[name="password"]').type("Mg!2025@1985/*");
    cy.get('input[name="rememberMe"]').check();

    // 3️⃣ Soumettre le formulaire
    cy.contains("button", "Login").click({ force: true });

    // 4️⃣ Attendre que la requête POST soit capturée
    cy.wait("@loginRequest").then((interception) => {
      // 5️⃣ Vérifier le contenu de la requête
      console.log("Requête POST capturée :", interception.request.body);

      expect(interception.request.body).to.deep.include({
        email: "mathieu.gillet@hotmail.fr",
        password: "Mg!2025@1985/*",
      });
    });

    // 6️⃣ Vérifier la redirection vers la page d'accueil
    cy.url({ timeout: 10000 }).should("eq", "http://localhost:5173/");

    // 7️⃣ Vérifier que le token est stocké
    cy.window().then((win) => {
      const token = win.localStorage.getItem("token");
      expect(token).to.exist;
    });

    // ✅ Maintenant vérifier le localStorage
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

  // OU de manière plus flexible :
  // cy.url().should('not.include', '/login');
  // cy.url().should('eq', Cypress.config().baseUrl + '/');

  // cypress/e2e/auth/login.cy.ts

  /**
   * TEST 2 : Connexion réussie avec des identifiants valides
   * ✅ AVEC cy.intercept() pour mocker la réponse API
   */
  //   it("Devrait se connecter avec des identifiants valides et rediriger vers /", () => {
  //     // 1️⃣ Intercept global pour debug (optionnel)
  //     cy.intercept("*", (req) => {
  //       console.log("Requête interceptée :", req.method, req.url, req.body);
  //     }).as("allRequests");

  //     // 2️⃣ Intercept spécifique pour mock login
  //     cy.intercept("POST", "http://localhost:8000/api/auth/login", {
  //       statusCode: 200,
  //       body: {
  //         user: {
  //           id: 1,
  //           email: "test@example.com",
  //           firstname: "Test",
  //           lastname: "User",
  //           picture: null,
  //           address: null,
  //         },
  //         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-jwt-token",
  //         refreshToken: "fake-refresh-token-123456",
  //       },
  //     }).as("loginRequest");

  //     // 3️⃣ Remplir le formulaire
  //     cy.get('input[name="email"]').type("test@example.com");
  //     cy.get('input[name="password"]').type("password123");
  //     cy.get('input[name="rememberMe"]').check();

  //     // 4️⃣ Soumettre le formulaire
  //     cy.contains("button", "Login").click({ force: true });

  //     // 5️⃣ Attendre que le loginRequest soit capté
  //     cy.wait("@loginRequest").then((interception) => {
  //       // Vérifier que le frontend a envoyé les bonnes données
  //       expect(interception.request.body).to.deep.include({
  //         email: "test@example.com",
  //         password: "password123",
  //         rememberMe: true,
  //       });
  //     });

  //     // 6️⃣ Vérifier la redirection vers /
  //     cy.url({ timeout: 10000 }).should("eq", "http://localhost:5173/");

  //     // 7️⃣ Vérifier que le token est stocké dans localStorage
  //     cy.window().then((win) => {
  //       const token = win.localStorage.getItem("token");
  //       expect(token).to.eq(
  //         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-jwt-token"
  //       );
  //     });
  //   });

  /**
   * ALTERNATIVE : Si vous voulez utiliser la vraie API
   * Assurez-vous que :
   * 1. Le backend tourne sur http://localhost:8000
   * 2. Les identifiants existent dans la base de données
   */
  it("Devrait se connecter avec la vraie API (si backend disponible)", () => {
    // Pas de cy.intercept() = vraie requête API

    cy.get('input[name="email"]').type("mathieu.gillet@hotmail.fr");
    cy.get('input[name="password"]').type("Mg!2025@1985/*");
    cy.get('input[name="rememberMe"]').check();

    cy.contains("button", "Login").click({ force: true });

    // Attendre un peu que la requête se fasse
    cy.wait(2000); // Optionnel

    // Vérifier la redirection
    cy.url().should("eq", "http://localhost:5173/", { timeout: 10000 });
  });

  /**
   * TEST avec validation de l'état après redirection
   */
  //   it("Devrait afficher le contenu après connexion réussie", () => {
  //     // Mocker l'API
  //     cy.intercept("POST", "http://localhost:8000/api/auth/login", {
  //       statusCode: 200,
  //       body: {
  //         user: {
  //           id: 1,
  //           email: "test@example.com",
  //           firstname: "John",
  //           lastname: "Doe",
  //         },
  //         token: "fake-jwt-token",
  //         refreshToken: "fake-refresh-token",
  //       },
  //     }).as("loginRequest");

  //     // Login
  //     cy.get('input[name="email"]').type("test@example.com");
  //     cy.get('input[name="password"]').type("password123");
  //     cy.contains("button", "Login").click({ force: true });

  //     // Vérifier la redirection ET le contenu
  //     cy.url().should("not.include", "/login");

  //     // Vérifier que des éléments de la page d'accueil sont présents
  //     // Adaptez selon votre application :
  //     // OU
  //   });

  /**
   * TEST : Vérifier que le token est stocké après login
   */
  //   it("Devrait stocker le token dans localStorage après connexion", () => {
  //     cy.intercept("POST", "http://localhost:8000/api/auth/login", {
  //       statusCode: 200,
  //       body: {
  //         user: { id: 1, email: "test@example.com" },
  //         token: "my-fake-jwt-token-12345",
  //         refreshToken: "my-fake-refresh-token",
  //       },
  //     }).as("loginRequest");

  //     cy.get('input[name="email"]').type("test@example.com");
  //     cy.get('input[name="password"]').type("password123");
  //     cy.contains("button", "Login").click({ force: true });

  //     // ✅ Attendre que la requête mockée soit terminée
  //     cy.wait("@loginRequest");

  //     // ✅ Maintenant vérifier le localStorage
  //     cy.window().then((win) => {
  //       const token = win.localStorage.getItem("token");
  //       const user = win.localStorage.getItem("user");

  //       expect(token).to.exist;
  //       expect(token).to.equal("my-fake-jwt-token-12345");
  //       expect(user).to.exist;

  //       const userData = JSON.parse(user);
  //       expect(userData.email).to.equal("test@example.com");
  //     });

  //     // ✅ Vérifier la redirection (après que tout soit écrit)
  //     cy.url().should("eq", "http://localhost:5173/");
  //   });
});
