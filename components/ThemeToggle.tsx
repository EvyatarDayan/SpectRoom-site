"use client";

import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/lib/LanguageProvider";
import { useTheme } from "@/lib/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-ink transition-colors hover:bg-cream-muted"
      aria-label={isDark ? t.nav.themeToLight : t.nav.themeToDark}
      aria-pressed={isDark}
    >
      {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}
