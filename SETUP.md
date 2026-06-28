# 🚀 Guide d'installation — Miwa Check-In (Next.js)

## 📁 Fichiers à copier dans ton projet Next.js

Copie les dossiers suivants **à la racine de ton projet Next.js** :

```
nextjs_output/
├── app/
│   ├── layout.tsx         → remplace ou fusionne avec ton app/layout.tsx
│   └── page.tsx           → ta page principale (ou adapte selon ta route)
├── components/
│   ├── BackButton.tsx
│   ├── GreetingHeader.tsx
│   ├── TrendingPlaces.tsx
│   ├── ActiveReservation.tsx
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   └── ui/
│       └── (tous les fichiers shadcn/ui)
└── styles/
    └── globals.css        → remplace ou fusionne avec ton globals.css actuel
```

> ⚠️ Si tu as déjà un `layout.tsx` et un `globals.css`, **fusionne** plutôt que de remplacer.

---

## 📦 Dépendances à installer

Lance cette commande dans ton projet Next.js :

```bash
npm install \
  @radix-ui/react-accordion \
  @radix-ui/react-alert-dialog \
  @radix-ui/react-aspect-ratio \
  @radix-ui/react-avatar \
  @radix-ui/react-checkbox \
  @radix-ui/react-collapsible \
  @radix-ui/react-context-menu \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-hover-card \
  @radix-ui/react-label \
  @radix-ui/react-menubar \
  @radix-ui/react-navigation-menu \
  @radix-ui/react-popover \
  @radix-ui/react-progress \
  @radix-ui/react-radio-group \
  @radix-ui/react-scroll-area \
  @radix-ui/react-select \
  @radix-ui/react-separator \
  @radix-ui/react-slider \
  @radix-ui/react-slot \
  @radix-ui/react-switch \
  @radix-ui/react-tabs \
  @radix-ui/react-toggle \
  @radix-ui/react-toggle-group \
  @radix-ui/react-tooltip \
  class-variance-authority \
  clsx \
  cmdk \
  date-fns \
  embla-carousel-react \
  input-otp \
  lucide-react \
  next-themes \
  react-day-picker \
  react-hook-form \
  react-resizable-panels \
  recharts \
  sonner \
  tailwind-merge \
  tw-animate-css \
  vaul \
  canvas-confetti \
  motion
```

---

## 🛠️ Configuration Tailwind CSS v4

Ce projet utilise **Tailwind CSS v4**. Installe les packages dev :

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

### `postcss.config.mjs`

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

> ⚠️ Tailwind v4 ne nécessite **pas** de fichier `tailwind.config.js`. La configuration se fait directement dans le CSS avec `@theme`.

---

## ⚙️ Configuration `tsconfig.json`

Assure-toi que ton `tsconfig.json` contient bien les alias `@/` :

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Next.js configure cela automatiquement si tu as utilisé `create-next-app`, mais vérifie quand même.

---

## 🎨 Importation du CSS global

Dans ton `app/layout.tsx`, assure-toi d'importer le fichier CSS :

```tsx
import "@/styles/globals.css";
```

---

## ✅ Vérification rapide

Après avoir tout copié et installé :

```bash
npm run dev
```

Tu devrais voir l’application Miwa Check-In sur `http://localhost:3000`.

---

## ❓ Problèmes courants

| Problème                                   | Solution                                                           |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `Cannot find module '@/components/ui/...'` | Vérifie les alias `@/` dans `tsconfig.json`                        |
| Erreur Tailwind sur `@theme`               | Vérifie que tu utilises bien Tailwind v4 + `@tailwindcss/postcss`  |
| Composant sans `"use client"`              | Tous les composants avec `useState` ont déjà `"use client"` ajouté |
| `tw-animate-css` introuvable               | Lance `npm install tw-animate-css` séparément                      |

---

## 📌 Notes importantes

- **`react-router`** a été **retiré** : Next.js gère le routing nativement via le dossier `app/`.
- **`vite`** et **`@vitejs/plugin-react`** ne sont **pas** nécessaires dans Next.js.
- Les composants utilisent **`"use client"`** car ils ont des états React (`useState`). C'est normal avec l'App Router de Next.js.
- Le fichier PDF `PROJET_N°1_BENIN.pdf` dans `/src/imports/` n'est pas utilisé dans le code — il n'a pas été inclus dans la migration.
