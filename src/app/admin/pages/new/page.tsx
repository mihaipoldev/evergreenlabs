import { AdminPageTitle } from "@/components/admin/AdminPageTitle";
import { PageForm } from "@/features/pages/components/PageForm";

export const dynamic = "force-dynamic";

export default async function NewPagePage() {
  return (
    <div className="w-full space-y-6">
      <div className="mb-6 md:mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
        <AdminPageTitle
          title="New Page"
          description="Create a new page for your site"
        />
      </div>
      <PageForm isEdit={false} />
    </div>
  );
}
