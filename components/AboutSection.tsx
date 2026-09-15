"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageProvider";

export default function AboutSection() {
  const { t } = useLanguage();
  const about = t.about;

  return (
    <section
      id="about"
      className="relative scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <h2
            id="about-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            {about.heading}
          </h2>

          <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {about.sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold text-ink">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div className="my-10 h-px bg-border" role="separator" />

          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {about.studio.heading}
          </h2>

          <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            {about.studio.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 space-y-6">
            {about.studio.sections.map((section, index) => (
              <div key={section.body}>
                {section.title ? (
                  <h3 className="text-lg font-semibold text-ink">
                    {section.title}
                  </h3>
                ) : null}
                <p
                  className={`text-sm leading-relaxed text-ink-soft sm:text-base ${
                    section.title ? "mt-2" : ""
                  }`}
                >
                  {section.body}
                </p>
                {index === about.studio.sections.length - 1 ? (
                  <p className="mt-4">
                    <a
                      href="https://abashelari.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:text-primary-hover"
                    >
                      {about.studio.visitLink}
                    </a>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
