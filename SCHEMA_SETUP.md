# 🚀 SETUP DU SCHÉMA SUPABASE - 2 MINUTES

## ⚠️ PROBLÈME ACTUEL

```
POST /api/auth/register → 500
Email rate limit exceeded
```

**Raison:** La table `users` n'existe pas dans Supabase.

---

## ✅ SOLUTION: Exécuter le schéma SQL

### Étape 1: Accès au Dashboard Supabase

- Va à https://app.supabase.com
- Connecte-toi
- Sélectionne ton projet **Miwa**

### Étape 2: Ouvrir l'éditeur SQL

- Menu gauche: **SQL Editor**
- Clique sur **New Query**

### Étape 3: Copier-coller le schéma

- **Ouvre ce fichier:** `scripts/sql/03-miwa-checkin-complete-schema.sql`
- **Sélectionne TOUT** (Ctrl+A)
- **Copie** (Ctrl+C)
- **Colle** dans l'éditeur SQL Supabase (Ctrl+V)

### Étape 4: Exécuter

- Clique sur **▶ Run** (en haut à droite)
- **Attends** 3-5 secondes
- ✅ Pas d'erreurs affichées = Succès!

---

## 🧹 Nettoyer les anciens tests (OPTIONNEL)

Si tu as tenté plusieurs fois avant:

1. Va à **Authentication** dans le menu gauche
2. **Users**
3. Supprime les utilisateurs de test

---

## 🧪 Tester après

1. Terminal: `npm run dev`
2. Ouvre http://localhost:3000/register
3. Crée un compte avec un nouvel email
4. **ça doit marcher!** ✅

---

## 🐛 Si ça ne marche pas

### Erreur: "permission denied"

→ Le schéma a peut-être déjà été exécuté. C'est bon!
→ Vérifier dans **Table Editor** si `users` existe

### Erreur: "uuid-ossp already exists"

→ Normal, c'est une extension déjà présente
→ Continue quand même, le SQL va skip automatiquement

### Autre erreur

→ Copie l'erreur exacte et partage-la

---

## 📞 Besoin d'aide?

Si le dashboard ne marche pas, dis-moi et je vais trouver une autre solution!
