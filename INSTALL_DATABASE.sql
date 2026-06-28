-- ============================================================================
-- MIWA CHECK-IN: INSTALLATION COMPLÈTE
-- Instructions: Copier-coller ce fichier ENTIÈREMENT dans Supabase SQL Editor
-- et exécuter une seule fois pour initialiser la base de données
-- ============================================================================

-- Extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ÉTAPE 1: ENUMS & TYPES
-- ============================================================================

CREATE TYPE IF NOT EXISTS user_role AS ENUM ('client', 'admin');
CREATE TYPE IF NOT EXISTS establishment_type AS ENUM ('hotel', 'restaurant', 'coworking');
CREATE TYPE IF NOT EXISTS booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled');
CREATE TYPE IF NOT EXISTS payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE IF NOT EXISTS payment_method AS ENUM ('mobile_money', 'card', 'wallet', 'hybrid');
CREATE TYPE IF NOT EXISTS housekeeping_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE IF NOT EXISTS order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed');
CREATE TYPE IF NOT EXISTS delivery_status AS ENUM ('pending', 'confirmed', 'preparing', 'dispatched', 'delivered');
CREATE TYPE IF NOT EXISTS payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- ============================================================================
-- ÉTAPE 2: TABLES PRINCIPALES
-- ============================================================================

-- TABLE: users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role DEFAULT 'client',
  profile_picture_url VARCHAR(500),
  wallet_balance DECIMAL(15, 2) DEFAULT 0,
  preferred_payment_method payment_method DEFAULT 'mobile_money',
  country VARCHAR(100) DEFAULT 'Benin',
  city VARCHAR(100),
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_banned ON public.users(is_banned);

-- TABLE: establishments
CREATE TABLE IF NOT EXISTS public.establishments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type establishment_type NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(500),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  cover_image_url VARCHAR(500),
  logo_url VARCHAR(500),
  average_rating DECIMAL(3, 1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  payout_account VARCHAR(255),
  payout_frequency VARCHAR(50) DEFAULT 'daily',
  verification_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_establishments_owner ON public.establishments(owner_id);
CREATE INDEX IF NOT EXISTS idx_establishments_type ON public.establishments(type);
CREATE INDEX IF NOT EXISTS idx_establishments_city ON public.establishments(city);
CREATE INDEX IF NOT EXISTS idx_establishments_verified ON public.establishments(is_verified);
CREATE INDEX IF NOT EXISTS idx_establishments_verification_status ON public.establishments(verification_status);

-- TABLE: rooms
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  room_number VARCHAR(50) NOT NULL,
  type VARCHAR(100),
  capacity INTEGER NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'FCFA',
  amenities JSONB,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rooms_establishment ON public.rooms(establishment_id);
CREATE INDEX IF NOT EXISTS idx_rooms_available ON public.rooms(is_available);

-- TABLE: hotel_bookings
CREATE TABLE IF NOT EXISTS public.hotel_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_nights INTEGER NOT NULL,
  number_of_guests INTEGER NOT NULL,
  total_price DECIMAL(15, 2) NOT NULL,
  deposit_amount DECIMAL(15, 2),
  remaining_amount DECIMAL(15, 2),
  payment_split INTEGER DEFAULT 2,
  status booking_status DEFAULT 'pending',
  booking_code VARCHAR(50) UNIQUE,
  qr_code_url VARCHAR(500),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hotel_bookings_client ON public.hotel_bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_establishment ON public.hotel_bookings(establishment_id);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_status ON public.hotel_bookings(status);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_check_in ON public.hotel_bookings(check_in_date);

-- TABLE: restaurant_bookings
CREATE TABLE IF NOT EXISTS public.restaurant_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  number_of_guests INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 120,
  status booking_status DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_restaurant_bookings_client ON public.restaurant_bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_bookings_establishment ON public.restaurant_bookings(establishment_id);

-- TABLE: payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  amount_requested DECIMAL(15, 2) NOT NULL,
  amount_paid DECIMAL(15, 2),
  deposit_paid DECIMAL(15, 2),
  remaining_due DECIMAL(15, 2),
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  transaction_id VARCHAR(255),
  transaction_hash VARCHAR(500),
  webhook_received BOOLEAN DEFAULT FALSE,
  payment_date TIMESTAMPTZ,
  commission_miwa DECIMAL(15, 2),
  commission_rate DECIMAL(5, 2) DEFAULT 5.00,
  payout_amount DECIMAL(15, 2),
  payout_status payout_status DEFAULT 'pending',
  payout_date TIMESTAMPTZ,
  payout_reference VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_client ON public.payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_establishment ON public.payments(establishment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(created_at DESC);

-- TABLE: favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, establishment_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_client ON public.favorites(client_id);
CREATE INDEX IF NOT EXISTS idx_favorites_establishment ON public.favorites(establishment_id);

-- ============================================================================
-- ÉTAPE 3: TABLES ADMIN & MODÉRATION
-- ============================================================================

-- TABLE: feedback_submissions
CREATE TABLE IF NOT EXISTS public.feedback_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN ('bug', 'feature', 'complaint', 'praise')),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'resolved', 'dismissed')),
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_client ON public.feedback_submissions(client_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback_submissions(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.feedback_submissions(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback_submissions(created_at DESC);

-- TABLE: contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_messages(created_at DESC);

-- TABLE: admin_logs
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON public.admin_logs(created_at DESC);

-- TABLE: admin_settings
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON public.admin_settings(setting_key);

-- TABLE: user_suspensions
CREATE TABLE IF NOT EXISTS public.user_suspensions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  suspended_by UUID NOT NULL REFERENCES public.users(id),
  suspended_at TIMESTAMPTZ DEFAULT now(),
  unsuspended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_suspensions_user ON public.user_suspensions(user_id);
CREATE INDEX IF NOT EXISTS idx_suspensions_active ON public.user_suspensions(is_active);

-- TABLE: establishment_flags
CREATE TABLE IF NOT EXISTS public.establishment_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  flag_type VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  flagged_by UUID NOT NULL REFERENCES public.users(id),
  resolved BOOLEAN DEFAULT FALSE,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  flagged_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_flags_establishment ON public.establishment_flags(establishment_id);
CREATE INDEX IF NOT EXISTS idx_flags_resolved ON public.establishment_flags(resolved);

-- ============================================================================
-- ÉTAPE 4: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Users table RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can read all users" ON public.users
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Establishments table RLS
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active establishments" ON public.establishments
  FOR SELECT USING (is_active = true OR auth.uid() = owner_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Rooms table RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rooms of active establishments" ON public.rooms
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.establishments e WHERE e.id = establishment_id AND (e.is_active = true OR auth.uid() = e.owner_id)));

-- Hotel bookings RLS
ALTER TABLE public.hotel_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own bookings" ON public.hotel_bookings
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Owners can read bookings for their establishments" ON public.hotel_bookings
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.establishments e WHERE e.id = establishment_id AND e.owner_id = auth.uid()));

CREATE POLICY "Admin can read all bookings" ON public.hotel_bookings
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Payments RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Owners can read payments for their establishments" ON public.payments
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.establishments e WHERE e.id = establishment_id AND e.owner_id = auth.uid()));

CREATE POLICY "Admin can read all payments" ON public.payments
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Feedback RLS
ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own feedback" ON public.feedback_submissions
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Admin can read all feedback" ON public.feedback_submissions
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert feedback" ON public.feedback_submissions
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Contact messages RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read all contact messages" ON public.contact_messages
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Admin logs RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only can read logs" ON public.admin_logs
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Admin settings RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only can read settings" ON public.admin_settings
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Favorites RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can insert their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = client_id);

-- User suspensions RLS
ALTER TABLE public.user_suspensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only can read suspensions" ON public.user_suspensions
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Establishment flags RLS
ALTER TABLE public.establishment_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only can read flags" ON public.establishment_flags
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- ÉTAPE 5: VUES UTILES POUR L'ADMIN
-- ============================================================================

-- Vue: Statistiques utilisateurs
CREATE OR REPLACE VIEW public.admin_user_stats AS
SELECT
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT CASE WHEN u.role = 'admin' THEN u.id END) as admin_count,
  COUNT(DISTINCT CASE WHEN u.is_banned = true THEN u.id END) as banned_count,
  COUNT(DISTINCT CASE WHEN u.created_at > NOW() - INTERVAL '30 days' THEN u.id END) as new_users_30d,
  ROUND(AVG(u.wallet_balance)::NUMERIC, 2) as avg_wallet_balance
FROM public.users u;

-- Vue: Statistiques réservations
CREATE OR REPLACE VIEW public.admin_booking_stats AS
SELECT
  COUNT(DISTINCT hb.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN hb.status = 'completed' THEN hb.id END) as completed_bookings,
  COUNT(DISTINCT CASE WHEN hb.status = 'pending' THEN hb.id END) as pending_bookings,
  COALESCE(ROUND(SUM(hb.total_price)::NUMERIC, 2), 0) as total_revenue,
  ROUND(AVG(hb.total_price)::NUMERIC, 2) as avg_booking_value
FROM public.hotel_bookings hb;

-- Vue: Statistiques paiements
CREATE OR REPLACE VIEW public.admin_payment_stats AS
SELECT
  COUNT(DISTINCT p.id) as total_payments,
  COUNT(DISTINCT CASE WHEN p.payment_status = 'paid' THEN p.id END) as successful_payments,
  COUNT(DISTINCT CASE WHEN p.payment_status = 'pending' THEN p.id END) as pending_payments,
  COUNT(DISTINCT CASE WHEN p.payment_status = 'failed' THEN p.id END) as failed_payments,
  COALESCE(ROUND(SUM(CASE WHEN p.payment_status = 'paid' THEN p.amount_paid ELSE 0 END)::NUMERIC, 2), 0) as total_paid,
  COALESCE(ROUND(SUM(p.commission_miwa)::NUMERIC, 2), 0) as total_commission
FROM public.payments p;

-- Vue: Statistiques établissements
CREATE OR REPLACE VIEW public.admin_establishment_stats AS
SELECT
  COUNT(DISTINCT e.id) as total_establishments,
  COUNT(DISTINCT CASE WHEN e.is_verified = true THEN e.id END) as verified_establishments,
  COUNT(DISTINCT CASE WHEN e.verification_status = 'pending' THEN e.id END) as pending_verification,
  COUNT(DISTINCT CASE WHEN e.is_active = false THEN e.id END) as inactive_establishments
FROM public.establishments e;

-- ============================================================================
-- ÉTAPE 6: FONCTIONS UTILES
-- ============================================================================

-- Fonction: Log action admin
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_admin_id UUID,
  p_action VARCHAR,
  p_entity_type VARCHAR,
  p_entity_id VARCHAR DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  v_log_id := uuid_generate_v4();
  INSERT INTO public.admin_logs (id, admin_id, action, entity_type, entity_id, old_values, new_values, details)
  VALUES (v_log_id, p_admin_id, p_action, p_entity_type, p_entity_id, p_old_values, p_new_values, p_details);
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Ban user
CREATE OR REPLACE FUNCTION public.ban_user(p_user_id UUID, p_reason TEXT, p_admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users SET is_banned = true, ban_reason = p_reason WHERE id = p_user_id;
  PERFORM public.log_admin_action(p_admin_id, 'ban_user', 'user', p_user_id::VARCHAR, NULL, jsonb_build_object('reason', p_reason));
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Unban user
CREATE OR REPLACE FUNCTION public.unban_user(p_user_id UUID, p_admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users SET is_banned = false, ban_reason = NULL WHERE id = p_user_id;
  PERFORM public.log_admin_action(p_admin_id, 'unban_user', 'user', p_user_id::VARCHAR);
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Verify establishment
CREATE OR REPLACE FUNCTION public.verify_establishment(p_establishment_id UUID, p_admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.establishments SET is_verified = true, verification_status = 'approved' WHERE id = p_establishment_id;
  PERFORM public.log_admin_action(p_admin_id, 'verify_establishment', 'establishment', p_establishment_id::VARCHAR);
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ÉTAPE 7: DONNÉES INITIALES (OPTIONNEL)
-- ============================================================================

-- Insérer les paramètres admin par défaut
INSERT INTO public.admin_settings (setting_key, setting_value, description)
VALUES
  ('commission_rate', '5.0'::JSONB, 'Commission Miwa en pourcentage'),
  ('max_establishment_requests_per_day', '10'::JSONB, 'Nombre maximum de demandes de réservation par jour'),
  ('email_notifications_enabled', 'true'::JSONB, 'Activer les notifications email'),
  ('maintenance_mode', 'false'::JSONB, 'Mode maintenance activé?')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================================
-- ÉTAPE 8: TESTS & VÉRIFICATION
-- ============================================================================

-- Vérifier que tout est correctement créé
SELECT 'Base de données initialisée avec succès!' as status;

-- Afficher les tables créées
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
