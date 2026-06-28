# ✅ CHECKLIST DE CONFIGURATION

## 📋 Phase 1: Configuration Supabase (15 min)

### Étape 1.1: Préparer la Base de Données

- [ ] Aller sur https://supabase.com
- [ ] Ouvrir votre projet
- [ ] Aller dans **SQL Editor**
- [ ] Créer une **New Query**

### Étape 1.2: Réinitialiser (Optionnel)

Si vous avez déjà des données et voulez recommencer:

- [ ] Copier le contenu de `scripts/sql/01-reset-db.sql`
- [ ] Coller dans l'éditeur SQL
- [ ] Cliquer **Run**
- [ ] ✅ Attendre le succès

### Étape 1.3: Initialiser la Base de Données

- [ ] Copier le contenu de `scripts/sql/03-miwa-checkin-complete-schema.sql`
- [ ] Coller dans une **New Query** de Supabase
- [ ] Cliquer **Run**
- [ ] ✅ Attendre "Initialisation complétée avec succès!"

### Étape 1.4: Vérifier les Tables

- [ ] Aller dans **Table Editor** (Supabase)
- [ ] Vérifier que ces tables existent:
  - [ ] `users`
  - [ ] `establishments`
  - [ ] `rooms`
  - [ ] `hotel_bookings`
  - [ ] `payments`

---

## 🔑 Phase 2: Configuration Variables d'Environnement (5 min)

### Étape 2.1: Récupérer les Clés Supabase

1. Aller dans **Project Settings** → **API** (Supabase)
2. Copier les 3 clés suivantes:

```env
# Étape 2.2: Créer/Modifier .env.local
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Étape 2.3: Localiser les Clés dans Supabase

- [ ] **NEXT_PUBLIC_SUPABASE_URL**:
  - Aller dans: Project Settings → API
  - Chercher: **Project URL**
  - Copier: `https://[PROJECT_ID].supabase.co`

- [ ] **NEXT_PUBLIC_SUPABASE_ANON_KEY**:
  - Aller dans: Project Settings → API → Project API keys
  - Chercher: **anon public**
  - Copier: La clé commençant par `eyJ...`

- [ ] **SUPABASE_SERVICE_ROLE_KEY**:
  - Aller dans: Project Settings → API → Project API keys
  - Chercher: **service_role secret** (⚠️ CACHÉ PAR DÉFAUT)
  - Cliquer sur l'oeil pour révéler
  - Copier: La clé commençant par `eyJ...`

### Étape 2.4: Coller dans .env.local

- [ ] Créer un fichier `.env.local` à la racine du projet (si inexistant)
- [ ] Coller les 3 clés
- [ ] ✅ Vérifier que le fichier N'EST PAS commité (vérifier .gitignore)

⚠️ **Sécurité**: Le fichier `.env.local` ne doit JAMAIS être versionnté sur Git!

---

## 🚀 Phase 3: Démarrer l'Application (5 min)

### Étape 3.1: Installer les dépendances (si besoin)

```bash
npm install
# Tous les packages sont déjà dans package.json
```

### Étape 3.2: Démarrer le serveur de développement

```bash
npm run dev
# L'app démarre sur http://localhost:3000
```

### Étape 3.3: Vérifier que tout fonctionne

- [ ] L'app démarre sans erreur
- [ ] Page http://localhost:3000 charge correctement
- [ ] Pas d'erreurs dans la console

---

## 🧪 Phase 4: Test du Flux d'Authentification (10 min)

### Test 1: Créer un Compte

1. [ ] Aller sur http://localhost:3000/register
2. [ ] Remplir le formulaire:
   - Nom: `Jean Dupont`
   - Email: `test@example.com`
   - Téléphone: `+229 12 34 56 78`
   - Password: `Test123!@`
   - Confirm: `Test123!@`
3. [ ] Cliquer **Créer mon compte**
4. [ ] ✅ Vérifier que vous êtes redirigé vers `/login` avec message de succès

### Test 2: Se Connecter

1. [ ] Vous êtes maintenant sur `/login`
2. [ ] Remplir:
   - Email: `test@example.com`
   - Password: `Test123!@`
3. [ ] Cliquer **Se connecter**
4. [ ] ✅ Vous devez être redirigé vers `/` (home page)

### Test 3: Vérifier la Création du Profil

1. [ ] Aller dans Supabase → **Table Editor**
2. [ ] Ouvrir la table `users`
3. [ ] ✅ Vérifier que l'utilisateur est créé:
   - nom: `Jean Dupont`
   - telephone: `+229 12 34 56 78`
   - role: `user`

### Test 4: Se Déconnecter

1. [ ] Sur la page `/`, cliquer sur le bouton de profil
2. [ ] Cliquer **Déconnexion** (ou similaire, selon vos routes)
3. [ ] ✅ Vous devez être redirigé vers `/login`

### Test 5: Session Persiste

1. [ ] Après connexion, aller sur n'importe quelle page protégée
2. [ ] Rafraîchir la page (F5 ou Ctrl+Shift+R)
3. [ ] ✅ Vous devez rester connecté

### Test 6: Middleware Protection

1. [ ] Déconnectez-vous complètement
2. [ ] Essayez d'accéder à `/` ou `/bookings` directement dans la URL
3. [ ] ✅ Vous devez être redirigé vers `/login`

---

## 🐛 Phase 5: Dépannage

### Si vous recevez une erreur "Invalid API key"

- [ ] Vérifier que `.env.local` a les bonnes clés
- [ ] Vérifier que les clés n'ont pas de guillemets supplémentaires
- [ ] Relancer: `npm run dev`

### Si la table users n'existe pas

- [ ] Vérifier que le script SQL 02-init-auth.sql s'est exécuté avec succès
- [ ] Vérifier qu'aucune erreur n'est affichée lors de l'exécution
- [ ] Réexécuter le script si nécessaire

### Si vous avez une erreur "RLS policy preventing access"

- [ ] C'est normal si vous n'êtes pas connecté
- [ ] Assurez-vous d'être connecté avant d'accéder aux routes protégées

### Si les formulaires ne se soumettent pas

- [ ] Vérifier la console du navigateur (F12) pour les erreurs
- [ ] Vérifier que les endpoints API existent:
  - http://localhost:3000/api/auth/register
  - http://localhost:3000/api/auth/login

---

## 📊 Checklist Finale

### Avant de continuer le développement:

- [ ] BD Supabase configurée avec les 7 tables
- [ ] Variables d'environnement correctement configurées
- [ ] `.env.local` créé et dans `.gitignore`
- [ ] npm run dev fonctionne sans erreur
- [ ] npm run build passe sans erreur
- [ ] Test d'inscription réussi
- [ ] Test de connexion réussi
- [ ] Test de session persistante réussi
- [ ] Test du middleware protection réussi

### Si tout est ✅ coché:

**Vous êtes prêt à implémenter les endpoints data!**

---

## 📚 Ressources

- 📄 `DATABASE_SETUP.md` - Guide complet de configuration
- 📄 `AUTH_IMPLEMENTATION.md` - Détails de l'implémentation
- 📄 `PHASE6_SUMMARY.md` - Résumé complet de cette phase
- 🔗 https://supabase.com/docs - Documentation Supabase

---

## ⏱️ Temps Estimé Total

| Phase               | Temps      |
| ------------------- | ---------- |
| 1. Configuration BD | 15 min     |
| 2. Variables d'env  | 5 min      |
| 3. Démarrage app    | 5 min      |
| 4. Test du flux     | 10 min     |
| **TOTAL**           | **35 min** |

---

**Bon à savoir:**

- Vous pouvez créer plusieurs utilisateurs de test
- Les données de test restent jusqu'à ce que vous exécutiez 01-reset-db.sql
- Chaque utilisateur ne voit que ses propres données (RLS)
- Les administrateurs verront tous les utilisateurs (voir RLS policies)

---

**Status**: Prêt pour la configuration! 🚀
