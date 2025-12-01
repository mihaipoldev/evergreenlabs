import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
  let cookieStore;
  try {
    cookieStore = await cookies();
  } catch {
    // If cookies() fails (e.g., due to malformed cookies), 
    // create a client without cookie support as a fallback.
    // This silently handles malformed cookies without logging
    // Create a minimal client without cookie support
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {
            // No-op when cookies can't be accessed
          },
        },
      }
    );
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll();
          } catch (error) {
            // If getAll() fails, return empty array
            console.warn("Failed to get cookies:", error);
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

