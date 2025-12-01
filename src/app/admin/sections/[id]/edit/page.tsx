import { notFound } from "next/navigation";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminPageTitle } from "@/components/admin/AdminPageTitle";
import { SectionForm } from "@/features/sections/components/SectionForm";
import { getSectionById, getAllPages } from "@/features/sections/data";

export const dynamic = "force-dynamic";

type EditSectionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSectionPage({ params }: EditSectionPageProps) {
  const { id } = await params;
  const [section, pages] = await Promise.all([
    getSectionById(id),
    getAllPages(),
  ]);

  if (!section) {
    notFound();
  }

  return (
    <div className="w-full space-y-6">
      <AdminBreadcrumb />
      <div className="mb-6 md:mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
        <AdminPageTitle
          title="Edit Section"
          entityName={section.title || section.type}
          description="Update the section details"
        />
      </div>
      <SectionForm pages={pages} initialData={section} isEdit={true} />
    </div>
  );
}
