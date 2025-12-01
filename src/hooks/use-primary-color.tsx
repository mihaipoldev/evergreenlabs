"use client";

import { useEffect, useState } from "react";

export function usePrimaryColor() {
  const [primaryColor, setPrimaryColor] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateColor = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const color = computedStyle.getPropertyValue("--primary").trim();
      setPrimaryColor(color);
    };

    updateColor();

    // Watch for changes to CSS variables
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => observer.disconnect();
  }, []);

  return { primaryColor };
}
