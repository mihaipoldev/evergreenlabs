import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { parseFontFamily, generateFontCSS } from "@/lib/font-utils";

export async function AdminFontStyle() {
  // First, check cookie for instant access (no DB query needed)
  let cookieFonts: { value: string } | undefined;
  try {
    const cookieStore = await cookies();
    cookieFonts = cookieStore.get("font-family-json");
  } catch {
    // Silently ignore cookie errors - fall back to database
  }

  if (cookieFonts?.value) {
    try {
      const fonts = parseFontFamily(cookieFonts.value);
      const css = generateFontCSS(fonts);
      return (
        <style
          id="font-family-inline-server"
          dangerouslySetInnerHTML={{
            __html: css,
          }}
        />
      );
    } catch {
      // Invalid cookie format - fall back to database
    }
  }

  // Fallback to database if no cookie
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    // Silently fail - return null to prevent errors
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get settings and theme
  const { data: settings } = await (supabase
    .from("user_settings") as any)
    .select("active_theme_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!settings?.active_theme_id) {
    return null;
  }

  // Get theme with font_family
  const { data: theme } = await (supabase
    .from("user_themes") as any)
    .select("font_family")
    .eq("id", settings.active_theme_id)
    .single();

  if (!theme?.font_family) {
    return null;
  }

  const fonts = parseFontFamily(theme.font_family);
  const css = generateFontCSS(fonts);

  return (
    <style
      id="font-family-inline-server"
      dangerouslySetInnerHTML={{
        __html: css,
      }}
    />
  );
}

