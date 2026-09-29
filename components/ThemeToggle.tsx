"use client";

import { useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { useLanguage } from "@/lib/LanguageProvider";
import { useTheme } from "@/lib/ThemeProvider";

const REST_LENGTH = 30;
const MAX_PULL = 68;
const TRIGGER_PULL = 40;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";
  const dragging = useRef(false);
  const triggered = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const pull = useMotionValue(0);
  const springPull = useSpring(pull, { stiffness: 420, damping: 28, mass: 0.55 });
  const cordHeight = useTransform(springPull, (v) => REST_LENGTH + v);

  const snapBack = () => {
    animate(pull, 0, { type: "spring", stiffness: 380, damping: 22 });
    triggered.current = false;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = true;
    triggered.current = false;
    setIsDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    const next = Math.max(0, Math.min(MAX_PULL, pull.get() + event.movementY));
    pull.set(next);

    if (!triggered.current && next >= TRIGGER_PULL) {
      triggered.current = true;
      // Pull cord = flip the light: dark when "off", light when "on".
      setTheme(isDark ? "light" : "dark");
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    snapBack();
  };

  return (
    <div className="relative z-20 flex h-10 w-10 shrink-0 justify-center overflow-visible">
      <button
        type="button"
        onClick={() => {
          if (isDragging) return;
          setTheme(isDark ? "light" : "dark");
        }}
        className={`relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
          isDark
            ? "border-border bg-card text-ink hover:bg-cream-muted"
            : "border-amber-300/45 bg-amber-200/45 text-ink hover:bg-amber-200/55"
        }`}
        aria-label={isDark ? t.nav.themeToLight : t.nav.themeToDark}
        aria-pressed={isDark}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -72, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 72, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.6 }}
            className="inline-flex"
          >
            {isDark ? <Moon size={18} aria-hidden /> : <Sun size={18} aria-hidden />}
          </motion.span>
        </AnimatePresence>
      </button>

      <motion.div
        className="absolute left-1/2 top-[36px] flex -translate-x-1/2 flex-col items-center"
        animate={isDragging ? { rotate: 0 } : { rotate: [-2.8, 2.8, -2.8] }}
        transition={
          isDragging
            ? { duration: 0.15 }
            : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <motion.div
          className="w-px origin-top bg-gradient-to-b from-ink/30 via-ink/45 to-ink/55"
          style={{ height: cordHeight }}
          aria-hidden
        />
        <motion.button
          type="button"
          aria-label={isDark ? t.nav.themeToLight : t.nav.themeToDark}
          className="pointer-events-auto -mt-px flex cursor-grab touch-none select-none flex-col items-center outline-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span
            className={`block size-2.5 rounded-full border shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-colors ${
              isDark
                ? "border-amber-200/90 bg-amber-100"
                : "border-ink/30 bg-[#f4f1ea]"
            }`}
            aria-hidden
          />
          <span
            className={`mt-1 h-3.5 w-[3px] rounded-full transition-colors ${
              isDark ? "bg-amber-100/95" : "bg-ink/45"
            }`}
            aria-hidden
          />
        </motion.button>
      </motion.div>
    </div>
  );
}
