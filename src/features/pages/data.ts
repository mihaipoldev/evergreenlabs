import { createClient } from "@/lib/supabase/server";
import type { Page } from "./types";

/**
 * Get all pages, ordered by creation date
 */
export async function getAllPages(): Promise<Page[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Get a single page by id
 */
export async function getPageById(id: string): Promise<Page | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw error;
  }

  return data;
}
