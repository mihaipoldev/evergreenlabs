"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPalette, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

type Section = "account" | "appearance";

interface SettingsSidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const sections: Array<{ id: Section; label: string; icon: any }> = [
  { id: "account", label: "Account", icon: faUser },
  { id: "appearance", label: "Appearance", icon: faPalette },
];

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-shrink-0 md:flex-col">
      <nav className="space-y-1">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 font-medium"
                  : "text-muted-foreground"
              )}
            >
              <FontAwesomeIcon icon={section.icon} className="h-4 w-4" />
              <span className="flex-1">{section.label}</span>
              {isActive && (
                <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
