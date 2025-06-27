import { FoodDonation } from '@/types';

export const mockDonations: FoodDonation[] = [
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    restaurantId: '11111111-1111-1111-1111-111111111111',
    restaurantName: "Mavalli Tiffin Room (MTR)",
    title: "South Indian Thali",
    description: "Freshly prepared South Indian thali meals with rice, sambar, rasam, and vegetables. About 20 servings available.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    quantity: 20,
    isVegetarian: true,
    expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    status: 'available',
    location: {
      latitude: 12.9507,
      longitude: 77.5848,
      address: "14, Lalbagh Road, Mavalli, Bengaluru, Karnataka 560004"
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
  },
  {
    id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    restaurantId: '22222222-2222-2222-2222-222222222222',
    restaurantName: "Nagarjuna",
    title: "Andhra Meals",
    description: "Spicy Andhra style meals with rice, curries, and pappu (dal). Approximately 15 servings available.",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    quantity: 15,
    isVegetarian: false,
    expiryTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    pickupTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    status: 'claimed',
    claimedBy: '66666666-6666-6666-6666-666666666666', // NGO ID
    location: {
      latitude: 12.9698,
      longitude: 77.6003,
      address: "Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025"
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
  },
  {
    id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
    restaurantId: '33333333-3333-3333-3333-333333333333',
    restaurantName: "Truffles",
    title: "Pasta and Sandwiches",
    description: "Assorted pasta dishes and sandwiches from lunch service. 12 servings available.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    quantity: 12,
    isVegetarian: false,
    expiryTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    pickupTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    status: 'in-progress',
    claimedBy: '77777777-7777-7777-7777-777777777777', // NGO ID
    assignedVolunteer: '99999999-9999-9999-9999-999999999999', // Volunteer ID
    location: {
      latitude: 12.9715,
      longitude: 77.6099,
      address: "22, St. Marks Road, Ashok Nagar, Bengaluru, Karnataka 560001"
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  },
  {
    id: 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
    restaurantId: '44444444-4444-4444-4444-444444444444',
    restaurantName: "Meghana Foods",
    title: "Biryani",
    description: "Leftover chicken and vegetable biryani from lunch service. About 18 servings available.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    quantity: 18,
    isVegetarian: false,
    expiryTime: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(), // 10 hours from now
    pickupTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    status: 'available',
    location: {
      latitude: 12.9698,
      longitude: 77.6003,
      address: "Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025"
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  },
  {
    id: 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii',
    restaurantId: '55555555-5555-5555-5555-555555555555',
    restaurantName: "Vidyarthi Bhavan",
    title: "Masala Dosa",
    description: "Freshly made masala dosas with chutney and sambar. 10 servings available.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    quantity: 10,
    isVegetarian: true,
    expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    pickupTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
    status: 'available',
    location: {
      latitude: 12.9454,
      longitude: 77.5714,
      address: "32, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru, Karnataka 560004"
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  }
];