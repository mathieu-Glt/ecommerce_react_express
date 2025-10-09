# 🌥️ Guide de Configuration Cloudinary

## 🚨 Problème Actuel

L'erreur `'Erreur upload iphone.jpeg: Must supply api_key'` indique que Cloudinary n'est pas configuré.

## ✅ Solution Temporaire

Le système utilise maintenant le **stockage local** comme fallback quand Cloudinary n'est pas configuré.

## 🔧 Configuration Cloudinary (Optionnel)

### 1. Créer un compte Cloudinary

1. Aller sur [cloudinary.com](https://cloudinary.com)
2. Créer un compte gratuit
3. Récupérer vos credentials dans le Dashboard

### 2. Créer le fichier `.env` dans le dossier `server/`

```bash
# Dans le dossier server/
touch .env
```

### 3. Ajouter les variables d'environnement

```env
# Configuration Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Configuration JWT
JWT_SECRET=your_jwt_secret_key

# Configuration du serveur
PORT=8000
NODE_ENV=development
```

### 4. Remplacer les valeurs par vos credentials Cloudinary

Dans votre Dashboard Cloudinary, vous trouverez :

- **Cloud Name** : `your_cloud_name`
- **API Key** : `your_api_key`
- **API Secret** : `your_api_secret`

### 5. Redémarrer le serveur

```bash
cd server
npm start
```

## 🎯 Fonctionnalités

### Avec Cloudinary configuré :

- ✅ Upload automatique vers Cloudinary
- ✅ Images optimisées automatiquement
- ✅ URLs sécurisées HTTPS
- ✅ Suppression automatique des images
- ✅ Badges visuels Cloudinary

### Sans Cloudinary (fallback actuel) :

- ✅ Stockage local dans `/server/uploads/`
- ✅ Fonctionnalité complète préservée
- ✅ Pas de dépendance externe

## 🔍 Vérification

Après configuration, vous devriez voir dans les logs du serveur :

```
🔧 Configuration Cloudinary:
  - CLOUDINARY_CLOUD_NAME: ✅ Défini
  - CLOUDINARY_API_KEY: ✅ Défini
  - CLOUDINARY_API_SECRET: ✅ Défini
```

## 🚀 Test

1. Aller sur `/admin/product`
2. Créer un nouveau produit avec des images
3. Vérifier que les images s'affichent correctement
4. Observer les badges Cloudinary dans l'interface

## 💡 Avantages Cloudinary

- **Performance** : Images optimisées automatiquement
- **Scalabilité** : Stockage cloud infini
- **Sécurité** : URLs sécurisées
- **CDN** : Distribution mondiale
- **Transformations** : Redimensionnement automatique

## 🆘 Dépannage

### Erreur "Must supply api_key"

- Vérifier que le fichier `.env` existe dans `server/`
- Vérifier que les variables sont correctement nommées
- Redémarrer le serveur après modification

### Images ne s'affichent pas

- Vérifier les permissions du dossier `uploads/`
- Vérifier que le serveur peut écrire dans le dossier

### Erreur de connexion

- Vérifier que MongoDB est démarré
- Vérifier l'URL de connexion MongoDB



