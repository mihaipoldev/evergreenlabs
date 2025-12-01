import { notFound } from "next/navigation";
import { AdminPageTitle } from "@/components/admin/AdminPageTitle";
import { TestimonialForm } from "@/features/testimonials/components/TestimonialForm";
import { getTestimonialById, getAllSections } from "@/features/testimonials/data";

export const dynamic = "force-dynamic";

type EditTestimonialPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params;
  const [testimonial, sections] = await Promise.all([
    getTestimonialById(id),
    getAllSections(),
  ]);

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="w-full space-y-6">
      <div className="mb-6 md:mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
        <AdminPageTitle
          title="Edit Testimonial"
          entityName={testimonial.author_name}
          description="Update the testimonial details"
        />
      </div>
      <TestimonialForm sections={sections} initialData={testimonial} isEdit={true} />
    </div>
  );
}
