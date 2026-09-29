"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/lib/LanguageProvider";

const trustIcons = {
  shield: ShieldCheck,
  lock: Lock,
  heart: HeartHandshake,
};

export default function FeatureGrid() {
  const { t } = useLanguage();

  return (
    <section
      id="features"
      className="relative scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2
            id="features-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            {t.features.heading}
          </h2>
          <p className="mt-4 text-base text-ink-soft sm:text-lg">
            {t.features.subtitle}
          </p>
        </motion.div>

        <ul className="grid gap-8 md:grid-cols-3 md:gap-6">
          {t.features.items.map((feature, index) => (
            <motion.li
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="relative mx-auto aspect-[9/19.5] w-full max-w-[220px]"
              >
                <Image
                  src={`${feature.image}?v=7`}
                  alt={feature.imageAlt}
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="440px"
                />
              </motion.div>
              <div className="mt-6 w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {feature.subtitle}
                </p>
                <h3 className="mt-1.5 text-lg font-bold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {feature.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {t.features.trust.map((item, index) => {
            const Icon = trustIcons[item.icon];
            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon size={20} aria-hidden />
                </div>
                <h3 className="font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
