"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faPlus } from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@/lib/supabase/client";
import { hexToHsl, hslToCssString, hslToCssHsl } from "@/lib/color-utils";
import { ColorModal } from "./ColorModal";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: faSun },
  { value: "dark", label: "Dark", icon: faMoon },
];

// Color type from database
type DatabaseColor = {
  id: string;
  user_id: string;
  name: string;
  hex: string;
  hsl_h: number;
  hsl_s: number;
  hsl_l: number;
};

// Color type for component
type Color = {
  id: string;
  name: string;
  hex: string;
  hsl: { h: number; s: number; l: number };
  value: string; // CSS HSL string
};

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userColors, setUserColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Convert database color to component color
  const dbColorToComponent = (dbColor: DatabaseColor): Color => {
    return {
      id: dbColor.id,
      name: dbColor.name,
      hex: dbColor.hex,
      hsl: {
        h: dbColor.hsl_h,
        s: dbColor.hsl_s,
        l: dbColor.hsl_l,
      },
      value: hslToCssHsl(dbColor.hsl_h, dbColor.hsl_s, dbColor.hsl_l),
    };
  };

  // Apply color to CSS variable
  const applyColorToCSS = (color: Color | null) => {
    if (!color || typeof document === "undefined") return;
    const root = document.documentElement;
    const cssValue = hslToCssString(color.hsl.h, color.hsl.s, color.hsl.l);
    
    // Remove existing injected style tags that might have !important
    const existingStyles = [
      document.getElementById("primary-color-inline"),
      document.getElementById("primary-color-script"),
      document.getElementById("primary-color-session"),
    ].filter(Boolean) as HTMLElement[];
    
    existingStyles.forEach((style) => style.remove());
    
    // Apply color with !important to override any remaining styles
    root.style.setProperty("--primary", cssValue, "important");
    
    // Also inject a new style tag to ensure it persists
    const style = document.createElement("style");
    style.id = "primary-color-client";
    style.textContent = `:root,html,body{--primary:${cssValue}!important;}`;
    document.head.appendChild(style);
    
    // Save to sessionStorage for InstantColorApply fallback
    try {
      sessionStorage.setItem("primary-color-hsl", cssValue);
    } catch (e) {
      // sessionStorage not available
    }
    
    // Save to cookie for instant access on next page load (server-side)
    // Cookie expires in 1 year
    try {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `primary-color-hsl=${encodeURIComponent(cssValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    } catch (e) {
      // Cookie setting failed
    }
  };

  // Load colors from database
  useEffect(() => {
    const loadColors = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          setMounted(true);
          return;
        }

        setUserId(user.id);

        // Load user colors
        const { data: colors, error } = await (supabase
          .from("user_colors") as any)
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading colors:", error);
          setLoading(false);
          setMounted(true);
          return;
        }

        const componentColors = (colors || []).map(dbColorToComponent);
        setUserColors(componentColors);

        // Try to load selected color from user_settings
        const { data: settings } = await (supabase
          .from("user_settings") as any)
          .select("active_theme_id")
          .eq("user_id", user.id)
          .single();

        if (settings?.active_theme_id) {
          const { data: theme } = await (supabase
            .from("user_themes") as any)
            .select("primary_color_id")
            .eq("id", settings.active_theme_id)
            .single();

          if (theme?.primary_color_id) {
            const { data: color } = await (supabase
              .from("user_colors") as any)
              .select("*")
              .eq("id", theme.primary_color_id)
              .single();

            if (color) {
              const selected = dbColorToComponent(color);
              setSelectedColor(selected);
              applyColorToCSS(selected);
            } else if (componentColors.length > 0) {
              // Fallback to first color
              setSelectedColor(componentColors[0]);
              applyColorToCSS(componentColors[0]);
            }
          } else if (componentColors.length > 0) {
            setSelectedColor(componentColors[0]);
            applyColorToCSS(componentColors[0]);
          }
        } else if (componentColors.length > 0) {
          setSelectedColor(componentColors[0]);
          applyColorToCSS(componentColors[0]);
        }
      } catch (error) {
        console.error("Error loading colors:", error);
      } finally {
        setLoading(false);
        setMounted(true);
      }
    };

    loadColors();
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleColorChange = async (color: Color) => {
    setSelectedColor(color);
    applyColorToCSS(color);
    
    // Automatically save to database
    if (!userId) return;
    
    try {
      const supabase = createClient();
      const colorId = color.id;

      // Create or update theme
      const { data: existingTheme } = await (supabase
        .from("user_themes") as any)
        .select("id")
        .eq("user_id", userId)
        .eq("name", "Default Theme")
        .maybeSingle();

      let themeId: string;
      if (existingTheme) {
        const { error: updateError } = await (supabase
          .from("user_themes") as any)
          .update({
            primary_color_id: colorId,
            secondary_color_id: colorId,
            accent_color_id: colorId,
          })
          .eq("id", existingTheme.id);
        if (updateError) throw updateError;
        themeId = existingTheme.id;
      } else {
        const { data: newTheme, error: themeError } = await (supabase
          .from("user_themes") as any)
          .insert({
            user_id: userId,
            name: "Default Theme",
            primary_color_id: colorId,
            secondary_color_id: colorId,
            accent_color_id: colorId,
            font_family: "system",
          })
          .select("id")
          .single();

        if (themeError) throw themeError;
        themeId = newTheme.id;
      }

      // Update user_settings
      const { error: settingsError } = await (supabase
        .from("user_settings") as any)
        .upsert(
          {
            user_id: userId,
            active_theme_id: themeId,
          },
          {
            onConflict: "user_id",
          }
        );

      if (settingsError) throw settingsError;
    } catch (error) {
      console.error("Error saving color preference:", error);
      // Don't show alert for automatic saves, just log the error
    }
  };

  const handleAddColor = () => {
    setEditingColor(null);
    setIsColorModalOpen(true);
  };

  const handleEditColor = (color: Color) => {
    setEditingColor(color);
    setIsColorModalOpen(true);
  };

  const handleSaveColor = async (colorData: { hex: string; name: string }) => {
    if (!userId) return;

    try {
      const supabase = createClient();
      const hsl = hexToHsl(colorData.hex);

      if (editingColor) {
        // Update existing color
        const { error } = await (supabase
          .from("user_colors") as any)
          .update({
            name: colorData.name,
            hex: colorData.hex,
            hsl_h: hsl.h,
            hsl_s: hsl.s,
            hsl_l: hsl.l,
          })
          .eq("id", editingColor.id);

        if (error) throw error;

        // Refresh colors
        const { data: colors } = await (supabase
          .from("user_colors") as any)
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (colors) {
          const componentColors = colors.map(dbColorToComponent);
          setUserColors(componentColors);

          // Update selected color if it was the one being edited and save preference automatically
          if (selectedColor?.id === editingColor.id) {
            const updated = componentColors.find((c: Color) => c.id === editingColor.id);
            if (updated) {
              await handleColorChange(updated);
            }
          }
        }
      } else {
        // Create new color
        const { data: newColor, error } = await (supabase
          .from("user_colors") as any)
          .insert({
            user_id: userId,
            name: colorData.name,
            hex: colorData.hex,
            hsl_h: hsl.h,
            hsl_s: hsl.s,
            hsl_l: hsl.l,
          })
          .select()
          .single();

        if (error) throw error;

        const componentColor = dbColorToComponent(newColor);
        setUserColors((prev) => [componentColor, ...prev]);
        
        // Auto-select the new color and save preference automatically
        await handleColorChange(componentColor);
      }

      setIsColorModalOpen(false);
      setEditingColor(null);
    } catch (error) {
      console.error("Error saving color:", error);
      alert("Failed to save color. Please try again.");
    }
  };


  if (!mounted || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  const currentTheme = theme || "light";

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card className="relative overflow-hidden shadow-lg">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent pointer-events-none" />
        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="sparkle" style={{ top: "20%", left: "8%", animationDelay: "1s" }} />
          <div className="sparkle" style={{ top: "65%", right: "12%", animationDelay: "4s" }} />
          <div className="sparkle" style={{ top: "40%", left: "15%", animationDelay: "7s" }} />
        </div>

        <CardHeader>
          <CardTitle className="relative">Theme</CardTitle>
          <CardDescription className="relative">
            Choose your preferred theme mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme Mode</Label>
            <Select value={currentTheme} onValueChange={handleThemeChange}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={option.icon} className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {themeOptions.map((option) => {
              const isActive = currentTheme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-accent"
                  )}
                >
                  <FontAwesomeIcon
                    icon={option.icon}
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Brand Colors */}
      <Card className="relative overflow-hidden shadow-lg">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent pointer-events-none" />
        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="sparkle" style={{ top: "25%", left: "6%", animationDelay: "2s" }} />
          <div className="sparkle" style={{ top: "70%", right: "9%", animationDelay: "5s" }} />
        </div>

        <CardHeader>
          <CardTitle className="relative">Brand Colors</CardTitle>
          <CardDescription className="relative">
            Customize your primary brand color. Add colors using the button below.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            {userColors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">No colors yet. Add your first color to get started!</p>
                <Button onClick={handleAddColor} variant="outline">
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                  Add Color
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {userColors.map((color) => {
                  const isActive = selectedColor?.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color)}
                      onDoubleClick={() => handleEditColor(color)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      )}
                      title="Double-click to edit"
                    >
                      <div
                        className="w-12 h-12 rounded-full border-2 border-border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium text-center",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {color.name}
                      </span>
                    </button>
                  );
                })}
                {/* Add Color Button */}
                <button
                  onClick={handleAddColor}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent transition-all"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center bg-muted/50">
                    <FontAwesomeIcon icon={faPlus} className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Add Color</span>
                </button>
              </div>
            )}
          </div>

          {selectedColor && (
            <>
              <Separator />

              {/* Preview Section */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ backgroundColor: selectedColor.hex }}
                    />
                    <div className="flex-1">
                      <div className="h-3 rounded bg-primary/20 mb-2" style={{ width: "60%" }} />
                      <div className="h-2 rounded bg-muted" style={{ width: "40%" }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" style={{ backgroundColor: selectedColor.hex }}>
                      Primary Button
                    </Button>
                    <Button size="sm" variant="outline">
                      Secondary Button
                    </Button>
                  </div>
                </div>
              </div>

            </>
          )}
        </CardContent>
      </Card>

      {/* Color Modal */}
      {userId && (
        <ColorModal
          isOpen={isColorModalOpen}
          onClose={() => {
            setIsColorModalOpen(false);
            setEditingColor(null);
          }}
          mode={editingColor ? "edit" : "create"}
          initialColor={editingColor ? { id: editingColor.id, hex: editingColor.hex, name: editingColor.name } : undefined}
          onSave={handleSaveColor}
          userId={userId}
          position={null}
        />
      )}
    </div>
  );
}
