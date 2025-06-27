import { z } from "zod";
import { publicProcedure } from "../../../trpc";
import { supabase } from "@/lib/supabase";
import { TRPCError } from "@trpc/server";

const getDonationSchema = z.object({
  id: z.string().uuid()
});

export default publicProcedure
  .input(getDonationSchema)
  .query(async ({ input }) => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', input.id)
      .single();
    
    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
    
    if (!data) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Donation not found',
      });
    }
    
    // Transform the data to match our app's format
    const donation = {
      id: data.id,
      restaurantId: data.restaurant_id,
      restaurantName: data.restaurant_name,
      title: data.title,
      description: data.description,
      image: data.image,
      quantity: data.quantity,
      isVegetarian: data.is_vegetarian,
      expiryTime: data.expiry_time,
      pickupTime: data.pickup_time,
      status: data.status,
      claimedBy: data.claimed_by,
      assignedVolunteer: data.assigned_volunteer,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
      },
      createdAt: data.created_at,
    };
    
    return { donation };
  });