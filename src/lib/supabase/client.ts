import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let supabaseBrowserClient: SupabaseClient | null = null;

/**
 * Returns a singleton browser client for Supabase.
 * Prepares the application for Phase 3/5 data and authentication integration.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (supabaseBrowserClient) {
    return supabaseBrowserClient;
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
      console.info(
        "ℹ️ [Supabase Client] Supabase URL or Anon Key not configured in environment. Database features will operate in local mock mode until configured."
      );
    }
    return null;
  }

  supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseBrowserClient;
}
