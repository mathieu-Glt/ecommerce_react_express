describe("Test de la Page de Registration", () => {
  // Avant chaque test, on visite la page de registration
  beforeEach(() => {
    cy.visit("http://localhost:5173/register");
  });

  /**
   * TEST 1 : Vérifier que la page de registration s'affiche correctement
   */
  it("Devrait afficher tous les éléments de la page de création de compte", () => {
    // Vérifier le titre et sous-titre
    cy.contains("Créez votre compte").should("be.visible");
    cy.contains("Rejoignez-nous dès aujourd'hui").should("be.visible");

    // Vérifier que le logo est présent
    cy.get(".register-logo").should("exist");

    // Vérifier que les champs du formulaire sont présents
    cy.get('input[name="firstname"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter first name");

    cy.get('input[name="lastname"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter last name");

    cy.get('input[name="email"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter email");

    cy.get('input[name="password"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter password");

    cy.get('input[name="confirmPassword"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Confirm password");

    cy.get('input[name="picture"]')
      .should("be.visible")
      .and("have.attr", "type", "file");

    cy.get('textarea[name="address"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter your address");

    // Vérifier le bouton de création de compte
    cy.contains("button", "Create Account").should("be.visible");

    // Vérifier les liens
    cy.contains("Already have an account?").should("be.visible");
    cy.contains("Sign in here").should("be.visible");
  });

  /**
   * TEST 2 : Validation des champs obligatoires vides
   */
  it("Devrait afficher des erreurs pour les champs obligatoires vides", () => {
    // Cliquer sur chaque champ et le quitter sans remplir (trigger blur)
    cy.get('input[name="firstname"]').focus().blur();
    cy.get('input[name="lastname"]').focus().blur();
    cy.get('input[name="email"]').focus().blur();
    cy.get('input[name="password"]').focus().blur();
    cy.get('input[name="confirmPassword"]').focus().blur();

    // Vérifier que les messages d'erreur s'affichent
    cy.contains("First name is required").should("be.visible");
    cy.contains("Last name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
    cy.contains("ConfirmPassword is required").should("be.visible");

    // Vérifier que le bouton est désactivé
    cy.contains("button", "Create Account").should("be.disabled");
  });

  /**
   * TEST 3 : Email complètement invalide (sans @)
   * Déclenche : .email("Please enter a valid email address")
   */
  it("Devrait afficher 'Please enter a valid email address' pour un email sans @", () => {
    cy.get('input[name="email"]').type("emailinvalide").blur();

    // Message de la validation .email()
    cy.contains("Please enter a valid email address").should("be.visible");
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 4 : Email invalide (avec @ mais format incorrect)
   * Déclenche : .email("Please enter a valid email address")
   */
  it("Devrait afficher 'Please enter a valid email address' pour un email mal formaté", () => {
    cy.get('input[name="email"]').type("email@").blur();

    cy.contains("Please enter a valid email address").should("be.visible");
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 5 : Email sans partie locale (clairement invalide)
   */
  it("Devrait afficher une erreur pour un email sans partie locale", () => {
    cy.get('input[name="email"]').clear().type("@example.com").blur();

    // Vérifier le message d'erreur spécifique
    cy.get(".invalid-feedback")
      .should("be.visible")
      .and("contain", "Please enter a valid email address");

    // Vérifier que le champ est marqué comme invalide
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 6 : Email qui passe .email() mais échoue sur .matches(EMAIL_REGEX)
   */
  it("Devrait afficher 'Email format is invalid' pour un email non conforme au regex", () => {
    cy.get('input[name="email"]').type("test@domain").blur();

    cy.contains("Email format is invalid").should("be.visible");
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 7 : Email vide (champ requis)
   * Déclenche : .required("Email is required")
   */
  it("Devrait afficher 'Email is required' pour un champ vide", () => {
    cy.get('input[name="email"]').focus().blur();

    cy.contains("Email is required").should("be.visible");
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 8 : Email valide qui passe toutes les validations
   */
  it("Devrait accepter un email valide", () => {
    cy.get('input[name="email"]').type("mathieu.gillet@hotmail.fr").blur();

    // Pas de message d'erreur
    cy.contains("Please enter a valid email address").should("not.exist");
    cy.contains("Email format is invalid").should("not.exist");
    cy.contains("Email is required").should("not.exist");

    // Le champ est marqué comme valide
    cy.get('input[name="email"]').should("have.class", "is-valid");
  });

  /**
   * TEST 9 : Tester différents formats d'emails invalides
   */
  it("Devrait rejeter plusieurs formats d'emails invalides", () => {
    const invalidEmails = [
      "plaintext",
      "@example.com",
      "user@",
      "user @example.com",
      "user@.com",
      "user..name@example.com",
    ];

    invalidEmails.forEach((email) => {
      cy.get('input[name="email"]').clear().type(email).blur();

      // Devrait afficher une erreur (soit .email() soit .matches())
      cy.get('input[name="email"]').should("have.class", "is-invalid");

      cy.log(`❌ Email invalide rejeté: ${email}`);
    });
  });

  /**
   * TEST 10 : Tester différents formats d'emails valides
   */
  it("Devrait accepter plusieurs formats d'emails valides", () => {
    const validEmails = [
      "simple@example.com",
      "user.name@example.com",
      "user+tag@example.fr",
      "test123@test-domain.co.uk",
    ];

    validEmails.forEach((email) => {
      cy.get('input[name="email"]').clear().type(email).blur();

      // Ne devrait PAS afficher d'erreur (selon ton EMAIL_REGEX)
      cy.get('input[name="email"]').should("have.class", "is-valid");

      cy.log(`✅ Email valide accepté: ${email}`);
    });
  });

  /**
   * TEST 11 : Test de la séquence de validation (order matters)
   */
  it("Devrait valider dans l'ordre : required → email → matches", () => {
    // 1️⃣ Champ vide → required
    cy.get('input[name="email"]').focus().blur();
    cy.contains("Email is required").should("be.visible");

    // 2️⃣ Email invalide → .email()
    cy.get('input[name="email"]').type("invalide").blur();
    cy.contains("Please enter a valid email address").should("be.visible");

    // 3️⃣ Email valide (si on arrive jusqu'ici)
    cy.get('input[name="email"]').clear().type("test@example.com").blur();
    cy.get('input[name="email"]').should("have.class", "is-valid");
  });

  /**
   * TEST 12 : Vérifier que les erreurs disparaissent après correction
   */
  it("Devrait masquer l'erreur après correction de l'email", () => {
    // Taper un email invalide
    cy.get('input[name="email"]').type("invalide").blur();

    cy.contains("Please enter a valid email address").should("be.visible");
    cy.get('input[name="email"]').should("have.class", "is-invalid");

    // Corriger l'email
    cy.get('input[name="email"]').clear().type("valide@example.com").blur();

    // L'erreur doit disparaître
    cy.contains("Please enter a valid email address").should("not.exist");
    cy.get('input[name="email"]').should("have.class", "is-valid");
  });

  /**
   * TEST 13 : Validation de la longueur minimale du mot de passe
   */
  it("Devrait afficher une erreur si le mot de passe est trop court", () => {
    cy.get('input[name="password"]').type("1234").blur();

    // Vérifier le message d'erreur
    cy.contains("Password must be at least 8 characters").should("be.visible");
    cy.get('input[name="password"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 14 : Validation de la correspondance des mots de passe
   */
  it("Devrait afficher une erreur si les mots de passe ne correspondent pas", () => {
    cy.get('input[name="password"]').type("Password123!").blur();
    cy.get('input[name="confirmPassword"]').type("Password456!").blur();

    // Vérifier le message d'erreur
    cy.contains("Passwords must match").should("be.visible");
    cy.get('input[name="confirmPassword"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 15 : Upload d'une image de profil
   */
  it("Devrait permettre l'upload d'une image de profil", () => {
    // Créer un fichier fictif pour le test
    const fileName = "profile-picture.jpg";

    cy.get('input[name="picture"]').selectFile({
      contents: Cypress.Buffer.from("fake image content"),
      fileName: fileName,
      mimeType: "image/jpeg",
    });

    // Vérifier que le nom du fichier s'affiche
    cy.contains(`✓ File selected: ${fileName}`).should("be.visible");
  });

  /**
   * TEST 16 : Validation de la taille du fichier (optionnel selon votre validation)
   */
  // it("Devrait afficher une erreur si le fichier est trop volumineux", () => {
  //   // Créer un fichier de plus de 5MB
  //   const largeFile = new Uint8Array(6 * 1024 * 1024); // 6MB

  //   cy.get('input[name="picture"]').selectFile(
  //     {
  //       contents: largeFile,
  //       fileName: "large-picture.jpg",
  //       mimeType: "image/jpeg",
  //     },
  //     { force: true }
  //   );

  //   // Vérifier le message d'erreur si votre validation gère ça
  //   cy.contains("File size must be less than 5MB").should("be.visible");
  // });

  /**
   * TEST 17 : Remplissage complet du formulaire avec données valides
   */
  it("Devrait permettre de remplir tous les champs avec des données valides", () => {
    // Remplir tous les champs
    cy.get('input[name="firstname"]').type("Jean");
    cy.get('input[name="lastname"]').type("Dupont");
    cy.get('input[name="email"]').type("jean.dupont@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="confirmPassword"]').type("Password123!");
    cy.get('textarea[name="address"]').type("123 Rue de la Paix, Paris");

    // Vérifier que tous les champs sont valides
    cy.get('input[name="firstname"]').should("have.class", "is-valid");
    cy.get('input[name="lastname"]').should("have.class", "is-valid");
    cy.get('input[name="email"]').should("have.class", "is-valid");
    cy.get('input[name="password"]').should("have.class", "is-valid");
    cy.get('input[name="confirmPassword"]').should("have.class", "is-valid");
    cy.get('textarea[name="address"]').should("have.class", "is-valid");

    // Vérifier que le bouton est activé
    cy.contains("button", "Create Account").should("not.be.disabled");
  });

  /**
   * TEST 18 : Soumission réussie du formulaire
   */
  it("Devrait créer un compte avec succès et rediriger", () => {
    // Intercepter la requête API
    cy.intercept("POST", "http://localhost:8000/api/auth/register", {
      statusCode: 201,
      body: {
        success: true,
        message: "Account created successfully",
        user: {
          id: "123",
          email: "jean.dupont@example.com",
          firstname: "Jean",
          lastname: "Dupont",
        },
      },
    }).as("registerRequest");

    // Remplir le formulaire
    cy.get('input[name="firstname"]').type("Jean");
    cy.get('input[name="lastname"]').type("Dupont");
    cy.get('input[name="email"]').type("jean.dupont@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="confirmPassword"]').type("Password123!");

    // Soumettre le formulaire
    cy.contains("button", "Create Account").click();

    // Vérifier que la requête a été envoyée
    cy.wait("@registerRequest");

    // Vérifier le spinner pendant le chargement
    cy.contains("Creating Account...").should("be.visible");

    // Vérifier la redirection (adapter selon votre logique)
    cy.url().should("include", "/login");
  });

  /**
   * TEST 19 : Gestion des erreurs du backend (email déjà utilisé)
   */
  it("Devrait afficher une erreur si l'email existe déjà", () => {
    cy.intercept("POST", "http://localhost:8000/api/auth/register", {
      statusCode: 400,
      body: {
        success: false,
        error: "Email already exists",
      },
    }).as("registerError");

    // Remplir le formulaire
    cy.get('input[name="firstname"]').type("Jean");
    cy.get('input[name="lastname"]').type("Dupont");
    cy.get('input[name="email"]').type("existing@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="confirmPassword"]').type("Password123!");

    // Soumettre le formulaire
    cy.contains("button", "Create Account").click({ force: true });

    // Attendre la réponse
    cy.wait("@registerError");

    // Vérifier que l'alerte d'erreur s'affiche
    cy.get(".alert.alert-danger").should("be.visible");

    // Vérifier le titre
    cy.get(".alert-heading").should("contain", "Registration Failed");

    // Vérifier le message d'erreur dans le paragraphe
    // Utiliser .contains sur l'alerte entière (plus robuste)
    cy.get(".alert.alert-danger").should(
      "contain.text",
      "Email already exists"
    );
  });

  /**
   * TEST 20 : Navigation vers la page de login
   */
  it("Devrait permettre de naviguer vers la page de login", () => {
    // Cliquer sur le lien "Sign in here"
    cy.contains("Sign in here").click();

    // Vérifier la navigation
    cy.url().should("include", "/login");
  });

  /**
   * TEST 21 : Le bouton reste désactivé si le formulaire n'est pas valide
   */
  it("Devrait garder le bouton désactivé tant que le formulaire n'est pas valide", () => {
    // Remplir partiellement le formulaire
    cy.get('input[name="firstname"]').type("Jean");
    cy.get('input[name="lastname"]').type("Dupont");
    // Ne pas remplir l'email

    // Le bouton devrait rester désactivé
    cy.contains("button", "Create Account").should("be.disabled");

    // Compléter l'email
    cy.get('input[name="email"]').type("jean@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="confirmPassword"]').type("Password123!");

    // Le bouton devrait maintenant être activé
    cy.contains("button", "Create Account").should("not.be.disabled");
  });

  /**
   * TEST 22 : Vérifier que les champs sont désactivés pendant le chargement
   */
  // it("Devrait désactiver tous les champs pendant la soumission", () => {
  //   // Intercepter la requête avec un délai
  //   cy.intercept("POST", "**/api/auth/register", (req) => {
  //     req.reply((res) => {
  //       res.delay = 2000; // Délai de 2 secondes
  //       res.send({
  //         statusCode: 201,
  //         body: { success: true },
  //       });
  //     });
  //   }).as("slowRegister");

  //   // Remplir et soumettre le formulaire
  //   cy.get('input[name="firstname"]').type("Jean");
  //   cy.get('input[name="lastname"]').type("Dupont");
  //   cy.get('input[name="email"]').type("jean@example.com");
  //   cy.get('input[name="password"]').type("Password123!");
  //   cy.get('input[name="confirmPassword"]').type("Password123!");
  //   cy.contains("button", "Create Account").click();

  //   // Vérifier que les champs sont désactivés
  //   cy.get('input[name="firstname"]').should("be.disabled");
  //   cy.get('input[name="email"]').should("be.disabled");
  //   cy.get('input[name="password"]').should("be.disabled");
  //   cy.contains("button", "Create Account").should("be.disabled");
  // });

  /**
   * TEST 23 : Validation du champ address (optionnel)
   */
  it("Devrait permettre de laisser l'adresse vide (champ optionnel)", () => {
    // Remplir seulement les champs obligatoires
    cy.get('input[name="firstname"]').type("Jean");
    cy.get('input[name="lastname"]').type("Dupont");
    cy.get('input[name="email"]').type("jean@example.com");
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="confirmPassword"]').type("Password123!");

    // Ne pas remplir l'adresse
    // Le bouton devrait être activé quand même
    cy.contains("button", "Create Account").should("not.be.disabled");
  });

  /**
   * TEST 1 : Register réussi - Vérification complète de la structure
   */
  it("Devrait créer un compte avec succès et retourner le bon format", () => {
    // Générer un email unique pour éviter les conflits
    const timestamp = Date.now();
    const uniqueEmail = `test.user.${timestamp}@example.com`;

    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/auth/register",
      body: {
        firstname: "Jean",
        lastname: "Dupont",
        email: uniqueEmail,
        password: "Password123!",
        confirmPassword: "Password123!",
        address: "123 Rue de la Paix, Paris",
      },
      failOnStatusCode: false, // Pour voir les erreurs si ça échoue
    }).then((response) => {
      // ✅ 1. Vérifier le status code
      expect(response.status).to.eq(201);
      expect(response.statusText).to.eq("Created");

      // ✅ 2. Vérifier la structure de base de la réponse
      expect(response.body).to.have.property("success", true);
      expect(response.body).to.have.property("message");
      expect(response.body.message).to.include("Utilisateur créé avec succès");
      expect(response.body).to.have.property("user");

      // ✅ 3. Vérifier l'objet user complet
      const { user } = response.body;
      expect(user).to.be.an("object");

      // --- Champs OBLIGATOIRES ---

      // _id
      expect(user).to.have.property("_id");
      expect(user._id).to.be.a("string");
      expect(user._id).to.not.be.empty;
      expect(user._id).to.have.length.at.least(20); // MongoDB ObjectId fait 24 caractères
      cy.log("✅ _id:", user._id);

      // email
      expect(user).to.have.property("email");
      expect(user.email).to.be.a("string");
      expect(user.email).to.eq(uniqueEmail);
      expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Format email valide
      cy.log("✅ email:", user.email);

      // firstname
      expect(user).to.have.property("firstname");
      expect(user.firstname).to.be.a("string");
      expect(user.firstname).to.eq("Jean");
      cy.log("✅ firstname:", user.firstname);

      // lastname
      expect(user).to.have.property("lastname");
      expect(user.lastname).to.be.a("string");
      expect(user.lastname).to.eq("DUPONT");
      cy.log("✅ lastname:", user.lastname);

      // name (construit depuis firstname + lastname)
      // expect(user).to.have.property("name");
      // expect(user.name).to.be.a("string");
      // expect(user.name).to.eq("Jean Dupont");
      // expect(user.name).to.include(user.firstname);
      // expect(user.name).to.include(user.lastname);
      // cy.log("✅ name:", user.name);

      // role (par défaut "user")
      expect(user).to.have.property("role");
      expect(user.role).to.be.a("string");
      expect(user.role).to.eq("user");
      cy.log("✅ role:", user.role);

      // --- Champs OPTIONNELS ---

      // picture (peut être null ou une string)
      expect(user).to.have.property("picture");
      if (user.picture !== null) {
        expect(user.picture).to.be.a("string");
      }
      cy.log("✅ picture:", user.picture || "null");

      // address
      expect(user).to.have.property("address");
      expect(user.address).to.be.a("string");
      expect(user.address).to.eq("123 Rue de la Paix, Paris");
      cy.log("✅ address:", user.address);

      // --- Champs DATES ---

      // createdAt (format ISO 8601)
      expect(user).to.have.property("createdAt");
      expect(user.createdAt).to.be.a("string");
      expect(user.createdAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      );
      cy.log("✅ createdAt:", user.createdAt);

      // Vérifier que la date est récente (créée il y a moins de 5 secondes)
      const createdDate = new Date(user.createdAt);
      const now = new Date();
      const diffMs = now.getTime() - createdDate.getTime();
      expect(diffMs).to.be.lessThan(5000);

      // updatedAt (format ISO 8601)
      expect(user).to.have.property("updatedAt");
      expect(user.updatedAt).to.be.a("string");
      expect(user.updatedAt).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
      );
      cy.log("✅ updatedAt:", user.updatedAt);

      // createdAt et updatedAt devraient être très proches lors de la création
      const updatedDate = new Date(user.updatedAt);
      const dateDiff = Math.abs(createdDate.getTime() - updatedDate.getTime());
      expect(dateDiff).to.be.lessThan(1000); // Moins d'1 seconde de différence

      // ✅ 4. Vérifier qu'il n'y a PAS de champs sensibles
      expect(user).to.not.have.property("password");
      expect(user).to.not.have.property("confirmPassword");
      expect(user).to.not.have.property("__v");

      // ✅ 5. Logger toute la structure pour référence
      cy.log("📦 User complet:", JSON.stringify(user, null, 2));
    });
  });
});
