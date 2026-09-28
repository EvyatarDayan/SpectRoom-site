"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/lib/LanguageProvider";
import { useAuth } from "@/lib/AuthProvider";
import { asTier, planStar, type PlanTier } from "@/lib/firebase/billing";

function planButtonLabel(tier: PlanTier, t: { nav: { freePlan: string; proPlan: string; premiumPlan: string } }) {
  if (tier === "premium") return t.nav.premiumPlan;
  if (tier === "pro") return t.nav.proPlan;
  return t.nav.freePlan;
}

export default function Header() {
  const { t } = useLanguage();
  const { user, profile, headerSession, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t.nav.downloads, href: "/#downloads" },
    { label: t.nav.featuresSafety, href: "/#privacy" },
    { label: t.nav.supportFaq, href: "/#faq" },
    { label: t.nav.about, href: "/#about" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const signedIn = Boolean(user || profile || headerSession);
  const accountHref = signedIn ? "/profile" : "/signin";
  const firstName =
    (profile?.name || headerSession?.name || "").trim().split(" ")[0] || "";
  const photoURL = profile?.profilePhotoURL ?? headerSession?.photoURL ?? null;
  const planTier = asTier(profile?.planTier ?? headerSession?.planTier);
  const planLabel = planButtonLabel(planTier, t);
  const planIcon = planStar(planTier);

  const premiumControl = signedIn ? (
    <Link
      href="/billing"
      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-semibold text-ink transition-all hover:bg-cream-muted"
    >
      {planLabel}
      <span aria-hidden className="text-base leading-none">
        {planIcon}
      </span>
    </Link>
  ) : null;

  const accountControl = signedIn ? (
    <Link
      href={accountHref}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card py-0.5 pl-1.5 pr-4 text-sm font-semibold text-ink transition-all hover:bg-cream-muted"
    >
      <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-cream-muted">
        {photoURL ? (
          <Image src={photoURL} alt="" fill className="object-cover" sizes="28px" />
        ) : (
          <span className="flex size-full items-center justify-center text-xs font-bold text-ink-soft">
            {(firstName || t.nav.profile).slice(0, 1).toUpperCase()}
          </span>
        )}
      </span>
      <span className="max-w-[9rem] truncate">{firstName || t.nav.profile}</span>
    </Link>
  ) : loading ? (
    <span className="inline-flex h-10 min-w-28 rounded-full border border-border bg-card" aria-hidden />
  ) : (
    <Link
      href={accountHref}
      className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-ink transition-all hover:bg-cream-muted"
    >
      {t.nav.signIn}
    </Link>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-cream/85 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:h-[4.25rem] sm:px-8 md:gap-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/assets/app-icon.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-[9px] shadow-sm"
            priority
          />
          <span className="truncate text-xl font-extrabold tracking-tight text-ink sm:text-[1.35rem]">
            {t.app.name}
          </span>
        </Link>

        <div className="hidden h-6 w-px shrink-0 bg-border md:block" aria-hidden />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-evenly md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden h-6 w-px shrink-0 bg-border md:block" aria-hidden />

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          {premiumControl}
          {accountControl}
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-ink"
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {signedIn ? (
            <Link
              href="/billing"
              aria-label={planLabel}
              className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-card px-2.5 text-xs font-semibold text-ink"
            >
              <span className="max-w-[6.5rem] truncate">{planLabel}</span>
              <span aria-hidden className="text-sm leading-none">
                {planIcon}
              </span>
            </Link>
          ) : null}
          {signedIn ? (
            <Link href={accountHref} aria-label={firstName || t.nav.profile}>
              <span className="relative inline-flex size-10 overflow-hidden rounded-full border border-border bg-cream-muted">
                {photoURL ? (
                  <Image src={photoURL} alt="" fill className="object-cover" sizes="40px" />
                ) : (
                  <span className="flex size-full items-center justify-center text-sm font-bold text-ink-soft">
                    {(firstName || t.nav.profile).slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>
            </Link>
          ) : loading ? (
            <span className="inline-flex size-10 rounded-full border border-border bg-card" aria-hidden />
          ) : (
            <Link
              href={accountHref}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-3 text-sm font-semibold text-ink"
            >
              {t.nav.signIn}
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-cream/95 backdrop-blur-xl md:hidden"
          >
            <nav
              className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4"
              aria-label="Mobile"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-card hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                {signedIn ? (
                  <Link href="/billing" onClick={() => setMobileOpen(false)}>
                    <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-semibold text-ink">
                      {planLabel}
                      <span aria-hidden>{planIcon}</span>
                    </span>
                  </Link>
                ) : null}
                <Link href={accountHref} onClick={() => setMobileOpen(false)}>
                  {signedIn ? (
                    <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-semibold text-ink">
                      <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-cream-muted">
                        {photoURL ? (
                          <Image src={photoURL} alt="" fill className="object-cover" sizes="28px" />
                        ) : (
                          <span className="flex size-full items-center justify-center text-xs font-bold text-ink-soft">
                            {(firstName || t.nav.profile).slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </span>
                      {firstName || t.nav.profile}
                    </span>
                  ) : (
                    <span className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-ink">
                      {t.nav.signIn}
                    </span>
                  )}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
