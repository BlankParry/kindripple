import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, Restaurant, NGO, Volunteer } from '@/types';
import { supabase } from '@/lib/supabase';
import { mockRestaurants, mockNGOs, mockVolunteers, mockAdmins } from '@/mocks/users';

// Create a union type that includes all possible user properties
type UserUpdateData = Partial<User> & Partial<Restaurant> & Partial<NGO> & Partial<Volunteer>;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  updateUser: (userData: UserUpdateData) => Promise<void>;
}

// Helper function to convert Supabase user to our app User type
const mapSupabaseUser = async (supabaseUser: any): Promise<User | null> => {
  if (!supabaseUser) return null;

  try {
    // Get user profile from the users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) {
      // If no profile exists yet, return basic user
      return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || '',
        email: supabaseUser.email || '',
        role: (supabaseUser.user_metadata?.role as UserRole) || 'volunteer',
        createdAt: supabaseUser.created_at,
      };
    }

    // Map database fields to our User type
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar,
      phone: data.phone,
      address: data.address,
      createdAt: data.created_at,
      ...(data.role === 'restaurant' && {
        description: data.description,
        cuisineType: data.cuisine_type,
        openingHours: data.opening_hours,
      }),
      ...(data.role === 'ngo' && {
        description: data.description,
      }),
      ...(data.role === 'volunteer' && {
        ngoId: data.ngo_id,
        completedDeliveries: data.completed_deliveries || 0,
        badges: data.badges || [],
        isAvailable: data.is_available || false,
      }),
    };
  } catch (error) {
    console.error('Error mapping user:', error);
    return null;
  }
};

// For demo purposes, we'll still use mock auth if Supabase fails
const mockAuth = async (email: string, password: string): Promise<User | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check all user types
  const allUsers = [...mockRestaurants, ...mockNGOs, ...mockVolunteers, ...mockAdmins];
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // In a real app, we would verify the password here
  if (user && password.length >= 6) {
    return user;
  }
  
  return null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Try to sign in with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.warn('Supabase auth error, falling back to mock auth:', error.message);
            // Fall back to mock auth for demo purposes
            const mockUser = await mockAuth(email, password);
            if (mockUser) {
              set({ user: mockUser, isAuthenticated: true, isLoading: false });
              return;
            } else {
              throw new Error('Invalid email or password');
            }
          }

          if (data.user) {
            const user = await mapSupabaseUser(data.user);
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error('No user returned from authentication');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred during login", 
            isLoading: false 
          });
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await supabase.auth.signOut();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          console.error('Error during logout:', error);
          // Even if there's an error, we'll still clear the local state
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
      
      register: async (userData: Partial<User>, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Register with Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email: userData.email || '',
            password,
            options: {
              data: {
                name: userData.name,
                role: userData.role,
              },
            },
          });

          if (error) {
            console.warn('Supabase registration error, using mock registration:', error.message);
            // Fall back to mock registration for demo
            const newUser: User = {
              id: `new-${Date.now()}`,
              name: userData.name || "",
              email: userData.email || "",
              role: userData.role || "volunteer",
              createdAt: new Date().toISOString(),
            };
            
            set({ user: newUser, isAuthenticated: true, isLoading: false });
            return;
          }

          if (data.user) {
            // Create a profile in the users table
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                name: userData.name || '',
                email: userData.email || '',
                role: userData.role || 'volunteer',
                created_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error('Error creating user profile:', profileError);
            }

            const user = await mapSupabaseUser(data.user);
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error('No user returned from registration');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred during registration", 
            isLoading: false 
          });
        }
      },
      
      updateUser: async (userData: UserUpdateData) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error("No user is logged in");
          }
          
          // Update user profile in Supabase
          const { error } = await supabase
            .from('users')
            .update({
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              address: userData.address,
              avatar: userData.avatar,
              ...(currentUser.role === 'restaurant' && {
                description: userData.description,
                cuisine_type: userData.cuisineType,
                opening_hours: userData.openingHours,
              }),
              ...(currentUser.role === 'ngo' && {
                description: userData.description,
              }),
              ...(currentUser.role === 'volunteer' && {
                ngo_id: userData.ngoId,
                is_available: userData.isAvailable,
              }),
            })
            .eq('id', currentUser.id);

          if (error) {
            console.warn('Error updating user profile, using local update:', error.message);
            // Fall back to local update for demo
            const updatedUser = { ...currentUser, ...userData };
            set({ user: updatedUser, isLoading: false });
            return;
          }

          // Get the updated user
          const { data: updatedUserData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          if (fetchError || !updatedUserData) {
            console.error('Error fetching updated user:', fetchError);
            // Fall back to local update
            const updatedUser = { ...currentUser, ...userData };
            set({ user: updatedUser, isLoading: false });
            return;
          }

          // Map the database user to our User type
          const updatedUser: User = {
            id: updatedUserData.id,
            name: updatedUserData.name,
            email: updatedUserData.email,
            role: updatedUserData.role,
            avatar: updatedUserData.avatar,
            phone: updatedUserData.phone,
            address: updatedUserData.address,
            createdAt: updatedUserData.created_at,
            ...(updatedUserData.role === 'restaurant' && {
              description: updatedUserData.description,
              cuisineType: updatedUserData.cuisine_type,
              openingHours: updatedUserData.opening_hours,
            }),
            ...(updatedUserData.role === 'ngo' && {
              description: updatedUserData.description,
            }),
            ...(updatedUserData.role === 'volunteer' && {
              ngoId: updatedUserData.ngo_id,
              completedDeliveries: updatedUserData.completed_deliveries || 0,
              badges: updatedUserData.badges || [],
              isAvailable: updatedUserData.is_available || false,
            }),
          };

          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred while updating user data", 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);