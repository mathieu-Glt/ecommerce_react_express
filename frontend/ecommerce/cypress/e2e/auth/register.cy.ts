describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("Test de la Page de Login", () => {
  // Avant chaque test, on visite la page de login
  beforeEach(() => {
    cy.visit("http://localhost:5173/register");
  });

  /**
   * TEST 1 : Vérifier que la page de login s'affiche correctement
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

    cy.get('input[name="picture"]')
      .should("be.visible")
      .and("have.attr", "type", "file");

    cy.get('input[name="confirmPassword"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Confirm password");

    cy.get('textarea[name="address"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter your address");

    // Vérifier le bouton de connexion
    cy.contains("button", "Create Account").should("be.visible");

    // Vérifier les liens
    cy.contains("Already have an account?").should("be.visible");
    cy.contains("Sign in here").should("be.visible");
  });

    /**
   * TEST 2 : Connexion réussie avec des identifiants valides
   */

});
