// ============================================================================
// MIWA CHECK-IN - Types de Base de Données
// ============================================================================

// =========================
// ENUMS & TYPES
// =========================

export type EstablishmentType = "hotel" | "restaurant" | "coworking";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "mobile_money" | "card" | "wallet" | "hybrid";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "completed";
export type HousekeepingStatus = "pending" | "in_progress" | "completed";
export type DeliveryStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "dispatched"
  | "delivered";
export type PayoutStatus = "pending" | "processing" | "completed" | "failed";
export type UserRole = "client" | "admin";

// =========================
// TABLE ROWS
// =========================

export interface User {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role: UserRole;
  profile_picture_url?: string;
  wallet_balance: number;
  preferred_payment_method: PaymentMethod;
  country: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

export interface Establishment {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  type: EstablishmentType;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  cover_image_url?: string;
  logo_url?: string;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  payout_account?: string;
  payout_frequency: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  establishment_id: string;
  room_number: string;
  type?: string;
  capacity: number;
  price_per_night: number;
  currency: string;
  amenities?: Record<string, any>;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface HotelBooking {
  id: string;
  establishment_id: string;
  room_id: string;
  client_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number;
  number_of_guests: number;
  total_price: number;
  deposit_amount?: number;
  remaining_amount?: number;
  payment_split: number;
  status: BookingStatus;
  booking_code?: string;
  qr_code_url?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface RestaurantTable {
  id: string;
  establishment_id: string;
  table_number: string;
  capacity: number;
  is_available: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantBooking {
  id: string;
  establishment_id: string;
  table_id: string;
  client_id: string;
  booking_date: string;
  booking_time: string;
  number_of_guests: number;
  duration_minutes: number;
  status: BookingStatus;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  establishment_id: string;
  client_id: string;
  order_type: "hotel_service" | "restaurant" | "delivery";
  order_reference?: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id?: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_instructions?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id?: string;
  client_id: string;
  establishment_id: string;
  amount_requested: number;
  amount_paid?: number;
  deposit_paid?: number;
  remaining_due?: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id?: string;
  transaction_hash?: string;
  webhook_received: boolean;
  payment_date?: string;
  commission_miwa?: number;
  commission_rate: number;
  payout_amount?: number;
  payout_status: PayoutStatus;
  payout_date?: string;
  payout_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  establishment_id: string;
  item_name: string;
  category?: string;
  quantity_on_hand: number;
  unit: string;
  reorder_level?: number;
  last_updated: string;
}

export interface InventoryMovement {
  id: string;
  inventory_id: string;
  movement_type: "sale" | "purchase" | "adjustment" | "waste";
  quantity_changed: number;
  reason?: string;
  created_by?: string;
  created_at: string;
}

export interface HousekeepingTask {
  id: string;
  establishment_id: string;
  room_id?: string;
  task_type: string;
  assigned_to?: string;
  scheduled_date: string;
  scheduled_time?: string;
  status: HousekeepingStatus;
  notes?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryOrder {
  id: string;
  establishment_id: string;
  client_id: string;
  delivery_address: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  delivery_distance_km?: number;
  delivery_fee?: number;
  total_amount: number;
  status: DeliveryStatus;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  driver_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  establishment_id: string;
  client_id: string;
  booking_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  cleanliness_rating?: number;
  service_rating?: number;
  value_for_money_rating?: number;
  verified_booking: boolean;
  helpful_count: number;
  unhelpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  client_id: string;
  establishment_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

// =========================
// DATABASE TYPE MAP
// =========================

export interface Database {
  public: {
    Tables: {
      users: { Row: User };
      establishments: { Row: Establishment };
      rooms: { Row: Room };
      hotel_bookings: { Row: HotelBooking };
      restaurant_tables: { Row: RestaurantTable };
      menu_items: { Row: MenuItem };
      restaurant_bookings: { Row: RestaurantBooking };
      orders: { Row: Order };
      order_items: { Row: OrderItem };
      payments: { Row: Payment };
      inventory: { Row: Inventory };
      inventory_movements: { Row: InventoryMovement };
      housekeeping_tasks: { Row: HousekeepingTask };
      delivery_orders: { Row: DeliveryOrder };
      reviews_ratings: { Row: Review };
      favorites: { Row: Favorite };
      notifications: { Row: Notification };
    };
  };
}

// =========================
// INPUT DTOs
// =========================

export interface CreateEstablishmentInput {
  name: string;
  type: EstablishmentType;
  description?: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  payout_account: string;
}

export interface CreateHotelBookingInput {
  establishment_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  special_requests?: string;
}

export interface CreatePaymentInput {
  establishment_id: string;
  amount_requested: number;
  payment_method: PaymentMethod;
  order_id?: string;
}

export interface CreateDeliveryOrderInput {
  establishment_id: string;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
}

// =========================
// API RESPONSES
// =========================

export interface ApiSuccess<T> {
  success: true;
  data?: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: string;
}
