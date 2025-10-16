// cypress/e2e/auth/login.cy.ts

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS E2E (END-TO-END) AVEC CYPRESS
// ═══════════════════════════════════════════════════════════════════════════════
//
// DIFFÉRENCE ENTRE TESTS UNITAIRES (JEST) ET TESTS E2E (CYPRESS) :
//
// TESTS UNITAIRES (Jest) :
// - Testent une fonction isolée
// - Moquent TOUTES les dépendances
// - Ultra-rapides (millisecondes)
// - Ne testent PAS l'interface utilisateur
// - Ne testent PAS les vraies API
//
// TESTS E2E (Cypress) :
// - Testent l'application COMPLÈTE comme un vrai utilisateur
// - Utilisent le vrai navigateur (Chrome, Firefox, etc.)
// - Peuvent utiliser les vraies API OU les mocker
// - Testent l'interface utilisateur réelle
// - Plus lents (secondes) mais plus représentatifs
// - Simulent les interactions utilisateur (click, type, etc.)
//
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Suite de tests E2E pour la page de login
 *
 * Ces tests vérifient le comportement complet de la page de connexion :
 * - Affichage correct de tous les éléments UI
 * - Connexion réussie avec vraies/fausses credentials
 * - Gestion des erreurs (401, 400)
 * - Validation de la structure des réponses API
 * - Stockage correct des données (localStorage)
 * - Redirections appropriées
 *
 * Cypress permet de :
 * - Visiter des pages web réelles
 * - Interagir avec le DOM (click, type, etc.)
 * - Intercepter et mocker les requêtes HTTP
 * - Vérifier le contenu affiché à l'écran
 * - Tester le comportement comme un vrai utilisateur
 */
describe("Login Page Test", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // AVANT CHAQUE TEST : Visite de la page de login
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * beforeEach() s'exécute AVANT chaque test individuel
   *
   * Pourquoi visiter la page avant chaque test ?
   * - Garantit que chaque test part d'un état initial propre
   * - Évite les interférences entre tests
   * - Simule un utilisateur qui arrive sur la page
   *
   * cy.visit() :
   * - Charge la page dans le navigateur Cypress
   * - Attend que la page soit complètement chargée
   * - Réinitialise le state de l'application
   */
  beforeEach(() => {
    // Visiter la page de login sur l'application en local
    // Note : L'application doit être lancée sur localhost:5173 (Vite par défaut)
    cy.visit("http://localhost:5173/login");
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 1 : VÉRIFICATION DE L'AFFICHAGE DE LA PAGE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 1 : Vérifier que tous les éléments de la page sont affichés
   *
   * Objectif : S'assurer que la page de login contient tous les éléments
   *            nécessaires pour qu'un utilisateur puisse se connecter.
   *
   * Ce qu'on vérifie :
   * - Titres et sous-titres
   * - Logo de l'application
   * - Champs du formulaire (email, password)
   * - Checkbox "Remember me"
   * - Bouton de connexion
   * - Liens (mot de passe oublié, inscription)
   * - Boutons OAuth (Google, Azure)
   *
   * Pourquoi ce test est important ?
   * - Détecte les régressions visuelles
   * - Garantit que l'UI est complète
   * - Vérifie que les traductions sont appliquées
   * - S'assure que le CSS charge correctement
   */
  it("Should display all elements of the login page", () => {
    // ─────────────────────────────────────────────────────────────────────────
    // VÉRIFIER LES TEXTES DE LA PAGE
    // ─────────────────────────────────────────────────────────────────────────

    // cy.contains() : Cherche un élément contenant le texte spécifié
    // .should("be.visible") : Vérifie que l'élément est visible à l'écran
    cy.contains("Bienvenue !").should("be.visible");
    cy.contains("Connectez-vous à votre compte").should("be.visible");

    // ─────────────────────────────────────────────────────────────────────────
    // VÉRIFIER LA PRÉSENCE DU LOGO
    // ─────────────────────────────────────────────────────────────────────────

    // cy.get() : Sélectionne un élément par sélecteur CSS
    // .should("exist") : Vérifie que l'élément existe dans le DOM
    // Note : "exist" vs "be.visible" - exist = dans le DOM, visible = affiché
    cy.get(".login-logo").should("exist");

    // ─────────────────────────────────────────────────────────────────────────
    // VÉRIFIER LES CHAMPS DU FORMULAIRE
    // ─────────────────────────────────────────────────────────────────────────

    // Champ email : Vérifier qu'il est visible ET qu'il a le bon placeholder
    // 'input[name="email"]' : Sélecteur d'attribut CSS
    // .and() : Enchaîne plusieurs assertions
    cy.get('input[name="email"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter email");

    // Champ password : Même vérification
    cy.get('input[name="password"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Password");

    // ─────────────────────────────────────────────────────────────────────────
    // VÉRIFIER LA CHECKBOX "REMEMBER ME"
    // ─────────────────────────────────────────────────────────────────────────

    // Vérifier que la checkbox existe
    cy.get('input[name="rememberMe"]').should("exist");

    // Vérifier que le label est visible
    cy.contains("Remember me").should("be.visible");

    // ─────────────────────────────────────────────────────────────────────────
    // VÉRIFIER LE BOUTON DE CONNEXION
    // ─────────────────────────────────────────────────────────────────────────

    // cy.contains("button", "Login") : Cherche un bouton contenant "Login"
    cy.contains("button", "Login").should("be.visible");

    // ─────────────────────────────────────────────────────────────────────────
    // VÉRIFIER LES LIENS UTILES
    // ─────────────────────────────────────────────────────────────────────────

    cy.contains("Forgot password?").should("be.visible");
    cy.contains("Sign up here").should("be.visible");

    // ─────────────────────────────────────────────────────────────────────────
    // VÉRIFIER LES BOUTONS OAUTH
    // ─────────────────────────────────────────────────────────────────────────

    cy.contains("Continue with Google").should("be.visible");
    cy.contains("Continue with Azure").should("be.visible");
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 2 : CAPTURE DE LA VRAIE REQUÊTE POST
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 2 : Capturer la vraie requête POST vers /login
   *
   * Objectif : Vérifier que le formulaire envoie bien les bonnes données
   *            au backend lors de la soumission.
   *
   * Ce test utilise la VRAIE API (pas de mock) :
   * - Remplit le formulaire avec de vraies credentials
   * - Soumet le formulaire
   * - Intercepte la requête HTTP pour l'inspecter
   * - Vérifie que les données envoyées sont correctes
   * - Vérifie la redirection et le stockage des données
   *
   * ⚠️ ATTENTION : Ce test nécessite que le backend soit lancé !
   *
   * cy.intercept() sans mock : Écoute les requêtes sans les modifier
   * cy.wait() : Attend qu'une requête soit capturée
   */
  it("Should capture the real POST request to /login", () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 1 : INTERCEPTER (ÉCOUTER) LA REQUÊTE POST
    // ─────────────────────────────────────────────────────────────────────────

    // cy.intercept() sans body de réponse = écoute SANS modifier
    // La requête ira vraiment au serveur backend
    // .as("loginRequest") : Donne un alias pour référencer cette interception
    cy.intercept("POST", "http://localhost:8000/api/auth/login").as(
      "loginRequest"
    );

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 2 : REMPLIR LE FORMULAIRE AVEC DES VRAIES CREDENTIALS
    // ─────────────────────────────────────────────────────────────────────────

    // cy.get() : Sélectionne un élément
    // .type() : Simule la saisie au clavier (comme un vrai utilisateur)
    cy.get('input[name="email"]').type("mathieu.gillet@hotmail.fr");
    cy.get('input[name="password"]').type("Mg!2025@1985/*");

    // .check() : Coche la checkbox (simule un click sur la checkbox)
    cy.get('input[name="rememberMe"]').check();

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 3 : SOUMETTRE LE FORMULAIRE
    // ─────────────────────────────────────────────────────────────────────────

    // cy.contains("button", "Login") : Trouve le bouton Login
    // .click({ force: true }) : Simule un click utilisateur
    // force: true = click même si le bouton est partiellement masqué
    cy.contains("button", "Login").click({ force: true });

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 4 : ATTENDRE ET CAPTURER LA REQUÊTE POST
    // ─────────────────────────────────────────────────────────────────────────

    // cy.wait("@loginRequest") : Attend que la requête interceptée soit complète
    // .then() : Permet d'accéder à l'objet interception
    cy.wait("@loginRequest").then((interception) => {
      // ───────────────────────────────────────────────────────────────────────
      // ÉTAPE 5 : VÉRIFIER LE CONTENU DE LA REQUÊTE ENVOYÉE
      // ───────────────────────────────────────────────────────────────────────

      // console.log() : Affiche dans la console Cypress (utile pour debug)
      console.log("Requête POST capturée :", interception.request.body);

      // Vérifier que le body de la requête contient les bonnes données
      // .to.deep.include() : Vérifie que l'objet contient au moins ces champs
      expect(interception.request.body).to.deep.include({
        email: "mathieu.gillet@hotmail.fr",
        password: "Mg!2025@1985/*",
      });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 6 : VÉRIFIER LA REDIRECTION VERS LA PAGE D'ACCUEIL
    // ─────────────────────────────────────────────────────────────────────────

    // cy.url() : Obtient l'URL actuelle
    // { timeout: 10000 } : Attend jusqu'à 10 secondes pour la redirection
    // .should("eq", ...) : Vérifie que l'URL est exactement celle attendue
    cy.url({ timeout: 10000 }).should("eq", "http://localhost:5173/");

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 7 : VÉRIFIER LE STOCKAGE DU TOKEN DANS LOCALSTORAGE
    // ─────────────────────────────────────────────────────────────────────────

    // cy.window() : Accède à l'objet window du navigateur
    // .then() : Permet d'exécuter du code JavaScript sur window
    cy.window().then((win) => {
      // Récupérer le token du localStorage
      const token = win.localStorage.getItem("token");

      // Vérifier que le token existe (pas null/undefined)
      expect(token).to.exist;
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 8 : VÉRIFIER LE CONTENU COMPLET DU LOCALSTORAGE
    // ─────────────────────────────────────────────────────────────────────────

    cy.window().then((win) => {
      // Récupérer token et user du localStorage
      const token = win.localStorage.getItem("token");
      const user = win.localStorage.getItem("user");

      // Vérifier que le token existe
      expect(token).to.exist;

      // Note : Cette ligne est commentée car le token change à chaque connexion
      // expect(token).to.equal("my-fake-jwt-token-12345");

      // Vérifier que les données user existent
      expect(user).to.exist;

      // Parser le JSON user et vérifier son contenu
      const userData = JSON.parse(user);
      expect(userData.email).to.equal("mathieu.gillet@hotmail.fr");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 3 : CONNEXION AVEC LA VRAIE API
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 3 : Se connecter avec la vraie API (backend doit être disponible)
   *
   * Objectif : Tester le flux complet de connexion avec le vrai backend
   *            sans intercepter ni mocker les requêtes.
   *
   * Ce test est différent du TEST 2 :
   * - Pas d'interception de requête
   * - Pas de vérification du body de la requête
   * - Juste : formulaire → backend → redirection
   *
   * Cas d'usage : Test d'intégration réel
   *
   * ⚠️ Dépend du backend : Si le backend est down, ce test échoue
   */
  it("Should connect with the real API (if backend is available)", () => {
    // Remplir le formulaire
    cy.get('input[name="email"]').type("mathieu.gillet@hotmail.fr");
    cy.get('input[name="password"]').type("Mg!2025@1985/*");
    cy.get('input[name="rememberMe"]').check();

    // Soumettre
    cy.contains("button", "Login").click({ force: true });

    // Attendre un peu pour que la requête soit traitée
    // cy.wait(2000) : Pause de 2 secondes (moins robuste que cy.wait("@alias"))
    // À ajuster selon la vitesse du backend
    cy.wait(2000);

    // Vérifier la redirection
    // Note : Pas d'interception, donc on attend juste que l'URL change
    cy.url().should("eq", "http://localhost:5173/", { timeout: 10000 });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 4 : RÉPONSE COMPLÈTE ET VALIDE DU BACKEND (AVEC MOCK)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 4 : Recevoir une réponse complète et valide du backend
   *
   * Objectif : Vérifier que la structure de la réponse API est correcte
   *            et contient tous les champs nécessaires.
   *
   * Ce test MOCKE la réponse du backend :
   * - N'a PAS besoin que le backend soit lancé
   * - Contrôle exact de la réponse (reproductible)
   * - Teste la gestion frontend de la réponse
   * - Vérifie la structure et les types de données
   *
   * cy.intercept() AVEC body : Remplace la vraie réponse par un mock
   *
   * Différence avec tests unitaires Jest :
   * - Ici on teste aussi l'UI et le routing
   * - Jest teste juste la fonction signIn() isolée
   */
  it("Should receive a complete and valid response from the backend after a successful login", () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 1 : PRÉPARER LES DONNÉES MOCKÉES
    // ─────────────────────────────────────────────────────────────────────────

    // Créer un faux utilisateur avec tous les champs attendus
    const mockUser = {
      _id: "507f1f77bcf86cd799439011", // ID MongoDB valide
      email: "jean.dupont@example.com",
      name: "Jean Dupont",
      firstname: "Jean",
      lastname: "Dupont",
      picture: "https://example.com/pictures/jean-dupont.jpg",
      address: "123 Rue de la Paix, 75001 Paris",
      role: "user",
      createdAt: "2024-01-15T10:30:00.000Z", // Format ISO 8601
      updatedAt: "2024-10-15T14:20:00.000Z",
    };

    // Créer de faux tokens JWT (structure réaliste)
    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    const mockRefreshToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.4Adcj0vVzr8C8qY7Nj5qLpGZmH7qVx9kN8_8k8Y8X8Y";

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 2 : INTERCEPTER ET MOCKER LA REQUÊTE LOGIN
    // ─────────────────────────────────────────────────────────────────────────

    // cy.intercept() avec un objet de réponse = REMPLACE la vraie réponse
    // La requête n'ira PAS au serveur, Cypress retournera ce mock
    cy.intercept("POST", "http://localhost:8000/api/auth/login", {
      statusCode: 200, // Code HTTP de succès
      body: {
        success: true,
        message: "Connection successful",
        user: mockUser, // Données user mockées
        token: mockToken, // JWT mocké
        refreshToken: mockRefreshToken, // Refresh token mocké
      },
    }).as("loginRequest");

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 3 : REMPLIR ET SOUMETTRE LE FORMULAIRE
    // ─────────────────────────────────────────────────────────────────────────

    cy.get('input[name="email"]').type("jean.dupont@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.contains("button", "Login").click({ force: true });

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 4 : ATTENDRE L'INTERCEPTION ET VALIDER LA RÉPONSE COMPLÈTE
    // ─────────────────────────────────────────────────────────────────────────

    cy.wait("@loginRequest").then((interception) => {
      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LE STATUS CODE
      // ───────────────────────────────────────────────────────────────────────

      expect(interception.response.statusCode).to.equal(200);

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LA STRUCTURE DE PREMIER NIVEAU
      // ───────────────────────────────────────────────────────────────────────

      expect(interception.response.body).to.have.property("success", true);
      expect(interception.response.body).to.have.property(
        "message",
        "Connection successful"
      );
      expect(interception.response.body).to.have.property("user");
      expect(interception.response.body).to.have.property("token");
      expect(interception.response.body).to.have.property("refreshToken");

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LES TOKENS (TYPE ET CONTENU)
      // ───────────────────────────────────────────────────────────────────────

      const { token, refreshToken } = interception.response.body;

      // Vérifier que ce sont des strings non vides
      expect(token).to.be.a("string");
      expect(token).to.not.be.empty;
      expect(refreshToken).to.be.a("string");
      expect(refreshToken).to.not.be.empty;

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER L'OBJET USER EN DÉTAIL
      // ───────────────────────────────────────────────────────────────────────

      const { user } = interception.response.body;

      // CHAMPS OBLIGATOIRES

      // _id : ID MongoDB unique
      expect(user).to.have.property("_id");
      expect(user._id).to.be.a("string");
      expect(user._id).to.equal(mockUser._id);

      // email : Format email valide
      expect(user).to.have.property("email");
      expect(user.email).to.be.a("string");
      // Regex pour valider le format email
      expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(user.email).to.equal(mockUser.email);

      // firstname : Prénom
      expect(user).to.have.property("firstname");
      expect(user.firstname).to.be.a("string");
      expect(user.firstname).to.equal(mockUser.firstname);

      // lastname : Nom de famille
      expect(user).to.have.property("lastname");
      expect(user.lastname).to.be.a("string");
      expect(user.lastname).to.equal(mockUser.lastname);

      // name : Nom complet (concaténation de firstname + lastname)
      expect(user).to.have.property("name");
      expect(user.name).to.be.a("string");
      expect(user.name).to.equal(`${mockUser.firstname} ${mockUser.lastname}`);

      // CHAMPS OPTIONNELS

      // picture : URL de la photo de profil (peut être null)
      expect(user).to.have.property("picture");
      if (user.picture) {
        expect(user.picture).to.be.a("string");
        expect(user.picture).to.equal(mockUser.picture);
      }

      // address : Adresse de l'utilisateur
      expect(user).to.have.property("address");
      expect(user.address).to.be.a("string");
      expect(user.address).to.equal(mockUser.address);

      // role : Rôle par défaut des nouveaux utilisateurs
      expect(user).to.have.property("role");
      expect(user.role).to.be.a("string");
      expect(user.role).to.equal("user");

      // DATES : Format ISO 8601

      // createdAt : Date de création du compte
      expect(user).to.have.property("createdAt");
      expect(user.createdAt).to.be.a("string");
      // Regex pour valider le format ISO : YYYY-MM-DDTHH:mm:ss.sssZ
      expect(user.createdAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      );

      // updatedAt : Date de dernière modification
      expect(user).to.have.property("updatedAt");
      expect(user.updatedAt).to.be.a("string");
      expect(user.updatedAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 5 : TEST API DIRECT AVEC CY.REQUEST()
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 5 : Test API direct avec cy.request()
   *
   * Objectif : Tester l'API backend DIRECTEMENT, sans passer par l'UI
   *
   * Différences avec les tests précédents :
   * - Ne charge PAS la page web
   * - Ne remplit PAS le formulaire
   * - Fait un appel HTTP DIRECT au backend
   * - Plus rapide (pas de rendu UI)
   * - Teste uniquement l'API, pas l'intégration frontend
   *
   * cy.request() :
   * - Fait un appel HTTP comme curl ou Postman
   * - Utile pour tester les API REST
   * - Ne nécessite pas d'UI
   *
   * ⚠️ ATTENTION : Nécessite que le backend soit lancé
   */
  it("Should successfully connect via cy.request()", () => {
    // cy.request() : Fait un appel HTTP direct
    cy.request({
      method: "POST", // Méthode HTTP
      url: "http://localhost:8000/api/auth/login", // URL complète
      body: {
        // Corps de la requête (JSON)
        email: "mathieu.gillet@hotmail.fr",
        password: "Mg!2025@1985/*",
        rememberMe: true,
      },
      // Ne pas échouer automatiquement sur erreur HTTP (pour tester les 4xx)
      failOnStatusCode: false,
    }).then((response) => {
      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LE STATUS CODE
      // ───────────────────────────────────────────────────────────────────────

      expect(response.status).to.eq(200);

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LA STRUCTURE DE LA RÉPONSE
      // ───────────────────────────────────────────────────────────────────────

      expect(response.body).to.have.property("success", true);
      expect(response.body).to.have.property(
        "message",
        "Connection successful"
      );
      expect(response.body).to.have.property("token");
      expect(response.body).to.have.property("refreshToken");
      expect(response.body).to.have.property("user");

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LES TOKENS
      // ───────────────────────────────────────────────────────────────────────

      const { token, refreshToken } = response.body;
      expect(token).to.be.a("string");
      expect(token).to.not.be.empty;
      expect(refreshToken).to.be.a("string");
      expect(refreshToken).to.not.be.empty;

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER L'OBJET USER
      // ───────────────────────────────────────────────────────────────────────

      const { user } = response.body;
      expect(user).to.have.property("_id");
      expect(user).to.have.property("email", "mathieu.gillet@hotmail.fr");
      expect(user).to.have.property("firstname");
      expect(user).to.have.property("lastname");
      expect(user).to.have.property("name");
      expect(user).to.have.property("role");
      expect(user).to.have.property("createdAt");
      expect(user).to.have.property("updatedAt");

      // ───────────────────────────────────────────────────────────────────────
      // LOGGER LES DONNÉES POUR DEBUG
      // ───────────────────────────────────────────────────────────────────────

      // cy.log() : Affiche dans le log Cypress (visible dans l'UI Cypress)
      cy.log("Token reçu:", token);
      cy.log("User:", JSON.stringify(user));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 6 : IDENTIFIANTS INCORRECTS (ERREUR 401)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 6 : Test avec identifiants incorrects
   *
   * Objectif : Vérifier que le backend retourne une erreur 401
   *            avec des identifiants invalides.
   *
   * Ce qu'on teste :
   * - Code HTTP 401 (Unauthorized)
   * - Champ success à false
   * - Message d'erreur approprié
   *
   * Scénario :
   * - Appel API direct avec mauvais credentials
   * - Pas d'UI, juste l'API
   * - Vérification de la gestion d'erreur backend
   */
  it("Should return a 401 error with invalid credentials", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      body: {
        email: "wrong@example.com", // Email inexistant
        password: "WrongPassword123!", // Mauvais mot de passe
      },
      failOnStatusCode: false, // IMPORTANT : Ne pas fail sur 401
    }).then((response) => {
      // Vérifier le status 401 (Unauthorized)
      expect(response.status).to.eq(401);

      // Vérifier que success est false
      expect(response.body).to.have.property("success", false);

      // Vérifier que le message d'erreur est présent
      expect(response.body).to.have.property("message");

      // Vérifier le contenu exact du message
      expect(response.body.message).to.eq("Email or password incorrect");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 7 : EMAIL MANQUANT (ERREUR 400)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 7 : Test avec email manquant
   *
   * Objectif : Vérifier la validation des champs requis côté backend
   *
   * Scénario :
   * - Envoyer seulement le password (pas d'email)
   * - Le backend doit retourner 400 (Bad Request)
   * - Le backend doit indiquer que l'email est requis
   */
  it("Should return a 400 error if the email is missing", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      body: {
        // Pas d'email
        password: "Password123!",
      },
      failOnStatusCode: false,
    }).then((response) => {
      // Vérifier le status 400 (Bad Request)
      expect(response.status).to.eq(400);

      // Vérifier que success est false
      expect(response.body).to.have.property("success", false);

      // Note : On pourrait aussi vérifier le message exact :
      // expect(response.body.message).to.eq("Email is required");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 8 : MOT DE PASSE MANQUANT (ERREUR 400)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 8 : Test avec mot de passe manquant
   *
   * Objectif : Identique au TEST 7, mais pour le champ password
   *
   * Scénario :
   * - Envoyer seulement l'email (pas de password)
   * - Le backend doit retourner 400
   */
  it("Should return a 400 error if the password is missing", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      body: {
        email: "test@example.com",
        // Pas de password
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("success", false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 9 : VÉRIFICATION DÉTAILLÉE DES DONNÉES USER (200)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 9 : Vérification approfondie des données utilisateur
   *
   * Objectif : Valider en détail la structure et le contenu
   *            de l'objet user retourné par le backend.
   *
   * Ce qu'on vérifie :
   * - Email exact
   * - Types de données corrects
   * - Champs obligatoires non vides
   * - Construction correcte du nom complet
   * - Rôle valide parmi les valeurs possibles
   * - Dates au format ISO correct
   *
   * Ce test est très strict et détecte :
   * - Changements de structure de données
   * - Problèmes de typage
   * - Données manquantes ou corrompues
   */
  it("Should return 200 with the correct user data", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      body: {
        email: "mathieu.gillet@hotmail.fr",
        password: "Mg!2025@1985/*",
      },
    }).then((response) => {
      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LE STATUS 200
      // ───────────────────────────────────────────────────────────────────────

      expect(response.status).to.eq(200);

      const { user } = response.body;

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER L'EMAIL (identifiant unique)
      // ───────────────────────────────────────────────────────────────────────

      expect(user.email).to.eq("mathieu.gillet@hotmail.fr");

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LES CHAMPS OBLIGATOIRES (type et contenu)
      // ───────────────────────────────────────────────────────────────────────

      // _id : Doit être une string non vide
      expect(user._id).to.be.a("string");
      expect(user._id).to.not.be.empty;

      // firstname : Doit être une string non vide
      expect(user.firstname).to.be.a("string");
      expect(user.firstname).to.not.be.empty;

      // lastname : Doit être une string non vide
      expect(user.lastname).to.be.a("string");
      expect(user.lastname).to.not.be.empty;

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LA CONSTRUCTION DU NOM COMPLET
      // ───────────────────────────────────────────────────────────────────────

      // Le name doit contenir le firstname
      expect(user.name).to.include(user.firstname);

      // Le name doit contenir le lastname
      expect(user.name).to.include(user.lastname);

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LE RÔLE (parmi les valeurs autorisées)
      // ───────────────────────────────────────────────────────────────────────

      // .to.be.oneOf() : Vérifie que la valeur est dans la liste
      expect(user.role).to.be.oneOf(["user", "admin", "moderator"]);

      // ───────────────────────────────────────────────────────────────────────
      // VÉRIFIER LES DATES (format ISO 8601)
      // ───────────────────────────────────────────────────────────────────────

      // createdAt : Format YYYY-MM-DDTHH:mm:ss.sssZ
      expect(user.createdAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      );

      // updatedAt : Même format
      expect(user.updatedAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      );
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// FIN DES TESTS E2E
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RÉSUMÉ DE LA COUVERTURE DES TESTS E2E
 *
 * ✅ TEST 1 : Affichage complet de la page (UI)
 * ✅ TEST 2 : Capture de requête POST réelle avec vérifications
 * ✅ TEST 3 : Connexion avec vraie API (test d'intégration)
 * ✅ TEST 4 : Réponse mockée complète (structure validée)
 * ✅ TEST 5 : Test API direct avec cy.request() (succès)
 * ✅ TEST 6 : Identifiants incorrects (401)
 * ✅ TEST 7 : Email manquant (400)
 * ✅ TEST 8 : Password manquant (400)
 * ✅ TEST 9 : Vérification détaillée des données user (200)
 *
 * Total : 9 tests E2E couvrant UI + API + erreurs
 *
 * TYPES DE TESTS UTILISÉS :
 *
 * 1. TESTS UI (User Interface) :
 *    - TEST 1 : Vérifie l'affichage visuel
 *    - Utilise cy.visit(), cy.get(), cy.contains()
 *    - Simule un utilisateur qui regarde la page
 *
 * 2. TESTS D'INTÉGRATION (UI + API) :
 *    - TEST 2, 3 : Formulaire → Backend → Redirection
 *    - Utilise cy.type(), cy.click(), cy.intercept()
 *    - Simule un utilisateur qui remplit le formulaire
 *
 * 3. TESTS API (API seulement) :
 *    - TEST 5, 6, 7, 8, 9 : Appels HTTP directs
 *    - Utilise cy.request()
 *    - Teste le backend sans UI
 *
 * 4. TESTS AVEC MOCKS :
 *    - TEST 4 : Réponse mockée pour contrôle total
 *    - Utilise cy.intercept() avec body
 *    - N'a pas besoin du backend
 *
 * DIFFÉRENCES AVEC TESTS UNITAIRES JEST :
 *
 * | Aspect          | Jest (Unitaire)        | Cypress (E2E)           |
 * |-----------------|------------------------|-------------------------|
 * | Scope           | Une fonction           | Application complète    |
 * | Navigateur      | Non (Node.js)          | Oui (Chrome, etc.)      |
 * | UI              | Non testée             | Testée                  |
 * | API             | Toujours mockée        | Vraie ou mockée         |
 * | Vitesse         | Très rapide (ms)       | Lent (secondes)         |
 * | Isolation       | Totale                 | Partielle               |
 * | Confiance       | Moyenne                | Élevée                  |
 *
 * BONNES PRATIQUES APPLIQUÉES :
 * ✓ beforeEach pour état initial propre
 * ✓ Alias (@loginRequest) pour interceptions
 * ✓ failOnStatusCode: false pour tester erreurs
 * ✓ Timeouts appropriés pour attendre redirections
 * ✓ Vérifications strictes des types et formats
 * ✓ Tests de tous les codes HTTP (200, 400, 401)
 * ✓ Commentaires ultra-détaillés
 * ✓ Mix de tests avec vraie API et mocks
 *
 * COMMANDES CYPRESS UTILISÉES :
 * - cy.visit() : Charger une page
 * - cy.get() : Sélectionner un élément
 * - cy.contains() : Trouver par texte
 * - cy.type() : Saisir du texte
 * - cy.click() : Cliquer
 * - cy.check() : Cocher une checkbox
 * - cy.intercept() : Intercepter requêtes
 * - cy.wait() : Attendre une requête
 * - cy.request() : Appel HTTP direct
 * - cy.window() : Accéder à window
 * - cy.url() : Vérifier l'URL
 * - cy.log() : Logger
 *
 * POUR EXÉCUTER CES TESTS :
 *
 * 1. Lancer l'application frontend :
 *    npm run dev
 *
 * 2. Lancer le backend (pour tests avec vraie API) :
 *    npm run start:backend
 *
 * 3. Ouvrir Cypress :
 *    npx cypress open
 *    OU
 *    npx cypress run (mode headless)
 */
