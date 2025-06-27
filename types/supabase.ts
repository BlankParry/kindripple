export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'restaurant' | 'ngo' | 'volunteer' | 'admin'
          avatar?: string
          phone?: string
          address?: string
          created_at: string
          description?: string
          cuisine_type?: string
          opening_hours?: string
          ngo_id?: string
          completed_deliveries?: number
          badges?: string[]
          is_available?: boolean
        }
        Insert: {
          id: string
          name: string
          email: string
          role: 'restaurant' | 'ngo' | 'volunteer' | 'admin'
          avatar?: string
          phone?: string
          address?: string
          created_at?: string
          description?: string
          cuisine_type?: string
          opening_hours?: string
          ngo_id?: string
          completed_deliveries?: number
          badges?: string[]
          is_available?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'restaurant' | 'ngo' | 'volunteer' | 'admin'
          avatar?: string
          phone?: string
          address?: string
          created_at?: string
          description?: string
          cuisine_type?: string
          opening_hours?: string
          ngo_id?: string
          completed_deliveries?: number
          badges?: string[]
          is_available?: boolean
        }
      }
      donations: {
        Row: {
          id: string
          restaurant_id: string
          restaurant_name: string
          title: string
          description: string
          image: string
          quantity: number
          is_vegetarian: boolean
          expiry_time: string
          pickup_time: string
          status: 'available' | 'claimed' | 'in-progress' | 'completed' | 'expired'
          claimed_by?: string
          assigned_volunteer?: string
          latitude: number
          longitude: number
          address: string
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          restaurant_name: string
          title: string
          description: string
          image: string
          quantity: number
          is_vegetarian: boolean
          expiry_time: string
          pickup_time: string
          status: 'available' | 'claimed' | 'in-progress' | 'completed' | 'expired'
          claimed_by?: string
          assigned_volunteer?: string
          latitude: number
          longitude: number
          address: string
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          restaurant_name?: string
          title?: string
          description?: string
          image?: string
          quantity?: number
          is_vegetarian?: boolean
          expiry_time?: string
          pickup_time?: string
          status?: 'available' | 'claimed' | 'in-progress' | 'completed' | 'expired'
          claimed_by?: string
          assigned_volunteer?: string
          latitude?: number
          longitude?: number
          address?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          donation_id: string
          volunteer_id: string
          ngo_id: string
          restaurant_id: string
          status: 'assigned' | 'in-progress' | 'completed' | 'cancelled'
          pickup_time: string
          delivery_time?: string
          pickup_latitude: number
          pickup_longitude: number
          pickup_address: string
          dropoff_latitude: number
          dropoff_longitude: number
          dropoff_address: string
          created_at: string
        }
        Insert: {
          id?: string
          donation_id: string
          volunteer_id: string
          ngo_id: string
          restaurant_id: string
          status: 'assigned' | 'in-progress' | 'completed' | 'cancelled'
          pickup_time: string
          delivery_time?: string
          pickup_latitude: number
          pickup_longitude: number
          pickup_address: string
          dropoff_latitude: number
          dropoff_longitude: number
          dropoff_address: string
          created_at?: string
        }
        Update: {
          id?: string
          donation_id?: string
          volunteer_id?: string
          ngo_id?: string
          restaurant_id?: string
          status?: 'assigned' | 'in-progress' | 'completed' | 'cancelled'
          pickup_time?: string
          delivery_time?: string
          pickup_latitude?: number
          pickup_longitude?: number
          pickup_address?: string
          dropoff_latitude?: number
          dropoff_longitude?: number
          dropoff_address?: string
          created_at?: string
        }
      }
      metrics: {
        Row: {
          id: string
          total_meals_rescued: number
          co2_emissions_saved: number
          volunteers_recognized: number
          restaurants_participating: number
          ngos_participating: number
          updated_at: string
        }
        Insert: {
          id?: string
          total_meals_rescued: number
          co2_emissions_saved: number
          volunteers_recognized: number
          restaurants_participating: number
          ngos_participating: number
          updated_at?: string
        }
        Update: {
          id?: string
          total_meals_rescued?: number
          co2_emissions_saved?: number
          volunteers_recognized?: number
          restaurants_participating?: number
          ngos_participating?: number
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}