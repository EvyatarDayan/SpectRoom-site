"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import { useLanguage } from "@/lib/LanguageProvider";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      className="relative overflow-hidden bg-cream pt-24 sm:pt-28"
      aria-labelledby="hero-heading"
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-6 sm:px-8 sm:pb-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6 lg:pb-24 lg:pt-4">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3.5 py-1.5 text-xs font-semibold text-ink-soft shadow-sm backdrop-blur"
          >
            {t.hero.badge}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-5 flex items-center gap-3"
          >
            <Image
              src="/assets/app-icon.png"
              alt="SpectRoom"
              width={56}
              height={56}
              className="h-14 w-14 rounded-[14px] shadow-md"
              priority
            />
            <div>
              <p className="text-sm font-medium text-ink-muted">
                {t.hero.titleLine1}
              </p>
              <h1
                id="hero-heading"
                className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
              >
                {t.hero.titleLine2}
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-2xl font-bold leading-snug tracking-tight text-ink sm:text-[1.85rem]"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#downloads"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            >
              {t.hero.primaryCta}
              <ArrowRight size={16} />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-semibold text-ink transition-all hover:bg-cream-muted"
            >
              {t.hero.secondaryCta}
            </a>
          </motion.div>
        </div>

        <div className="relative flex min-h-[440px] w-full max-w-full justify-center overflow-hidden sm:min-h-[540px] lg:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
