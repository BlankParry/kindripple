import { z } from "zod";
import { publicProcedure } from "../../../trpc";
import { supabase } from "@/lib/supabase";
import { TRPCError } from "@trpc/server";

const listDonationsSchema = z.object({
  status: z.enum(['available', 'claimed', 'in-progress', 'completed', 'expired']).optional(),
  restaurantId: z.string().uuid().optional(),
  ngoId: z.string().uuid().optional(),
  isVegetarian: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(50),
}).optional();

export default publicProcedure
  .input(listDonationsSchema)
  .query(async ({ input }) => {
    let query = supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (input) {
      if (input.status) {
        query = query.eq('status', input.status);
      }
      
      if (input.restaurantId) {
        query = query.eq('restaurant_id', input.restaurantId);
      }
      
      if (input.ngoId) {
        query = query.eq('claimed_by', input.ngoId);
      }
      
      if (input.isVegetarian !== undefined) {
        query = query.eq('is_vegetarian', input.isVegetarian);
      }
      
      query = query.limit(input.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
    
    // Transform the data to match our app's format
    const donations = data.map(item => ({
      id: item.id,
      restaurantId: item.restaurant_id,
      restaurantName: item.restaurant_name,
      title: item.title,
      description: item.description,
      image: item.image,
      quantity: item.quantity,
      isVegetarian: item.is_vegetarian,
      expiryTime: item.expiry_time,
      pickupTime: item.pickup_time,
      status: item.status,
      claimedBy: item.claimed_by,
      assignedVolunteer: item.assigned_volunteer,
      location: {
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
      },
      createdAt: item.created_at,
    }));
    
    return { donations };
  });