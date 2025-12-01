import { createClient } from "@/lib/supabase/server";
import type { FAQItem, FAQItemWithSection } from "./types";
import type { Database } from "@/lib/supabase/types";

type Section = Database["public"]["Tables"]["sections"]["Row"];

/**
 * Get all FAQ items with section information, ordered by position
 */
export async function getAllFAQItems(): Promise<FAQItemWithSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select(`
      *,
      sections (
        id,
        title,
        type
      )
    `)
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Get a single FAQ item by id
 */
export async function getFAQItemById(id: string): Promise<FAQItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_items")
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
 * Get all sections for dropdown selection
 */
export async function getAllSections(): Promise<Section[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}
