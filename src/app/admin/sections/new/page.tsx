import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminPageTitle } from "@/components/admin/AdminPageTitle";
import { SectionForm } from "@/features/sections/components/SectionForm";
import { getAllPages } from "@/features/sections/data";

export const dynamic = "force-dynamic";

export default async function NewSectionPage() {
  const pages = await getAllPages();

  return (
    <div className="w-full space-y-6">
      <AdminBreadcrumb />
      <div className="mb-6 md:mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
        <AdminPageTitle
          title="New Section"
          description="Create a new section for your pages"
        />
      </div>
      <SectionForm pages={pages} isEdit={false} />
    </div>
  );
}
