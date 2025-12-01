// Client-side Supabase client (for React components)
export { createClient } from "./client";

// Server-side Supabase client (for API routes and server components)
export { createClient as createServerClient } from "./server";

// Middleware helper
export { updateSession } from "./middleware";

// Types
export type { Database } from "./types";

