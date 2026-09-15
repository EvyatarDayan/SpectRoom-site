"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageProvider";

/** Store URLs - fill in when App Store / Play links are ready. */
export const IOS_DOWNLOAD_URL = "";
export const ANDROID_DOWNLOAD_URL = "";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 2.89 1.98-.07.04-1.73 1.01-1.71 3.03.03 2.4 2.11 3.2 2.14 3.21-.02.06-.33 1.14-.98 2.24zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3.6 2.7c-.3.2-.6.6-.6 1.1v16.4c0 .5.3.9.6 1.1l9.1-9.3L3.6 2.7zm11.1 6.3-2.1 1.2 2.4 2.4 2.1-1.2c.9-.5.9-1.9 0-2.4l-2.4-1zm-2.1 6.4-2.4 2.4 8.8 5c.5-.1.8-.5.8-1V16l-7.2-2.6zm8.9-9.1-8.8-5-2.4 2.4 7.2 4.1 4-1.5z" />
    </svg>
  );
}

type StoreButtonProps = {
  href: string;
  label: string;
  store: string;
  icon: "apple" | "play";
};

function StoreButton({ href, label, store, icon }: StoreButtonProps) {
  const className =
    "inline-flex h-[52px] min-w-[168px] items-center gap-3 rounded-xl bg-[#1c1c1e] px-4 text-left text-white transition-all hover:bg-[#2c2c2e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70";

  const content = (
    <>
      {icon === "apple" ? (
        <AppleIcon className="h-7 w-7 shrink-0" />
      ) : (
        <PlayIcon className="h-6 w-6 shrink-0" />
      )}
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium opacity-85">{label}</span>
        <span className="mt-1 text-[17px] font-semibold tracking-tight">
          {store}
        </span>
      </span>
    </>
  );

  if (!href) {
    return (
      <button type="button" className={className} disabled aria-disabled="true">
        {content}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  );
}

export default function DownloadsSection() {
  const { t } = useLanguage();

  return (
    <section
      id="downloads"
      className="relative scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="downloads-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="downloads-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            {t.downloads.heading}
          </h2>
          <p className="mt-4 text-base text-ink-soft sm:text-lg">
            {t.downloads.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <StoreButton
            href={IOS_DOWNLOAD_URL}
            label={t.downloads.iosLabel}
            store={t.downloads.iosStore}
            icon="apple"
          />
          <StoreButton
            href={ANDROID_DOWNLOAD_URL}
            label={t.downloads.androidLabel}
            store={t.downloads.androidStore}
            icon="play"
          />
        </motion.div>
      </div>
    </section>
  );
}
