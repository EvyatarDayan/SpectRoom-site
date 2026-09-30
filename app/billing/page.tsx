"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BillingEditor from "@/components/BillingEditor";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/lib/AuthProvider";
import { useLanguage } from "@/lib/LanguageProvider";

export default function BillingPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, user, router]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-28">
        {loading || !user ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <Spinner />
            <p className="text-sm text-ink-muted">{t.billing.loading}</p>
          </div>
        ) : (
          <BillingEditor key={user.uid} />
        )}
      </main>
    </div>
  );
}
