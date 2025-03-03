
# CPME Tool - Architecture Optimisée

Ce projet utilise une architecture optimisée avec Hostinger, Firebase et Stripe pour offrir une solution complète et scalable.

## Configuration de l'environnement

Pour que l'application fonctionne correctement, vous devez configurer les variables d'environnement suivantes :

### Frontend (React)

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
# Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_your-public-key
VITE_STRIPE_STANDARD_PLAN_ID=price_standard_id
VITE_STRIPE_PRO_PLAN_ID=price_pro_id
VITE_STRIPE_ENTERPRISE_PLAN_ID=price_enterprise_id

# API Backend (Hostinger)
VITE_API_URL=https://your-api.hostinger.fr
```

### Backend (Hostinger)

Configurez les variables d'environnement suivantes sur votre serveur Hostinger :

```
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
FRONTEND_URL=https://your-frontend-url.com
PORT=3000
```

## Guide de déploiement

### Frontend (React)

1. Installez les dépendances et construisez l'application :
   ```bash
   npm install
   npm run build
   ```

2. Déployez le contenu du dossier `dist` sur votre hébergement statique.

### Backend (Node.js sur Hostinger)

1. Créez un hébergement Node.js sur Hostinger.
2. Uploadez le contenu du dossier `server` dans le répertoire de votre application.
3. Installez les dépendances :
   ```bash
   npm install express cors stripe
   ```
4. Configurez les variables d'environnement.
5. Démarrez l'application :
   ```bash
   node index.js
   ```

### Firebase

1. Créez un projet Firebase à partir de la console Firebase.
2. Activez les services suivants :
   - Authentication (Email/Password et Google)
   - Firestore Database
   - Storage
3. Configurez les règles de sécurité pour Firestore et Storage.
4. Obtenez les informations d'identification et mettez à jour les variables d'environnement.

### Stripe

1. Créez un compte Stripe et configurez les produits et prix.
2. Créez un webhook Stripe pointant vers `https://your-api.hostinger.fr/webhook`.
3. Obtenez les clés API et mettez à jour les variables d'environnement.

## Architecture du projet

### Backend (Hostinger)
- Héberge l'API REST pour les opérations Stripe
- Gère les webhooks Stripe
- Traite les événements d'abonnement et de paiement

### Firebase
- Authentication : Gère l'authentification des utilisateurs
- Firestore : Stocke les données des utilisateurs, licences et logs
- Storage : Stocke les fichiers PDF et autres documents

### Stripe
- Gère les abonnements et paiements
- Traite les cartes de crédit
- Fournit un portail client pour la gestion des abonnements

## Maintenance et mise à jour

Pour mettre à jour le système :

1. Frontend : Mettez à jour le code source, reconstruisez et redéployez
2. Backend : Mettez à jour les fichiers sur Hostinger et redémarrez le serveur
3. Firebase/Stripe : Les mises à jour sont automatiques
