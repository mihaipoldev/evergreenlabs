import type { FontConfig } from "@/types/fonts";
import { DEFAULT_FONT_CONFIG } from "@/types/fonts";
import { getFontVariable as getFontVariableLightweight } from "./font-variables";

/**
 * Parse font_family JSON string from database
 */
export function parseFontFamily(fontFamilyJson: string | null | undefined): FontConfig {
  if (!fontFamilyJson) {
    return DEFAULT_FONT_CONFIG;
  }

  try {
    const parsed = JSON.parse(fontFamilyJson);
    
    // Validate structure
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.admin === "object" &&
      typeof parsed.admin?.heading === "string" &&
      typeof parsed.admin?.body === "string"
    ) {
      return parsed as FontConfig;
    }
  } catch (error) {
    console.error("Error parsing font_family JSON:", error);
  }

  return DEFAULT_FONT_CONFIG;
}

/**
 * Serialize FontConfig to JSON string for database storage
 */
export function serializeFontFamily(fonts: FontConfig): string {
  return JSON.stringify(fonts);
}

/**
 * Get default font configuration
 */
export function getDefaultFontFamily(): FontConfig {
  return DEFAULT_FONT_CONFIG;
}

/**
 * Generate complete CSS for admin fonts
 */
export function generateFontCSS(fonts: FontConfig): string {
  const headingVar = getFontVariableLightweight(fonts.admin.heading);
  const bodyVar = getFontVariableLightweight(fonts.admin.body);

  return `:root{--font-family-admin-heading:var(${headingVar});--font-family-admin-body:var(${bodyVar});}html.preset-admin body,html.preset-admin body *,.preset-admin body,.preset-admin body *{font-family:var(${bodyVar}),system-ui,sans-serif!important;}html.preset-admin body h1,html.preset-admin body h2,html.preset-admin body h3,html.preset-admin body h4,html.preset-admin body h5,html.preset-admin body h6,.preset-admin h1,.preset-admin h2,.preset-admin h3,.preset-admin h4,.preset-admin h5,.preset-admin h6{font-family:var(${headingVar}),system-ui,sans-serif!important;}`;
}

