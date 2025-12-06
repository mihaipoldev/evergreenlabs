import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { StylePresetProvider } from "@/providers/StylePresetProvider";
import { AdminColorStyle } from "@/components/admin/AdminColorStyle";
import { InstantColorApply } from "@/components/admin/InstantColorApply";
import { AdminFontStyle } from "@/components/admin/AdminFontStyle";
import { InstantFontApply } from "@/components/admin/InstantFontApply";
import { getAllFontVariables } from "@/lib/fonts";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Evergreen Labs",
  description: "Evergreen Labs - Building the future, one project at a time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Safely get headers with fallback
  let pathname = "";
  let isAdminPage = false;
  
  try {
    const headersList = await headers();
    pathname = headersList.get("x-pathname") || headersList.get("referer") || "";
    isAdminPage = pathname.includes("/admin") && !pathname.includes("/admin/login");
  } catch (error) {
    // If headers() fails, continue without admin features
    // This prevents the entire site from breaking
    console.warn('Failed to get headers in layout:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning className={getAllFontVariables()}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* CRITICAL: Server-side color injection - must be first in body */}
        {/* Next.js will move style tags to head automatically */}
        {isAdminPage && <AdminColorStyle />}
        {/* CRITICAL: Server-side font injection */}
        {isAdminPage && <AdminFontStyle />}
        {/* Client-side fallback from sessionStorage */}
        {isAdminPage && <InstantColorApply />}
        {isAdminPage && <InstantFontApply />}
        <StylePresetProvider />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
