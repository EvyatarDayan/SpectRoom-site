"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageProvider";

const AUTO_MS = 10000;

const screenSrcs = [
  "/assets/carousel-discover.png",
  "/assets/carousel-profile.png",
  "/assets/carousel-chat.png",
  "/assets/carousel-matches.png",
] as const;

function slideRole(index: number, active: number, total: number) {
  const raw = index - active;
  const wrapped =
    raw > total / 2
      ? raw - total
      : raw < -total / 2
        ? raw + total
        : raw;

  if (wrapped === 0) return "center" as const;
  if (wrapped === -1) return "left" as const;
  if (wrapped === 1) return "right" as const;
  return "hidden" as const;
}

/** Positions stay inside the stage; side phones peek without expanding page width. */
const slideClass: Record<"center" | "left" | "right" | "hidden", string> = {
  center:
    "z-40 opacity-100 h-[400px] w-[194px] sm:h-[500px] sm:w-[242px] [transform:translate(-50%,-50%)]",
  left: "z-30 hidden opacity-100 h-[340px] w-[165px] sm:block sm:h-[400px] sm:w-[194px] [transform:translate(-112%,-50%)_rotateY(14deg)]",
  right:
    "z-30 hidden opacity-100 h-[340px] w-[165px] sm:block sm:h-[400px] sm:w-[194px] [transform:translate(12%,-50%)_rotateY(-14deg)]",
  hidden:
    "z-10 h-[340px] w-[165px] opacity-0 pointer-events-none sm:h-[400px] sm:w-[194px] [transform:translate(-50%,-50%)]",
};

export default function PhoneMockup() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = screenSrcs.length;
  const screens = screenSrcs.map((src, i) => ({
    src,
    alt: `${t.app.name} ${i + 1}`,
  }));

  const showPrev = useCallback(() => {
    setActive((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const showNext = useCallback(() => {
    setActive((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(showNext, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, showNext, total]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[min(100%,440px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="relative h-[440px] w-full overflow-hidden sm:h-[540px]"
        style={{ perspective: "900px" }}
        role="region"
        aria-roledescription="carousel"
        aria-label={t.carousel.region}
      >
        {screens.map((screen, index) => {
          const role = slideRole(index, active, total);
          return (
            <div
              key={screen.src}
              className={`absolute left-1/2 top-1/2 origin-center transition-[transform,opacity,width,height] duration-[450ms] ease-out ${slideClass[role]}`}
              aria-hidden={role !== "center"}
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={`${screen.src}?v=7`}
                  alt={screen.alt}
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="(max-width: 640px) 388px, 484px"
                  priority={index <= 1}
                />
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={showPrev}
          aria-label={t.carousel.previous}
          className="absolute left-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={showNext}
          aria-label={t.carousel.next}
          className="absolute right-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        {screens.map((screen, i) => (
          <button
            key={screen.src}
            type="button"
            aria-label={`${t.carousel.goTo} ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-4 bg-primary" : "w-1.5 bg-ink-muted/35"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
