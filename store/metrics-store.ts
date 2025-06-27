import { create } from 'zustand';
import { ImpactMetrics } from '@/types';
import { mockMetrics } from '@/mocks/metrics';
import { supabase } from '@/lib/supabase';

interface MetricsState {
  metrics: ImpactMetrics;
  isLoading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  updateMetrics: (updates: Partial<ImpactMetrics>) => Promise<void>;
  calculateRealTimeMetrics: () => Promise<ImpactMetrics>;
}

export const useMetricsStore = create<MetricsState>((set, get) => ({
  metrics: { ...mockMetrics },
  isLoading: false,
  error: null,
  
  fetchMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      // First try to calculate real-time metrics from actual data
      const realTimeMetrics = await get().calculateRealTimeMetrics();
      
      // Try to fetch stored metrics from Supabase
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.warn('Error fetching metrics from Supabase, using calculated metrics:', error.message);
        // Use real-time calculated metrics
        set({ metrics: realTimeMetrics, isLoading: false });
        return;
      }

      if (data) {
        const storedMetrics: ImpactMetrics = {
          totalMealsRescued: data.total_meals_rescued,
          co2EmissionsSaved: data.co2_emissions_saved,
          volunteersRecognized: data.volunteers_recognized,
          restaurantsParticipating: data.restaurants_participating,
          ngosParticipating: data.ngos_participating,
        };
        
        // Merge stored metrics with real-time calculations for most accurate data
        const mergedMetrics = {
          ...storedMetrics,
          totalMealsRescued: realTimeMetrics.totalMealsRescued, // Always use real-time for this
          co2EmissionsSaved: realTimeMetrics.co2EmissionsSaved, // Calculate based on meals
        };
        
        set({ metrics: mergedMetrics, isLoading: false });
      } else {
        // If no metrics in database, use real-time calculated metrics
        set({ metrics: realTimeMetrics, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch metrics", 
        isLoading: false,
        metrics: { ...mockMetrics } // Fall back to mock data
      });
    }
  },

  calculateRealTimeMetrics: async () => {
    try {
      // Calculate metrics from actual data
      let totalMealsRescued = 0;
      let restaurantsParticipating = 0;
      let ngosParticipating = 0;
      let volunteersRecognized = 0;

      // Get donations data
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('quantity, status');

      if (!donationsError && donations) {
        totalMealsRescued = donations
          .filter(d => d.status === 'completed')
          .reduce((sum, d) => sum + (d.quantity || 0), 0);
      }

      // Get user counts by role
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('role');

      if (!usersError && users) {
        restaurantsParticipating = users.filter(u => u.role === 'restaurant').length;
        ngosParticipating = users.filter(u => u.role === 'ngo').length;
        volunteersRecognized = users.filter(u => u.role === 'volunteer').length;
      }

      // Calculate CO2 savings (approximate: 1 meal = 2.5kg CO2 saved)
      const co2EmissionsSaved = Math.round(totalMealsRescued * 2.5);

      return {
        totalMealsRescued,
        co2EmissionsSaved,
        volunteersRecognized,
        restaurantsParticipating,
        ngosParticipating,
      };
    } catch (error) {
      console.error('Error calculating real-time metrics:', error);
      // Return mock data as fallback
      return { ...mockMetrics };
    }
  },
  
  updateMetrics: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      // Try to update metrics in Supabase
      const { data: existingData, error: fetchError } = await supabase
        .from('metrics')
        .select('id')
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.warn('Error fetching existing metrics:', fetchError.message);
      }

      let upsertError;
      if (existingData) {
        // Update existing metrics
        const { error } = await supabase
          .from('metrics')
          .update({
            total_meals_rescued: updates.totalMealsRescued,
            co2_emissions_saved: updates.co2EmissionsSaved,
            volunteers_recognized: updates.volunteersRecognized,
            restaurants_participating: updates.restaurantsParticipating,
            ngos_participating: updates.ngosParticipating,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id);
        upsertError = error;
      } else {
        // Insert new metrics
        const { error } = await supabase
          .from('metrics')
          .insert({
            total_meals_rescued: updates.totalMealsRescued || 0,
            co2_emissions_saved: updates.co2EmissionsSaved || 0,
            volunteers_recognized: updates.volunteersRecognized || 0,
            restaurants_participating: updates.restaurantsParticipating || 0,
            ngos_participating: updates.ngosParticipating || 0,
            updated_at: new Date().toISOString(),
          });
        upsertError = error;
      }

      if (upsertError) {
        console.warn('Error updating metrics in Supabase, updating local state:', upsertError.message);
      }

      // Update local state regardless of Supabase result
      set(state => ({
        metrics: { ...state.metrics, ...updates },
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to update metrics", isLoading: false });
      throw error;
    }
  },
}));