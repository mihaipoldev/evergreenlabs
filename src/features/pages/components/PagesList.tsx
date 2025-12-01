"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  AdminTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/admin/AdminTable";
import { ActionMenu } from "@/components/admin/ActionMenu";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFile } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Page } from "../types";

type PagesListProps = {
  initialPages: Page[];
};

export function PagesList({ initialPages }: PagesListProps) {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const response = await fetch(`/api/admin/pages/${id}`, {
        method: "DELETE",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete page");
      }

      toast.success("Page deleted successfully");
      setPages(pages.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("Error deleting page:", error);
      toast.error(error.message || "Failed to delete page");
      throw error;
    }
  };

  const filteredPages = pages.filter((page) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      page.title.toLowerCase().includes(query) ||
      page.slug.toLowerCase().includes(query) ||
      page.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-4xl font-bold text-foreground leading-none">Pages</h1>
            <span className="inline-flex items-center justify-center h-5 px-2.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 leading-none">
              ({filteredPages.length} {filteredPages.length === 1 ? "page" : "pages"})
            </span>
          </div>
          <p className="text-base text-muted-foreground">
            Manage your site pages, including their content and structure.
          </p>
        </div>
      </div>
      <div className="space-y-3 md:space-y-4">
        <AdminToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search pages..."
        >
          <Button
            asChild
            variant="ghost"
            className="rounded-full w-10 h-10 p-0 bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent border-0 shadow-none transition-colors"
            title="New Page"
          >
            <Link href="/admin/pages/new">
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
            </Link>
          </Button>
        </AdminToolbar>

        <AdminTable>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b">
              <TableHead className="pl-4 w-24 font-bold">Icon</TableHead>
              <TableHead className="w-64 max-w-64 font-bold">Title</TableHead>
              <TableHead className="font-bold">Slug</TableHead>
              <TableHead className="font-bold">Created</TableHead>
              <TableHead className="text-right pr-4 font-bold" style={{ textAlign: "right" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {searchQuery
                    ? "No pages found matching your search"
                    : "No pages found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredPages.map((page) => (
                <>
                  {/* Mobile Layout */}
                  <TableRow
                    key={`${page.id}-mobile`}
                    className="md:hidden group cursor-pointer hover:bg-muted/50 border-b border-border/50"
                  >
                    <TableCell className="px-3 md:pl-4 md:pr-4 py-4" colSpan={5}>
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-muted shadow-md flex-shrink-0">
                          <FontAwesomeIcon
                            icon={faFile}
                            className="h-6 w-6 text-muted-foreground"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base mb-1.5 break-words">
                            {page.title}
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            /{page.slug}
                          </div>
                          {page.description && (
                            <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {page.description}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(page.created_at), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2" data-action-menu>
                          <ActionMenu
                            itemId={page.id}
                            editHref={`/admin/pages/${page.id}/edit`}
                            onDelete={handleDelete}
                            deleteLabel={`page "${page.title}"`}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Desktop Layout */}
                  <TableRow
                    key={`${page.id}-desktop`}
                    className="table-row-responsive group cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="pl-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-muted shadow-md">
                        <FontAwesomeIcon
                          icon={faFile}
                          className="h-5 w-5 text-muted-foreground"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="w-64 max-w-64 font-medium">
                      <span className="truncate block" title={page.title}>
                        {page.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="block truncate font-mono text-sm" title={page.slug}>
                        /{page.slug}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(page.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right pr-4" data-action-menu style={{ textAlign: "right" }}>
                      <div className="inline-flex ml-auto">
                        <ActionMenu
                          itemId={page.id}
                          editHref={`/admin/pages/${page.id}/edit`}
                          onDelete={handleDelete}
                          deleteLabel={`page "${page.title}"`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ))
            )}
          </TableBody>
        </AdminTable>
      </div>
    </div>
  );
}
