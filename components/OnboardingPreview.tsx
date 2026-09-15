"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageProvider";

/** Bold block arrow matching the process-flow icon style. */
function ProcessArrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 28"
      fill="currentColor"
      className={className}
    >
      <path d="M2 8.5c0-1.1.9-2 2-2h16.5v-3.2c0-1.5 1.7-2.3 2.9-1.4l14.2 10.1c1 0.7 1 2.1 0 2.8L23.4 24.9c-1.2.9-2.9.1-2.9-1.4v-3.2H4c-1.1 0-2-.9-2-2V8.5z" />
    </svg>
  );
}

export default function OnboardingPreview() {
  const { t } = useLanguage();
  const steps = t.steps.items;

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="onboarding-heading"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2
            id="onboarding-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            {t.steps.heading}
          </h2>
          <p className="mt-4 text-base text-ink-soft sm:text-lg">
            {t.hero.notice}
          </p>
        </motion.div>

        <ol className="grid gap-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
          {steps.map((step, index) => (
            <motion.li
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-5 w-full max-w-[200px]">
                <div className="absolute -right-1 -top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-white shadow-md sm:-right-2 sm:-top-3 sm:h-12 sm:w-12 sm:text-xl">
                  {step.step}
                </div>
                <div className="relative mx-auto aspect-[9/19.5] w-full">
                  <Image
                    src={`${step.image}?v=1`}
                    alt={step.imageAlt}
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="400px"
                    priority={index === 0}
                  />
                </div>
                {index < steps.length - 1 && (
                  <ProcessArrow
                    className={`pointer-events-none absolute top-1/2 z-20 h-7 w-10 text-emerald-500 sm:h-8 sm:w-11 ${
                      index % 2 === 0
                        ? "-right-4 hidden translate-x-full -translate-y-1/2 sm:block sm:-right-5"
                        : "-right-4 hidden translate-x-full -translate-y-1/2 lg:block lg:-right-5"
                    }`}
                  />
                )}
              </div>
              <h3 className="text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{step.detail}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
