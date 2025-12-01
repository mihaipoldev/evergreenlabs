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
import { Checkbox } from "@/components/ui/checkbox";
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
import type { Testimonial } from "../types";
import type { Database } from "@/lib/supabase/types";

type Section = Database["public"]["Tables"]["sections"]["Row"];

const formSchema = z.object({
  section_id: z.string().min(1, "Section is required"),
  author_name: z.string().min(1, "Author name is required"),
  author_role: z.string().optional(),
  company_name: z.string().optional(),
  quote: z.string().min(1, "Quote is required"),
  video_url: z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional(),
  avatar_url: z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional(),
  approved: z.boolean(),
  position: z.number().int().min(0),
});

type FormValues = z.infer<typeof formSchema>;

type TestimonialFormProps = {
  initialData?: Testimonial | null;
  sections: Section[];
  isEdit?: boolean;
};

export function TestimonialForm({ initialData, sections, isEdit = false }: TestimonialFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section_id: initialData?.section_id || "",
      author_name: initialData?.author_name || "",
      author_role: initialData?.author_role || "",
      company_name: initialData?.company_name || "",
      quote: initialData?.quote || "",
      video_url: initialData?.video_url || "",
      avatar_url: initialData?.avatar_url || "",
      approved: initialData?.approved ?? false,
      position: initialData?.position ?? 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const url = isEdit && initialData
        ? `/api/admin/testimonials/${initialData.id}`
        : "/api/admin/testimonials";
      const method = isEdit ? "PUT" : "POST";

      // Clean up empty strings to null
      const payload = {
        ...values,
        author_role: values.author_role || null,
        company_name: values.company_name || null,
        video_url: values.video_url || null,
        avatar_url: values.avatar_url || null,
      };

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
        throw new Error(error.error || `Failed to ${isEdit ? "update" : "create"} testimonial`);
      }

      toast.success(`Testimonial ${isEdit ? "updated" : "created"} successfully`);
      router.push("/admin/testimonials");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving testimonial:", error);
      toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} testimonial`);
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
            name="section_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Section <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.title || `Section ${section.position + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The section this testimonial belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="author_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Author Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the person giving the testimonial
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CEO, Marketing Director" {...field} />
                  </FormControl>
                  <FormDescription>
                    The role or title of the author
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormDescription>
                  The company the author works for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Quote <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the testimonial quote"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The testimonial quote or review text
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." type="url" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional video testimonial URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." type="url" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional profile picture URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
              name="approved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Approved</FormLabel>
                    <FormDescription>
                      Only approved testimonials are visible to the public
                    </FormDescription>
                  </div>
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
            <Link href="/admin/testimonials">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Testimonial" : "Create Testimonial"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
