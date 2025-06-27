import { publicProcedure } from "../../../trpc";
import { supabase } from "@/lib/supabase";
import { TRPCError } from "@trpc/server";

export default publicProcedure
  .query(async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
    
    return {
      session: data.session,
    };
  });