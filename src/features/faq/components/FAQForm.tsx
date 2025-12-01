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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FAQItem } from "../types";
import type { Database } from "@/lib/supabase/types";

type Section = Database["public"]["Tables"]["sections"]["Row"];

const formSchema = z.object({
  section_id: z.string().min(1, "Section is required"),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  position: z.number().int().min(0),
});

type FormValues = z.infer<typeof formSchema>;

type FAQFormProps = {
  initialData?: FAQItem | null;
  sections: Section[];
  isEdit?: boolean;
};

export function FAQForm({ initialData, sections, isEdit = false }: FAQFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section_id: initialData?.section_id || "",
      question: initialData?.question || "",
      answer: initialData?.answer || "",
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
        ? `/api/admin/faq-items/${initialData.id}`
        : "/api/admin/faq-items";
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
        throw new Error(error.error || `Failed to ${isEdit ? "update" : "create"} FAQ item`);
      }

      toast.success(`FAQ item ${isEdit ? "updated" : "created"} successfully`);
      router.push("/admin/faq");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving FAQ item:", error);
      toast.error(error.message || `Failed to ${isEdit ? "update" : "create"} FAQ item`);
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
                  The section this FAQ item belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Question <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter the question" {...field} />
                </FormControl>
                <FormDescription>
                  The question being asked
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Answer <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the answer"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The answer to the question
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isSubmitting}
          >
            <Link href="/admin/faq">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update FAQ Item" : "Create FAQ Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
