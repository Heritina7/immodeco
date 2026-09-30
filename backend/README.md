# Furniture Backend – Express + Prisma + PostgreSQL

API REST pour le catalogue mobilier Maison Élégance.

## Prérequis

- Node.js 18+
- PostgreSQL 14+ installé et démarré

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données
# Éditer le fichier .env avec tes identifiants PostgreSQL
cp .env.example .env
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/furniture_db?schema=public"

# 3. Créer la base de données PostgreSQL
# Dans psql ou pgAdmin :
# CREATE DATABASE furniture_db;

# 4. Pousser le schéma Prisma
npx prisma db push

# 5. Générer le client Prisma
npx prisma generate

# 6. Remplir la base avec les données de démo
npm run db:seed

# 7. Lancer le serveur
npm run dev
```

Le serveur démarre sur **http://localhost:3001**

## Endpoints API

### Health
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/health` | Statut de l'API |

### Catégories
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/categories` | Liste des catégories |
| GET | `/api/categories/:slug` | Une catégorie |

### Produits
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/products` | Liste (avec filtres) |
| GET | `/api/products/featured` | Produits en vedette |
| GET | `/api/products/:id` | Détail d'un produit |
| GET | `/api/products/:id/similar` | Produits similaires |

**Query params pour `/api/products` :**
- `category` – slug de catégorie (ex: `chaises`)
- `search` – recherche texte
- `minPrice` / `maxPrice` – fourchette de prix
- `colors` – couleurs séparées par virgule
- `promo=true` – promotions uniquement
- `sort` – `price-asc` \| `price-desc` \| `name` \| `new`
- `page` / `limit` – pagination

### Commandes
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/orders` | Créer une commande |
| GET | `/api/orders` | Liste des commandes |
| GET | `/api/orders/:id` | Détail d'une commande |

**Body pour POST `/api/orders` :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "phone": "0612345678",
  "address": "12 rue du Design",
  "city": "Paris",
  "zip": "75011",
  "country": "France",
  "items": [
    {
      "productId": "clxxx...",
      "selectedColor": "Noir",
      "quantity": 2
    }
  ]
}
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur en mode watch |
| `npm start` | Serveur production |
| `npm run db:push` | Pousser le schéma |
| `npm run db:seed` | Remplir les données |
| `npm run db:studio` | Interface Prisma Studio |
| `npm run db:migrate` | Créer une migration |

## Structure

```
src/
├── index.js              # Point d'entrée Express
├── lib/prisma.js         # Client Prisma
├── routes/               # Routes
└── controllers/          # Logique métier
prisma/
├── schema.prisma         # Schéma de la base
└── seed.js               # Données de démo
```

## Connexion Frontend

Dans ton frontend React, remplace les appels aux données locales par :

```js
const API_URL = 'http://localhost:3001/api'

// Exemple
const res = await fetch(`${API_URL}/products?category=chaises`)
const data = await res.json()
```
