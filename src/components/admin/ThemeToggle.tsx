"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { CircleButton } from "./CircleButton";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <CircleButton size="md" variant="ghost" disabled>
        <FontAwesomeIcon icon={faSun} className="h-4 w-4" />
      </CircleButton>
    );
  }

  return (
    <CircleButton
      size="md"
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <FontAwesomeIcon
        icon={theme === "dark" ? faSun : faMoon}
        className="h-4 w-4"
      />
    </CircleButton>
  );
}
