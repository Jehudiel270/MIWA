# 📡 MIWA CHECK-IN - API DOCUMENTATION

Base URL: `http://localhost:3000/api`

---

## 🏢 ESTABLISHMENTS (Hôtels, Restaurants, Coworking)

### GET /establishments

Lister tous les établissements avec filtrage.

**Query Parameters:**

```
?type=hotel|restaurant|coworking  // Filtrer par type
?city=Cotonou|Calavi|Ouidah       // Filtrer par ville
?search=text                       // Recherche libre
?limit=50                          // Nombre de résultats
?offset=0                          // Pagination
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Hotel Tropicana",
      "type": "hotel",
      "address": "123 Rue Principale",
      "city": "Cotonou",
      "average_rating": 4.5,
      "is_verified": true
    }
  ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

---

### POST /establishments

Créer un nouvel établissement (authentifié).

**Body:**

```json
{
  "name": "Hotel Tropicana",
  "type": "hotel",
  "description": "Hôtel 4 étoiles",
  "address": "123 Rue Principale",
  "city": "Cotonou",
  "phone": "+229 96123456",
  "email": "contact@tropicana.bj",
  "website": "https://tropicana.bj",
  "latitude": 6.4969,
  "longitude": 2.4277,
  "payout_account": "22290123456"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-nouvelle",
    "owner_id": "user-id",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### GET /establishments/{id}

Récupérer les détails d'un établissement.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Hotel Tropicana",
    "type": "hotel",
    "description": "Hôtel 4 étoiles avec vue sur mer",
    "address": "123 Rue Principale",
    "city": "Cotonou",
    "phone": "+229 96123456",
    "email": "contact@tropicana.bj",
    "latitude": 6.4969,
    "longitude": 2.4277,
    "cover_image_url": "https://cdn.miwa.bj/...",
    "average_rating": 4.5,
    "total_reviews": 127,
    "is_verified": true,
    "payout_account": "22290123456"
  }
}
```

---

### PATCH /establishments/{id}

Modifier un établissement (propriétaire uniquement).

**Body:** (tous les champs optionnels)

```json
{
  "name": "Hotel Tropicana Deluxe",
  "description": "Nouvel hôtel 5 étoiles",
  "phone": "+229 96654321",
  "is_active": true
}
```

---

## 🛏️ ROOMS (Chambres)

### POST /rooms

Créer une chambre.

**Body:**

```json
{
  "establishment_id": "uuid",
  "room_number": "101",
  "type": "deluxe",
  "capacity": 2,
  "price_per_night": 85000,
  "amenities": {
    "air_conditioning": true,
    "wifi": true,
    "tv": true,
    "bathtub": true
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "room_number": "101"
  }
}
```

---

### GET /rooms

Lister les chambres d'un établissement.

**Query Parameters:**

```
?establishment_id=uuid
?available=true              // Seulement disponibles
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "room_number": "101",
      "type": "deluxe",
      "capacity": 2,
      "price_per_night": 85000,
      "is_available": true
    }
  ]
}
```

---

## 📅 HOTEL BOOKINGS (Réservations Hôtel)

### POST /hotel-bookings

Créer une réservation hôtel.

**Body:**

```json
{
  "establishment_id": "uuid",
  "room_id": "uuid",
  "check_in_date": "2024-01-25",
  "check_out_date": "2024-01-27",
  "number_of_guests": 2,
  "special_requests": "Chambre vue sur mer si possible"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-booking",
    "booking_code": "BK-2024-00001",
    "status": "pending",
    "total_price": 170000,
    "deposit_amount": 85000,
    "remaining_amount": 85000,
    "qr_code_url": "https://cdn.miwa.bj/qr/..."
  }
}
```

---

### GET /hotel-bookings/{id}

Récupérer les détails d'une réservation.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "booking_code": "BK-2024-00001",
    "establishment": {
      "name": "Hotel Tropicana"
    },
    "room": {
      "room_number": "101"
    },
    "check_in_date": "2024-01-25",
    "check_out_date": "2024-01-27",
    "status": "pending",
    "qr_code_url": "https://..."
  }
}
```

---

### PATCH /hotel-bookings/{id}

Modifier le statut d'une réservation.

**Body:**

```json
{
  "status": "confirmed|checked_in|completed|cancelled"
}
```

---

### GET /hotel-bookings/client/{client_id}

Lister les réservations d'un client.

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "booking_code": "BK-2024-00001",
      "establishment": { "name": "Hotel Tropicana" },
      "status": "pending"
    }
  ]
}
```

---

## 🍽️ RESTAURANT BOOKINGS

### POST /restaurant-bookings

Réserver une table.

**Body:**

```json
{
  "establishment_id": "uuid",
  "booking_date": "2024-01-25",
  "booking_time": "19:30",
  "number_of_guests": 4,
  "special_requests": "Table près de la fenêtre"
}
```

---

### GET /restaurant-bookings/{id}

Détails d'une réservation table.

---

## 🍴 MENU ITEMS

### GET /menu-items

Lister les items d'un établissement.

**Query Parameters:**

```
?establishment_id=uuid
?category=drinks|food|desserts
```

---

## 📦 ORDERS (Commandes)

### POST /orders

Créer une commande (hôtel, restaurant, livraison).

**Body:**

```json
{
  "establishment_id": "uuid",
  "order_type": "hotel_service|restaurant|delivery",
  "items": [
    {
      "menu_item_id": "uuid",
      "quantity": 2,
      "unit_price": 15000
    }
  ],
  "special_instructions": "Sans oignons"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_reference": "ORD-2024-00001",
    "total_amount": 30000,
    "status": "pending"
  }
}
```

---

### GET /orders/{id}

Récupérer une commande.

---

### PATCH /orders/{id}

Modifier le statut d'une commande.

**Body:**

```json
{
  "status": "pending|confirmed|preparing|ready|delivered|completed"
}
```

---

## 💳 PAYMENTS

### POST /payments

Créer un paiement (initier transaction).

**Body:**

```json
{
  "establishment_id": "uuid",
  "order_id": "uuid",
  "amount_requested": 85000,
  "payment_method": "mobile_money|card|wallet|hybrid"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "transaction_id": "TXN-2024-00001",
    "payment_status": "pending",
    "deposit_paid": 42500,
    "remaining_due": 42500,
    "commission_miwa": 3400,
    "payout_amount": 39100
  }
}
```

**WARA Algorithm:**

```
V = PL - C - SD
V   = Virement (payout_amount)
PL  = Part en Ligne (amount_requested)
C   = Commission Miwa (4% hôtels, 200F restaurants, 15% livraison)
SD  = Solde Débiteur (accumulated debt)
```

---

### POST /payments/{id}/confirm

Confirmer un paiement reçu (webhook FedaPay).

**Body:**

```json
{
  "transaction_id": "FedaPay-txn-123",
  "transaction_hash": "hash...",
  "webhook_received": true
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "payment_status": "paid",
    "payout_status": "pending",
    "payout_reference": "PAYOUT-2024-00001"
  }
}
```

---

### GET /payments/{id}

Récupérer les détails d'un paiement.

---

### GET /payments/client/{client_id}

Historique des paiements d'un client.

---

## 🚚 DELIVERY ORDERS

### POST /delivery-orders

Créer une commande de livraison.

**Body:**

```json
{
  "establishment_id": "uuid",
  "delivery_address": "123 Rue de la Paix, Cotonou",
  "delivery_latitude": 6.4969,
  "delivery_longitude": 2.4277,
  "items": [
    {
      "menu_item_id": "uuid",
      "quantity": 2
    }
  ]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "delivery_distance_km": 5.2,
    "delivery_fee": 5000,
    "total_amount": 35000,
    "estimated_delivery_time": "30 minutes"
  }
}
```

---

### GET /delivery-orders/{id}

Détails d'une livraison.

---

### GET /delivery-orders/{id}/status

Suivi en temps réel d'une livraison.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "dispatched",
    "driver_location": {
      "latitude": 6.495,
      "longitude": 2.429
    },
    "estimated_arrival": "2024-01-15T15:30:00Z"
  }
}
```

---

## 👤 USERS

### GET /users/{id}

Récupérer le profil utilisateur.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Jean Dupont",
    "email": "jean@example.bj",
    "phone": "+229 96123456",
    "wallet_balance": 250000,
    "preferred_payment_method": "mobile_money"
  }
}
```

---

### PATCH /users/{id}

Modifier le profil.

**Body:**

```json
{
  "full_name": "Jean Dupont",
  "preferred_payment_method": "card"
}
```

---

### GET /users/{id}/wallet

Récupérer le solde du portefeuille.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "wallet_balance": 250000,
    "currency": "XOF"
  }
}
```

---

## 🔍 SEARCH

### GET /search

Recherche globale (établissements + items).

**Query Parameters:**

```
?q=hotel
?type=establishment|menu_item
?location=Cotonou
```

---

## ⚠️ ERROR RESPONSES

### 400 - Bad Request

```json
{
  "success": false,
  "error": "Missing required fields"
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### 404 - Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 🔐 AUTHENTICATION

Tous les endpoints marqués "authentifié" nécessitent:

```
Authorization: Bearer {session_token}
```

Obtenir le token:

1. Register/Login via `/api/auth/register` ou `/api/auth/login`
2. Token retourné dans la réponse
3. Utiliser dans les headers

---

## 🧪 TESTING

**Avec Postman:**

1. Importer la collection depuis ce doc
2. Configurer la variable d'environnement: `{{base_url}}`
3. Exécuter les requêtes

**Avec cURL:**

```bash
curl -X GET http://localhost:3000/api/establishments
curl -X POST http://localhost:3000/api/establishments \
  -H "Content-Type: application/json" \
  -d '{"name":"Hotel","type":"hotel","address":"123","city":"Cotonou","payout_account":"22290"}'
```

---

**Dernière mise à jour:** 2024-01-15
