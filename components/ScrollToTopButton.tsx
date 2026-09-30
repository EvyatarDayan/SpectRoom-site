"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronsUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageProvider";

const SCROLL_ROOT = "[data-scroll-root]";

function maxScrollTop() {
  let top = window.scrollY || document.documentElement.scrollTop;
  document.querySelectorAll<HTMLElement>(SCROLL_ROOT).forEach((el) => {
    top = Math.max(top, el.scrollTop);
  });
  return top;
}

export default function ScrollToTopButton() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const update = () => {
      setVisible(maxScrollTop() >= window.innerHeight);
    };

    update();
    document.addEventListener("scroll", update, { capture: true, passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      document.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelectorAll<HTMLElement>(SCROLL_ROOT).forEach((el) => {
      el.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label={t.nav.scrollToTop}
          onClick={scrollToTop}
          className="fixed bottom-14 z-[90] inline-flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-ink shadow-lg shadow-ink/15 transition-colors hover:bg-cream-muted right-[max(1.25rem,calc((100vw-64rem)/2-4.75rem))]"
          initial={{ opacity: 0, y: 10, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.92 }}
          transition={{ duration: 0.18 }}
        >
          <ChevronsUp size={30} strokeWidth={2.25} aria-hidden />
        </motion.button>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
