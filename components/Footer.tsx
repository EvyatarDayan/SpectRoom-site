"use client";

import Image from "next/image";
import { ShieldCheck, Lock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageProvider";
import { SupportEmailLink } from "@/components/SupportEmail";

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t.footer.privacyPolicy, href: "#privacy" },
    { label: t.footer.terms, href: "#privacy" },
    { label: t.footer.guidelines, href: "#privacy" },
    { label: t.footer.safetyCenter, href: "#privacy" },
  ];

  return (
    <footer className="border-t border-border bg-card" role="contentinfo">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 md:grid-cols-3 md:gap-6">
        <div>
          <a href="#top" className="flex items-center gap-2.5">
            <Image
              src="/assets/app-icon.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg"
            />
            <span className="text-lg font-extrabold tracking-tight text-ink">
              {t.app.name}
            </span>
          </a>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
            {t.app.tagline}.
          </p>
          <p className="mt-3 text-xs text-ink-muted">{t.footer.copyright}</p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            {t.footer.quickLinksTitle}
          </h2>
          <ul className="mt-2.5 space-y-1.5">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-ink-soft transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            {t.footer.supportTitle}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
            {t.footer.needHelp} <SupportEmailLink />
          </p>
        </div>
      </div>

      <div className="border-t border-border-soft">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-5 px-5 py-3 sm:justify-start sm:px-8">
          <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
            <ShieldCheck size={14} className="text-primary" aria-hidden />
            {t.footer.badge2fa}
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
            <Lock size={14} className="text-primary" aria-hidden />
            {t.footer.badgePrivacy}
          </div>
        </div>
      </div>
    </footer>
  );
}
