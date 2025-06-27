import { protectedProcedure } from "../../../trpc";
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { TRPCError } from '@trpc/server';

const createDonationSchema = z.object({
  restaurantId: z.string().uuid(),
  restaurantName: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().url(),
  quantity: z.number().int().positive(),
  isVegetarian: z.boolean(),
  expiryTime: z.string().datetime(),
  pickupTime: z.string().datetime(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
});

export default protectedProcedure
  .input(createDonationSchema)
  .mutation(async ({ input, ctx }) => {
    // First verify that the restaurant exists
    const { data: restaurantExists, error: restaurantCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', input.restaurantId)
      .eq('role', 'restaurant')
      .single();

    if (restaurantCheckError || !restaurantExists) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Restaurant with ID ${input.restaurantId} does not exist`,
      });
    }

    // Then create the donation
    const { data, error } = await supabase
      .from('donations')
      .insert({
        restaurant_id: input.restaurantId,
        restaurant_name: input.restaurantName,
        title: input.title,
        description: input.description,
        image: input.image,
        quantity: input.quantity,
        is_vegetarian: input.isVegetarian,
        expiry_time: input.expiryTime,
        pickup_time: input.pickupTime,
        status: 'available',
        latitude: input.latitude,
        longitude: input.longitude,
        address: input.address,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating donation:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to create donation: ${error.message}`,
      });
    }

    return data;
  });