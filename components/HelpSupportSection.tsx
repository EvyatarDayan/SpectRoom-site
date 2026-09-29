"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageProvider";
import { useSupportModal } from "@/lib/SupportModalProvider";

export default function HelpSupportSection() {
  const { t, locale } = useLanguage();
  const { openSupport } = useSupportModal();

  return (
    <section
      id="help-support"
      className="relative scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="help-support-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          key={locale}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-xl text-center"
        >
          <h2
            id="help-support-heading"
            className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            {t.support.sectionHeading}
          </h2>
          <p className="mt-3 text-sm text-ink-soft sm:text-base">
            {t.support.sectionSubtitle}
          </p>
          <button
            type="button"
            onClick={openSupport}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
          >
            {t.support.sectionCta}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
