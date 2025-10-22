# 🌥️ Configuration Cloudinary

## 📋 Prérequis

1. **Compte Cloudinary** : Créer un compte sur [cloudinary.com](https://cloudinary.com)
2. **Variables d'environnement** : Configurer les clés API dans le fichier `.env`

## 🔧 Configuration

### 1. Variables d'environnement

Ajouter dans `server/.env` :

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Installation des packages

```bash
cd server && npm install cloudinary multer
```

## 🚀 Utilisation

### Côté Serveur

#### Configuration (`server/config/cloudinary.js`)

- ✅ Configuration automatique avec les variables d'environnement
- ✅ Fonctions d'upload et de suppression
- ✅ Génération d'URLs optimisées

#### Middleware (`server/middleware/cloudinaryUpload.js`)

- ✅ Upload automatique vers Cloudinary
- ✅ Nettoyage des fichiers temporaires
- ✅ Gestion des erreurs

#### Contrôleurs

- ✅ `createProduct` : Upload automatique des images
- ✅ `updateProduct` : Gestion des nouvelles images
- ✅ `deleteProduct` : Suppression automatique des images

### Côté Client

#### Utilitaires (`client/src/utils/cloudinaryUtils.js`)

```javascript
import {
  getOptimizedImageUrl,
  getThumbnailUrl,
  getResponsiveImageUrl,
  isCloudinaryImage,
} from "../utils/cloudinaryUtils";

// Vérifier si c'est une image Cloudinary
if (isCloudinaryImage(imageUrl)) {
  // Générer une URL optimisée
  const optimizedUrl = getThumbnailUrl(imageUrl, 300);
}
```

#### Composant réutilisable (`client/src/components/CloudinaryImage.js`)

```javascript
import CloudinaryImage from "../components/CloudinaryImage";

// Utilisation simple
<CloudinaryImage
  src={product.images[0]}
  alt={product.title}
  size="medium"
  showCloudinaryBadge={true}
/>;
```

## 📸 Fonctionnalités

### 1. Upload automatique

- Les images sont automatiquement uploadées vers Cloudinary
- Stockage temporaire local puis suppression
- Gestion des erreurs et nettoyage

### 2. Optimisation automatique

- **Thumbnails** : Images redimensionnées pour les listes
- **Responsive** : Images adaptées aux écrans
- **Qualité optimisée** : Compression automatique

### 3. Suppression automatique

- Suppression des images lors de la suppression de produits
- Nettoyage du stockage Cloudinary

## 🎨 Tailles d'images disponibles

### Utilitaires

- `getThumbnailUrl(url, size)` : Images carrées
- `getResponsiveImageUrl(url, maxWidth)` : Images responsives
- `getOptimizedImageUrl(url, options)` : Personnalisées

### Composant CloudinaryImage

- `size="small"` : 150x150px
- `size="medium"` : 300x300px
- `size="large"` : 600x600px
- `customSize={400}` : Taille personnalisée

## 🔍 Debug et monitoring

### Logs serveur

```javascript
console.log("📤 Upload vers Cloudinary:", fileName);
console.log("✅ Image uploadée:", result.url);
console.log("🗑️ Suppression de Cloudinary:", publicId);
```

### Vérification côté client

```javascript
// Vérifier si une image est sur Cloudinary
if (isCloudinaryImage(imageUrl)) {
  console.log("☁️ Image Cloudinary détectée");
}
```

## 🛠️ Dépannage

### Erreurs courantes

1. **Variables d'environnement manquantes**

   ```
   Error: Cloudinary configuration missing
   ```

   → Vérifier le fichier `.env`

2. **Upload échoué**

   ```
   Error: Upload failed
   ```

   → Vérifier les permissions Cloudinary

3. **Images non affichées**
   → Vérifier les URLs dans la base de données

### Tests

1. **Créer un produit** avec des images
2. **Vérifier** que les images sont uploadées vers Cloudinary
3. **Modifier un produit** et ajouter de nouvelles images
4. **Supprimer un produit** et vérifier la suppression des images

## 📚 Ressources

- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [API Cloudinary](https://cloudinary.com/documentation/admin_api)
- [Transformations d'images](https://cloudinary.com/documentation/image_transformations)




