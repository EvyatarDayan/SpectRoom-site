"use client";

import { LanguageProvider } from "@/lib/LanguageProvider";
import { ThemeProvider } from "@/lib/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
