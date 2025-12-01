"use client";

import { useState } from "react";
import Link from "next/link";
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
import { faPlus, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { FAQItemWithSection } from "../types";

type FAQListProps = {
  initialFAQItems: FAQItemWithSection[];
};

export function FAQList({ initialFAQItems }: FAQListProps) {
  const [faqItems, setFAQItems] = useState<FAQItemWithSection[]>(initialFAQItems);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const response = await fetch(`/api/admin/faq-items/${id}`, {
        method: "DELETE",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete FAQ item");
      }

      toast.success("FAQ item deleted successfully");
      setFAQItems(faqItems.filter((item) => item.id !== id));
    } catch (error: any) {
      console.error("Error deleting FAQ item:", error);
      toast.error(error.message || "Failed to delete FAQ item");
      throw error;
    }
  };

  const filteredFAQItems = faqItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-4xl font-bold text-foreground leading-none">FAQ</h1>
            <span className="inline-flex items-center justify-center h-5 px-2.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 leading-none">
              ({filteredFAQItems.length} {filteredFAQItems.length === 1 ? "item" : "items"})
            </span>
          </div>
          <p className="text-base text-muted-foreground">
            Manage frequently asked questions and their answers.
          </p>
        </div>
      </div>
      <div className="space-y-3 md:space-y-4">
        <AdminToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search FAQ..."
        >
          <Button
            asChild
            variant="ghost"
            className="rounded-full w-10 h-10 p-0 bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent border-0 shadow-none transition-colors"
            title="New FAQ Item"
          >
            <Link href="/admin/faq/new">
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
            </Link>
          </Button>
        </AdminToolbar>

        <AdminTable>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b">
              <TableHead className="pl-4 w-24 font-bold">Icon</TableHead>
              <TableHead className="w-64 max-w-64 font-bold">Question</TableHead>
              <TableHead className="font-bold">Position</TableHead>
              <TableHead className="text-right pr-4 font-bold" style={{ textAlign: "right" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFAQItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  {searchQuery
                    ? "No FAQ items found matching your search"
                    : "No FAQ items found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredFAQItems.map((item) => (
                <>
                  {/* Mobile Layout */}
                  <TableRow
                    key={`${item.id}-mobile`}
                    className="md:hidden group cursor-pointer hover:bg-muted/50 border-b border-border/50"
                  >
                    <TableCell className="px-3 md:pl-4 md:pr-4 py-4" colSpan={4}>
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-muted shadow-md flex-shrink-0">
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                            className="h-6 w-6 text-muted-foreground"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base mb-1.5 break-words">
                            {item.question}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {item.answer}
                          </div>
                          {item.sections && (
                            <div className="text-xs text-muted-foreground mb-1">
                              Section: {item.sections.title || item.sections.type}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Position: {item.position}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2" data-action-menu>
                          <ActionMenu
                            itemId={item.id}
                            editHref={`/admin/faq/${item.id}/edit`}
                            onDelete={handleDelete}
                            deleteLabel={`FAQ item "${item.question}"`}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Desktop Layout */}
                  <TableRow
                    key={`${item.id}-desktop`}
                    className="table-row-responsive group cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="pl-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-muted shadow-md">
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                          className="h-5 w-5 text-muted-foreground"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="w-64 max-w-64 font-medium">
                      <span className="truncate block" title={item.question}>
                        {item.question}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.position}</TableCell>
                    <TableCell className="text-right pr-4" data-action-menu style={{ textAlign: "right" }}>
                      <div className="inline-flex ml-auto">
                        <ActionMenu
                          itemId={item.id}
                          editHref={`/admin/faq/${item.id}/edit`}
                          onDelete={handleDelete}
                          deleteLabel={`FAQ item "${item.question}"`}
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
