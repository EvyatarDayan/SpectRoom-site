"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProfileEditor from "@/components/ProfileEditor";
import { useLanguage } from "@/lib/LanguageProvider";
import { useAuth } from "@/lib/AuthProvider";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, profile, loading } = useAuth();
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
        {loading || !profile ? (
          <p className="mx-auto w-full max-w-5xl px-5 text-sm text-ink-muted sm:px-8">
            {t.profile.loading}
          </p>
        ) : (
          <>
            <div className="z-10 shrink-0 bg-cream px-5 pb-16 sm:px-8">
              <h1 className="mx-auto w-full max-w-5xl text-center text-3xl font-extrabold tracking-tight text-ink">
                {t.profile.title}
              </h1>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-24 sm:px-8">
              <div className="mx-auto w-full max-w-5xl">
                <ProfileEditor profile={profile} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
