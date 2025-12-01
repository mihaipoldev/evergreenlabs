"use client";

import { AdminSidebarMobile } from "./AdminSidebarMobile";
import { ThemeToggle } from "./ThemeToggle";
import { AdminBreadcrumb } from "./AdminBreadcrumb";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-2 backdrop-blur-sm bg-transparent px-4 md:px-10 lg:px-12">
      <div className="flex items-center gap-2">
        <AdminSidebarMobile />
        <AdminBreadcrumb />
      </div>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}

