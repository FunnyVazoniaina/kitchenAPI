# Backend - Food Suggester

Ce backend est une API REST développée avec **Node.js** et **Express.js**, qui complète l’application frontend *Food Suggester*. Il permet la gestion des utilisateurs, des recettes favorites, de l’historique de recherche et d'autres fonctionnalités personnalisées non couvertes par l’API Spoonacular.

## Fonctionnalités principales

- Authentification des utilisateurs (JWT)
- Sauvegarde des recettes favorites
- Historique des recherches par utilisateur
- Système de commentaires et de notation
- Middleware de validation et de sécurité
- API RESTful consommable par n’importe quel frontend

## Technologies utilisées

- Node.js
- Express.js
- MySQL ou PostgreSQL (au choix)
- Sequelize (ORM) ou Knex
- JWT (jsonwebtoken)
- bcrypt pour le hachage des mots de passe
- dotenv pour la gestion de l’environnement
- Cors, Helmet, etc. pour la sécurité

## Prérequis

- Node.js >= 18.x
- npm ou pnpm
- Base de données relationnelle (MySQL ou PostgreSQL)
- Un compte Spoonacular (facultatif pour le backend)

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/food-suggester-backend.git
cd food-suggester-backend
2. Installer les dépendances
bash
Copy
Edit
npm install
# ou
pnpm install
3. Configurer les variables d’environnement
Créer un fichier .env à la racine :

env
Copy
Edit
PORT=5000
DATABASE_URL=mysql://user:password@localhost:3306/food_suggester
JWT_SECRET=une_chaine_secrete
Adapter la variable DATABASE_URL selon ton SGBD et ton système.

4. Lancer le serveur
bash
Copy
Edit
npm run dev
# ou
pnpm run dev
Le backend sera disponible à l'adresse : http://localhost:5000

Structure du projet
pgsql
Copy
Edit
food-suggester-backend/
├── controllers/
│   └── user.controller.js
│   └── recipe.controller.js
├── routes/
│   └── user.routes.js
│   └── recipe.routes.js
├── models/
├── middlewares/
├── services/
├── config/
│   └── database.js
├── .env
├── server.js
└── README.md
Routes principales
Méthode	Endpoint	Description
POST	/api/auth/register	Inscription utilisateur
POST	/api/auth/login	Connexion utilisateur
GET	/api/recipes/favorites	Obtenir les recettes favorites
POST	/api/recipes/favorites	Ajouter une recette aux favoris
DELETE	/api/recipes/favorites/:id	Supprimer une recette des favoris
GET	/api/history	Voir l’historique de recherche

Sécurité
Les routes protégées nécessitent un token JWT valide dans l'en-tête Authorization.

Les mots de passe sont hachés avec bcrypt.

Utilisation de middlewares (helmet, cors, rate-limiter) pour renforcer la sécurité.

Fonctionnalités futures
Intégration d'une file d’attente pour les suggestions personnalisées

Webhooks pour déclencher des actions côté frontend

Dashboard administrateur

API publique en lecture seule

Auteur
Développé par Vazoniaina
Email : vazoniaina@proton.me