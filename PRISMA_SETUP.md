# Prisma Setup Guide

## Overview

This project uses **Prisma ORM** for type-safe database access to the PostgreSQL database hosted on Supabase.

## Initial Setup (Already Done)

1. ✅ Installed `prisma` and `@prisma/client`
2. ✅ Created `prisma/schema.prisma` with complete data model
3. ✅ Added `DATABASE_URL` to `.env.local`
4. ✅ Created `lib/prisma.ts` (Prisma Client singleton)
5. ✅ Created `lib/prismaUtils.ts` (common queries)

## Database Connection

The `DATABASE_URL` environment variable must be set in `.env.local`:

```
DATABASE_URL=postgresql://username:password@host:5432/database
```

For Supabase, this looks like:

```
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECTID.supabase.co:5432/postgres
```

## Next Steps

### 1. Execute Database Schema

Before using Prisma, you MUST execute the `INSTALL_DATABASE.sql` file in your Supabase SQL Editor:

1. Go to Supabase Dashboard → Your Project
2. Navigate to SQL Editor
3. Create new query
4. Copy entire content from `/INSTALL_DATABASE.sql`
5. Execute the query

This creates all tables, enums, RLS policies, views, and functions.

### 2. Introspect Existing Schema (Optional)

If the schema already exists in the database, generate Prisma models from it:

```bash
npx prisma db push
```

Or to introspect:

```bash
npx prisma introspect
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

This creates type-safe Prisma Client in `node_modules/.prisma/client`.

### 4. Test Connection

```bash
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555` for visual database management.

## Usage Examples

### In Server Components/API Routes

```typescript
import { prisma } from "@/lib/prisma";

// Find a user
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// Create a new booking
const booking = await prisma.booking.create({
  data: {
    user_id: userId,
    room_id: roomId,
    establishment_id: establishmentId,
    check_in: new Date(),
    check_out: new Date(Date.now() + 24 * 60 * 60 * 1000),
    total_price: 150,
  },
});

// Update with relations
const updated = await prisma.establishment.update({
  where: { id: establishmentId },
  data: {
    verification_status: "VERIFIED",
    verification_date: new Date(),
  },
  include: {
    rooms: true,
  },
});

// Complex query with filtering
const bookings = await prisma.booking.findMany({
  where: {
    user_id: userId,
    status: "CONFIRMED",
  },
  include: {
    room: true,
    establishment: true,
  },
  orderBy: {
    check_in: "asc",
  },
});
```

### Using Utility Functions

```typescript
import {
  getUserWithRelations,
  getAdminStats,
  banUser,
  logAdminAction,
} from "@/lib/prismaUtils";

// Get user with all related data
const user = await getUserWithRelations(userId);

// Get admin statistics
const stats = await getAdminStats();

// Ban a user
await banUser(userId, "Violates terms of service");

// Log admin action
await logAdminAction(adminId, "ban_user", "User", userId, { reason: "Spam" });
```

## Migration from Supabase SDK to Prisma

### Before (Supabase SDK)

```typescript
const { data, error } = await supabase
  .from("establishments")
  .select("*")
  .eq("verification_status", "VERIFIED");
```

### After (Prisma)

```typescript
const establishments = await prisma.establishment.findMany({
  where: {
    verification_status: "VERIFIED",
  },
});
```

## Admin System Migration

### Stats Endpoint

Will be migrated from `/api/admin/stats/route.ts` using:

```typescript
const stats = await getAdminStats();
```

### User Management

Will be migrated to use:

```typescript
await prisma.user.update({
  where: { id: userId },
  data: { is_banned, ban_reason },
});
```

### Admin Logging

Will use:

```typescript
await logAdminAction(
  adminId,
  "verify_establishment",
  "Establishment",
  establishmentId,
);
```

## Common Queries Patterns

### Search/Filter

```typescript
const results = await prisma.establishment.findMany({
  where: {
    AND: [{ city: city }, { establishment_type: type }, { is_active: true }],
  },
});
```

### Pagination

```typescript
const page = 1;
const pageSize = 10;

const results = await prisma.establishment.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

### Aggregation

```typescript
const count = await prisma.booking.count({
  where: {
    establishment_id: establishmentId,
    status: "COMPLETED",
  },
});

const totalRevenue = await prisma.payment.aggregate({
  _sum: {
    amount: true,
  },
  where: {
    status: "COMPLETED",
  },
});
```

## Debugging

Enable Prisma logging:

```typescript
// In lib/prisma.ts
const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});
```

View logs in console when running `npm run dev`.

## Troubleshooting

### "P1000: Can't reach database server"

- Verify `DATABASE_URL` is correct
- Ensure Supabase project is active
- Check network connectivity
- Verify IP whitelist settings in Supabase

### "P1002: The provided database string is invalid"

- Check `DATABASE_URL` format
- Ensure password is URL-encoded
- Password special chars should be encoded: `@` → `%40`, etc.

### "Unknown field on model"

- Run `npx prisma generate` to regenerate types
- Check schema.prisma for typos

## Documentation

- [Prisma Docs](https://www.prisma.io/docs/)
- [Prisma Client Reference](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client)
- [PostgreSQL Connector](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
