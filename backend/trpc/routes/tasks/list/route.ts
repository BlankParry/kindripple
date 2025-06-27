import { z } from "zod";
import { publicProcedure } from "../../../trpc";
import { supabase } from "@/lib/supabase";
import { TRPCError } from "@trpc/server";

const listTasksSchema = z.object({
  status: z.enum(['assigned', 'in-progress', 'completed', 'cancelled']).optional(),
  volunteerId: z.string().uuid().optional(),
  ngoId: z.string().uuid().optional(),
  restaurantId: z.string().uuid().optional(),
  limit: z.number().min(1).max(100).default(50),
}).optional();

export default publicProcedure
  .input(listTasksSchema)
  .query(async ({ input }) => {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (input) {
      if (input.status) {
        query = query.eq('status', input.status);
      }
      
      if (input.volunteerId) {
        query = query.eq('volunteer_id', input.volunteerId);
      }
      
      if (input.ngoId) {
        query = query.eq('ngo_id', input.ngoId);
      }
      
      if (input.restaurantId) {
        query = query.eq('restaurant_id', input.restaurantId);
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
    const tasks = data.map(item => ({
      id: item.id,
      donationId: item.donation_id,
      volunteerId: item.volunteer_id,
      ngoId: item.ngo_id,
      restaurantId: item.restaurant_id,
      status: item.status,
      pickupTime: item.pickup_time,
      deliveryTime: item.delivery_time,
      route: {
        pickupLocation: {
          latitude: item.pickup_latitude,
          longitude: item.pickup_longitude,
          address: item.pickup_address,
        },
        dropoffLocation: {
          latitude: item.dropoff_latitude,
          longitude: item.dropoff_longitude,
          address: item.dropoff_address,
        },
      },
      createdAt: item.created_at,
    }));
    
    return { tasks };
  });