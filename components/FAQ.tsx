"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useLanguage } from "@/lib/LanguageProvider";
import { useSupportModal } from "@/lib/SupportModalProvider";
import { withSupportContactLinks } from "@/components/SupportEmail";

export default function FAQ() {
  const { t, locale } = useLanguage();
  const { openSupport } = useSupportModal();
  const tabs = t.faq.tabs;
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Reset tab when language changes if id still valid
  const currentTabId = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : tabs[0].id;

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return tabs.flatMap((tab) =>
        tab.items.filter(
          (item) =>
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q)
        )
      );
    }
    return tabs.find((tab) => tab.id === currentTabId)?.items ?? [];
  }, [currentTabId, query, tabs]);

  const searching = query.trim().length > 0;

  return (
    <section
      id="faq"
      className="relative scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          key={locale}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <h2
            id="faq-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            {t.faq.heading}
          </h2>
          <p className="mt-4 text-base text-ink-soft sm:text-lg">
            {t.faq.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="border-b border-border p-4 sm:p-5">
            <label htmlFor="faq-search" className="sr-only">
              {t.faq.searchLabel}
            </label>
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-hidden
              />
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpenIndex(0);
                }}
                placeholder={t.faq.searchPlaceholder}
                className="h-11 w-full rounded-xl border border-border bg-cream pl-10 pr-4 text-sm text-ink outline-none transition-shadow placeholder:text-ink-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>

          {!searching && (
            <div
              role="tablist"
              aria-label="FAQ categories"
              className="flex flex-wrap gap-1 border-b border-border px-3 pt-3 sm:px-4"
            >
              {tabs.map((tab) => {
                const selected = currentTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setOpenIndex(0);
                    }}
                    className={`shrink-0 rounded-t-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                      selected
                        ? "bg-cream text-ink"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          <div
            role={searching ? undefined : "tabpanel"}
            id={searching ? undefined : `panel-${currentTabId}`}
            aria-labelledby={searching ? undefined : `tab-${currentTabId}`}
            className="px-5 sm:px-6"
          >
            {filteredItems.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">
                {t.faq.empty}
              </p>
            ) : (
              filteredItems.map((item, index) => {
                const open = openIndex === index;
                const panelId = `faq-panel-${index}`;
                const buttonId = `faq-button-${index}`;
                return (
                  <div
                    key={item.question}
                    className="border-b border-border last:border-b-0"
                  >
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() =>
                          setOpenIndex((prev) =>
                            prev === index ? null : index
                          )
                        }
                        className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:text-primary"
                      >
                        <span className="text-[15px] font-semibold leading-snug text-ink">
                          {item.question}
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
                          transition={{
                            duration: 0.25,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pr-8 text-sm leading-relaxed text-ink-soft">
                            {withSupportContactLinks(
                              item.answer,
                              t.support.sectionCta,
                              openSupport
                            )}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
