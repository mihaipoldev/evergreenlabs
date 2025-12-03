import Script from "next/script";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function AdminColorStyle() {
  // First, check cookie for instant access (no DB query needed)
  // Silently handle any cookie reading errors
  let cookieColor: { value: string } | undefined;
  try {
    const cookieStore = await cookies();
    cookieColor = cookieStore.get("primary-color-hsl");
  } catch {
    // Silently ignore cookie errors - fall back to database
  }
  
  if (cookieColor?.value) {
    // Validate cookie value format (should be "H S% L%" format)
    const isValidFormat = /^\d+\s+\d+%\s+\d+%$/.test(cookieColor.value);
    if (isValidFormat) {
      // Use cookie value immediately - fastest option (no DB query!)
      const primaryValue = cookieColor.value;
      // Parse HSL values from cookie
      const hslMatch = primaryValue.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
      if (hslMatch) {
        const [, h, s, l] = hslMatch;
        // Return ONLY the style tag (no script needed, middleware handles persistence)
        // This is the fastest path - style tag renders immediately
        return (
          <style
            id="primary-color-inline-server"
            dangerouslySetInnerHTML={{
              __html: `:root,:root *,html,html *,body,body *,.preset-admin,.preset-admin *,.preset-admin.dark,.preset-admin.dark *{--brand-h:${h}!important;--brand-s:${s}!important;--brand-l:${l}!important;--primary:${primaryValue}!important;}`,
            }}
          />
        );
      }
    }
    // Silently ignore invalid cookie format - fall back to database
  }

  // Fallback to database if no cookie
  // Silently handle any client creation errors
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

  // Optimized: Get settings and theme in one query, then color in second
  const { data: settings } = await (supabase
    .from("user_settings") as any)
    .select("active_theme_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!settings?.active_theme_id) {
    return null;
  }

  // Get theme and color in a single query using a join
  const { data: themeData } = await (supabase
    .from("user_themes") as any)
    .select(`
      primary_color_id,
      user_colors!inner (
        hsl_h,
        hsl_s,
        hsl_l
      )
    `)
    .eq("id", settings.active_theme_id)
    .single();

  if (!themeData?.user_colors || !Array.isArray(themeData.user_colors) || themeData.user_colors.length === 0) {
    return null;
  }

  const color = themeData.user_colors[0];
  const primaryValue = `${color.hsl_h} ${color.hsl_s}% ${color.hsl_l}%`;

  return renderColorScript(primaryValue, color.hsl_h, color.hsl_s, color.hsl_l);
}

function renderColorScript(primaryValue: string, h: number, s: number, l: number) {
  // Return ONLY the style tag - Next.js will move it to head
  // The middleware handles persistence, and InstantColorApply handles client-side fallback
  // This is the cleanest approach - style tag applies immediately
  
  return (
    <style
      id="primary-color-inline-server"
      dangerouslySetInnerHTML={{
        __html: `:root,:root *,html,html *,body,body *,.preset-admin,.preset-admin *,.preset-admin.dark,.preset-admin.dark *{--brand-h:${h}!important;--brand-s:${s}!important;--brand-l:${l}!important;--primary:${primaryValue}!important;}`,
      }}
    />
  );
}
