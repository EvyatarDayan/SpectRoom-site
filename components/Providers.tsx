"use client";

import { LanguageProvider } from "@/lib/LanguageProvider";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { AuthProvider } from "@/lib/AuthProvider";
import { SupportModalProvider } from "@/lib/SupportModalProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SupportModalProvider>{children}</SupportModalProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
