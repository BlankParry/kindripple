import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/supabase';

const supabaseUrl = 'https://dnqaxuczmnvbidnqqxkf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucWF4dWN6bW52YmlkbnFxeGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDMxOTIsImV4cCI6MjA2NjU3OTE5Mn0.NzokHi1iz6EVLQ5hpyeUBVA5cD-d8LUxWoHiw0hnKEU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to upload image to Supabase Storage
export const uploadImage = async (imageUri: string, bucket: string = 'images'): Promise<string> => {
  try {
    // Convert image to blob for upload
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const fileExt = imageUri.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `donations/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Helper function to delete image from Supabase Storage
export const deleteImage = async (imageUrl: string, bucket: string = 'images'): Promise<void> => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `donations/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};