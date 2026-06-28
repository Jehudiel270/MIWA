# Prisma Implementation Roadmap

## Current Status

✅ **Completed:**

- Prisma schema created (`prisma/schema.prisma`)
- Prisma client singleton setup (`lib/prisma.ts`)
- Utility functions prepared (`lib/prismaUtils.ts`)
- Environment variable configured (`.env.local` with `DATABASE_URL`)
- Documentation created (`PRISMA_SETUP.md`)

🔄 **In Progress:**

- Installing `prisma` and `@prisma/client` packages

## Immediate Next Steps (After npm install completes)

### Step 1: Verify Installation

```bash
npm list prisma @prisma/client
npx prisma -v
```

### Step 2: Push Database Schema to Supabase

Before this step, **execute `INSTALL_DATABASE.sql` in Supabase SQL Editor**

Then run:

```bash
npx prisma db push
```

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

### Step 4: Test Prisma Studio (optional)

```bash
npx prisma studio
```

## Phase 1: Admin System Migration to Prisma

### Files to Update

1. **`app/api/admin/stats/route.ts`**
   - Replace Supabase RPC calls with Prisma queries
   - Use `getAdminStats()` utility from `lib/prismaUtils.ts`

2. **`app/api/admin/data/route.ts`**
   - Replace `.from().select()` with `prisma[model].findMany()`
   - Support types: users, establishments, bookings, payments, feedback, messages

3. **`app/api/admin/users/[id]/route.ts`**
   - Replace user update queries with Prisma
   - Use `banUser()`, `unbanUser()` utilities

4. **`app/api/admin/establishments/[id]/route.ts`**
   - Replace establishment update queries with Prisma
   - Implement verification, deactivation, flagging

5. **`app/api/admin/feedback/[id]/route.ts`**
   - Replace feedback update queries with Prisma

6. **`lib/adminUtils.ts`**
   - Update `logAdminAction()` to use Prisma
   - Keep role checking logic as-is

## Phase 2: Main App Migration to Prisma

### User Pages

- `app/(main)/profile/page.tsx` - User data fetching
- `app/(main)/bookings/page.tsx` - Booking queries
- `app/(main)/payments/page.tsx` - Payment queries

### Authentication

- Replace Supabase session queries where applicable

### Search & Listing

- `app/(main)/search/page.tsx` - Establishment search
- `app/(main)/listing/[slug]/page.tsx` - Detailed establishment view

## Database Schema Features

The `prisma/schema.prisma` includes:

✅ All tables from `INSTALL_DATABASE.sql`:

- User (with role-based access)
- Establishment (with verification workflow)
- Room, Booking, Payment
- Review, Favorite
- FeedbackSubmission, ContactMessage
- AdminLog, UserSuspension, EstablishmentFlag
- AdminSetting

✅ Type-safe enums:

- UserRole (CLIENT, ADMIN)
- BookingStatus (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- PaymentStatus (PENDING, COMPLETED, FAILED, REFUNDED)
- VerificationStatus (PENDING, VERIFIED, REJECTED)
- And more...

✅ Relationships:

- User → Bookings, Reviews, Favorites, Payments
- Establishment → Rooms, Bookings, Reviews, Favorites, Flags
- Proper onDelete behaviors (CASCADE, SET_NULL)

✅ Indexes on common query fields:

- email, role, is_banned for users
- city, type, verification_status for establishments
- status, created_at for logs

## Testing Commands

```bash
# Check Prisma setup
npx prisma validate

# Generate types
npx prisma generate

# Open database UI
npx prisma studio

# Create migration (after schema changes)
npx prisma migrate dev --name init

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Example: Migrating an API Endpoint

### Before (Supabase SDK):

```typescript
const { data: users, error } = await supabaseServer
  .from("users")
  .select("*")
  .eq("role", "ADMIN");

if (error) throw error;
return Response.json(users);
```

### After (Prisma):

```typescript
const users = await prisma.user.findMany({
  where: { role: "ADMIN" },
});
return Response.json(users);
```

## Notes

1. **No migration files needed** - Supabase schema already created from `INSTALL_DATABASE.sql`
2. **Prisma CLI** automatically available via `npx prisma`
3. **Type safety** - All queries are fully typed by default
4. **Performance** - Prisma generates optimized queries
5. **RLS Policies** - Continue to work at database level (defined in `INSTALL_DATABASE.sql`)

## Critical Path

1. ✅ npm install completes
2. → Execute `INSTALL_DATABASE.sql` in Supabase
3. → Run `npx prisma db push` (optional, schema already defined)
4. → Run `npx prisma generate`
5. → Migrate admin API endpoints to Prisma
6. → Test admin system
7. → Migrate remaining endpoints
8. → Full testing before production

## Success Criteria

- All Prisma imports resolve without errors
- Admin API endpoints work with Prisma queries
- No TypeScript errors in compiled code
- Prisma Studio can connect and browse data
- Admin dashboard fully functional with Prisma backend
