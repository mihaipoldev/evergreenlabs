import { createClient } from "./server";
import type { Database } from "./types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Get a page by its slug
 */
export async function getPageBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get all sections for a page, ordered by position
 */
export async function getSectionsByPageId(pageId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", pageId)
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get section children by type (cta_buttons, offer_features, testimonials, faq_items)
 */
export async function getSectionChildren(
  sectionId: string,
  type: "cta_buttons" | "offer_features" | "testimonials" | "faq_items"
) {
  const supabase = await createClient();
  const tableName = type as keyof Database["public"]["Tables"];

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("section_id", sectionId)
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Reorder items in a table by updating their positions
 * @param table - Table name
 * @param items - Array of { id, position } objects
 */
export async function reorderItems(
  table: "sections" | "cta_buttons" | "offer_features" | "testimonials" | "faq_items",
  items: Array<{ id: string; position: number }>
) {
  const supabase = await createClient();
  const tableName = table as keyof Database["public"]["Tables"];

  const updates = items.map((item) =>
    (supabase
      .from(tableName) as any)
      .update({ position: item.position })
      .eq("id", item.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((result) => result.error);

  if (errors.length > 0) {
    throw errors[0].error;
  }

  return results;
}

/**
 * Get all visible sections for a page (public-facing)
 */
export async function getVisibleSectionsByPageId(pageId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", pageId)
    .eq("visible", true)
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get approved testimonials for a section (public-facing)
 */
export async function getApprovedTestimonialsBySectionId(sectionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("section_id", sectionId)
    .eq("approved", true)
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}
