# 🚀 PLAN D'ACTION MIWA CHECK-IN - ACCÉLÉRATION

## 📊 État Actuel vs Objectif

```
ACTUEL:
✅ Frontend: 10 pages, 50+ composants (100%)
✅ Authentification: Complète (100%)
⏳ Base de données: Schéma legacy non aligné → À REFAIRE

OBJECTIF NOUVEAU SCOPE (Miwa Check-In):
✅ Frontend: RÉUTILISABLE! (pages search, listing, bookings, payments existent!)
⏳ API: 20+ endpoints à créer
⏳ PMS: Modules QR, Stocks, Housekeeping
⏳ Fintech: Calcul WARA, virements automatiques
```

---

## ⚡ PHASES DE DÉVELOPPEMENT RAPIDE

### **PHASE 1: MVP (2 semaines)** - Réservation Hôtel Basique

**Semaine 1: Backend**

```
① Créer endpoints API:
   - POST /api/establishments (créer hôtel)
   - POST /api/rooms (créer chambres)
   - GET /api/establishments (rechercher)
   - GET /api/establishments/{id} (détails)
   - POST /api/hotel-bookings (réserver)
   - GET /api/hotel-bookings/:id (récupérer booking)

② Implémenter système de paiement:
   - Intégration FedaPay (déjà validé!)
   - Calcul de commission: 4% du total
   - Webhook pour confirmations de paiement

③ Créer base de données:
   - Exécuter 03-miwa-checkin-complete-schema.sql
   - Tester la structure
```

**Semaine 2: Frontend + Intégration**

```
① Intégrer les pages existantes:
   - /search → Affiche établissements
   - /listing/[slug] → Détails hôtel
   - /checkout/[id] → Paiement
   - /bookings → Mes réservations

② Adapter les composants:
   - SearchForm → Recherche hôtels
   - ListingCard → Établissements
   - CheckoutForm → Paiement avec logique WARA

③ Tests:
   - Créer établissement
   - Réserver une chambre
   - Payer 50% en ligne
   - Recevoir QR Code
```

---

### **PHASE 2: Expansion (2 semaines)** - Restaurants + Livraison

**Semaine 1: Restaurants**

```
① Endpoints:
   - GET /api/establishments?type=restaurant
   - GET /api/restaurants/{id}/tables
   - GET /api/restaurants/{id}/menu
   - POST /api/restaurant-bookings
   - POST /api/orders (commande table)

② Fonctionnalités:
   - Scanner QR à l'arrivée
   - +200 FCFA par personne au Solde Débiteur
   - Commandes cuisine instantanées
   - Stocks automatiques

③ PMS Resto:
   - Scan QR Table
   - Commandes Cuisine
   - Stocks Bar/Resto
```

**Semaine 2: Livraison**

```
① Endpoints:
   - POST /api/delivery-orders
   - GET /api/delivery-orders/{id}
   - GET /api/delivery-status/{id}
   - PATCH /api/delivery-orders/{id}

② Logique:
   - Calcul distance GPS
   - Commission 15% du total
   - Failover MTN ↔ KKiaPay
```

---

### **PHASE 3: Fintech Avancée (1 semaine)**

```
① Webhooks de paiement:
   - Recevoir confirmations FedaPay
   - Créditer wallet client
   - Débiter commission Miwa
   - Calculer payout établissement

② Virements automatiques:
   - Déclencher payout <2 min après paiement
   - Gestion Solde Débiteur
   - Failover automatique si paiement échoue

③ Dashboard:
   - KPIs en temps réel
   - Historique virements
   - Statistiques occupancy/revenus
```

---

### **PHASE 4: Polish + QA (1 semaine)**

```
① Sécurité:
   - Token unique par réservation
   - Vérification serveur QR Code
   - Mode offline + sync

② Performance:
   - Cache Redis pour recherches
   - Lazy loading images
   - Optimisation BD indexes

③ Tests:
   - Scénarios complets (réservation → paiement → arrivée)
   - Tests offline
   - Tests paiement echecs + retry
```

**TOTAL: 6 semaines = ~1.5 mois**

---

## 📋 CHECKLIST DÉTAILLÉE PAR PRIORITÉ

### 🔴 **CRITIQUES (Faire en PREMIER)**

- [ ] Exécuter nouveau schema SQL (03-miwa-checkin-complete-schema.sql)
- [ ] Créer 6 endpoints API core:
  ```
  POST   /api/establishments
  GET    /api/establishments?type=hotel&city=Cotonou
  GET    /api/establishments/{id}
  GET    /api/rooms/{establishmentId}
  POST   /api/hotel-bookings
  GET    /api/hotel-bookings/{id}
  ```
- [ ] Intégrer FedaPay pour paiements
- [ ] Créer webhook pour confirmations paiement
- [ ] Refaire type DatabaseTypes pour nouveau schéma
- [ ] Adapter pages search → listing → checkout

### 🟡 **IMPORTANTS (Faire rapidement)**

- [ ] 8 endpoints restaurants
- [ ] 5 endpoints livraison
- [ ] Système QR Code Check-in
- [ ] Calcul WARA (commission + payout)
- [ ] Page booking/reservation
- [ ] Page "Mes établissements" (pour partenaires)
- [ ] Dashboard partenaire basique

### 🟢 **OPTIONNELS (Faire plus tard)**

- [ ] Avis/Ratings
- [ ] Favoris
- [ ] Historique stocks détaillé
- [ ] Planning housekeeping avancé
- [ ] Analytics dashboard
- [ ] Admin panel complet

---

## 🛠️ ENDPOINTS À CRÉER (Priorité)

### **HÔTELS (7 endpoints)**

```
POST   /api/establishments               (créer)
GET    /api/establishments              (lister/rechercher)
GET    /api/establishments/{id}         (détails)
PATCH  /api/establishments/{id}         (modifier)
POST   /api/rooms                       (créer chambre)
GET    /api/rooms/{establishmentId}     (lister chambre)
POST   /api/hotel-bookings              (créer booking)
GET    /api/hotel-bookings/{id}         (détails booking)
PATCH  /api/hotel-bookings/{id}         (modifier status)
GET    /api/hotel-bookings/client/{id}  (mes réservations)
```

### **RESTAURANTS (6 endpoints)**

```
GET    /api/restaurants/{id}/tables     (disponibilité)
GET    /api/restaurants/{id}/menu       (carte)
POST   /api/restaurant-bookings         (réserver table)
POST   /api/orders                      (créer commande)
GET    /api/orders/{id}                 (détails)
PATCH  /api/orders/{id}                 (modifier status)
```

### **LIVRAISON (5 endpoints)**

```
POST   /api/delivery-orders             (créer)
GET    /api/delivery-orders/{id}        (détails)
GET    /api/delivery-orders/client/{id} (mes livraisons)
PATCH  /api/delivery-orders/{id}        (modifier status)
GET    /api/delivery-status/{id}        (suivi temps réel)
```

### **PAIEMENTS (4 endpoints)**

```
POST   /api/payments                    (créer paiement)
GET    /api/payments/{id}               (détails)
POST   /api/payments/{id}/confirm       (confirmer paiement)
GET    /api/payments/client/{id}        (historique)
```

### **UTILISATEUR (3 endpoints)**

```
GET    /api/users/{id}                  (profil)
PATCH  /api/users/{id}                  (modifier profil)
GET    /api/users/{id}/wallet           (wallet balance)
```

**TOTAL: 25 endpoints essentiels**

---

## 📁 STRUCTURE FICHIERS À CRÉER

```
app/api/
├── establishments/
│   ├── route.ts (GET, POST)
│   └── [id]/
│       ├── route.ts (GET, PATCH)
│       ├── rooms/
│       │   └── route.ts (GET, POST)
│       ├── bookings/
│       │   └── route.ts (GET)
│       ├── tables/
│       │   └── route.ts (GET)
│       └── menu/
│           └── route.ts (GET)
│
├── hotel-bookings/
│   ├── route.ts (GET, POST)
│   └── [id]/
│       ├── route.ts (GET, PATCH)
│       └── qr/
│           └── route.ts (GET - générer QR)
│
├── restaurant-bookings/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PATCH)
│
├── orders/
│   ├── route.ts (GET, POST)
│   └── [id]/
│       ├── route.ts (GET, PATCH)
│       └── status/route.ts (GET - suivi)
│
├── delivery-orders/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PATCH)
│
├── payments/
│   ├── route.ts (GET, POST)
│   ├── [id]/
│   │   ├── route.ts (GET)
│   │   └── confirm/route.ts (POST - webhook)
│   └── webhook/
│       └── fedapay/route.ts (POST - paiements entrants)
│
├── users/
│   └── [id]/
│       ├── route.ts (GET, PATCH)
│       ├── bookings/route.ts (GET)
│       └── wallet/route.ts (GET)
│
└── search/
    └── route.ts (GET - recherche globale)

types/
├── db.types.ts (REFAIRE avec nouveau schéma!)
└── models.ts (Interfaces pour API)

lib/
├── payment.service.ts (Logique WARA)
├── qr.service.ts (Génération QR)
├── search.service.ts (Recherche/filtrage)
└── notifications.service.ts
```

---

## 🎯 KPIs PAR PHASE

**Phase 1 (MVP):**

- ✅ 10 établissements testés
- ✅ 50 réservations hôtel
- ✅ 0 erreur paiement
- ✅ Temps moyen réservation < 2 min

**Phase 2 (Expansion):**

- ✅ 30 établissements actifs
- ✅ 500 réservations/mois
- ✅ Commission moyenne ~7M FCFA/mois
- ✅ Taux satisfaction > 4.5/5

**Phase 3 (Consolidation):**

- ✅ 100 établissements
- ✅ 7M FCFA/mois revenus
- ✅ Payout < 2 min garanti
- ✅ Reference locale établie

---

## ⚡ TRICKS POUR ALLER PLUS VITE

### 1️⃣ **Réutiliser le Frontend**

Les pages existent déjà! Juste adapter:

- SearchPage → Cherche hôtels/restos
- ListingPage → Affiche établissement
- CheckoutPage → Paiement 50/50
- BookingsPage → Mes réservations

### 2️⃣ **API Simplifiée Phase 1**

Ne pas tout faire tout de suite:

- Juste hôtels d'abord (pas restos)
- Juste réservation (pas livraison)
- Juste paiement online (pas offline)

### 3️⃣ **Utiliser des Libraries**

- `qrcode` pour QR Code
- `geolocation-utils` pour distances
- `date-fns` pour dates
- `zod` pour validation (déjà installé!)

### 4️⃣ **Tester avec Postman**

- Créer une collection API
- Tester chaque endpoint
- Documenter pour clients

### 5️⃣ **Seed Data**

Créer des données de test:

- 5 établissements types
- 20 chambres
- 10 utilisateurs test

---

## 📊 TIMELINE RÉALISTE

| Phase       | Durée     | Objectif           | Team         |
| ----------- | --------- | ------------------ | ------------ |
| 1 MVP       | 2 sem     | Hôtels Cotonou     | 1 fullstack  |
| 2 Expansion | 2 sem     | Restos + Livraison | 1 fullstack  |
| 3 Fintech   | 1 sem     | Virements auto     | 1 backend    |
| 4 Polish    | 1 sem     | QA + Sécurité      | 1-2 QA       |
| **TOTAL**   | **6 sem** | **Prêt lancement** | **1-2 devs** |

---

## 🎬 COMMENCER MAINTENANT

**Semaine 1:**

1. Exécuter `03-miwa-checkin-complete-schema.sql`
2. Mettre à jour `types/db.types.ts` (nouveau schéma)
3. Créer 3 premiers endpoints:
   - POST /api/establishments
   - GET /api/establishments
   - GET /api/establishments/{id}
4. Tester avec 5 établissements de test

**Semaine 2:**

1. Endpoints hôtels + bookings
2. Intégration FedaPay
3. Adapter pages frontend
4. Première réservation de test → paiement → QR Code

**Semaine 3-6:**
Suivre le plan ci-dessus...

---

**Besoin d'aide pour:**

- [ ] Refaire types/db.types.ts?
- [ ] Créer le premier endpoint?
- [ ] Intégrer FedaPay?
- [ ] Adapter les pages existantes?

**Dépêche-toi! Tu as les briques, juste à assembler! 🏗️**
