"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProfileEditor from "@/components/ProfileEditor";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/lib/AuthProvider";
import { useLanguage } from "@/lib/LanguageProvider";

const LOAD_TIMEOUT_MS = 8000;

export default function ProfilePage() {
  const { user, profile, loading, reloadProfile } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, user, router]);

  // Load only when we don't already have a cached profile in auth state.
  useEffect(() => {
    if (loading || !user || profile) return;

    let cancelled = false;
    (async () => {
      setFetching(true);
      setTimedOut(false);
      try {
        await reloadProfile();
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading, profile, reloadProfile]);

  const isBusy = Boolean(user && !profile && (loading || fetching || retrying));

  useEffect(() => {
    if (profile || !user || !isBusy) {
      setTimedOut(false);
      return;
    }
    const id = window.setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [profile, user, isBusy]);

  const showLoadError = Boolean(user && !profile && (!isBusy || timedOut));

  const handleRetry = async () => {
    setRetrying(true);
    setTimedOut(false);
    try {
      await reloadProfile();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-28">
        {profile && !showLoadError ? (
          <ProfileEditor profile={profile} />
        ) : showLoadError ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card px-6 py-8 shadow-sm">
              <h1 className="text-xl font-bold text-ink">{t.profile.empty}</h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {t.profile.emptyHint}
              </p>
              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  disabled={retrying}
                  onClick={() => void handleRetry()}
                  className="inline-flex h-11 min-w-32 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                >
                  {retrying ? (
                    <span
                      aria-hidden
                      className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                    />
                  ) : (
                    t.profile.retry
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <Spinner />
            <p className="text-sm text-ink-muted">{t.profile.loading}</p>
          </div>
        )}
      </main>
    </div>
  );
}
