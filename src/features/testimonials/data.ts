import { createClient } from "@/lib/supabase/server";
import type { Testimonial, TestimonialWithSection } from "./types";
import type { Database } from "@/lib/supabase/types";

type Section = Database["public"]["Tables"]["sections"]["Row"];

/**
 * Get all testimonials with section information, ordered by position
 */
export async function getAllTestimonials(): Promise<TestimonialWithSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
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
 * Get a single testimonial by id
 */
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
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
