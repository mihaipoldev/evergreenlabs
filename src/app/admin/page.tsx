import { AdminPageTitle } from "@/components/admin/AdminPageTitle";

export default function DashboardPage() {
  return (
    <>
      <AdminPageTitle
        title="Dashboard"
        description="Overview of your admin panel and site statistics."
      />
      <p className="text-muted-foreground">
        Dashboard content will be added here.
      </p>
    </>
  );
}
