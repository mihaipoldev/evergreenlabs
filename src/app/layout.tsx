import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { StylePresetProvider } from "@/components/StylePresetProvider";
import { AdminColorStyle } from "@/components/admin/AdminColorStyle";
import { InstantColorApply } from "@/components/admin/InstantColorApply";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Evergreen Labs",
  description: "Evergreen Labs - Building the future, one project at a time.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("referer") || "";
  const isAdminPage = pathname.includes("/admin") && !pathname.includes("/admin/login");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* CRITICAL: Server-side color injection - must be first in body */}
        {/* Next.js will move style tags to head automatically */}
        {isAdminPage && <AdminColorStyle />}
        {/* Client-side fallback from sessionStorage */}
        <InstantColorApply />
        <StylePresetProvider />
        {children}
      </body>
    </html>
  );
}
