"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageProvider";
import { useSupportModal } from "@/lib/SupportModalProvider";
import { withSupportContactLinks } from "@/components/SupportEmail";

export default function PrivacySafetySection() {
  const { t } = useLanguage();
  const { openSupport } = useSupportModal();
  const privacy = t.privacy;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const withContact = (text: string) =>
    withSupportContactLinks(text, t.support.sectionCta, openSupport);

  return (
    <section
      id="privacy"
      className="relative scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="privacy-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <h2
            id="privacy-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            {privacy.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            {privacy.intro}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card px-5 shadow-sm sm:px-6"
        >
          {privacy.sections.map((section, index) => {
            const open = openIndex === index;
            const panelId = `privacy-panel-${index}`;
            const buttonId = `privacy-button-${index}`;
            return (
              <div
                key={section.title}
                className="border-b border-border last:border-b-0"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenIndex((prev) => (prev === index ? null : index))
                    }
                    className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-[15px] font-semibold leading-snug text-ink">
                      {section.title}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`mt-0.5 shrink-0 text-ink-muted transition-transform duration-200 ${
                        open ? "rotate-180 text-primary" : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pb-5 pr-8 text-sm leading-relaxed text-ink-soft">
                        {section.lead ? <p>{withContact(section.lead)}</p> : null}
                        <ul className="list-disc space-y-1.5 pl-5">
                          {section.paragraphs.map((item) => (
                            <li key={item}>{withContact(item)}</li>
                          ))}
                        </ul>
                        {section.closingLead ? (
                          <p className="pt-1">{withContact(section.closingLead)}</p>
                        ) : null}
                        {section.closingItems ? (
                          <ul className="list-disc space-y-1.5 pl-5">
                            {section.closingItems.map((item) => (
                              <li key={item}>{withContact(item)}</li>
                            ))}
                          </ul>
                        ) : null}
                        {section.closing ? (
                          <p className="font-medium text-ink">{withContact(section.closing)}</p>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
