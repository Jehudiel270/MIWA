# Audit de projet — Miwa Check-In

Dernière mise à jour: 2026-06-28

## Résumé exécutif

Ce document liste l'état actuel du projet, les verrous bloquants, les éléments fonctionnels restants, et un plan priorisé d'actions à court et moyen terme pour mener le projet au MVP. Il est basé sur l'inspection du code, des fichiers de documentation et des marqueurs `TODO`/`FIXME` présents dans le dépôt.

## État général

- Codebase: Next.js 16 (App Router), TypeScript, Tailwind v4
- Auth: Supabase Auth (client + edge) — intégration partielle
- Base de données: Prisma / PostgreSQL (schéma fourni mais potentiellement non exécuté en Supabase)
- Paiements: Intégration prévue avec FedaPay / mobile money (flux partiellement implémentés côté UI)

## Verrous critiques (blockers)

1. Base de données: exécution du schéma sur Supabase (bloque le développement complet des API). Voir `scripts/sql/03-miwa-checkin-complete-schema.sql` et README.md.
2. Endpoints API manquants ou incomplets: plusieurs routes `app/api/*` contiennent des TODOs (auth, envoi d'e-mails, webhooks paiement).
3. Intégration d'auth (Supabase) et erreurs `fetch failed` en runtime edge — vérifier variables d'environnement et accès réseau depuis l'environnement d'exécution.

## Variables d'environnement (vérifier / sécuriser)

Les variables attendues (vérifier présence et éviter d'exposer les valeurs) :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Action recommandée: valider que les clés sensibles ne sont pas poussées sur un dépôt public et envisager une rotation si elles ont circulé.

## Résumé des fichiers contenant `TODO` / éléments à compléter

Liste non exhaustive (extraits depuis une recherche du dépôt) :

- `app/verify-email/page.tsx` — TODO: appeler l'API de vérification email
- `app/forgot-password/page.tsx` — TODO: appel API reset password
- `app/(main)/edit-profile/page.tsx` — TODO: appeler API de mise à jour du profil
- `app/(main)/payment-methods/add/page.tsx` — TODO: appeler API pour ajouter un moyen de paiement, afficher succès et redirection
- `app/api/auth/verify-email/route.ts` — TODO: vérifier le code côté serveur (DB ou provider)
- `app/api/auth/forgot-password/route.ts` — TODO: intégrer envoi d'e-mail (Supabase ou service mail)

Remarque: le dossier `.next` contient aussi des TODOs dans des bundles buildés (fichiers turbopack) — ce sont des références upstream et non du code applicatif à modifier.

## Éléments fonctionnels restants (par domaine)

1. Configuration & Infrastructure

- Valider exécution du script de schéma dans Supabase (étape critique).
- Vérifier `DATABASE_URL` et accès réseau depuis l'environnement de déploiement.
- Mettre en place CI simple (GitHub Actions ou équivalent) pour lint/build/tests.

2. Authentification

- Implémenter les routes server-side d'auth (`verify-email`, `forgot-password`) : vérifier tokens/codes et intégration e-mail.
- Gérer correctement les sessions côté Edge (rafraîchissement token) et ajouter gestion d'erreurs réseau.

3. API (Backend)

- Créer/compléter endpoints prioritaires:
  - `GET/POST /api/establishments`
  - `GET/POST /api/rooms` (CRUD)
  - `POST /api/bookings`
  - `POST /api/payments` + webhook handler
- Ajouter validations d'entrée (zod ou similar) et tests d'intégration pour chaque endpoint.

4. Paiements

- Implémenter intégration FedaPay (création de transaction, redirection, webhook de confirmation).
- Gérer flow mobile-money + carte (côté UI et backend).

5. Frontend

- Connecter les pages existantes aux endpoints backend listés dans `IMPLEMENTATION_STATUS.md`.
- Ajouter/formaliser validations de formulaires (`react-hook-form`) et messages d'erreur.
- Implémenter upload image (Cloudinary) pour la photo de profil.

6. Admin

- Finaliser pages admin (establishments, dashboard) et vérifier qu'il n'y a pas de conflits de routes avec les groupes parallèles `/(admin)` vs `/(main)`.

7. Tests & Qualité

- Ajouter tests unitaires pour fonctions utils + tests d'API (supertest / test server).
- Intégrer linting + pre-commit hooks (ESLint, Prettier).

8. Documentation

- Mettre à jour `API_DOCUMENTATION.md` avec les endpoints réellement implémentés et les schémas request/response.
- Documenter le flux paiement (sécurité, validation côté serveur).

9. Sécurité

- Ne pas exposer `SUPABASE_SERVICE_ROLE_KEY` côté client.
- Ajouter revues de sécurité sur dépendances (npm audit) et vérifier CSP/headers HTTP.

## Liste d'actions prioritaires (short-term MVP, ordre recommandé)

1. (48h) Exécuter le schéma SQL sur Supabase — vérification DB accessible.
2. (3 jours) Implémenter `POST /api/auth/forgot-password` et `POST /api/auth/verify-email` avec envoi e-mail ou lien Supabase.
3. (1 semaine) Implémenter `POST /api/payments` + webhook + tests end-to-end minimal (create booking → pay → webhook confirm).
4. (1 semaine) Connecter les pages `forgot-password`, `verify-email`, `edit-profile`, `payment-methods/add` aux endpoints.
5. (2 semaines) Stabiliser Auth (refresh tokens, edge runtime), ajouter CI build et tests.

Estimation: MVP interne (flux établissement → réservation → paiement) = 2–3 semaines (1 dev full-time), dépendances: accès DB + clés paiements.

## Commandes utiles

Développement local:

```bash
npm install
npm run dev
```

Build/production check:

```bash
npm run build
```

## Notes opérationnelles et recommandations

- Vérifier que les clés sensibles dans `.env.local` ne sont pas poussées sur Git public. Envisager variables d'environnement gérées par le provider (Vercel/Supabase secrets).
- Ajouter un petit script de vérification `scripts/check-env.mjs` qui échoue si des variables critiques manquent.
- Considérer l'ajout d'un endpoint d'état healthcheck (`/api/health`) pour vérifier DB/services externes.

## Annexes — fichiers & références

- Schéma DB: `scripts/sql/03-miwa-checkin-complete-schema.sql`
- Docs importantes: `README.md`, `GETTING_STARTED.md`, `IMPLEMENTATION_STATUS.md`, `SETUP.md`, `API_DOCUMENTATION.md`
- Fichiers avec TODOs identifiés: voir section "Résumé des fichiers contenant TODO" ci‑dessus.

---

Si vous voulez, je peux: (a) exécuter le schéma SQL sur Supabase (avec vos accès), (b) implémenter en priorité les endpoints `auth` ou `payments`, ou (c) lancer la CI locale et corriger les erreurs de build restantes. Dites-moi par quoi commencer.
