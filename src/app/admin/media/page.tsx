import { AdminPageTitle } from "@/components/admin/AdminPageTitle";

export default function MediaPage() {
  return (
    <>
      <AdminPageTitle
        title="Media Library"
        description="Manage and organize your media files."
      />
      <p className="text-muted-foreground">
        Media library content will be added here.
      </p>
    </>
  );
}
