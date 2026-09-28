"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BillingEditor from "@/components/BillingEditor";
import { useLanguage } from "@/lib/LanguageProvider";
import { useAuth } from "@/lib/AuthProvider";

export default function BillingPage() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, user, router]);

  return (
    <div className="h-dvh overflow-hidden">
      <Header />
      <main className="flex h-full flex-col pt-28">
        {loading || !user ? (
          <p className="mx-auto w-full max-w-5xl px-5 text-sm text-ink-muted sm:px-8">
            {t.billing.loading}
          </p>
        ) : (
          <BillingEditor />
        )}
      </main>
    </div>
  );
}
