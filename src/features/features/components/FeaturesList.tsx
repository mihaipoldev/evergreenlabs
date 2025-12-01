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
import { faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { OfferFeature } from "../types";

type FeaturesListProps = {
  initialFeatures: OfferFeature[];
};

export function FeaturesList({ initialFeatures }: FeaturesListProps) {
  const [features, setFeatures] = useState<OfferFeature[]>(initialFeatures);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const response = await fetch(`/api/admin/offer-features/${id}`, {
        method: "DELETE",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete feature");
      }

      toast.success("Feature deleted successfully");
      setFeatures(features.filter((f) => f.id !== id));
    } catch (error: any) {
      console.error("Error deleting feature:", error);
      toast.error(error.message || "Failed to delete feature");
      throw error;
    }
  };

  const filteredFeatures = features.filter((feature) => {
    const query = searchQuery.toLowerCase();
    return (
      feature.title.toLowerCase().includes(query) ||
      feature.subtitle?.toLowerCase().includes(query) ||
      feature.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-4xl font-bold text-foreground leading-none">Features</h1>
            <span className="inline-flex items-center justify-center h-5 px-2.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 leading-none">
              ({filteredFeatures.length} {filteredFeatures.length === 1 ? "feature" : "features"})
            </span>
          </div>
          <p className="text-base text-muted-foreground">
            Manage your site features, including titles, descriptions, and icons.
          </p>
        </div>
      </div>
      <div className="space-y-3 md:space-y-4">
        <AdminToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search features..."
        >
          <Button
            asChild
            variant="ghost"
            className="rounded-full w-10 h-10 p-0 bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent border-0 shadow-none transition-colors"
            title="New Feature"
          >
            <Link href="/admin/features/new">
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
            </Link>
          </Button>
        </AdminToolbar>

        <AdminTable>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b">
              <TableHead className="pl-4 w-24 font-bold">Icon</TableHead>
              <TableHead className="w-64 max-w-64 font-bold">Title</TableHead>
              <TableHead className="font-bold">Position</TableHead>
              <TableHead className="text-right pr-4 font-bold" style={{ textAlign: "right" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeatures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  {searchQuery
                    ? "No features found matching your search"
                    : "No features found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredFeatures.map((feature) => (
                <>
                  {/* Mobile Layout */}
                  <TableRow
                    key={`${feature.id}-mobile`}
                    className="md:hidden group cursor-pointer hover:bg-muted/50 border-b border-border/50"
                  >
                    <TableCell className="px-3 md:pl-4 md:pr-4 py-4" colSpan={4}>
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-muted shadow-md flex-shrink-0">
                          {feature.icon ? (
                            <span className="text-xs text-muted-foreground font-semibold">
                              {feature.icon}
                            </span>
                          ) : (
                            <FontAwesomeIcon
                              icon={faStar}
                              className="h-6 w-6 text-muted-foreground"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base mb-1.5 break-words">
                            {feature.title}
                          </div>
                          {feature.subtitle && (
                            <div className="text-sm text-muted-foreground mb-1">
                              {feature.subtitle}
                            </div>
                          )}
                          {feature.description && (
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {feature.description}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-muted-foreground">
                            Position: {feature.position}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2" data-action-menu>
                          <ActionMenu
                            itemId={feature.id}
                            editHref={`/admin/features/${feature.id}/edit`}
                            onDelete={handleDelete}
                            deleteLabel={`feature "${feature.title}"`}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Desktop Layout */}
                  <TableRow
                    key={`${feature.id}-desktop`}
                    className="table-row-responsive group cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="pl-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-muted shadow-md">
                        {feature.icon ? (
                          <span className="text-xs text-muted-foreground font-semibold">
                            {feature.icon}
                          </span>
                        ) : (
                          <FontAwesomeIcon
                            icon={faStar}
                            className="h-5 w-5 text-muted-foreground"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-64 max-w-64 font-medium">
                      <span className="truncate block" title={feature.title}>
                        {feature.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{feature.position}</TableCell>
                    <TableCell className="text-right pr-4" data-action-menu style={{ textAlign: "right" }}>
                      <div className="inline-flex ml-auto">
                        <ActionMenu
                          itemId={feature.id}
                          editHref={`/admin/features/${feature.id}/edit`}
                          onDelete={handleDelete}
                          deleteLabel={`feature "${feature.title}"`}
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
