describe("Test de la Page de Registration", () => {
  // Avant chaque test, on visite la page d’inscription
  beforeEach(() => {
    cy.visit("http://localhost:5173/register"); // Recharge la page à chaque test pour partir d’un état propre
  });

  /**
   * TEST 1 : Vérifier que la page de registration s'affiche correctement
   */
  it("Devrait afficher tous les éléments de la page de création de compte", () => {
    // Vérifie que le titre principal "Créez votre compte" est visible
    cy.contains("Créez votre compte").should("be.visible");

    // Vérifie que le sous-titre est présent et visible
    cy.contains("Rejoignez-nous dès aujourd'hui").should("be.visible");

    // Vérifie que le logo (ayant la classe CSS .register-logo) existe dans le DOM
    cy.get(".register-logo").should("exist");

    // Vérifie la présence du champ "firstname" avec son placeholder
    cy.get('input[name="firstname"]')
      .should("be.visible") // Doit être visible à l’écran
      .and("have.attr", "placeholder", "Enter first name"); // Et avoir le bon texte d’aide

    // Vérifie le champ "lastname"
    cy.get('input[name="lastname"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter last name");

    // Vérifie le champ "email"
    cy.get('input[name="email"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter email");

    // Vérifie le champ "password"
    cy.get('input[name="password"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter password");

    // Vérifie le champ "confirmPassword"
    cy.get('input[name="confirmPassword"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Confirm password");

    // Vérifie le champ d’upload d’image
    cy.get('input[name="picture"]')
      .should("be.visible")
      .and("have.attr", "type", "file");

    // Vérifie le champ "address" (zone de texte)
    cy.get('textarea[name="address"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter your address");

    // Vérifie que le bouton de création de compte est visible
    cy.contains("button", "Create Account").should("be.visible");

    // Vérifie les liens vers la page de connexion
    cy.contains("Already have an account?").should("be.visible");
    cy.contains("Sign in here").should("be.visible");
  });

  /**
   * TEST 2 : Validation des champs obligatoires vides
   */
  it("Devrait afficher des erreurs pour les champs obligatoires vides", () => {
    // On simule un clic puis une sortie de chaque champ sans rien saisir
    cy.get('input[name="firstname"]').focus().blur();
    cy.get('input[name="lastname"]').focus().blur();
    cy.get('input[name="email"]').focus().blur();
    cy.get('input[name="password"]').focus().blur();
    cy.get('input[name="confirmPassword"]').focus().blur();

    // Chaque champ obligatoire doit afficher un message d’erreur correspondant
    cy.contains("First name is required").should("be.visible");
    cy.contains("Last name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
    cy.contains("ConfirmPassword is required").should("be.visible");

    // Le bouton de soumission doit être désactivé tant que le formulaire est invalide
    cy.contains("button", "Create Account").should("be.disabled");
  });

  /**
   * TEST 3 : Email complètement invalide (sans @)
   */
  it("Devrait afficher 'Please enter a valid email address' pour un email sans @", () => {
    // Tape un email sans symbole @ (format invalide)
    cy.get('input[name="email"]').type("emailinvalide").blur();

    // Le message d’erreur de validation d’email doit apparaître
    cy.contains("Please enter a valid email address").should("be.visible");

    // Le champ email doit avoir la classe "is-invalid" (erreur visuelle)
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 4 : Email invalide (avec @ mais format incorrect)
   */
  it("Devrait afficher 'Please enter a valid email address' pour un email mal formaté", () => {
    // Tape un email qui contient un @ mais sans domaine valide
    cy.get('input[name="email"]').type("email@").blur();

    // Le message d’erreur de validation d’email doit apparaître
    cy.contains("Please enter a valid email address").should("be.visible");

    // Le champ email doit être marqué comme invalide
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 5 : Email sans partie locale (avant le @)
   */
  it("Devrait afficher une erreur pour un email sans partie locale", () => {
    // Efface le champ puis tape un email du type "@example.com"
    cy.get('input[name="email"]').clear().type("@example.com").blur();

    // Vérifie que le message d’erreur est visible
    cy.get(".invalid-feedback")
      .should("be.visible")
      .and("contain", "Please enter a valid email address");

    // Vérifie que le champ est visuellement en erreur
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 6 : Email qui passe .email() mais échoue sur .matches(EMAIL_REGEX)
   */
  it("Devrait afficher 'Email format is invalid' pour un email non conforme au regex", () => {
    // Tape un email avec un domaine sans extension (.com, .fr, etc.)
    cy.get('input[name="email"]').type("test@domain").blur();

    // Vérifie que le message d’erreur spécifique au format regex s’affiche
    cy.contains("Email format is invalid").should("be.visible");

    // Le champ doit être visuellement marqué comme invalide
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 7 : Email vide (champ requis)
   * Déclenche : .required("Email is required")
   */
  it("Devrait afficher 'Email is required' pour un champ vide", () => {
    // Focus puis blur sur le champ vide pour déclencher la validation
    cy.get('input[name="email"]').focus().blur();

    // Le message "Email is required" doit apparaître
    cy.contains("Email is required").should("be.visible");

    // Le champ email est marqué comme invalide
    cy.get('input[name="email"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 8 : Email valide qui passe toutes les validations
   */
  it("Devrait accepter un email valide", () => {
    // Tape un email correct complet
    cy.get('input[name="email"]').type("mathieu.gillet@hotmail.fr").blur();

    // Aucun message d’erreur ne doit apparaître
    cy.contains("Please enter a valid email address").should("not.exist");
    cy.contains("Email format is invalid").should("not.exist");
    cy.contains("Email is required").should("not.exist");

    // Le champ doit être marqué comme valide
    cy.get('input[name="email"]').should("have.class", "is-valid");
  });

  /**
   * TEST 9 : Tester différents formats d'emails invalides
   * (test commenté dans ton code d’origine)
   */
  // it("Devrait rejeter plusieurs formats d'emails invalides", () => {
  //   const invalidEmails = [
  //     "plaintext",              // pas de @
  //     "@example.com",           // pas de partie locale
  //     "user@",                  // pas de domaine
  //     "user @example.com",      // espace interdit
  //     "user@.com",              // point directement après @
  //     "user..name@example.com", // double point dans la partie locale
  //   ];

  //   // Pour chaque email invalide, on vérifie que le champ devient invalide
  //   invalidEmails.forEach((email) => {
  //     cy.get('input[name="email"]').clear().type(email).blur();

  //     // Le champ doit être en erreur
  //     cy.get('input[name="email"]').should("have.class", "is-invalid");

  //     // Petit log pour identifier l’email testé
  //     cy.log(`❌ Email invalide rejeté: ${email}`);
  //   });
  // });

  /**
   * TEST 10 : Tester différents formats d'emails valides
   */
  it("Devrait accepter plusieurs formats d'emails valides", () => {
    // Tableau de plusieurs formats valides acceptés par ton regex
    const validEmails = [
      "simple@example.com", // classique
      "user.name@example.com", // avec un point dans le nom
      "user+tag@example.fr", // avec un "+"
      "test123@test-domain.co.uk", // domaine multi-niveau
    ];

    // Pour chaque email, on le teste dans le champ
    validEmails.forEach((email) => {
      // On efface le champ avant chaque saisie
      cy.get('input[name="email"]').clear().type(email).blur();

      // On s’assure qu’il est marqué comme valide
      cy.get('input[name="email"]').should("have.class", "is-valid");

      // On log le résultat pour plus de clarté dans la console Cypress
      cy.log(`✅ Email valide accepté: ${email}`);
    });
  });

  /**
   * TEST 11 : Test de la séquence de validation (ordre des erreurs)
   */
  it("Devrait valider dans l'ordre : required → email → matches", () => {
    // 1️⃣ Étape 1 — Champ vide → déclenche l’erreur "required"
    cy.get('input[name="email"]').focus().blur();
    cy.contains("Email is required").should("be.visible");

    // 2️⃣ Étape 2 — Email invalide → déclenche l’erreur de format basique
    cy.get('input[name="email"]').type("invalide").blur();
    cy.contains("Please enter a valid email address").should("be.visible");

    // 3️⃣ Étape 3 — Email valide → plus aucune erreur
    cy.get('input[name="email"]').clear().type("test@example.com").blur();
    cy.get('input[name="email"]').should("have.class", "is-valid");
  });

  /**
   * TEST 12 : Vérifier que les erreurs disparaissent après correction
   */
  it("Devrait masquer l'erreur après correction de l'email", () => {
    // Tape d’abord un email invalide
    cy.get('input[name="email"]').type("invalide").blur();

    // Vérifie que le message d’erreur apparaît et que le champ est invalide
    cy.contains("Please enter a valid email address").should("be.visible");
    cy.get('input[name="email"]').should("have.class", "is-invalid");

    // Corrige l’email pour un format valide
    cy.get('input[name="email"]').clear().type("valide@example.com").blur();

    // L’erreur ne doit plus apparaître après correction
    cy.contains("Please enter a valid email address").should("not.exist");

    // Le champ devient visuellement valide
    cy.get('input[name="email"]').should("have.class", "is-valid");
  });

  /**
   * TEST 13 : Validation de la longueur minimale du mot de passe
   */
  it("Devrait afficher une erreur si le mot de passe est trop court", () => {
    // Tape un mot de passe trop court (4 caractères)
    cy.get('input[name="password"]').type("1234").blur();

    // Vérifie que le message d’erreur spécifique s’affiche
    cy.contains("Password must be at least 8 characters").should("be.visible");

    // Vérifie que le champ est marqué comme invalide
    cy.get('input[name="password"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 14 : Validation de la correspondance des mots de passe
   */
  it("Devrait afficher une erreur si les mots de passe ne correspondent pas", () => {
    // Tape un mot de passe principal
    cy.get('input[name="password"]').type("Password123!").blur();

    // Tape un mot de passe différent dans la confirmation
    cy.get('input[name="confirmPassword"]').type("Password456!").blur();

    // Vérifie que le message d’erreur “Passwords must match” apparaît
    cy.contains("Passwords must match").should("be.visible");

    // Vérifie que le champ de confirmation est invalide
    cy.get('input[name="confirmPassword"]').should("have.class", "is-invalid");
  });

  /**
   * TEST 15 : Upload d'une image de profil
   */
  it("Devrait permettre l'upload d'une image de profil", () => {
    // Déclare un faux nom de fichier
    const fileName = "profile-picture.jpg";

    // Simule la sélection d’un fichier image
    cy.get('input[name="picture"]').selectFile({
      contents: Cypress.Buffer.from("fake image content"), // Contenu fictif
      fileName: fileName, // Nom du fichier simulé
      mimeType: "image/jpeg", // Type MIME
    });

    // Vérifie que le message de succès s’affiche après sélection
    cy.contains(`✓ File selected: ${fileName}`).should("be.visible");
  });
});
