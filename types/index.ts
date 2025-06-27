export type UserRole = 'restaurant' | 'ngo' | 'volunteer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Restaurant extends User {
  role: 'restaurant';
  description?: string;
  cuisineType?: string;
  openingHours?: string;
}

export interface NGO extends User {
  role: 'ngo';
  description?: string;
  volunteers?: string[]; // Array of volunteer IDs
}

export interface Volunteer extends User {
  role: 'volunteer';
  ngoId?: string;
  completedDeliveries: number;
  badges: string[];
  isAvailable: boolean;
}

export interface Admin extends User {
  role: 'admin';
}

export interface FoodDonation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  title: string;
  description: string;
  image: string;
  quantity: number; // Number of meals
  isVegetarian: boolean;
  expiryTime: string; // ISO date string
  pickupTime: string; // ISO date string
  status: 'available' | 'claimed' | 'in-progress' | 'completed' | 'expired' | 'collected' | 'delivered';
  claimedBy?: string; // NGO ID
  assignedVolunteer?: string; // Volunteer ID
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
}

export interface DeliveryTask {
  id: string;
  donationId: string;
  volunteerId: string;
  ngoId: string;
  restaurantId: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  pickupTime: string;
  deliveryTime?: string;
  route: {
    pickupLocation: {
      latitude: number;
      longitude: number;
      address: string;
    };
    dropoffLocation: {
      latitude: number;
      longitude: number;
      address: string;
    };
  };
  createdAt: string;
}

export interface ImpactMetrics {
  totalMealsRescued: number;
  co2EmissionsSaved: number; // in kg
  volunteersRecognized: number;
  restaurantsParticipating: number;
  ngosParticipating: number;
}