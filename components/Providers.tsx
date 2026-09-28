"use client";

import { LanguageProvider } from "@/lib/LanguageProvider";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { AuthProvider } from "@/lib/AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
