-- Create tables for KindRipple app with Bengaluru, India data

-- Users table (restaurants, NGOs, volunteers, admins)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('restaurant', 'ngo', 'volunteer', 'admin')),
  avatar TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  cuisine_type TEXT,
  opening_hours TEXT,
  ngo_id UUID REFERENCES public.users(id),
  completed_deliveries INTEGER DEFAULT 0,
  badges TEXT[],
  is_available BOOLEAN DEFAULT TRUE
);

-- Donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES public.users(id) NOT NULL,
  restaurant_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  is_vegetarian BOOLEAN NOT NULL,
  expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'claimed', 'in-progress', 'completed', 'expired')),
  claimed_by UUID REFERENCES public.users(id),
  assigned_volunteer UUID REFERENCES public.users(id),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID REFERENCES public.donations(id) NOT NULL,
  volunteer_id UUID REFERENCES public.users(id) NOT NULL,
  ngo_id UUID REFERENCES public.users(id) NOT NULL,
  restaurant_id UUID REFERENCES public.users(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('assigned', 'in-progress', 'completed', 'cancelled')),
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_time TIMESTAMP WITH TIME ZONE,
  pickup_latitude DOUBLE PRECISION NOT NULL,
  pickup_longitude DOUBLE PRECISION NOT NULL,
  pickup_address TEXT NOT NULL,
  dropoff_latitude DOUBLE PRECISION NOT NULL,
  dropoff_longitude DOUBLE PRECISION NOT NULL,
  dropoff_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Metrics table
CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_meals_rescued INTEGER NOT NULL,
  co2_emissions_saved DOUBLE PRECISION NOT NULL,
  volunteers_recognized INTEGER NOT NULL,
  restaurants_participating INTEGER NOT NULL,
  ngos_participating INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Bengaluru restaurants
INSERT INTO public.users (id, name, email, role, avatar, phone, address, description, cuisine_type, opening_hours)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mavalli Tiffin Room (MTR)', 'contact@mtrfoods.com', 'restaurant', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 80 2222 0022', '14, Lalbagh Road, Mavalli, Bengaluru, Karnataka 560004', 'Iconic South Indian restaurant known for authentic Karnataka cuisine since 1924.', 'South Indian, Vegetarian', 'Mon-Sun: 6:30 AM - 11:00 AM, 12:30 PM - 3:30 PM'),
  
  ('22222222-2222-2222-2222-222222222222', 'Nagarjuna', 'info@nagarjunarestaurant.com', 'restaurant', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 80 2558 7088', 'Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025', 'Famous for authentic Andhra cuisine with spicy flavors and biryanis.', 'Andhra, South Indian', 'Mon-Sun: 12:00 PM - 3:30 PM, 7:00 PM - 11:00 PM'),
  
  ('33333333-3333-3333-3333-333333333333', 'Truffles', 'hello@trufflesindia.com', 'restaurant', 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 80 4115 0844', '22, St. Marks Road, Ashok Nagar, Bengaluru, Karnataka 560001', 'Popular casual dining restaurant known for burgers, steaks, and pasta.', 'Continental, American, Italian', 'Mon-Sun: 11:00 AM - 11:00 PM'),
  
  ('44444444-4444-4444-4444-444444444444', 'Meghana Foods', 'contact@meghanafoods.com', 'restaurant', 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 80 4091 3400', 'Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025', 'Famous for Andhra-style biryanis and spicy non-vegetarian dishes.', 'Andhra, Biryani, North Indian', 'Mon-Sun: 11:30 AM - 11:30 PM'),
  
  ('55555555-5555-5555-5555-555555555555', 'Vidyarthi Bhavan', 'info@vidyarthibhavan.com', 'restaurant', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 80 2667 7588', '32, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru, Karnataka 560004', 'Historic restaurant established in 1943, famous for crispy masala dosas.', 'South Indian, Vegetarian', 'Tue-Sun: 6:30 AM - 11:30 AM, 2:00 PM - 8:00 PM');

-- Insert Bengaluru NGOs
INSERT INTO public.users (id, name, email, role, avatar, phone, address, description)
VALUES
  ('66666666-6666-6666-6666-666666666666', 'Akshaya Patra Foundation', 'contact@akshayapatra.org', 'ngo', 'https://images.unsplash.com/photo-1593113598332-cd59a93f9724?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 80 3014 7777', 'Hare Krishna Hill, Chord Road, Rajajinagar, Bengaluru, Karnataka 560010', 'World''s largest NGO-run school meal program serving millions of children across India.'),
  
  ('77777777-7777-7777-7777-777777777777', 'Bengaluru Food Bank', 'info@bengalurufoodbank.org', 'ngo', 'https://images.unsplash.com/photo-1607748851687-ba9a10438621?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 80 2345 6789', '45, 5th Cross, Indiranagar, Bengaluru, Karnataka 560038', 'Local food bank collecting and distributing surplus food to underprivileged communities in Bengaluru.'),
  
  ('88888888-8888-8888-8888-888888888888', 'Feeding India - Bengaluru Chapter', 'bengaluru@feedingindia.org', 'ngo', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 98765 43210', '78, 12th Main, HSR Layout, Bengaluru, Karnataka 560102', 'Volunteer-driven organization working to reduce hunger and food waste across India.');

-- Insert Bengaluru volunteers
INSERT INTO public.users (id, name, email, role, avatar, phone, address, ngo_id, completed_deliveries, badges, is_available)
VALUES
  ('99999999-9999-9999-9999-999999999999', 'Arjun Sharma', 'arjun.s@example.com', 'volunteer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 98765 12345', 'Koramangala 5th Block, Bengaluru, Karnataka 560095', '66666666-6666-6666-6666-666666666666', 15, ARRAY['first-delivery', '10-deliveries', 'weekend-warrior'], TRUE),
  
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Priya Patel', 'priya.p@example.com', 'volunteer', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 98765 23456', 'Jayanagar 4th Block, Bengaluru, Karnataka 560041', '66666666-6666-6666-6666-666666666666', 8, ARRAY['first-delivery', '5-deliveries'], TRUE),
  
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Rahul Verma', 'rahul.v@example.com', 'volunteer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 98765 34567', 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038', '77777777-7777-7777-7777-777777777777', 5, ARRAY['first-delivery', '5-deliveries'], FALSE),
  
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Ananya Desai', 'ananya.d@example.com', 'volunteer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 98765 45678', 'Whitefield, Bengaluru, Karnataka 560066', '88888888-8888-8888-8888-888888888888', 3, ARRAY['first-delivery'], TRUE);

-- Insert admin
INSERT INTO public.users (id, name, email, role, avatar, phone, address)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Admin User', 'admin@kindripple.org', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', '+91 98765 56789', 'MG Road, Bengaluru, Karnataka 560001');

-- Insert food donations from Bengaluru restaurants
INSERT INTO public.donations (id, restaurant_id, restaurant_name, title, description, image, quantity, is_vegetarian, expiry_time, pickup_time, status, claimed_by, assigned_volunteer, latitude, longitude, address, created_at)
VALUES
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', '11111111-1111-1111-1111-111111111111', 'Mavalli Tiffin Room (MTR)', 'South Indian Thali', 'Freshly prepared South Indian thali meals with rice, sambar, rasam, and vegetables. About 20 servings available.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', 20, TRUE, NOW() + INTERVAL '24 hours', NOW() + INTERVAL '2 hours', 'available', NULL, NULL, 12.9507, 77.5848, '14, Lalbagh Road, Mavalli, Bengaluru, Karnataka 560004', NOW() - INTERVAL '1 hour'),
  
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', '22222222-2222-2222-2222-222222222222', 'Nagarjuna', 'Andhra Meals', 'Spicy Andhra style meals with rice, curries, and pappu (dal). Approximately 15 servings available.', 'https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', 15, FALSE, NOW() + INTERVAL '12 hours', NOW() + INTERVAL '1 hour', 'claimed', '66666666-6666-6666-6666-666666666666', NULL, 12.9698, 77.6003, 'Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025', NOW() - INTERVAL '3 hours'),
  
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '33333333-3333-3333-3333-333333333333', 'Truffles', 'Pasta and Sandwiches', 'Assorted pasta dishes and sandwiches from lunch service. 12 servings available.', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', 12, FALSE, NOW() + INTERVAL '8 hours', NOW() + INTERVAL '30 minutes', 'in-progress', '77777777-7777-7777-7777-777777777777', '99999999-9999-9999-9999-999999999999', 12.9715, 77.6099, '22, St. Marks Road, Ashok Nagar, Bengaluru, Karnataka 560001', NOW() - INTERVAL '5 hours'),
  
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', '44444444-4444-4444-4444-444444444444', 'Meghana Foods', 'Biryani', 'Leftover chicken and vegetable biryani from lunch service. About 18 servings available.', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', 18, FALSE, NOW() + INTERVAL '10 hours', NOW() + INTERVAL '3 hours', 'available', NULL, NULL, 12.9698, 77.6003, 'Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025', NOW() - INTERVAL '4 hours'),
  
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', '55555555-5555-5555-5555-555555555555', 'Vidyarthi Bhavan', 'Masala Dosa', 'Freshly made masala dosas with chutney and sambar. 10 servings available.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', 10, TRUE, NOW() + INTERVAL '6 hours', NOW() + INTERVAL '45 minutes', 'available', NULL, NULL, 12.9454, 77.5714, '32, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru, Karnataka 560004', NOW() - INTERVAL '2 hours');

-- Insert delivery tasks
INSERT INTO public.tasks (id, donation_id, volunteer_id, ngo_id, restaurant_id, status, pickup_time, delivery_time, pickup_latitude, pickup_longitude, pickup_address, dropoff_latitude, dropoff_longitude, dropoff_address, created_at)
VALUES
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', '99999999-9999-9999-9999-999999999999', '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'assigned', NOW() + INTERVAL '1 hour', NULL, 12.9698, 77.6003, 'Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025', 12.9716, 77.5946, 'Hare Krishna Hill, Chord Road, Rajajinagar, Bengaluru, Karnataka 560010', NOW() - INTERVAL '30 minutes'),
  
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '99999999-9999-9999-9999-999999999999', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'in-progress', NOW() + INTERVAL '30 minutes', NULL, 12.9715, 77.6099, '22, St. Marks Road, Ashok Nagar, Bengaluru, Karnataka 560001', 12.9784, 77.6408, '45, 5th Cross, Indiranagar, Bengaluru, Karnataka 560038', NOW() - INTERVAL '2 hours'),
  
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'completed', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours', 12.9507, 77.5848, '14, Lalbagh Road, Mavalli, Bengaluru, Karnataka 560004', 12.9716, 77.5946, 'Hare Krishna Hill, Chord Road, Rajajinagar, Bengaluru, Karnataka 560010', NOW() - INTERVAL '5 hours');

-- Insert metrics
INSERT INTO public.metrics (id, total_meals_rescued, co2_emissions_saved, volunteers_recognized, restaurants_participating, ngos_participating, updated_at)
VALUES
  ('a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 1850, 5550, 25, 35, 12, NOW());