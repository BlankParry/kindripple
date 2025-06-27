import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const authHeader = opts.req.headers.get('authorization');
  
  return {
    req: opts.req,
    user: authHeader ? { token: authHeader } : null,
    // You can add more context items here like database connections, auth, etc.
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;