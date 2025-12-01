"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AdminPageTitle } from "@/components/admin/AdminPageTitle";
import { SettingsSidebar } from "@/components/admin/settings/SettingsSidebar";
import { SettingsContent } from "@/components/admin/settings/SettingsContent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

type Section = "account" | "appearance";

const SECTION_URL_MAP: Record<Section, string> = {
  account: "account",
  appearance: "appearance",
};

const URL_SECTION_MAP: Record<string, Section> = {
  account: "account",
  appearance: "appearance",
};

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<Section>("account");

  // Get section from URL or localStorage
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && URL_SECTION_MAP[tabParam]) {
      setActiveSection(URL_SECTION_MAP[tabParam]);
      localStorage.setItem("settings-last-section", URL_SECTION_MAP[tabParam]);
    } else {
      const lastSection = localStorage.getItem("settings-last-section") as Section;
      if (lastSection && (lastSection === "account" || lastSection === "appearance")) {
        setActiveSection(lastSection);
      }
    }
  }, [searchParams]);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    localStorage.setItem("settings-last-section", section);
    router.push(`/admin/settings?tab=${SECTION_URL_MAP[section]}`, { scroll: false });
  };

  return (
    <>
      <AdminPageTitle
        title="Settings"
        description="Configure application settings and preferences."
      />
      <div className="mt-6">
        {isMobile ? (
          <div className="space-y-6">
            <Tabs value={activeSection} onValueChange={(value) => handleSectionChange(value as Section)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
            </Tabs>
            <SettingsContent activeSection={activeSection} />
          </div>
        ) : (
          <div className="flex gap-8">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
            <SettingsContent activeSection={activeSection} />
          </div>
        )}
      </div>
    </>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <>
          <AdminPageTitle
            title="Settings"
            description="Configure application settings and preferences."
          />
          <div className="mt-6 space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
          </div>
        </>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}
