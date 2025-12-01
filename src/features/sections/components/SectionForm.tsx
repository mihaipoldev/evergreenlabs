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
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Section } from "../types";
import type { Database } from "@/lib/supabase/types";

type Page = Database["public"]["Tables"]["pages"]["Row"];

const formSchema = z.object({
  page_id: z.string().min(1, "Page is required"),
  type: z.string().min(1, "Type is required"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  position: z.number().int().min(0),
  visible: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type SectionFormProps = {
  initialData?: Section | null;
  pages: Page[];
  isEdit?: boolean;
};

// Common section types
const SECTION_TYPES = [
  "hero",
  "features",
  "testimonials",
  "faq",
  "cta",
  "content",
  "gallery",
  "pricing",
  "contact",
  "about",
];

export function SectionForm({ initialData, pages, isEdit = false }: SectionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse content JSON if it exists
  const parseContent = (content: any): string => {
    if (!content) return "";
    if (typeof content === "string") return content;
    try {
      return JSON.stringify(content, null, 2);
    } catch {
      return "";
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      page_id: initialData?.page_id || "",
      type: initialData?.type || "",
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      content: parseContent(initialData?.content),
      position: initialData?.position ?? 0,
      visible: initialData?.visible ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      // Parse content JSON if provided
      let parsedContent = null;
      if (values.content && values.content.trim()) {
        try {
          parsedContent = JSON.parse(values.content);
        } catch (e) {
          throw new Error("Invalid JSON in content field");
        }
      }

      const payload = {
        page_id: values.page_id,
        type: values.type,
        title: values.title || null,
        subtitle: values.subtitle || null,
        content: parsedContent,
        position: values.position,
        visible: values.visible,
      };

      const url = isEdit && initialData
        ? `/api/admin/sections/${initialData.id}`
        : "/api/admin/sections";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEdit ? "update" : "create"} section`);
      }

      toast.success(`Section ${isEdit ? "updated" : "created"} successfully`);
      router.push("/admin/sections");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving section:", error);
      toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} section`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="rounded-xl bg-card/50 border border-border text-card-foreground dark:bg-card/30 shadow-lg p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="page_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Page <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a page" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pages.map((page) => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The page this section belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SECTION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter section title" {...field} />
                </FormControl>
                <FormDescription>
                  An optional title for the section
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="Enter section subtitle" {...field} />
                </FormControl>
                <FormDescription>
                  An optional subtitle for the section
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter JSON content, e.g., {"key": "value"}'
                    className="min-h-[150px] font-mono text-sm"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional JSON content for the section. Must be valid JSON format.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Display order (lower numbers appear first)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Visible</FormLabel>
                    <FormDescription>
                      Whether this section is visible on the page
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isSubmitting}
          >
            <Link href="/admin/sections">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Section" : "Create Section"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
