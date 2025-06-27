import { z } from "zod";
import { publicProcedure } from "../../../trpc";

const hiSchema = z.object({ 
  name: z.string() 
});

export default publicProcedure
  .input(hiSchema)
  .query(({ input }) => {
    return {
      hello: input.name,
      date: new Date(),
    };
  });