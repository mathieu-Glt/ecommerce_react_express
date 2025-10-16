// tests/unit/signIn.test.ts

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
const mockPost = jest.fn(); // Mock pour les requêtes POST (créer/authentifier)
const mockGet = jest.fn(); // Mock pour les requêtes GET (lire des ressources)
const mockPut = jest.fn(); // Mock pour les requêtes PUT (mettre à jour)
const mockDelete = jest.fn(); // Mock pour les requêtes DELETE (supprimer)

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
import { signIn } from "../../src/services/api/auth";

// Import des constantes (routes API)
import { API_ROUTES } from "../../src/services/constants/api-routes";

// Import des types TypeScript pour le typage fort
import type { LoginResponse } from "../../src/interfaces/response.interface";

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 : SUITE DE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Tests unitaires pour la fonction signIn
 *
 * Cette suite de tests vérifie tous les scénarios possibles de connexion :
 * - Connexion réussie avec identifiants valides
 * - Identifiants incorrects (email ou mot de passe)
 * - Validations de champs manquants (email, password)
 * - Structure complète de la réponse
 * - Gestion des erreurs serveur (500)
 *
 * Chaque test couvre un scénario spécifique pour s'assurer que la fonction
 * se comporte comme prévu dans toutes les situations.
 */
describe("signIn", () => {
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
   * Données de connexion valides utilisées comme base pour tous les tests
   * Ces données représentent des identifiants de connexion valides
   *
   * Structure minimale pour l'authentification :
   * - email : Identifiant unique de l'utilisateur
   * - password : Mot de passe en clair (sera hashé côté backend)
   */
  const loginData = {
    email: "test@example.com", // Email de test valide
    password: "password123", // Mot de passe de test (8+ caractères)
  };

  /**
   * Réponse API attendue pour une connexion réussie
   * Cette fixture simule ce que le backend retourne après authentification réussie
   *
   * Structure complète incluant :
   * - success: Flag de succès
   * - message: Message de confirmation
   * - user: Toutes les données de l'utilisateur
   * - token: JWT pour les requêtes authentifiées
   * - refreshToken: Token pour renouveler le JWT expiré
   */
  const apiResponse: LoginResponse = {
    success: true,
    message: "Connection successful",
    user: {
      _id: "user123", // ID MongoDB de l'utilisateur
      email: "test@example.com", // Email (identifiant)
      name: "Test User", // Nom complet
      firstname: "Test", // Prénom
      lastname: "User", // Nom de famille
      picture: "https://example.com/avatar.png", // URL de la photo de profil
      address: "", // Adresse (vide si non fournie)
      role: "user", // Rôle (user/admin)
      createdAt: "2025-10-15T12:00:00.000Z", // Date de création du compte
      updatedAt: "2025-10-15T12:00:00.000Z", // Date de dernière modification
    },
    token: "fake-jwt-token", // JWT pour authentification
    refreshToken: "fake-refresh-token", // Token de renouvellement
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 1 : CONNEXION RÉUSSIE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 1 : Login successfully
   *
   * Objectif : Vérifier que la fonction retourne les données correctes
   *            lors d'une connexion réussie avec des identifiants valides.
   *
   * Scénario :
   * - Utilisateur saisit email et mot de passe valides
   * - Le backend vérifie les identifiants dans la base de données
   * - Le backend retourne status 200 avec les données utilisateur et les tokens
   * - signIn() doit extraire et retourner ces données
   *
   * Ce qu'on teste :
   * - L'appel API est fait avec les bons paramètres (URL + credentials)
   * - La fonction n'appelle l'API qu'une seule fois (pas de retry)
   * - Les données retournées correspondent exactement à la réponse backend
   * - Les champs critiques (success, email, token) sont présents et corrects
   *
   * Importance :
   * - C'est le "happy path" (scénario nominal) le plus fréquent
   * - Toute l'application dépend de cette fonctionnalité
   * - Les tokens sont essentiels pour toutes les requêtes authentifiées
   */
  it("should return the login data if successful", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Préparer les données de test (FIXTURE)
    // ─────────────────────────────────────────────────────────────────────────

    // Créer une FIXTURE qui simule une réponse HTTP réussie d'Axios
    // Cette structure imite exactement ce qu'Axios retourne lors d'un appel API réussi
    const axiosResponse: AxiosResponse<LoginResponse> = {
      // data : Le corps de la réponse (payload) contenant toutes les données
      // C'est ce que le backend renvoie dans le body de la réponse HTTP
      // Pour un login, cela inclut : user, token, refreshToken, message
      data: apiResponse,

      // status : Le code de statut HTTP
      // 200 = OK : Requête traitée avec succès
      // Note : Pour login, on utilise 200 (lecture) et non 201 (création)
      status: 200,

      // statusText : Le texte descriptif du statut HTTP
      // "OK" correspond au code 200 (convention HTTP standard)
      statusText: "OK",

      // headers : Les en-têtes HTTP de la réponse
      // Vides pour ce test car on ne teste pas les headers
      // En production, pourrait contenir: Content-Type, Set-Cookie, etc.
      headers: {},

      // config : La configuration Axios utilisée pour effectuer la requête
      // Contient normalement: method, url, headers, timeout, etc.
      // On utilise 'as any' pour éviter de remplir tous les champs obligatoires
      config: {} as any,
    };

    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Configurer le MOCK (STUB)
    // ─────────────────────────────────────────────────────────────────────────

    // Configurer le MOCK mockPost pour qu'il retourne notre FIXTURE
    // mockResolvedValueOnce() = Simule une promesse résolue (succès) UNE FOIS
    //
    // Que se passe-t-il concrètement ?
    // 1. La fonction signIn() va appeler api.post(API_ROUTES.AUTH.LOGIN, loginData)
    // 2. Grâce au mock, Jest intercepte cet appel AVANT qu'il atteigne le vrai Axios
    // 3. Au lieu de faire un vrai appel HTTP vers le serveur, Jest retourne immédiatement axiosResponse
    // 4. signIn() reçoit cette réponse et la traite comme si elle venait du serveur
    //
    // Avantages :
    // - Pas besoin de serveur backend en fonctionnement
    // - Test ultra-rapide (pas de latence réseau)
    // - Résultat déterministe et prévisible
    // - Isolation complète du test unitaire
    mockPost.mockResolvedValueOnce(axiosResponse);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT : Exécuter la fonction à tester
    // ─────────────────────────────────────────────────────────────────────────

    // Appeler la vraie fonction signIn() avec les données de login
    // À l'intérieur, signIn() va appeler api.post() qui est mocké
    // Donc au lieu de faire un vrai appel HTTP, il reçoit immédiatement axiosResponse
    //
    // Flux d'exécution :
    // 1. signIn(loginData) démarre
    // 2. Elle appelle api.post(API_ROUTES.AUTH.LOGIN, loginData)
    // 3. Le mock intercepte et retourne axiosResponse instantanément
    // 4. signIn() extrait axiosResponse.data et le retourne
    // 5. result contient maintenant apiResponse
    //
    // await : On attend que la promesse se résolve
    // Même si le mock retourne instantanément, signIn() est une fonction async
    // donc on doit utiliser await pour obtenir le résultat
    const result = await signIn(loginData);

    // ─────────────────────────────────────────────────────────────────────────
    // ASSERT : Vérifier les résultats (6 ASSERTIONS)
    // ─────────────────────────────────────────────────────────────────────────

    // ───────────────────────────────────────────────────────────────────────
    // ASSERTION 1 : Vérifier l'appel API avec les bons paramètres
    // ───────────────────────────────────────────────────────────────────────

    // toHaveBeenCalledWith() vérifie que la fonction mock a été appelée
    // avec EXACTEMENT ces arguments (comparaison stricte)
    //
    // Que vérifie-t-on ?
    // - Premier argument : L'URL de l'endpoint de connexion
    // - Deuxième argument : Les credentials (email + password)
    //
    // Pourquoi c'est important ?
    // - Garantit qu'on appelle le bon endpoint (pas register ou autre)
    // - Garantit que les données envoyées sont exactement celles fournies
    // - Détecte les erreurs de typage ou de mapping des données
    // - Vérifie que l'ordre des paramètres est correct
    expect(mockPost).toHaveBeenCalledWith(
      API_ROUTES.AUTH.LOGIN, // Premier argument : URL '/api/auth/login'
      loginData // Deuxième argument : { email, password }
    );

    // ───────────────────────────────────────────────────────────────────────
    // ASSERTION 2 : Vérifier le nombre d'appels API
    // ───────────────────────────────────────────────────────────────────────

    // toHaveBeenCalledTimes(1) s'assure qu'il n'y a pas eu d'appels multiples
    // ou d'appels manquants
    //
    // Scénarios détectés :
    // - 0 appel = La fonction n'a pas essayé d'appeler l'API (bug critique!)
    // - 2+ appels = Appels dupliqués ou retry logic non désirée (bug de performance!)
    // - 1 appel = Comportement correct ✅
    //
    // Pourquoi c'est important ?
    // - Évite les appels API inutiles (coût, performance)
    // - Détecte les boucles infinies ou les retry mal configurés
    // - Garantit un comportement prévisible
    expect(mockPost).toHaveBeenCalledTimes(1);

    // ───────────────────────────────────────────────────────────────────────
    // ASSERTION 3 : Vérifier l'égalité complète de la réponse
    // ───────────────────────────────────────────────────────────────────────

    // toEqual() fait une comparaison profonde (deep equality) de tous les champs
    // C'est différent de toBe() qui fait une comparaison par référence (===)
    //
    // Comparaison profonde signifie :
    // - Compare tous les objets imbriqués récursivement (user.firstname, etc.)
    // - Compare les tableaux élément par élément
    // - Compare les types ET les valeurs
    // - Ignore les références mémoire (deux objets identiques mais différents en mémoire = égaux)
    //
    // Pourquoi c'est important ?
    // - Garantit que signIn() n'a pas modifié/corrompu les données
    // - Garantit que la structure complète est préservée
    // - Détecte toute transformation non désirée des données
    // - Vérifie que TOUS les champs sont présents (pas juste quelques-uns)
    expect(result).toEqual(apiResponse);

    // ───────────────────────────────────────────────────────────────────────
    // ASSERTION 4 : Vérifier le flag de succès
    // ───────────────────────────────────────────────────────────────────────

    // toBe() fait une comparaison stricte (===) avec vérification du type
    // toBe(true) vérifie : result.success === true (et non juste truthy)
    //
    // Pourquoi vérifier success séparément alors qu'on a déjà toEqual() ?
    // - Documentation : Rend explicite qu'on vérifie le succès de l'opération
    // - Lisibilité : Si ce test échoue, on sait immédiatement que c'est le flag success
    // - Importance : success est un champ critique qui détermine le comportement de l'UI
    // - Clarté des erreurs : Message d'erreur plus précis en cas d'échec
    //
    // En production, ce flag détermine :
    // - Afficher un message de succès ou d'erreur
    // - Rediriger l'utilisateur ou rester sur la page
    // - Stocker le token ou non
    expect(result.success).toBe(true);

    // ───────────────────────────────────────────────────────────────────────
    // ASSERTION 5 : Vérifier l'email de l'utilisateur connecté
    // ───────────────────────────────────────────────────────────────────────

    // Vérifie que l'email de l'utilisateur retourné correspond à celui envoyé
    // On descend dans l'objet result.user.email pour vérifier une donnée précise
    //
    // Pourquoi c'est important ?
    // - L'email est l'identifiant unique de l'utilisateur
    // - Vérifie que le backend a bien authentifié le bon utilisateur
    // - Garantit que la structure user est correctement peuplée
    // - Détecte les problèmes de mapping ou de données
    //
    // Scénarios détectés :
    // - Email incorrect = Mauvais utilisateur authentifié (bug critique!)
    // - Email undefined = Structure de réponse incorrecte (bug API!)
    // - Email vide = Données manquantes (bug backend!)
    expect(result.user.email).toBe("test@example.com");

    // ───────────────────────────────────────────────────────────────────────
    // ASSERTION 6 : Vérifier la présence du token JWT
    // ───────────────────────────────────────────────────────────────────────

    // Vérifie que le token JWT est présent et correct
    // Le token est essentiel pour l'authentification, donc on le vérifie explicitement
    //
    // Pourquoi c'est critique ?
    // - Le token est utilisé pour TOUTES les requêtes authentifiées suivantes
    // - Sans token valide, l'utilisateur ne peut rien faire dans l'application
    // - Le token contient les informations d'identité encodées (JWT)
    // - Le token a une durée de validité (expiration)
    //
    // En production, ce token sera :
    // - Stocké dans le localStorage ou en cookie
    // - Envoyé dans le header Authorization de chaque requête
    // - Vérifié par le backend pour chaque action authentifiée
    // - Renouvelé avec le refreshToken quand il expire
    expect(result.token).toBe("fake-jwt-token");

    // ═══════════════════════════════════════════════════════════════════════
    // RÉSUMÉ DU FLUX DE CE TEST :
    // ═══════════════════════════════════════════════════════════════════════
    // 1. ARRANGE : On crée une fausse réponse HTTP (axiosResponse)
    // 2. ARRANGE : On configure mockPost pour retourner cette réponse
    // 3. ACT : On appelle signIn() qui utilise mockPost au lieu du vrai api.post()
    // 4. ASSERT : On vérifie (6 assertions) :
    //    - Les bons paramètres ont été envoyés (URL + credentials)
    //    - La fonction a été appelée exactement une fois
    //    - Le résultat complet retourné est correct
    //    - Le flag success est true
    //    - L'email de l'utilisateur est correct
    //    - Le token JWT est présent
    // ═══════════════════════════════════════════════════════════════════════
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 2 : IDENTIFIANTS INCORRECTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 2 : Login with incorrect credentials
   *
   * Objectif : Vérifier que la fonction gère correctement les erreurs
   *            d'authentification avec des identifiants invalides.
   *
   * Scénario :
   * - Utilisateur saisit un email ou mot de passe incorrect
   * - Le backend vérifie les credentials et détecte qu'ils sont invalides
   * - Le backend retourne status 401 (Unauthorized)
   * - signIn() doit lancer une exception avec un message d'erreur clair
   *
   * Ce qu'on teste :
   * - L'erreur 401 est correctement interceptée
   * - Le message d'erreur est extrait et propagé
   * - L'exception est lancée (pas de retour silencieux)
   * - Le message est user-friendly (pas un code technique)
   *
   * Importance :
   * - C'est un scénario très fréquent (typos, mauvais mot de passe)
   * - Le message doit être clair pour l'utilisateur final
   * - Ne doit pas révéler si c'est l'email ou le password qui est incorrect (sécurité)
   *
   * Note de sécurité :
   * - Le message est volontairement vague : "Email or password incorrect"
   * - On ne dit PAS "Email incorrect" ou "Password incorrect"
   * - Cela empêche l'énumération des utilisateurs (attaque par force brute)
   */
  it("should throw an error in case of incorrect credentials", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Créer une vraie AxiosError pour simuler une erreur 401
    // ─────────────────────────────────────────────────────────────────────────

    // Créer une vraie AxiosError (classe d'erreur d'Axios)
    // On ne crée pas un simple objet, mais une vraie instance d'AxiosError
    // pour simuler fidèlement le comportement réel d'Axios
    const axiosError = new AxiosError(
      "Request failed with status code 401", // Message principal de l'erreur
      "ERR_BAD_REQUEST", // Code d'erreur Axios
      undefined, // Config (non nécessaire ici)
      undefined, // Request (non nécessaire ici)
      {
        // Response : La réponse HTTP qui contient les détails de l'erreur
        data: {
          success: false, // Flag d'échec
          message: "Email or password incorrect", // Message user-friendly
        },
        status: 401, // 401 = Unauthorized (identifiants invalides)
        statusText: "Unauthorized", // Texte du statut HTTP
        headers: {}, // En-têtes HTTP
        config: {} as any, // Configuration Axios
      }
    );

    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Configurer le mock pour rejeter avec cette erreur
    // ─────────────────────────────────────────────────────────────────────────

    // mockRejectedValueOnce() simule UNE promesse rejetée (échec) UNE FOIS
    // Quand signIn() appellera api.post(), le mock lancera cette erreur
    // au lieu de retourner un succès
    mockPost.mockRejectedValueOnce(axiosError);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT & ASSERT : Vérifier que l'exception est lancée avec le bon message
    // ─────────────────────────────────────────────────────────────────────────

    // expect().rejects.toThrow() est une assertion spéciale pour les promesses
    // qui vérifie qu'une exception est lancée
    //
    // Que vérifie-t-on ?
    // 1. signIn() lance bien une exception (pas de retour normal)
    // 2. Le message de l'exception est EXACTEMENT "Email or password incorrect"
    // 3. Le message vient bien de error.response.data.message (extrait correctement)
    //
    // Si ce test échoue, cela peut indiquer :
    // - signIn() ne propage pas l'erreur (bug!)
    // - Le message est mal extrait (bug de parsing!)
    // - Le backend a changé le format de réponse (breaking change!)
    await expect(signIn(loginData)).rejects.toThrow(
      "Email or password incorrect"
    );

    // Vérifier que l'API a bien été appelée (même si elle a échoué)
    // Cela confirme que l'échec vient du backend, pas d'un problème local
    expect(mockPost).toHaveBeenCalledWith(API_ROUTES.AUTH.LOGIN, loginData);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 3 : EMAIL MANQUANT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 3 : Missing email
   *
   * Objectif : Vérifier que la fonction gère correctement l'erreur
   *            quand l'email est manquant ou vide.
   *
   * Scénario :
   * - Utilisateur essaie de se connecter sans fournir d'email
   * - Le backend (ou frontend) détecte le champ manquant
   * - Le backend retourne status 400 (Bad Request)
   * - signIn() doit lancer une exception avec un message clair
   *
   * Ce qu'on teste :
   * - La validation des champs requis fonctionne
   * - L'erreur 400 est correctement gérée
   * - Le message d'erreur est spécifique au champ manquant
   *
   * Note : Dans cet exemple, on utilise un objet simple au lieu d'AxiosError
   * pour montrer que le code doit gérer les deux formats (robustesse)
   */
  it("should throw an error if the email is missing", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Créer une erreur de validation (format simplifié)
    // ─────────────────────────────────────────────────────────────────────────

    // Note : Ici on utilise un objet simple au lieu d'une vraie AxiosError
    // Le code de signIn() doit être assez robuste pour gérer les deux formats
    const errorResponse = {
      response: {
        data: {
          error: "Email is required", // Message de validation spécifique
        },
        status: 400, // 400 = Bad Request (erreur de validation)
      },
    };

    // Configurer le mock pour rejeter avec cette erreur de validation
    mockPost.mockRejectedValueOnce(errorResponse);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT & ASSERT : Vérifier l'exception pour un email vide
    // ─────────────────────────────────────────────────────────────────────────

    // Appeler signIn() avec un email vide et vérifier que l'exception est lancée
    // { email: "", password: "password123" } simule un formulaire avec email vide
    await expect(
      signIn({ email: "", password: "password123" })
    ).rejects.toThrow("Email is required");
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 4 : MOT DE PASSE MANQUANT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 4 : Missing password
   *
   * Objectif : Vérifier la validation du champ password
   * Structure identique au TEST 3, mais pour le mot de passe
   *
   * Scénario :
   * - Utilisateur essaie de se connecter sans mot de passe
   * - Le backend détecte le champ manquant
   * - Une erreur 400 avec message spécifique est retournée
   */
  it("should throw an error if the password is missing", async () => {
    // Créer l'erreur de validation pour mot de passe manquant
    const errorResponse = {
      response: {
        data: {
          error: "Password is required", // Message spécifique au password
        },
        status: 400,
      },
    };

    // Configurer le mock pour rejeter avec cette erreur
    mockPost.mockRejectedValueOnce(errorResponse);

    // Vérifier que l'exception est lancée avec le bon message
    // { email: "test@example.com", password: "" } simule un mot de passe vide
    await expect(
      signIn({ email: "test@example.com", password: "" })
    ).rejects.toThrow("Password is required");
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 5 : STRUCTURE DE LA RÉPONSE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 5 : Check the complete structure of the response
   *
   * Objectif : S'assurer que la réponse contient TOUS les champs attendus
   *            et que la structure est conforme au contrat API.
   *
   * Importance :
   * - Garantit que le frontend peut accéder à toutes les données nécessaires
   * - Détecte les breaking changes dans l'API backend
   * - Valide que l'interface TypeScript LoginResponse est correcte
   * - Vérifie la présence des champs même s'ils sont optionnels
   *
   * Ce test est un "test de contrat" :
   * - Il vérifie le contrat entre frontend et backend
   * - Si le backend change la structure, ce test échoue
   * - Permet de détecter les breaking changes tôt
   *
   * Ce qu'on vérifie :
   * - Propriétés de premier niveau (success, message, user, token, refreshToken)
   * - Propriétés imbriquées dans user (_id, email, firstname, etc.)
   * - Présence de TOUS les champs, même optionnels (address peut être vide mais doit exister)
   */
  it("should return a response with the correct structure", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Créer la fixture de réponse
    // ─────────────────────────────────────────────────────────────────────────

    const axiosResponse: AxiosResponse<LoginResponse> = {
      data: apiResponse, // Contient la structure complète à vérifier
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };

    // Configurer le mock pour retourner cette réponse
    mockPost.mockResolvedValueOnce(axiosResponse);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT : Appeler la fonction
    // ─────────────────────────────────────────────────────────────────────────

    const result = await signIn(loginData);

    // ─────────────────────────────────────────────────────────────────────────
    // ASSERT : Vérifier chaque propriété individuellement
    // ─────────────────────────────────────────────────────────────────────────

    // Vérifier les propriétés de la réponse de premier niveau
    // Ces champs sont essentiels pour le fonctionnement de l'application
    expect(result).toHaveProperty("success"); // Flag de succès/échec
    expect(result).toHaveProperty("message"); // Message de confirmation
    expect(result).toHaveProperty("user"); // Objet utilisateur complet
    expect(result).toHaveProperty("token"); // JWT pour authentification
    expect(result).toHaveProperty("refreshToken"); // Token de renouvellement

    // Vérifier les propriétés de l'objet utilisateur (imbriqué)
    // Ces champs sont nécessaires pour afficher le profil utilisateur
    expect(result.user).toHaveProperty("_id"); // ID unique MongoDB
    expect(result.user).toHaveProperty("email"); // Email (identifiant)
    expect(result.user).toHaveProperty("firstname"); // Prénom pour affichage
    expect(result.user).toHaveProperty("lastname"); // Nom pour affichage
    expect(result.user).toHaveProperty("name"); // Nom complet
    expect(result.user).toHaveProperty("role"); // Rôle pour permissions
    expect(result.user).toHaveProperty("createdAt"); // Date de création
    expect(result.user).toHaveProperty("updatedAt"); // Date de modification

    // Note importante :
    // toHaveProperty() vérifie seulement la PRÉSENCE de la propriété
    // Elle ne vérifie PAS :
    // - Le type de la valeur (string, number, etc.)
    // - Le contenu exact de la valeur
    // - Si la valeur est null/undefined (tant que la clé existe)
    //
    // Pour vérifier le type ET la valeur, il faudrait faire :
    // expect(result.success).toBe(true);
    // expect(typeof result.token).toBe("string");
    // etc.
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 6 : ERREUR SERVEUR 500
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * TEST 6 : Server error 500
   *
   * Objectif : Vérifier que la fonction gère correctement les erreurs serveur
   *            (erreurs internes du backend, non liées aux données utilisateur).
   *
   * Scénario :
   * - Le serveur rencontre une erreur interne (bug, BDD down, etc.)
   * - Le serveur retourne status 500 (Internal Server Error)
   * - signIn() doit propager cette erreur de manière compréhensible
   *
   * Cas d'usage réels déclenchant une erreur 500 :
   * - Base de données MongoDB inaccessible ou en panne
   * - Crash d'un microservice d'authentification
   * - Timeout d'une API tierce (OAuth, etc.)
   * - Bug dans le code backend (exception non catchée)
   * - Serveur surchargé (out of memory, etc.)
   * - Problème réseau interne entre services
   *
   * Pourquoi tester les erreurs 500 ?
   * - Elles PEUVENT arriver en production (Murphy's law)
   * - Le frontend doit les gérer gracieusement
   * - L'utilisateur doit voir un message clair, pas un crash
   * - On doit pouvoir logger ces erreurs pour investigation
   *
   * Comportement attendu en production :
   * - Afficher un message user-friendly
   * - Logger l'erreur pour les développeurs
   * - Proposer de réessayer
   * - Ne PAS afficher de stack trace à l'utilisateur
   */
  it("should handle server 500 errors", async () => {
    // ─────────────────────────────────────────────────────────────────────────
    // ARRANGE : Créer une erreur serveur 500
    // ─────────────────────────────────────────────────────────────────────────

    // Format simplifié (pas une vraie AxiosError)
    // Le code doit être robuste et gérer ce format aussi
    const serverError = {
      response: {
        data: {
          error: "Internal server error", // Message générique
        },
        status: 500, // 500 = Internal Server Error
      },
    };

    // Configurer le mock pour rejeter avec cette erreur serveur
    mockPost.mockRejectedValueOnce(serverError);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT & ASSERT : Vérifier la propagation de l'erreur
    // ─────────────────────────────────────────────────────────────────────────

    // Vérifier que l'exception est lancée avec le message d'erreur
    await expect(signIn(loginData)).rejects.toThrow("Internal server error");

    // Note : En production, après avoir catché cette erreur, on devrait :
    // 1. Logger l'erreur complète (avec stack trace) pour debugging
    // 2. Afficher à l'utilisateur : "Une erreur est survenue, veuillez réessayer"
    // 3. Proposer de contacter le support si l'erreur persiste
    // 4. Ne PAS révéler de détails techniques sensibles
    // 5. Peut-être envoyer un rapport d'erreur automatique (Sentry, etc.)
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// FIN DES TESTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RÉSUMÉ DE LA COUVERTURE DE TESTS
 *
 * ✅ TEST 1 : Connexion réussie (happy path) - Status 200
 * ✅ TEST 2 : Identifiants incorrects - Status 401
 * ✅ TEST 3 : Email manquant - Status 400
 * ✅ TEST 4 : Mot de passe manquant - Status 400
 * ✅ TEST 5 : Structure de la réponse (contrat API)
 * ✅ TEST 6 : Erreur serveur - Status 500
 *
 * Total : 6 tests couvrant tous les scénarios critiques de connexion
 *
 * PATTERN UTILISÉ : AAA (Arrange-Act-Assert)
 * - ARRANGE : Préparer les données et configurer les mocks
 * - ACT     : Exécuter la fonction testée
 * - ASSERT  : Vérifier les résultats avec des assertions
 *
 * BONNES PRATIQUES APPLIQUÉES :
 * ✓ Tests isolés (beforeEach nettoyage systématique)
 * ✓ Mocks configurés correctement (ordre des imports respecté)
 * ✓ Fixtures réutilisables (loginData, apiResponse)
 * ✓ Assertions explicites et complètes
 * ✓ Commentaires ultra-détaillés (pédagogiques)
 * ✓ Nommage clair et descriptif (should...)
 * ✓ Couverture complète (succès + erreurs + validations)
 * ✓ Tests de contrat (structure de réponse)
 *
 * CODES HTTP TESTÉS :
 * - 200 OK : Authentification réussie
 * - 400 Bad Request : Validation (champs manquants)
 * - 401 Unauthorized : Identifiants incorrects
 * - 500 Internal Server Error : Erreur serveur
 *
 * DIFFÉRENCES AVEC signUp :
 * - Status 200 (lecture) au lieu de 201 (création)
 * - Teste token + refreshToken (pas de création d'utilisateur)
 * - Moins de validations (juste email + password)
 * - Pas de FormData (pas d'upload de fichier)
 */
