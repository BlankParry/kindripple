import { publicProcedure } from "../../../trpc";
import { supabase } from "@/lib/supabase";
import { TRPCError } from "@trpc/server";

export default publicProcedure
  .query(async () => {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
    
    if (!data.user) {
      return { user: null };
    }
    
    // Get user profile from the users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: profileError.message,
      });
    }
    
    return {
      user: data.user,
      profile,
    };
  });