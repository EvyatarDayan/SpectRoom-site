"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BillingEditor from "@/components/BillingEditor";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/lib/AuthProvider";

export default function BillingPage() {
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
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <BillingEditor />
        )}
      </main>
    </div>
  );
}
