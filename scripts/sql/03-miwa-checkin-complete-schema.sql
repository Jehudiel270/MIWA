-- ============================================================================
-- MIWA CHECK-IN: SCHÉMA COMPLET BASE DE DONNÉES
-- Plateforme d'hospitalité et gestion intégrée (Réservations + PMS + Fintech)
-- ============================================================================

-- Extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS & TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE establishment_type AS ENUM ('hotel', 'restaurant', 'coworking');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('mobile_money', 'card', 'wallet', 'hybrid');
CREATE TYPE housekeeping_status AS ENUM ('pending', 'in_progress', 'completed');

-- ============================================================================
-- TABLE: users (Clients - Profils Supabase Auth)
-- ============================================================================

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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- TABLE: establishments (Hôtels, Restaurants, Coworking)
-- ============================================================================

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
  payout_account VARCHAR(255), -- Mobile Money account
  payout_frequency VARCHAR(50) DEFAULT 'daily',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_establishments_owner ON public.establishments(owner_id);
CREATE INDEX idx_establishments_type ON public.establishments(type);
CREATE INDEX idx_establishments_city ON public.establishments(city);
CREATE INDEX idx_establishments_verified ON public.establishments(is_verified);

ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active establishments" ON public.establishments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can read their own" ON public.establishments
  FOR SELECT USING (auth.uid() = owner_id);

-- ============================================================================
-- TABLE: rooms (Chambres d'hôtel)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  room_number VARCHAR(50) NOT NULL,
  type VARCHAR(100), -- Deluxe, Standard, Suite, etc.
  capacity INTEGER NOT NULL DEFAULT 2,
  price_per_night DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XOF',
  amenities JSONB, -- WiFi, AC, TV, etc.
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(establishment_id, room_number)
);

CREATE INDEX idx_rooms_establishment ON public.rooms(establishment_id);
CREATE INDEX idx_rooms_available ON public.rooms(is_available);

-- ============================================================================
-- TABLE: hotel_bookings (Réservations d'hôtel)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.hotel_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_nights INTEGER NOT NULL,
  number_of_guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(15, 2) NOT NULL,
  deposit_amount DECIMAL(15, 2),
  remaining_amount DECIMAL(15, 2),
  payment_split DECIMAL(3, 1) DEFAULT 50, -- 50% now, 50% on arrival
  status booking_status DEFAULT 'pending',
  booking_code VARCHAR(50) UNIQUE,
  qr_code_url VARCHAR(500),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hotel_bookings_client ON public.hotel_bookings(client_id);
CREATE INDEX idx_hotel_bookings_establishment ON public.hotel_bookings(establishment_id);
CREATE INDEX idx_hotel_bookings_check_in ON public.hotel_bookings(check_in_date);
CREATE INDEX idx_hotel_bookings_status ON public.hotel_bookings(status);

ALTER TABLE public.hotel_bookings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: tables (Tables de restaurant)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  table_number VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 4,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(establishment_id, table_number)
);

CREATE INDEX idx_tables_establishment ON public.restaurant_tables(establishment_id);

-- ============================================================================
-- TABLE: menu_items (Éléments de menu)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- Appetizer, Main, Dessert, Beverage
  price DECIMAL(15, 2) NOT NULL,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_menu_items_establishment ON public.menu_items(establishment_id);

-- ============================================================================
-- TABLE: restaurant_bookings (Réservations de tables)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.restaurant_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  table_id UUID NOT NULL REFERENCES public.restaurant_tables(id) ON DELETE CASCADE,
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

CREATE INDEX idx_restaurant_bookings_client ON public.restaurant_bookings(client_id);
CREATE INDEX idx_restaurant_bookings_establishment ON public.restaurant_bookings(establishment_id);
CREATE INDEX idx_restaurant_bookings_booking_date ON public.restaurant_bookings(booking_date);

-- ============================================================================
-- TABLE: orders (Commandes = Hôtel + Restaurant + Livraison)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_type VARCHAR(50), -- 'hotel_service', 'restaurant', 'delivery'
  order_reference UUID, -- Peut pointer à hotel_booking ou restaurant_booking
  total_amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, preparing, ready, delivered, completed
  payment_status payment_status DEFAULT 'pending',
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_client ON public.orders(client_id);
CREATE INDEX idx_orders_establishment ON public.orders(establishment_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ============================================================================
-- TABLE: order_items (Détails des commandes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id),
  item_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(15, 2) NOT NULL,
  subtotal DECIMAL(15, 2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- ============================================================================
-- TABLE: payments (Transactions financières)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  amount_requested DECIMAL(15, 2) NOT NULL,
  amount_paid DECIMAL(15, 2),
  deposit_paid DECIMAL(15, 2), -- 50% acompte
  remaining_due DECIMAL(15, 2), -- 50% sur place
  payment_method payment_method DEFAULT 'mobile_money',
  payment_status payment_status DEFAULT 'pending',
  transaction_id VARCHAR(255), -- MTN/Moov transaction reference
  transaction_hash VARCHAR(255), -- Blockchain si crypto
  webhook_received BOOLEAN DEFAULT FALSE,
  payment_date TIMESTAMPTZ,
  commission_miwa DECIMAL(15, 2), -- Calcul: 4% sur total pour hôtels, 200 FCFA/pers pour restos
  commission_rate DECIMAL(5, 2) DEFAULT 4.00, -- En pourcentage
  payout_amount DECIMAL(15, 2), -- Montant à reverser à l'établissement
  payout_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  payout_date TIMESTAMPTZ,
  payout_reference VARCHAR(255), -- Numéro virement MTN/Moov
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_client ON public.payments(client_id);
CREATE INDEX idx_payments_establishment ON public.payments(establishment_id);
CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_status ON public.payments(payment_status);
CREATE INDEX idx_payments_payout_status ON public.payments(payout_status);
CREATE INDEX idx_payments_transaction_id ON public.payments(transaction_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: inventory (Stocks Bar/Cuisine)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- Boissons, Alcool, Nourriture, Condiments
  quantity_on_hand DECIMAL(15, 2) NOT NULL,
  unit VARCHAR(50), -- litre, kg, pièce, etc.
  reorder_level DECIMAL(15, 2),
  last_updated TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_inventory_establishment ON public.inventory(establishment_id);

-- ============================================================================
-- TABLE: inventory_movements (Historique stocks)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  movement_type VARCHAR(50), -- 'sale', 'purchase', 'adjustment', 'waste'
  quantity_changed DECIMAL(15, 2) NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_inventory_movements_inventory ON public.inventory_movements(inventory_id);

-- ============================================================================
-- TABLE: housekeeping_tasks (Planification ménage)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.housekeeping_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  task_type VARCHAR(100), -- 'checkout_clean', 'daily_clean', 'maintenance'
  assigned_to UUID REFERENCES public.users(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  status housekeeping_status DEFAULT 'pending',
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_housekeeping_establishment ON public.housekeeping_tasks(establishment_id);
CREATE INDEX idx_housekeeping_room ON public.housekeeping_tasks(room_id);
CREATE INDEX idx_housekeeping_assigned_to ON public.housekeeping_tasks(assigned_to);
CREATE INDEX idx_housekeeping_date ON public.housekeeping_tasks(scheduled_date);

-- ============================================================================
-- TABLE: delivery_orders (Commandes de livraison)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.delivery_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  delivery_address TEXT NOT NULL,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  delivery_distance_km DECIMAL(10, 2),
  delivery_fee DECIMAL(15, 2),
  total_amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, preparing, dispatched, delivered
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  driver_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_delivery_orders_client ON public.delivery_orders(client_id);
CREATE INDEX idx_delivery_orders_establishment ON public.delivery_orders(establishment_id);
CREATE INDEX idx_delivery_orders_status ON public.delivery_orders(status);

-- ============================================================================
-- TABLE: reviews_ratings (Avis clients)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reviews_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID, -- Référence facultative
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  cleanliness_rating INTEGER,
  service_rating INTEGER,
  value_for_money_rating INTEGER,
  verified_booking BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_establishment ON public.reviews_ratings(establishment_id);
CREATE INDEX idx_reviews_client ON public.reviews_ratings(client_id);
CREATE INDEX idx_reviews_rating ON public.reviews_ratings(rating);

ALTER TABLE public.reviews_ratings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: favorites (Favoris des clients)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, establishment_id)
);

CREATE INDEX idx_favorites_client ON public.favorites(client_id);

-- ============================================================================
-- TABLE: notifications (Système de notifications)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50), -- 'booking_confirmation', 'payment_received', 'reminder', 'promotion'
  related_id UUID, -- ID de la commande/réservation
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);

-- ============================================================================
-- TRIGGERS POUR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_establishments_updated_at BEFORE UPDATE ON public.establishments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotel_bookings_updated_at BEFORE UPDATE ON public.hotel_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_housekeeping_tasks_updated_at BEFORE UPDATE ON public.housekeeping_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_orders_updated_at BEFORE UPDATE ON public.delivery_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ✅ SCHÉMA COMPLET CRÉÉ ET PRÊT POUR MIWA CHECK-IN
-- ============================================================================
