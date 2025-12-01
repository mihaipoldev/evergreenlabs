import { createClient } from "@/lib/supabase/server";
import type { OfferFeature } from "./types";
import type { Database } from "@/lib/supabase/types";

type Section = Database["public"]["Tables"]["sections"]["Row"];

/**
 * Get all offer features, ordered by position
 */
export async function getAllOfferFeatures(): Promise<OfferFeature[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("offer_features")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Get a single offer feature by id
 */
export async function getOfferFeatureById(id: string): Promise<OfferFeature | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("offer_features")
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
