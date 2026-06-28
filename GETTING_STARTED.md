# 🚀 GETTING STARTED - MIWA CHECK-IN

**Durée estimée:** 30 minutes pour terminer toutes les étapes critiques.

---

## ✅ STEP 1: Exécuter le Schema Base de Données (5 min)

### Objectif

Créer la structure complète de la base de données Miwa Check-In dans Supabase (15 tables + indexes).

### Étapes

1. **Ouvrir Supabase SQL Editor**
   - Go to: https://app.supabase.com
   - Sélectionner votre projet
   - Cliquer "SQL Editor" dans le left sidebar

2. **Créer une nouvelle requête**
   - Cliquer "+ New Query"
   - Copier-coller le contenu ENTIER de `scripts/sql/03-miwa-checkin-complete-schema.sql`

3. **Exécuter la requête**
   - Cliquer le bouton bleu "Run" (ou Ctrl+Enter)
   - Attendre la confirmation ✅

4. **Vérifier la création des tables**
   - Aller à "Table Editor" (left sidebar)
   - Vérifier que ces tables existent:
     ```
     ✅ public.users
     ✅ public.establishments
     ✅ public.rooms
     ✅ public.hotel_bookings
     ✅ public.payments
     ✅ public.orders
     ✅ public.delivery_orders
     ```

5. **Activer RLS (Row Level Security)**
   - Aller à "Authentication" → "Policies"
   - RLS devrait être déjà activé automatiquement ✅

### ✔️ Validation

Si toutes les tables aparaissent dans Table Editor = **SUCCESS! ✅**

---

## ✅ STEP 2: Créer Premier Endpoint API (10 min)

### Objectif

Créer l'endpoint pour lister les établissements (hôtels, restaurants, etc.)

### Code à créer

**Fichier:** `app/api/establishments/route.ts`

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/establishments - Lister les établissements
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      },
    );

    // Récupérer les paramètres de recherche
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // 'hotel', 'restaurant', 'coworking'
    const city = searchParams.get("city"); // 'Cotonou', 'Calavi', etc.
    const search = searchParams.get("search"); // Recherche libre
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Construire la requête
    let query = supabase
      .from("establishments")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Ajouter les filtres
    if (type) query = query.eq("type", type);
    if (city) query = query.eq("city", city);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data,
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/establishments - Créer un établissement (admin only)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      },
    );

    // Vérifier authentification
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const {
      name,
      type,
      address,
      city,
      payout_account,
      description,
      email,
      phone,
    } = body;

    // Validation
    if (!name || !type || !address || !city || !payout_account) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("establishments")
      .insert([
        {
          owner_id: user.id,
          name,
          type,
          address,
          city,
          payout_account,
          description,
          email,
          phone,
          is_active: true,
          is_verified: false,
          average_rating: 0,
          total_reviews: 0,
          payout_frequency: "daily",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

### ✔️ Validation

Tester avec Postman ou cURL:

```bash
curl http://localhost:3000/api/establishments
```

Devrait retourner:

```json
{
  "success": true,
  "data": [],
  "total": 0
}
```

---

## ✅ STEP 3: Créer Endpoint Détails Établissement (5 min)

**Fichier:** `app/api/establishments/[id]/route.ts`

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      },
    );

    const { data: establishment, error } = await supabase
      .from("establishments")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !establishment) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: establishment });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      },
    );

    // Vérifier authentification
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("establishments")
      .update(body)
      .eq("id", params.id)
      .eq("owner_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

## ✅ STEP 4: Tester les Endpoints (5 min)

### Avec Postman

1. **Créer un établissement**

   ```
   POST http://localhost:3000/api/establishments
   Content-Type: application/json

   {
     "name": "Hotel Tropicana",
     "type": "hotel",
     "address": "123 Rue Principale",
     "city": "Cotonou",
     "payout_account": "22290123456",
     "description": "Hôtel 4 étoiles avec vue sur mer"
   }
   ```

2. **Récupérer l'ID** de la réponse
3. **Lister les établissements**

   ```
   GET http://localhost:3000/api/establishments
   ```

4. **Récupérer un établissement**
   ```
   GET http://localhost:3000/api/establishments/{id}
   ```

### Avec cURL

```bash
# Créer
curl -X POST http://localhost:3000/api/establishments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurant La Mer",
    "type": "restaurant",
    "address": "456 Ave Principale",
    "city": "Cotonou",
    "payout_account": "22290654321"
  }'

# Lister
curl http://localhost:3000/api/establishments

# Filtrer par ville
curl "http://localhost:3000/api/establishments?city=Cotonou"

# Filtrer par type
curl "http://localhost:3000/api/establishments?type=hotel"
```

---

## ✅ STEP 5: Intégrer Endpoint dans le Frontend (5 min)

**Fichier:** `components/EstablishmentSearch.tsx` (à créer)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Establishment } from '@/types/db.types';

export function EstablishmentSearch() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (city) params.append('city', city);
      if (search) params.append('search', search);

      const response = await fetch(`/api/establishments?${params}`);
      const data = await response.json();

      if (data.success) {
        setEstablishments(data.data);
      }
    } catch (error) {
      console.error('Error fetching establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hotel">Hôtel</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="coworking">Coworking</SelectItem>
          </SelectContent>
        </Select>

        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cotonou">Cotonou</SelectItem>
            <SelectItem value="Calavi">Calavi</SelectItem>
            <SelectItem value="Ouidah">Ouidah</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Recherche...' : 'Chercher'}
        </Button>
      </div>

      <div className="grid gap-4">
        {establishments.map((est) => (
          <div key={est.id} className="p-4 border rounded-lg">
            <h3 className="font-bold">{est.name}</h3>
            <p className="text-sm text-gray-600">{est.address}</p>
            <p className="text-xs text-gray-500">{est.city}</p>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {est.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📋 CHECKLIST DE DÉMARRAGE

- [ ] Step 1: Schema SQL exécuté dans Supabase ✅
- [ ] Step 2: Endpoint GET /establishments créé ✅
- [ ] Step 3: Endpoint GET /establishments/{id} créé ✅
- [ ] Step 4: Endpoints testés avec Postman ✅
- [ ] Step 5: Composant de recherche intégré ✅

---

## 🎯 PROCHAINES ÉTAPES

Une fois ces 5 steps terminées, continuer avec:

1. **Endpoints Hôtels:**
   - POST /api/rooms (créer chambre)
   - GET /api/rooms/{establishmentId}
   - POST /api/hotel-bookings
   - GET /api/hotel-bookings/{id}

2. **Paiements:**
   - POST /api/payments
   - Intégration FedaPay

3. **QR Code:**
   - GET /api/hotel-bookings/{id}/qr

---

## 💬 Questions?

Vérifier:

- Logs de la console du navigateur (F12)
- Logs Supabase SQL Editor
- Terminal Next.js (npm run dev)

**Vous êtes prêt! Commencez par Step 1! 🚀**
