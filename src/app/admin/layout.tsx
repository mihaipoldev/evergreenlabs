"use client";

import { ThemeProvider } from "next-themes";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden md:pl-64">
          <main className="flex flex-1 flex-col min-h-0 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1400px] flex flex-col">
              <AdminHeader />
              <div className="flex flex-col py-6 pb-4 md:pb-8 px-4 md:px-10 lg:px-12 space-y-4 md:space-y-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
