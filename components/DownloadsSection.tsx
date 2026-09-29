"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageProvider";

/** Temporary QR destinations - replace when real store / TestFlight links are ready. */
export const IOS_DOWNLOAD_URL = "https://spectroom.app/#downloads-ios-temp";
export const ANDROID_DOWNLOAD_URL = "https://spectroom.app/#downloads-android-temp";

function qrSrc(data: string, size = 168) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(data)}`;
}

function QrCard({
  label,
  store,
  href,
}: {
  label: string;
  store: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="rounded-xl bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc(href)}
          alt=""
          width={168}
          height={168}
          className="size-[168px]"
        />
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-ink-muted">{label}</p>
        <p className="mt-0.5 text-base font-bold text-ink">{store}</p>
      </div>
    </div>
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
          className="mt-10 flex flex-wrap items-stretch justify-center gap-4 sm:gap-6"
        >
          <QrCard
            href={IOS_DOWNLOAD_URL}
            label={t.downloads.iosLabel}
            store={t.downloads.iosStore}
          />
          <QrCard
            href={ANDROID_DOWNLOAD_URL}
            label={t.downloads.androidLabel}
            store={t.downloads.androidStore}
          />
        </motion.div>
      </div>
    </section>
  );
}
