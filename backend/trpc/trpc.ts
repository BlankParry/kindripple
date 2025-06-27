import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './create-context';
import superjson from 'superjson';

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.code === 'BAD_REQUEST' && error.cause ? error.cause : null,
      },
    };
  },
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware for logging
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  
  console.log(`tRPC ${type} ${path} - ${durationMs}ms`);
  
  return result;
});

// Apply logger to all procedures
export const loggedProcedure = publicProcedure.use(loggerMiddleware);

// Protected procedure - can be used when authentication is required
export const protectedProcedure = loggedProcedure.use(({ ctx, next }) => {
  // Check if user is authenticated
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Ensure user is available in context
    },
  });
});