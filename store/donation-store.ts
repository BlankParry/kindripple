import { create } from 'zustand';
import { FoodDonation } from '@/types';
import { mockDonations } from '@/mocks/donations';
import { supabase } from '@/lib/supabase';

interface DonationState {
  donations: FoodDonation[];
  isLoading: boolean;
  error: string | null;
  fetchDonations: () => Promise<void>;
  addDonation: (donation: Omit<FoodDonation, 'id' | 'createdAt'>) => Promise<FoodDonation>;
  updateDonation: (id: string, updates: Partial<FoodDonation>) => Promise<void>;
  claimDonation: (donationId: string, ngoId: string) => Promise<void>;
  assignVolunteer: (donationId: string, volunteerId: string) => Promise<void>;
  getDonationById: (id: string) => FoodDonation | undefined;
  getDonationsByRestaurant: (restaurantId: string) => FoodDonation[];
  getAvailableDonations: () => FoodDonation[];
  getClaimedDonations: (ngoId: string) => FoodDonation[];
}

// Helper function to map Supabase donation to our app FoodDonation type
const mapSupabaseDonation = (donation: any): FoodDonation => {
  return {
    id: donation.id,
    restaurantId: donation.restaurant_id,
    restaurantName: donation.restaurant_name,
    title: donation.title,
    description: donation.description,
    image: donation.image,
    quantity: donation.quantity,
    isVegetarian: donation.is_vegetarian,
    expiryTime: donation.expiry_time,
    pickupTime: donation.pickup_time,
    status: donation.status,
    claimedBy: donation.claimed_by,
    assignedVolunteer: donation.assigned_volunteer,
    location: {
      latitude: donation.latitude,
      longitude: donation.longitude,
      address: donation.address,
    },
    createdAt: donation.created_at,
  };
};

export const useDonationStore = create<DonationState>((set, get) => ({
  donations: [...mockDonations],
  isLoading: false,
  error: null,
  
  fetchDonations: async () => {
    set({ isLoading: true, error: null });
    try {
      // Try to fetch donations from Supabase
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching donations from Supabase, using mock data:', error.message);
        // Fall back to mock data
        set({ donations: [...mockDonations], isLoading: false });
        return;
      }

      if (data && data.length > 0) {
        const mappedDonations = data.map(mapSupabaseDonation);
        set({ donations: mappedDonations, isLoading: false });
      } else {
        // If no donations in database, use mock data
        set({ donations: [...mockDonations], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch donations", 
        isLoading: false,
        donations: [...mockDonations] // Fall back to mock data
      });
    }
  },
  
  addDonation: async (donation) => {
    set({ isLoading: true, error: null });
    try {
      // First verify that the restaurant exists
      const { data: restaurantExists, error: restaurantCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', donation.restaurantId)
        .eq('role', 'restaurant')
        .single();

      if (restaurantCheckError) {
        console.warn('Error checking restaurant existence:', restaurantCheckError.message);
        // If we can't verify, we'll still try to add the donation but log a warning
      } else if (!restaurantExists) {
        throw new Error(`Restaurant with ID ${donation.restaurantId} does not exist`);
      }

      // Try to add donation to Supabase
      const { data, error } = await supabase
        .from('donations')
        .insert({
          restaurant_id: donation.restaurantId,
          restaurant_name: donation.restaurantName,
          title: donation.title,
          description: donation.description,
          image: donation.image,
          quantity: donation.quantity,
          is_vegetarian: donation.isVegetarian,
          expiry_time: donation.expiryTime,
          pickup_time: donation.pickupTime,
          status: donation.status,
          claimed_by: donation.claimedBy,
          assigned_volunteer: donation.assignedVolunteer,
          latitude: donation.location.latitude,
          longitude: donation.location.longitude,
          address: donation.location.address,
        })
        .select()
        .single();

      if (error) {
        console.warn('Error adding donation to Supabase, using local state:', error.message);
        // Fall back to local state
        const newDonation: FoodDonation = {
          ...donation,
          id: `donation-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({
          donations: [newDonation, ...state.donations],
          isLoading: false
        }));
        
        return newDonation;
      }

      const newDonation = mapSupabaseDonation(data);
      set(state => ({
        donations: [newDonation, ...state.donations],
        isLoading: false
      }));
      
      return newDonation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add donation";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  updateDonation: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Try to update donation in Supabase
      const { error } = await supabase
        .from('donations')
        .update({
          title: updates.title,
          description: updates.description,
          image: updates.image,
          quantity: updates.quantity,
          is_vegetarian: updates.isVegetarian,
          expiry_time: updates.expiryTime,
          pickup_time: updates.pickupTime,
          status: updates.status,
          claimed_by: updates.claimedBy,
          assigned_volunteer: updates.assignedVolunteer,
          ...(updates.location && {
            latitude: updates.location.latitude,
            longitude: updates.location.longitude,
            address: updates.location.address,
          }),
        })
        .eq('id', id);

      if (error) {
        console.warn('Error updating donation in Supabase, updating local state:', error.message);
      }

      // Update local state regardless of Supabase result
      set(state => ({
        donations: state.donations.map(donation => 
          donation.id === id ? { ...donation, ...updates } : donation
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to update donation", isLoading: false });
      throw error;
    }
  },
  
  claimDonation: async (donationId, ngoId) => {
    set({ isLoading: true, error: null });
    try {
      // Verify NGO exists
      const { data: ngoExists, error: ngoCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', ngoId)
        .eq('role', 'ngo')
        .single();

      if (ngoCheckError) {
        console.warn('Error checking NGO existence:', ngoCheckError.message);
      } else if (!ngoExists) {
        throw new Error(`NGO with ID ${ngoId} does not exist`);
      }

      // Try to update donation in Supabase
      const { error } = await supabase
        .from('donations')
        .update({
          status: 'claimed',
          claimed_by: ngoId
        })
        .eq('id', donationId);

      if (error) {
        console.warn('Error claiming donation in Supabase, updating local state:', error.message);
      }

      // Update local state regardless of Supabase result
      set(state => ({
        donations: state.donations.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: 'claimed', claimedBy: ngoId } 
            : donation
        ),
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to claim donation";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  assignVolunteer: async (donationId, volunteerId) => {
    set({ isLoading: true, error: null });
    try {
      // Verify volunteer exists
      const { data: volunteerExists, error: volunteerCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', volunteerId)
        .eq('role', 'volunteer')
        .single();

      if (volunteerCheckError) {
        console.warn('Error checking volunteer existence:', volunteerCheckError.message);
      } else if (!volunteerExists) {
        throw new Error(`Volunteer with ID ${volunteerId} does not exist`);
      }

      // Try to update donation in Supabase
      const { error } = await supabase
        .from('donations')
        .update({
          status: 'in-progress',
          assigned_volunteer: volunteerId
        })
        .eq('id', donationId);

      if (error) {
        console.warn('Error assigning volunteer in Supabase, updating local state:', error.message);
      }

      // Update local state regardless of Supabase result
      set(state => ({
        donations: state.donations.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: 'in-progress', assignedVolunteer: volunteerId } 
            : donation
        ),
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to assign volunteer";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  getDonationById: (id) => {
    return get().donations.find(donation => donation.id === id);
  },
  
  getDonationsByRestaurant: (restaurantId) => {
    return get().donations.filter(donation => donation.restaurantId === restaurantId);
  },
  
  getAvailableDonations: () => {
    return get().donations.filter(donation => donation.status === 'available');
  },
  
  getClaimedDonations: (ngoId) => {
    return get().donations.filter(
      donation => donation.claimedBy === ngoId && 
      ['claimed', 'in-progress'].includes(donation.status)
    );
  },
}));