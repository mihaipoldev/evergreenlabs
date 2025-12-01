import { AdminPageTitle } from "@/components/admin/AdminPageTitle";
import { FeatureForm } from "@/features/features/components/FeatureForm";
import { getAllSections } from "@/features/features/data";

export const dynamic = "force-dynamic";

export default async function NewFeaturePage() {
  const sections = await getAllSections();

  return (
    <div className="w-full space-y-6">
      <div className="mb-6 md:mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
        <AdminPageTitle
          title="New Feature"
          description="Create a new feature to showcase your offerings"
        />
      </div>
      <FeatureForm sections={sections} isEdit={false} />
    </div>
  );
}
