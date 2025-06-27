import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes with more permissive settings
app.use("*", cors({
  origin: true, // Allow all origins in development
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

// Add error handling middleware
app.use("*", async (c, next) => {
  try {
    await next();
  } catch (error) {
    console.error('API Error:', error);
    return c.json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
    onError: ({ error, path, input }) => {
      console.error('tRPC Error:', {
        path,
        input,
        error: error.message,
        stack: error.stack,
      });
    },
  })
);

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ 
    status: "ok", 
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});

// Add a test endpoint to verify API is working
app.get("/test", (c) => {
  return c.json({ 
    message: "Test endpoint working",
    timestamp: new Date().toISOString()
  });
});

export default app;