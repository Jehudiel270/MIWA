-- ============================================================================
-- SCRIPT DE RÉINITIALISATION COMPLÈTE DE LA BASE DE DONNÉES
-- ============================================================================
-- ⚠️  ATTENTION: Ce script supprime TOUTES les données et tables!
-- Ne pas exécuter en production sans sauvegarde!
-- ============================================================================

-- Supprimer les tables dans l'ordre inverse de leurs dépendances
DROP TABLE IF EXISTS public.restaurant_bookings CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.restaurant_tables CASCADE;
DROP TABLE IF EXISTS public.hotel_bookings CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;
DROP TABLE IF EXISTS public.establishments CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Supprimer les enums
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.establishment_type CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.payment_method CASCADE;
DROP TYPE IF EXISTS public.housekeeping_status CASCADE;

-- Supprimer les extensions personnalisées
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- Réactiver les extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ✅ Base de données réinitialisée avec succès!
