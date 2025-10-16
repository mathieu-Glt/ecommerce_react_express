// tests/unit/signUp.test.ts

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 : CRÉATION DES MOCKS
// ═══════════════════════════════════════════════════════════════════════════════
// Les mocks sont des fonctions simulées qui remplacent les vraies fonctions HTTP
// d'Axios. Cela permet de tester notre code sans faire de vraies requêtes réseau.

/**
 * Création des fonctions mock de l'API
 * Ces fonctions mockées simulent les appels HTTP (POST, GET, PUT, DELETE)
 * sans effectuer de vraies requêtes réseau vers un serveur.
 *
 * Avantages des mocks :
 * - Tests ultra-rapides (pas de latence réseau)
 * - Tests déterministes (résultats prévisibles)
 * - Pas besoin d'un serveur backend en fonctionnement
 * - Isolation complète des tests unitaires
 */
const mockPost = jest.fn(); // Mock pour les requêtes POST (créer des ressources)
const mockGet = jest.fn(); // Mock pour les requêtes GET (lire des ressources)
const mockPut = jest.fn(); // Mock pour les requêtes PUT (mettre à jour des ressources)
const mockDelete = jest.fn(); // Mock pour les requêtes DELETE (supprimer des ressources)

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 : MOCK DU HOOK useApi
// ═══════════════════════════════════════════════════════════════════════════════
// ⚠️ TRÈS IMPORTANT : Ce mock DOIT être défini AVANT l'import de auth.ts
//
// Pourquoi cet ordre est crucial ?
// 1. Jest exécute les mocks en premier
// 2. Quand auth.ts est importé, il utilise useApi
// 3. Si le mock n'existe pas encore, useApi utilisera la vraie implémentation
// 4. On ne pourra alors plus contrôler les appels HTTP dans nos tests

/**
 * Mock du hook useApi
 * Ce mock remplace complètement l'implémentation réelle de useApi
 * pour que notre code utilise nos fonctions mockées au lieu de faire
 * de vraies requêtes HTTP avec Axios.
 */
jest.mock("../../src/hooks/useApi", () => ({
  // useApi retourne un objet qui contient toutes les méthodes HTTP
  useApi: jest.fn(() => ({
    post: mockPost, // Remplace axios.post par notre mock
    get: mockGet, // Remplace axios.get par notre mock
    put: mockPut, // Remplace axios.put par notre mock
    delete: mockDelete, // Remplace axios.delete par notre mock

    // Simuler les interceptors Axios (pour la cohérence de l'API)
    // Les interceptors permettent de transformer les requêtes/réponses
    // On les mocke aussi pour éviter des erreurs TypeScript
    interceptors: {
      request: {
        use: jest.fn(), // Mock de l'ajout d'un interceptor de requête
        eject: jest.fn(), // Mock de la suppression d'un interceptor
      },
      response: {
        use: jest.fn(), // Mock de l'ajout d'un interceptor de réponse
        eject: jest.fn(), // Mock de la suppression d'un interceptor
      },
    },
  })),
}));

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 : IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════
// ⚠️ Ces imports doivent venir APRÈS les mocks (voir section 2)

// Import des types Axios nécessaires pour créer nos fixtures (données de test)
import { AxiosError, AxiosResponse } from "axios";

// Import de la fonction à tester
import { signUp } from "../../src/services/api/auth";

// Import des constantes (routes API)
import { API_ROUTES } from "../../src/services/constants/api-routes";

// Import des types TypeScript pour le typage fort
import type { ApiResponse } from "../../src/interfaces/response.interface";

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 : SUITE DE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Tests unitaires pour la fonction signUp
 *
 * Cette suite de tests vérifie tous les scénarios possibles d'inscription :
 * - Inscription réussie
 * - Validations de champs manquants
 * - Gestion des erreurs (email existant, mot de passe trop court, etc.)
 * - Upload de fichier
 * - Erreurs serveur
 *
 * Chaque test couvre un scénario spécifique pour s'assurer que la fonction
 * se comporte comme prévu dans toutes les situations.
 */
describe("signUp", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // AVANT CHAQUE TEST : Nettoyage
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * beforeEach() s'exécute AVANT chaque test individuel
   *
   * Pourquoi c'est nécessaire ?
   * - Les tests doivent être isolés les uns des autres
   * - Un test ne doit pas influencer le résultat d'un autre test
   * - Sans nettoyage, les mocks gardent leur historique d'appels
   *
   * Que fait ce code ?
   * - jest.clearAllMocks() : Réinitialise tous les mocks (efface l'historique)
   * - localStorage.clear() : Vide le localStorage du navigateur simulé
   */
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialiser l'historique des appels de tous les mocks
    localStorage.clear(); // Vider le localStorage pour partir d'un état propre
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // DONNÉES DE TEST COMMUNES (FIXTURES)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Données d'inscription valides utilisées comme base pour tous les tests
   * Ces données représentent un formulaire d'inscription complet et valide
   *
   * Chaque test peut modifier ces données pour tester des cas spécifiques
   * Par exemple : { ...registerData, email: "" } pour tester l'email manquant
   */
  const registerData = {
    firstname: "Jean", // Prénom de l'utilisateur
    lastname: "Dupont", // Nom de famille
    email: "jean.dupont@example.com", // Email (identifiant unique)
    password: "Password123!", // Mot de passe fort (8+ caractères)
    confirmPassword: "Password123!", // Confirmation du mot de passe
    address: "123 Rue de la Paix", // Adresse (optionnelle)
    picture: null, // Photo de profil (optionnelle, null = pas de photo)
  };

  /**
   * Réponse API attendue pour une inscription réussie
   * Cette fixture simule ce que le backend retourne après avoir créé un utilisateur
   *
   * Structure :
   * - success: Indicateur de succès de l'opération
   * - message: Message de confirmation en français
   * - user: Objet utilisateur complet avec tous ses champs
   */
  const apiResponse: ApiResponse = {
    success: true,
    message: "Utilisateur créé avec succès",
    user: {
      _id: "user123", // ID unique généré par MongoDB
      email: "jean.dupont@example.com", // Email de l'utilisateur
      firstname: "Jean", // Prénom
      lastname: "Dupont", // Nom
      name: "Jean Dupont", // Nom complet (concaténation)
      picture: null, // Photo de profil (null si pas uploadée)
      address: "123 Rue de la Paix", // Adresse
      role: "user", // Rôle par défaut (pas admin)
      createdAt: "2025-10-16T12:00:00.000Z", // Date de création (ISO 8601)
      updatedAt: "2025-10-16T12:00:00.000Z", // Date de dernière mise à jour
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 1 : INSCRIPTION RÉUSSIE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 1 : Inscription réussie
   *
   * Objectif : Vérifier que la fonction retourne les données correctes
   *            lors d'une inscription réussie avec des données valides.
   *
   * Scénario :
   * - Utilisateur remplit un formulaire d'inscription valide
   * - Toutes les données requises sont présentes et valides
   * - Le backend crée l'utilisateur et retourne status 201
   * - signUp() doit extraire et retourner les données utilisateur
   *
   * Ce qu'on teste :
   * - L'appel API est fait avec les bons paramètres
   * - La fonction n'appelle l'API qu'une seule fois
   * - Les données retournées correspondent à la réponse du backend
   * - Les champs importants (success, email, message) sont corrects
   */
  it("should return the user data if registration is successful", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Préparer les données de test
    // ─────────────────────────────────────────────────────────────────────────

    // Créer une FIXTURE qui simule la réponse HTTP d'Axios pour un succès
    // Note : status 201 (Created) est utilisé pour la création de ressources
    const axiosResponse: AxiosResponse<ApiResponse> = {
      data: apiResponse, // Corps de la réponse (données utilisateur)
      status: 201, // 201 = Created (ressource créée avec succès)
      statusText: "Created", // Texte du statut HTTP
      headers: {}, // En-têtes HTTP (vides pour ce test)
      config: {} as any, // Configuration Axios (type assertion pour simplifier)
    };

    // Configurer le mock pour qu'il retourne notre fixture
    // mockResolvedValueOnce = Simule UNE promesse résolue (succès)
    mockPost.mockResolvedValueOnce(axiosResponse);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT : Exécuter la fonction à tester
    // ─────────────────────────────────────────────────────────────────────────

    // Appeler signUp() avec les données d'inscription
    // Le mock intercepte l'appel api.post() et retourne axiosResponse
    const result = await signUp(registerData);

    // ─────────────────────────────────────────────────────────────────────────
    // ASSERT : Vérifier les résultats
    // ─────────────────────────────────────────────────────────────────────────

    // Vérifier que l'API a été appelée avec les bons paramètres
    expect(mockPost).toHaveBeenCalledWith(
      API_ROUTES.AUTH.REGISTER, // L'URL de l'endpoint d'inscription
      registerData // Les données envoyées
    );

    // Vérifier qu'il n'y a eu qu'un seul appel API (pas de retry, pas de duplication)
    expect(mockPost).toHaveBeenCalledTimes(1);

    // Vérifier que le résultat complet correspond à notre fixture
    expect(result).toEqual(apiResponse);

    // Vérifier que le flag de succès est true
    expect(result.success).toBe(true);

    // Vérifier que l'email de l'utilisateur créé est correct
    expect(result.user?.email).toBe("jean.dupont@example.com");

    // Vérifier que le message de confirmation est correct
    expect(result.message).toBe("Utilisateur créé avec succès");
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 2 : EMAIL MANQUANT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 2 : Email manquant
   *
   * Objectif : Vérifier que la fonction gère correctement l'erreur
   *            quand l'email est manquant ou vide.
   *
   * Scénario :
   * - Utilisateur essaie de s'inscrire sans fournir d'email
   * - Le backend détecte le champ manquant
   * - Le backend retourne status 400 avec un message d'erreur
   * - signUp() doit lancer une exception avec le message d'erreur
   *
   * Ce qu'on teste :
   * - La validation backend est déclenchée
   * - L'erreur est correctement propagée au frontend
   * - Le message d'erreur est précis et exploitable
   */
  it("should throw an error if the email is missing", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Créer une erreur Axios simulée
    // ─────────────────────────────────────────────────────────────────────────

    // Créer une vraie AxiosError pour simuler fidèlement le comportement d'Axios
    // Contrairement à un objet simple, AxiosError est une vraie classe d'erreur
    const axiosError = new AxiosError(
      "Request failed with status code 400", // Message de l'erreur
      "ERR_BAD_REQUEST", // Code d'erreur Axios
      undefined, // Config (non nécessaire ici)
      undefined, // Request (non nécessaire ici)
      {
        // Response : La réponse HTTP qui contient les détails de l'erreur
        data: {
          success: false, // Indicateur d'échec
          error: "Email, password, firstname et lastname are required", // Message du backend
        },
        status: 400, // 400 = Bad Request (erreur de validation)
        statusText: "Bad Request", // Texte du statut
        headers: {}, // En-têtes
        config: {} as any, // Configuration
      }
    );

    // Configurer le mock pour rejeter (échec) avec cette erreur
    // mockRejectedValueOnce = Simule UNE promesse rejetée (erreur)
    mockPost.mockRejectedValueOnce(axiosError);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT & ASSERT : Appeler et vérifier que l'erreur est lancée
    // ─────────────────────────────────────────────────────────────────────────

    // Appeler signUp() avec un email vide
    // expect().rejects.toThrow() vérifie qu'une exception est lancée
    await expect(signUp({ ...registerData, email: "" })).rejects.toThrow(
      "Email, password, firstname et lastname are required"
    );

    // Vérifier que l'API a bien été appelée (même si elle a échoué)
    expect(mockPost).toHaveBeenCalledWith(API_ROUTES.AUTH.REGISTER, {
      ...registerData,
      email: "", // Email vide qui cause l'erreur
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 3 : MOT DE PASSE MANQUANT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 3 : Mot de passe manquant
   *
   * Objectif : Vérifier que la fonction gère correctement l'erreur
   *            quand le mot de passe est manquant ou vide.
   *
   * Scénario : Identique au TEST 2, mais pour le champ password
   *
   * Note : Ce test suit exactement la même structure que le TEST 2
   */
  it("should throw an error if the password is missing", async () => {
    // Créer l'erreur Axios pour un mot de passe manquant
    const axiosError = new AxiosError(
      "Request failed with status code 400",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        data: {
          success: false,
          error: "Email, password, firstname et lastname are required",
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
      }
    );

    // Configurer le mock pour rejeter avec l'erreur
    mockPost.mockRejectedValueOnce(axiosError);

    // Vérifier que l'exception est lancée avec le bon message
    // Note : Le message est en français ici (cohérent avec le backend)
    await expect(signUp({ ...registerData, password: "" })).rejects.toThrow(
      "Email, password, firstname et lastname are required"
    );
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 4 : PRÉNOM MANQUANT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 4 : Prénom manquant
   *
   * Objectif : Vérifier la validation du champ firstname
   * Structure identique aux tests précédents
   */
  it("should throw an error if the firstname is missing", async () => {
    const axiosError = new AxiosError(
      "Request failed with status code 400",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        data: {
          success: false,
          error: "Email, password, firstname et lastname are required",
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
      }
    );

    mockPost.mockRejectedValueOnce(axiosError);

    await expect(signUp({ ...registerData, firstname: "" })).rejects.toThrow(
      "Email, password, firstname et lastname are required"
    );
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 5 : NOM MANQUANT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 5 : Nom manquant
   *
   * Objectif : Vérifier la validation du champ lastname
   * Structure identique aux tests précédents
   */
  it("should throw an error if the lastname is missing", async () => {
    const axiosError = new AxiosError(
      "Request failed with status code 400",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        data: {
          success: false,
          error: "Email, password, firstname et lastname are required",
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
      }
    );

    mockPost.mockRejectedValueOnce(axiosError);

    await expect(signUp({ ...registerData, lastname: "" })).rejects.toThrow(
      "Email, password, firstname et lastname are required"
    );
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 6 : EMAIL DÉJÀ EXISTANT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 6 : Email déjà existant
   *
   * Objectif : Vérifier que la fonction gère correctement le cas où
   *            l'email est déjà utilisé par un autre utilisateur.
   *
   * Scénario :
   * - Utilisateur essaie de s'inscrire avec un email déjà enregistré
   * - Le backend détecte le doublon dans la base de données
   * - Le backend retourne status 400 avec "Email already exists"
   * - signUp() propage cette erreur au frontend
   *
   * Cas d'usage réel :
   * - Empêcher la création de comptes multiples avec le même email
   * - Protéger contre l'usurpation d'identité
   * - Respecter la contrainte d'unicité de la BDD
   */
  it("should throw an error if the email already exists", async () => {
    // Créer l'erreur pour un email déjà existant
    const axiosError = new AxiosError(
      "Request failed with status code 400",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        data: {
          success: false,
          error: "Email already exists", // Message spécifique au doublon
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
      }
    );

    mockPost.mockRejectedValueOnce(axiosError);

    // Note : On utilise registerData complet (email valide mais déjà existant)
    await expect(signUp(registerData)).rejects.toThrow("Email already exists");

    // Vérifier que l'API a été appelée normalement
    expect(mockPost).toHaveBeenCalledWith(
      API_ROUTES.AUTH.REGISTER,
      registerData
    );
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 7 : MOT DE PASSE TROP COURT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 7 : Mot de passe trop court
   *
   * Objectif : Vérifier la validation de la longueur minimale du mot de passe
   *
   * Règle métier : Le mot de passe doit contenir au moins 8 caractères
   *
   * Scénario :
   * - Utilisateur fournit un mot de passe de moins de 8 caractères
   * - Le backend rejette l'inscription (sécurité)
   * - Le frontend affiche un message d'erreur explicite
   *
   * Pourquoi 8 caractères minimum ?
   * - Standard de sécurité recommandé
   * - Balance entre sécurité et expérience utilisateur
   * - Réduit les risques de brute force
   */
  it("should throw an error if the password is too short", async () => {
    const axiosError = new AxiosError(
      "Request failed with status code 400",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        data: {
          success: false,
          // Message explicite sur la règle de validation
          error: "The password must be at least 8 characters long",
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
      }
    );

    mockPost.mockRejectedValueOnce(axiosError);

    // Tester avec un mot de passe de seulement 6 caractères
    await expect(
      signUp({ ...registerData, password: "Pass1!" })
    ).rejects.toThrow("The password must be at least 8 characters long");
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 8 : STRUCTURE DE LA RÉPONSE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 8 : Vérifier la structure complète de la réponse
   *
   * Objectif : S'assurer que la réponse contient TOUS les champs attendus
   *            et que la structure est conforme au contrat API.
   *
   * Importance :
   * - Garantit que le frontend peut accéder à toutes les données nécessaires
   * - Détecte les breaking changes dans l'API backend
   * - Valide que l'interface TypeScript est correcte
   *
   * Ce test vérifie :
   * - Les propriétés de premier niveau (success, message, user)
   * - Les propriétés imbriquées dans l'objet user
   * - La présence de TOUS les champs, même optionnels
   */
  it("should return a response with the correct structure", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Créer la fixture de réponse
    // ─────────────────────────────────────────────────────────────────────────

    // Objet de test qui simule la structure de la réponse API
    const axiosResponse: AxiosResponse<ApiResponse> = {
      data: apiResponse, // Contient la structure complète à vérifier
      status: 201,
      statusText: "Created",
      headers: {},
      config: {} as any,
    };

    // Configurer le MOCK avec la FIXTURE
    mockPost.mockResolvedValueOnce(axiosResponse);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT : Appeler la fonction testée
    // ─────────────────────────────────────────────────────────────────────────

    const result = await signUp(registerData);

    // ─────────────────────────────────────────────────────────────────────────
    // ASSERT : Vérifier chaque propriété individuellement
    // ─────────────────────────────────────────────────────────────────────────

    // Vérifier les propriétés de la réponse de premier niveau
    expect(result).toHaveProperty("success"); // Flag de succès/échec
    expect(result).toHaveProperty("message"); // Message de confirmation
    expect(result).toHaveProperty("user"); // Objet utilisateur

    // Vérifier les propriétés de l'objet utilisateur (imbriqué)
    expect(result.user).toHaveProperty("_id"); // ID MongoDB
    expect(result.user).toHaveProperty("email"); // Email unique
    expect(result.user).toHaveProperty("firstname"); // Prénom
    expect(result.user).toHaveProperty("lastname"); // Nom
    expect(result.user).toHaveProperty("name"); // Nom complet
    expect(result.user).toHaveProperty("role"); // Rôle (user/admin)
    expect(result.user).toHaveProperty("createdAt"); // Date de création
    expect(result.user).toHaveProperty("updatedAt"); // Date de modification

    // Note : toHaveProperty() vérifie seulement la PRÉSENCE de la propriété
    // Elle ne vérifie pas le type ou la valeur (c'est toEqual() qui le fait)
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 9 : ERREUR SERVEUR 500
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 9 : Erreur serveur 500
   *
   * Objectif : Vérifier que la fonction gère correctement les erreurs serveur
   *            (erreurs internes du backend, non liées aux données utilisateur).
   *
   * Scénario :
   * - Le serveur rencontre une erreur interne (bug, BDD indisponible, etc.)
   * - Le serveur retourne status 500 (Internal Server Error)
   * - signUp() doit propager cette erreur de manière compréhensible
   *
   * Cas d'usage réels :
   * - Base de données inaccessible
   * - Crash d'un microservice
   * - Timeout d'une API tierce
   * - Bug dans le code backend
   *
   * Pourquoi tester les erreurs 500 ?
   * - Elles peuvent arriver en production
   * - Le frontend doit les gérer gracieusement
   * - L'utilisateur doit voir un message clair
   */
  it("should handle server 500 errors", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Simuler une erreur serveur 500
    // ─────────────────────────────────────────────────────────────────────────

    // Objet de test qui simule la structure d'une erreur serveur
    const serverError = new AxiosError(
      "Request failed with status code 500", // Message de l'erreur
      "ERR_INTERNAL_SERVER_ERROR", // Code Axios pour 500
      undefined,
      undefined,
      {
        data: {
          success: false,
          error: "Internal server error", // Message générique pour l'utilisateur
        },
        status: 500, // 500 = Erreur serveur interne
        statusText: "Internal Server Error",
        headers: {},
        config: {} as any,
      }
    );

    // Configurer le mock pour rejeter avec cette erreur serveur
    mockPost.mockRejectedValueOnce(serverError);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT & ASSERT : Vérifier que l'erreur est correctement propagée
    // ─────────────────────────────────────────────────────────────────────────

    await expect(signUp(registerData)).rejects.toThrow("Internal server error");

    // Note : En production, on pourrait :
    // - Logger cette erreur pour investigation
    // - Afficher un message user-friendly
    // - Proposer de réessayer plus tard
    // - Contacter le support si l'erreur persiste
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 10 : UPLOAD DE FICHIER (FORMDATA)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 10 : Inscription avec FormData (upload de fichier)
   *
   * Objectif : Vérifier que la fonction peut gérer un FormData contenant
   *            à la fois des champs texte ET un fichier (photo de profil).
   *
   * Contexte :
   * - Pour uploader des fichiers, on doit utiliser FormData (pas JSON)
   * - FormData permet d'envoyer du multipart/form-data
   * - Le backend utilise multer pour traiter les fichiers
   *
   * Scénario :
   * - Utilisateur remplit le formulaire d'inscription
   * - Utilisateur sélectionne une photo de profil
   * - Le frontend crée un FormData avec tous les champs + le fichier
   * - signUp() envoie le FormData au backend
   * - Le backend traite le fichier et retourne l'URL de la photo
   *
   * Ce qu'on teste :
   * - signUp() accepte FormData en plus d'un objet simple
   * - Le fichier est correctement inclus dans l'appel API
   * - La réponse contient l'URL de la photo uploadée
   */
  it("should handle FormData for file upload", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Créer un FormData avec un fichier
    // ─────────────────────────────────────────────────────────────────────────

    // Créer un nouvel objet FormData (API Web native)
    const formData = new FormData();

    // Ajouter tous les champs texte au FormData
    formData.append("firstname", "Jean");
    formData.append("lastname", "Dupont");
    formData.append("email", "jean.dupont@example.com");
    formData.append("password", "Password123!");
    formData.append("confirmPassword", "Password123!");
    formData.append("address", "123 Rue de la Paix");

    // Simuler un fichier image (en environnement de test)
    // En production, ce serait un vrai File venant d'un <input type="file">
    const file = new File(
      ["dummy content"], // Contenu du fichier (simulé)
      "avatar.jpg", // Nom du fichier
      { type: "image/jpeg" } // Type MIME
    );

    // Ajouter le fichier au FormData
    // Note : Le nom "picture" doit correspondre au champ attendu par multer
    formData.append("picture", file);

    // Créer la réponse attendue avec l'URL de la photo uploadée
    const axiosResponse: AxiosResponse<ApiResponse> = {
      data: {
        ...apiResponse,
        user: {
          ...apiResponse.user!,
          // Le backend retourne l'URL où le fichier a été sauvegardé
          picture: "/uploads/avatars/avatar-123.jpg",
        },
      },
      status: 201,
      statusText: "Created",
      headers: {},
      config: {} as any,
    };

    // Configurer le mock pour retourner la réponse avec l'URL de la photo
    mockPost.mockResolvedValueOnce(axiosResponse);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT : Appeler signUp avec le FormData
    // ─────────────────────────────────────────────────────────────────────────

    const result = await signUp(formData);

    // ─────────────────────────────────────────────────────────────────────────
    // ASSERT : Vérifier le bon traitement du FormData et du fichier
    // ─────────────────────────────────────────────────────────────────────────

    // Vérifier que l'API a été appelée avec le FormData (pas un objet JSON)
    expect(mockPost).toHaveBeenCalledWith(API_ROUTES.AUTH.REGISTER, formData);

    // Vérifier le succès de l'opération
    expect(result.success).toBe(true);

    // Vérifier que l'URL de la photo est présente dans la réponse
    // toBeTruthy() vérifie que la valeur existe et n'est pas null/undefined/false
    expect(result.user?.picture).toBeTruthy();

    // Note : En production, on pourrait aussi vérifier :
    // - Le format de l'URL (commence par /uploads/)
    // - Le type de fichier accepté
    // - La taille maximale du fichier
    // - La transformation de l'image (resize, compression)
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// FIN DES TESTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RÉSUMÉ DE LA COUVERTURE DE TESTS
 *
 * ✅ TEST 1  : Inscription réussie (happy path)
 * ✅ TEST 2  : Email manquant (validation)
 * ✅ TEST 3  : Mot de passe manquant (validation)
 * ✅ TEST 4  : Prénom manquant (validation)
 * ✅ TEST 5  : Nom manquant (validation)
 * ✅ TEST 6  : Email déjà existant (contrainte unique)
 * ✅ TEST 7  : Mot de passe trop court (règle métier)
 * ✅ TEST 8  : Structure de la réponse (contrat API)
 * ✅ TEST 9  : Erreur serveur 500 (robustesse)
 * ✅ TEST 10 : Upload de fichier (FormData)
 *
 * Total : 10 tests couvrant tous les scénarios critiques
 *
 * PATTERN UTILISÉ : AAA (Arrange-Act-Assert)
 * - ARRANGE : Préparer les données et mocks
 * - ACT     : Exécuter la fonction testée
 * - ASSERT  : Vérifier les résultats
 *
 * BONNES PRATIQUES APPLIQUÉES :
 * - Tests isolés (beforeEach nettoyage)
 * - Mocks configurés correctement
 * - Fixtures réutilisables
 * - Assertions explicites et complètes
 * - Commentaires détaillés
 * - Nommage clair des tests (should...)
 */
