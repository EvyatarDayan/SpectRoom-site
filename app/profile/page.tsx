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
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-28 sm:px-8">
        {loading || !profile ? (
          <p className="text-sm text-ink-muted">{t.profile.loading}</p>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink">
              {t.profile.title}
            </h1>
            <div className="mt-8">
              <ProfileEditor profile={profile} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
