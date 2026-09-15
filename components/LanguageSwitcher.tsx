"use client";

import { useEffect, useRef, useState } from "react";
import { LANG_META, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, langMeta } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-semibold text-ink transition-colors hover:bg-cream-muted"
        onClick={() => setOpen((v) => !v)}
        aria-label="Switch language"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span aria-hidden className="text-base leading-none">
          {langMeta.flag}
        </span>
        {langMeta.short}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-[60] min-w-[148px] overflow-hidden rounded-[10px] border border-border bg-card shadow-lg shadow-ink/10"
        >
          {(Object.keys(LANG_META) as Locale[]).map((code) => {
            const meta = LANG_META[code];
            const selected = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="menuitem"
                onClick={() => select(code)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-cream ${
                  selected ? "font-semibold text-ink" : "text-ink-soft"
                }`}
              >
                <span aria-hidden>{meta.flag}</span>
                {meta.menuLabel}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
