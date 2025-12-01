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
import { StateBadge } from "@/components/admin/StateBadge";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { TestimonialWithSection } from "../types";

type TestimonialsListProps = {
  initialTestimonials: TestimonialWithSection[];
};

export function TestimonialsList({ initialTestimonials }: TestimonialsListProps) {
  const [testimonials, setTestimonials] = useState<TestimonialWithSection[]>(initialTestimonials);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete testimonial");
      }

      toast.success("Testimonial deleted successfully");
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (error: any) {
      console.error("Error deleting testimonial:", error);
      toast.error(error.message || "Failed to delete testimonial");
      throw error;
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const query = searchQuery.toLowerCase();
    return (
      testimonial.author_name.toLowerCase().includes(query) ||
      testimonial.quote.toLowerCase().includes(query) ||
      testimonial.company_name?.toLowerCase().includes(query) ||
      testimonial.author_role?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-4xl font-bold text-foreground leading-none">Testimonials</h1>
            <span className="inline-flex items-center justify-center h-5 px-2.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 leading-none">
              ({filteredTestimonials.length} {filteredTestimonials.length === 1 ? "testimonial" : "testimonials"})
            </span>
          </div>
          <p className="text-base text-muted-foreground">
            Manage customer testimonials and reviews.
          </p>
        </div>
      </div>
      <div className="space-y-3 md:space-y-4">
        <AdminToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search testimonials..."
        >
          <Button
            asChild
            variant="ghost"
            className="rounded-full w-10 h-10 p-0 bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent border-0 shadow-none transition-colors"
            title="New Testimonial"
          >
            <Link href="/admin/testimonials/new">
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
            </Link>
          </Button>
        </AdminToolbar>

        <AdminTable>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b">
              <TableHead className="pl-4 w-24 font-bold">Icon</TableHead>
              <TableHead className="w-64 max-w-64 font-bold">Author</TableHead>
              <TableHead className="w-24 font-bold">Status</TableHead>
              <TableHead className="text-right pr-4 font-bold" style={{ textAlign: "right" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  {searchQuery
                    ? "No testimonials found matching your search"
                    : "No testimonials found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <>
                  {/* Mobile Layout */}
                  <TableRow
                    key={`${testimonial.id}-mobile`}
                    className="md:hidden group cursor-pointer hover:bg-muted/50 border-b border-border/50"
                  >
                    <TableCell className="px-3 md:pl-4 md:pr-4 py-4" colSpan={4}>
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-muted shadow-md flex-shrink-0">
                          {testimonial.avatar_url ? (
                            <img
                              src={testimonial.avatar_url}
                              alt={testimonial.author_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-muted-foreground">
                              {testimonial.author_name
                                .split(/\s+/)
                                .map((w) => w[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base mb-1.5 break-words">
                            {testimonial.author_name}
                          </div>
                          {(testimonial.author_role || testimonial.company_name) && (
                            <div className="text-sm text-muted-foreground mb-1">
                              {testimonial.author_role && testimonial.company_name
                                ? `${testimonial.author_role} at ${testimonial.company_name}`
                                : testimonial.author_role || testimonial.company_name}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {testimonial.quote}
                          </div>
                          <div className="flex items-center gap-2">
                            <StateBadge state={testimonial.approved ? "active" : "inactive"} />
                            <span className="text-xs text-muted-foreground">
                              Position: {testimonial.position}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2" data-action-menu>
                          <ActionMenu
                            itemId={testimonial.id}
                            editHref={`/admin/testimonials/${testimonial.id}/edit`}
                            onDelete={handleDelete}
                            deleteLabel={`testimonial from "${testimonial.author_name}"`}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Desktop Layout */}
                  <TableRow
                    key={`${testimonial.id}-desktop`}
                    className="table-row-responsive group cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="pl-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-muted shadow-md">
                        {testimonial.avatar_url ? (
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.author_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground">
                            {testimonial.author_name
                              .split(/\s+/)
                              .map((w) => w[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-64 max-w-64 font-medium">
                      <span className="truncate block" title={testimonial.author_name}>
                        {testimonial.author_name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StateBadge state={testimonial.approved ? "active" : "inactive"} />
                    </TableCell>
                    <TableCell className="text-right pr-4" data-action-menu style={{ textAlign: "right" }}>
                      <div className="inline-flex ml-auto">
                        <ActionMenu
                          itemId={testimonial.id}
                          editHref={`/admin/testimonials/${testimonial.id}/edit`}
                          onDelete={handleDelete}
                          deleteLabel={`testimonial from "${testimonial.author_name}"`}
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
