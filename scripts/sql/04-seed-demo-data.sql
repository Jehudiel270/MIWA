-- Sample seed data for hotel booking flow
-- Replace UUID values with real auth user IDs if necessary.

-- Client user (must also exist in auth.users for Supabase auth)
INSERT INTO public.users (
  id,
  full_name,
  phone,
  email,
  role,
  profile_picture_url,
  wallet_balance,
  preferred_payment_method,
  country,
  city
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Koffi Mensah',
  '+22997123456',
  'koffi.mensah@example.com',
  'client',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
  300000,
  'mobile_money',
  'Benin',
  'Cotonou'
);

-- Establishment owner user
INSERT INTO public.users (
  id,
  full_name,
  phone,
  email,
  role,
  profile_picture_url,
  wallet_balance,
  preferred_payment_method,
  country,
  city
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Aissatou Hotelier',
  '+22998123456',
  'aissatou.hotelier@example.com',
  'admin',
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=200&h=200&fit=crop',
  0,
  'mobile_money',
  'Benin',
  'Cotonou'
);

-- Establishment
INSERT INTO public.establishments (
  id,
  owner_id,
  name,
  description,
  type,
  address,
  city,
  phone,
  email,
  website,
  cover_image_url,
  average_rating,
  total_reviews,
  is_verified,
  is_active,
  payout_account
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'Azalai Hôtel Plaza',
  'Hôtel moderne avec chambres confortables, petit-déjeuner inclus et service 24/7.',
  'hotel',
  'Rue de la Paix, Cotonou',
  'Cotonou',
  '+22995000000',
  'contact@azalai-plaza.com',
  'https://azalai-plaza.example.com',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
  4.8,
  126,
  true,
  true,
  '+22995000000'
);

-- Rooms
INSERT INTO public.rooms (
  id,
  establishment_id,
  room_number,
  type,
  capacity,
  price_per_night,
  currency,
  amenities,
  is_available
) VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    '101',
    'Standard',
    2,
    35000,
    'XOF',
    '["WiFi","Climatisation","Télévision"]',
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    '102',
    'Deluxe',
    2,
    50000,
    'XOF',
    '["WiFi","Climatisation","Mini-bar","Balcon"]',
    true
  );

-- Hotel booking
INSERT INTO public.hotel_bookings (
  id,
  establishment_id,
  room_id,
  client_id,
  check_in_date,
  check_out_date,
  number_of_nights,
  number_of_guests,
  total_price,
  deposit_amount,
  remaining_amount,
  payment_split,
  status,
  booking_code,
  qr_code_url,
  special_requests
) VALUES (
  '66666666-6666-6666-6666-666666666666',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  '2026-04-24',
  '2026-04-27',
  3,
  2,
  105000,
  52500,
  52500,
  50,
  'confirmed',
  'AZA-20260424-01',
  'https://example.com/qr/66666666-6666-6666-6666-666666666666.png',
  'Chambre côté piscine si possible.'
);

-- Mark the booked room as unavailable
UPDATE public.rooms
SET is_available = false
WHERE id = '44444444-4444-4444-4444-444444444444';

-- Payment record
INSERT INTO public.payments (
  id,
  client_id,
  establishment_id,
  amount_requested,
  amount_paid,
  deposit_paid,
  remaining_due,
  payment_method,
  payment_status,
  transaction_id,
  payment_date,
  commission_miwa,
  commission_rate,
  payout_amount,
  payout_status
) VALUES (
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  105000,
  52500,
  52500,
  52500,
  'mobile_money',
  'paid',
  'TRX123456789',
  now(),
  4200,
  4.00,
  100800,
  'completed'
);
