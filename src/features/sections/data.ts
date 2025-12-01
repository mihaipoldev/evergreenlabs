import { createClient } from "@/lib/supabase/server";
import type { Section, SectionWithPage } from "./types";
import type { Database } from "@/lib/supabase/types";

type Page = Database["public"]["Tables"]["pages"]["Row"];

/**
 * Get all sections with page information, ordered by position
 */
export async function getAllSections(): Promise<SectionWithPage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select(`
      *,
      pages (
        id,
        slug,
        title
      )
    `)
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Get a single section by id
 */
export async function getSectionById(id: string): Promise<Section | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
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

/**
 * Get all pages for dropdown selection
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
