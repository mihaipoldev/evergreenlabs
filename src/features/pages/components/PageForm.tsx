"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Page } from "../types";

const formSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type PageFormProps = {
  initialData?: Page | null;
  isEdit?: boolean;
};

export function PageForm({ initialData, isEdit = false }: PageFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: initialData?.slug || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const url = isEdit && initialData
        ? `/api/admin/pages/${initialData.id}`
        : "/api/admin/pages";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEdit ? "update" : "create"} page`);
      }

      toast.success(`Page ${isEdit ? "updated" : "created"} successfully`);
      router.push("/admin/pages");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving page:", error);
      toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} page`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="rounded-xl bg-card/50 border border-border text-card-foreground dark:bg-card/30 shadow-lg p-6 md:p-8 space-y-6">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Slug <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="my-page-slug" {...field} />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier (lowercase letters, numbers, and hyphens only)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter page title" {...field} />
                </FormControl>
                <FormDescription>
                  The main title of the page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter page description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of the page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isSubmitting}
          >
            <Link href="/admin/pages">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Page" : "Create Page"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
