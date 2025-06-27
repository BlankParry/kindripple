import { create } from 'zustand';
import { FoodDonation } from '@/types';
import { mockDonations } from '@/mocks/donations';
import { supabase } from '@/lib/supabase';
import { NotificationHelpers } from '@/lib/notifications';
import { useNotificationStore } from './notification-store';

interface DonationState {
  donations: FoodDonation[];
  userNames: Record<string, string>; // Cache for user names
  isLoading: boolean;
  error: string | null;
  fetchDonations: () => Promise<void>;
  fetchUserNames: (userIds: string[]) => Promise<void>;
  addDonation: (donation: Omit<FoodDonation, 'id' | 'createdAt'>) => Promise<FoodDonation>;
  updateDonation: (id: string, updates: Partial<FoodDonation>) => Promise<void>;
  claimDonation: (donationId: string, ngoId: string) => Promise<void>;
  assignVolunteer: (donationId: string, volunteerId: string) => Promise<void>;
  getDonationById: (id: string) => FoodDonation | undefined;
  getDonationsByRestaurant: (restaurantId: string) => FoodDonation[];
  getAvailableDonations: () => FoodDonation[];
  getClaimedDonations: (ngoId: string) => FoodDonation[];
  getUserName: (userId: string) => string;
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
  userNames: {},
  isLoading: false,
  error: null,
  
  fetchUserNames: async (userIds: string[]) => {
    const { userNames } = get();
    const missingIds = userIds.filter(id => id && !userNames[id]);
    
    if (missingIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .in('id', missingIds);

      if (error) {
        console.warn('Error fetching user names:', error.message);
        return;
      }

      if (data) {
        const newNames: Record<string, string> = {};
        data.forEach(user => {
          if (user.name) {
            newNames[user.id] = user.name;
          }
        });
        
        set(state => ({
          userNames: { ...state.userNames, ...newNames }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user names:', error);
    }
  },
  
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
        
        // Fetch names for mock data
        const userIds = mockDonations.flatMap(d => [d.restaurantId, d.claimedBy, d.assignedVolunteer]).filter(Boolean);
        get().fetchUserNames(userIds);
        return;
      }

      if (data && data.length > 0) {
        const mappedDonations = data.map(mapSupabaseDonation);
        set({ donations: mappedDonations, isLoading: false });
        
        // Fetch user names for all related users
        const userIds = mappedDonations.flatMap(d => [d.restaurantId, d.claimedBy, d.assignedVolunteer]).filter(Boolean);
        get().fetchUserNames(userIds);
      } else {
        // If no donations in database, use mock data
        set({ donations: [...mockDonations], isLoading: false });
        
        // Fetch names for mock data
        const userIds = mockDonations.flatMap(d => [d.restaurantId, d.claimedBy, d.assignedVolunteer]).filter(Boolean);
        get().fetchUserNames(userIds);
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch donations", 
        isLoading: false,
        donations: [...mockDonations] // Fall back to mock data
      });
      
      // Fetch names for mock data
      const userIds = mockDonations.flatMap(d => [d.restaurantId, d.claimedBy, d.assignedVolunteer]).filter(Boolean);
      get().fetchUserNames(userIds);
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
        
        // Fetch user names
        get().fetchUserNames([donation.restaurantId]);
        
        // Send notification to NGOs about new food listing
        await NotificationHelpers.notifyNGOsAboutFoodListing(
          donation.restaurantName,
          donation.quantity,
          newDonation.id
        );

        // Add in-app notification
        useNotificationStore.getState().addInAppNotification({
          title: "Donation Created! 🍽️",
          message: `Your donation "${donation.title}" has been listed and NGOs have been notified.`,
          type: 'success',
          data: { donationId: newDonation.id },
        });
        
        return newDonation;
      }

      const newDonation = mapSupabaseDonation(data);
      set(state => ({
        donations: [newDonation, ...state.donations],
        isLoading: false
      }));
      
      // Fetch user names
      get().fetchUserNames([newDonation.restaurantId]);
      
      // Send notification to NGOs about new food listing
      await NotificationHelpers.notifyNGOsAboutFoodListing(
        newDonation.restaurantName,
        newDonation.quantity,
        newDonation.id
      );

      // Add in-app notification
      useNotificationStore.getState().addInAppNotification({
        title: "Donation Created! 🍽️",
        message: `Your donation "${newDonation.title}" has been listed and NGOs have been notified.`,
        type: 'success',
        data: { donationId: newDonation.id },
      });
      
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
      
      // Fetch user names for any new user IDs
      const userIds = [updates.claimedBy, updates.assignedVolunteer].filter(Boolean);
      if (userIds.length > 0) {
        get().fetchUserNames(userIds);
      }

      // Send notifications for status changes
      if (updates.status) {
        const donation = get().donations.find(d => d.id === id);
        if (donation) {
          if (updates.status === 'collected' || updates.status === 'delivered' || updates.status === 'completed') {
            await NotificationHelpers.notifyDeliveryStatusChange(
              updates.status,
              id,
              true // For restaurant
            );
          }
        }
      }
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
      
      // Fetch NGO name
      get().fetchUserNames([ngoId]);

      // Add in-app notification for NGO
      const donation = get().donations.find(d => d.id === donationId);
      if (donation) {
        useNotificationStore.getState().addInAppNotification({
          title: "Donation Claimed! 📦",
          message: `You have successfully claimed "${donation.title}" from ${donation.restaurantName}.`,
          type: 'success',
          data: { donationId },
        });
      }
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
        .select('id, name')
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
      
      // Fetch volunteer name
      get().fetchUserNames([volunteerId]);

      // Send notifications about volunteer assignment
      const donation = get().donations.find(d => d.id === donationId);
      if (donation && volunteerExists) {
        // Notify NGO
        await NotificationHelpers.notifyVolunteerAssignment(
          volunteerExists.name,
          donation.restaurantName,
          donationId,
          true // For NGO
        );

        // Notify Volunteer
        await NotificationHelpers.notifyVolunteerAssignment(
          volunteerExists.name,
          donation.restaurantName,
          donationId,
          false // For Volunteer
        );

        // Add in-app notifications
        useNotificationStore.getState().addInAppNotification({
          title: "Volunteer Assigned! 👥",
          message: `${volunteerExists.name} has been assigned to handle the pickup from ${donation.restaurantName}.`,
          type: 'info',
          data: { donationId },
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to assign volunteer";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  getUserName: (userId: string) => {
    const { userNames } = get();
    return userNames[userId] || `User #${userId.slice(-4)}`;
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