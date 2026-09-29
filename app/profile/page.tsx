"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProfileEditor from "@/components/ProfileEditor";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/lib/AuthProvider";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
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
        {loading || !profile ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProfileEditor profile={profile} />
        )}
      </main>
    </div>
  );
}
