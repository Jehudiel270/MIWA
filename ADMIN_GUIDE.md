# Système d'Admin Miwa Check-In

## 📋 Vue d'ensemble

Le système d'admin permet à l'équipe Miwa de gérer les retours utilisateurs, les messages de contact, et de suivre les activités sur la plateforme.

## 🏗️ Architecture

### Tables de Base de Données

1. **`feedback_submissions`** - Retours utilisateurs
   - Type : bug, feature, complaint, praise
   - Statut : new, acknowledged, resolved, dismissed
   - Relations : client_id (users)

2. **`contact_messages`** - Messages de contact
   - Email, nom, téléphone, sujet, message
   - Statut : new, read, responded, archived
   - Relations : responded_by (users - admin)

3. **`admin_logs`** - Journal des actions admin
   - Action : type d'action effectuée
   - Entity : entité modifiée (feedback, message, user, booking, etc.)
   - Details : données JSON

### RLS Policies (Row Level Security)

- **feedback_submissions** :
  - Users : voir uniquement leurs propres retours
  - Admin : voir tous les retours, pouvoir mettre à jour le statut et ajouter des réponses

- **contact_messages** :
  - Public : créer de nouveaux messages
  - Admin : voir tous les messages, mettre à jour le statut

- **admin_logs** :
  - Admin : consulter uniquement

## 🔐 Authentification Admin

### Middleware de Vérification

```typescript
// lib/adminUtils.ts
checkAdminRole() -> { isAdmin: boolean, userId: string }
```

Le middleware vérifie que l'utilisateur a le rôle `admin` dans la table `users`.

### Protection des Routes

```typescript
// app/(admin)/layout.tsx
// Redirige vers /login si l'utilisateur n'est pas admin
```

## 🎯 Endpoints API

### Feedback

- **POST `/api/feedback`** - Soumettre un retour

  ```json
  {
    "feedback_type": "bug|feature|complaint|praise",
    "message": "Texte du retour"
  }
  ```

- **GET `/api/feedback`** - Récupérer les retours
  - Users : leurs retours
  - Admin : tous les retours

### Contact

- **POST `/api/contact`** - Soumettre un message
  ```json
  {
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+229 XX XX XX XX",
    "subject": "Sujet",
    "message": "Texte du message"
  }
  ```

## 📊 Dashboard Admin

**URL** : `/admin/dashboard`

### Sections

1. **Vue d'ensemble**
   - Total utilisateurs
   - Total réservations
   - Total retours
   - Revenu
   - Badges pour les éléments en attente

2. **Retours**
   - Liste des retours par date
   - Filtrage par statut et type
   - Actions rapides : changer le statut, ajouter une réponse

3. **Messages de Contact**
   - Liste des messages par date
   - Filtrage par statut
   - Actions rapides : marquer comme lu, répondre, archiver

4. **Utilisateurs** (en développement)
   - Liste des utilisateurs
   - Statistiques par utilisateur

5. **Réservations** (en développement)
   - Liste des réservations
   - Statistiques par établissement

## 🚀 Utilisation

### Créer un Admin

```sql
-- Modifier le rôle d'un utilisateur existant
UPDATE users SET role = 'admin' WHERE id = 'user-uuid';
```

### Accéder au Dashboard

1. Aller sur `/admin/dashboard`
2. Si vous êtes admin, vous verrez le dashboard
3. Sinon, vous serez redirigé vers `/login`

### Soumettre un Retour (User)

1. Aller sur `/feedback`
2. Sélectionner le type de retour
3. Remplir le message
4. Cliquer sur "Envoyer"

### Gérer les Retours (Admin)

1. Aller sur `/admin/dashboard`
2. Cliquer sur "Retours"
3. Pour chaque retour :
   - Voir le statut actuel
   - Changer le statut (Nouveau → Reconnu → Résolu → Rejeté)
   - Ajouter une réponse si nécessaire

## 📝 Logs Admin

Chaque action importante d'un admin est enregistrée dans `admin_logs` :

- Changement de statut d'un retour
- Suppression de données
- Modification de paramètres critiques

```typescript
await logAdminAction(adminId, "change_status", "feedback", feedbackId, {
  old_status: "new",
  new_status: "acknowledged",
});
```

## 🔄 Flux Types

### Flux de Retour Utilisateur

1. User soumet un retour via `/feedback`
2. Retour stocké dans `feedback_submissions` avec statut `new`
3. Admin voit le retour dans le dashboard
4. Admin change le statut à `acknowledged`
5. Admin peut ajouter une réponse (`admin_response`)
6. Statut passe à `resolved` ou `dismissed`

### Flux de Message de Contact

1. Visiteur ou user soumet un message via `/api/contact`
2. Message stocké dans `contact_messages` avec statut `new`
3. Admin voit le message dans le dashboard
4. Admin marque comme `read` → `responded` → `archived`

## 🛡️ Sécurité

- **RLS Policies** : PostgreSQL garantit que les users ne voient que leurs données
- **Middleware** : La route `/admin` redirige si pas authentifié comme admin
- **Validation** : Les inputs sont validés côté serveur
- **CSRF** : Next.js gère automatiquement

## 📈 Évolutions Futures

- [ ] Response email automatique aux retours
- [ ] Export données en CSV/PDF
- [ ] Webhook pour notifications admins
- [ ] Tags et catégories pour organisER les retours
- [ ] Analytics avancées
- [ ] Système de vote interne pour les features

## 🐛 Troubleshooting

### "Unauthorized" sur le dashboard

→ Vérifiez que `role = 'admin'` dans `users` pour votre user.

### Retour non sauvegardé

→ Vérifiez les RLS policies, assurez-vous que l'utilisateur est authentifié.

### Admin logs vides

→ Les logs ne sont créés que lors d'actions admin critiques (pas automatique).
