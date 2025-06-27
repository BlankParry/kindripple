import { Restaurant, NGO, Volunteer, Admin } from '@/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: "Mavalli Tiffin Room (MTR)",
    email: "contact@mtrfoods.com",
    role: "restaurant",
    avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 80 2222 0022",
    address: "14, Lalbagh Road, Mavalli, Bengaluru, Karnataka 560004",
    createdAt: "2023-01-15T08:00:00Z",
    description: "Iconic South Indian restaurant known for authentic Karnataka cuisine since 1924.",
    cuisineType: "South Indian, Vegetarian",
    openingHours: "Mon-Sun: 6:30 AM - 11:00 AM, 12:30 PM - 3:30 PM"
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: "Nagarjuna",
    email: "info@nagarjunarestaurant.com",
    role: "restaurant",
    avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 80 2558 7088",
    address: "Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025",
    createdAt: "2023-02-20T10:30:00Z",
    description: "Famous for authentic Andhra cuisine with spicy flavors and biryanis.",
    cuisineType: "Andhra, South Indian",
    openingHours: "Mon-Sun: 12:00 PM - 3:30 PM, 7:00 PM - 11:00 PM"
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: "Truffles",
    email: "hello@trufflesindia.com",
    role: "restaurant",
    avatar: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 80 4115 0844",
    address: "22, St. Marks Road, Ashok Nagar, Bengaluru, Karnataka 560001",
    createdAt: "2023-03-10T09:15:00Z",
    description: "Popular casual dining restaurant known for burgers, steaks, and pasta.",
    cuisineType: "Continental, American, Italian",
    openingHours: "Mon-Sun: 11:00 AM - 11:00 PM"
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: "Meghana Foods",
    email: "contact@meghanafoods.com",
    role: "restaurant",
    avatar: "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 80 4091 3400",
    address: "Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025",
    createdAt: "2023-04-05T11:45:00Z",
    description: "Famous for Andhra-style biryanis and spicy non-vegetarian dishes.",
    cuisineType: "Andhra, Biryani, North Indian",
    openingHours: "Mon-Sun: 11:30 AM - 11:30 PM"
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: "Vidyarthi Bhavan",
    email: "info@vidyarthibhavan.com",
    role: "restaurant",
    avatar: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 80 2667 7588",
    address: "32, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru, Karnataka 560004",
    createdAt: "2023-01-25T08:30:00Z",
    description: "Historic restaurant established in 1943, famous for crispy masala dosas.",
    cuisineType: "South Indian, Vegetarian",
    openingHours: "Tue-Sun: 6:30 AM - 11:30 AM, 2:00 PM - 8:00 PM"
  }
];

export const mockNGOs: NGO[] = [
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: "Akshaya Patra Foundation",
    email: "contact@akshayapatra.org",
    role: "ngo",
    avatar: "https://images.unsplash.com/photo-1593113598332-cd59a93f9724?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 80 3014 7777",
    address: "Hare Krishna Hill, Chord Road, Rajajinagar, Bengaluru, Karnataka 560010",
    createdAt: "2023-01-05T11:00:00Z",
    description: "World's largest NGO-run school meal program serving millions of children across India.",
    volunteers: ['99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa']
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: "Bengaluru Food Bank",
    email: "info@bengalurufoodbank.org",
    role: "ngo",
    avatar: "https://images.unsplash.com/photo-1607748851687-ba9a10438621?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 80 2345 6789",
    address: "45, 5th Cross, Indiranagar, Bengaluru, Karnataka 560038",
    createdAt: "2023-02-15T13:45:00Z",
    description: "Local food bank collecting and distributing surplus food to underprivileged communities in Bengaluru.",
    volunteers: ['bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb']
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    name: "Feeding India - Bengaluru Chapter",
    email: "bengaluru@feedingindia.org",
    role: "ngo",
    avatar: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 98765 43210",
    address: "78, 12th Main, HSR Layout, Bengaluru, Karnataka 560102",
    createdAt: "2023-03-10T14:30:00Z",
    description: "Volunteer-driven organization working to reduce hunger and food waste across India.",
    volunteers: ['cccccccc-cccc-cccc-cccc-cccccccccccc']
  }
];

export const mockVolunteers: Volunteer[] = [
  {
    id: '99999999-9999-9999-9999-999999999999',
    name: "Arjun Sharma",
    email: "arjun.s@example.com",
    role: "volunteer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 98765 12345",
    address: "Koramangala 5th Block, Bengaluru, Karnataka 560095",
    createdAt: "2023-01-10T14:30:00Z",
    ngoId: '66666666-6666-6666-6666-666666666666',
    completedDeliveries: 15,
    badges: ['first-delivery', '10-deliveries', 'weekend-warrior'],
    isAvailable: true
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: "Priya Patel",
    email: "priya.p@example.com",
    role: "volunteer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 98765 23456",
    address: "Jayanagar 4th Block, Bengaluru, Karnataka 560041",
    createdAt: "2023-02-05T16:15:00Z",
    ngoId: '66666666-6666-6666-6666-666666666666',
    completedDeliveries: 8,
    badges: ['first-delivery', '5-deliveries'],
    isAvailable: true
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: "Rahul Verma",
    email: "rahul.v@example.com",
    role: "volunteer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 98765 34567",
    address: "Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
    createdAt: "2023-03-01T10:45:00Z",
    ngoId: '77777777-7777-7777-7777-777777777777',
    completedDeliveries: 5,
    badges: ['first-delivery', '5-deliveries'],
    isAvailable: false
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: "Ananya Desai",
    email: "ananya.d@example.com",
    role: "volunteer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 98765 45678",
    address: "Whitefield, Bengaluru, Karnataka 560066",
    createdAt: "2023-03-15T11:30:00Z",
    ngoId: '88888888-8888-8888-8888-888888888888',
    completedDeliveries: 3,
    badges: ['first-delivery'],
    isAvailable: true
  }
];

export const mockAdmins: Admin[] = [
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    name: "Admin User",
    email: "admin@kindripple.org",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    phone: "+91 98765 56789",
    address: "MG Road, Bengaluru, Karnataka 560001",
    createdAt: "2023-01-01T09:00:00Z"
  }
];