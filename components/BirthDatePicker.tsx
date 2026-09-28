"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Locale } from "@/lib/i18n/types";
import {
  ageFromBirthDate,
  MAX_AGE,
  MIN_AGE,
  toIsoDate,
} from "@/lib/firebase/profileLimits";

const ITEM_H = 40;

function intlLocale(locale: Locale) {
  return locale === "no" ? "nb" : locale;
}

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return {
    year: year || new Date().getFullYear() - MIN_AGE,
    month: month || 1,
    day: day || 1,
  };
}

function padIso(year: number, month: number, day: number) {
  const days = daysInMonth(year, month);
  return `${year}-${String(month).padStart(2, "0")}-${String(
    Math.min(day, days)
  ).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function clampToAllowed(iso: string) {
  const min = new Date();
  min.setFullYear(min.getFullYear() - MAX_AGE);
  const max = new Date();
  max.setFullYear(max.getFullYear() - MIN_AGE);
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return toIsoDate(max);
  if (date < min) return toIsoDate(min);
  if (date > max) return toIsoDate(max);
  return iso;
}

function WheelColumn({
  items,
  value,
  onChange,
}: {
  items: { value: number; label: string }[];
  value: number;
  onChange: (value: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const ignore = useRef(false);
  const timer = useRef<number | null>(null);

  const scrollToValue = (next: number, behavior: ScrollBehavior = "auto") => {
    const el = scroller.current;
    if (!el) return;
    const index = items.findIndex((item) => item.value === next);
    if (index < 0) return;
    ignore.current = true;
    el.scrollTo({ top: index * ITEM_H, behavior });
    window.setTimeout(() => {
      ignore.current = false;
    }, 80);
  };

  useEffect(() => {
    scrollToValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, items.length]);

  const commit = () => {
    const el = scroller.current;
    if (!el || ignore.current) return;
    const index = Math.max(
      0,
      Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H))
    );
    const item = items[index];
    if (item && item.value !== value) onChange(item.value);
  };

  return (
    <div className="relative h-[200px] flex-1 overflow-hidden">
      <div
        ref={scroller}
        onScroll={() => {
          if (timer.current) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(commit, 80);
        }}
        className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "y mandatory" }}
      >
        <div style={{ height: ITEM_H * 2 }} />
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              onChange(item.value);
              scrollToValue(item.value, "smooth");
            }}
            className={`flex w-full items-center justify-center text-[15px] transition-colors ${
              item.value === value
                ? "font-semibold text-ink"
                : "font-medium text-ink-muted"
            }`}
            style={{ height: ITEM_H, scrollSnapAlign: "center" }}
          >
            {item.label}
          </button>
        ))}
        <div style={{ height: ITEM_H * 2 }} />
      </div>
    </div>
  );
}

export default function BirthDatePicker({
  value,
  onChange,
  ageLabel,
  locale,
}: {
  value: string;
  onChange: (next: string) => void;
  ageLabel: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const safe = clampToAllowed(value);
  const parts = parseIso(safe);
  const bcp = intlLocale(locale);

  const formatted = useMemo(() => {
    const date = new Date(`${safe}T00:00:00`);
    return new Intl.DateTimeFormat(bcp, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }, [safe, bcp]);

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        return {
          value: month,
          label: new Intl.DateTimeFormat(bcp, { month: "long" }).format(
            new Date(2000, index, 1)
          ),
        };
      }),
    [bcp]
  );

  const years = useMemo(() => {
    const max = new Date().getFullYear() - MIN_AGE;
    const min = new Date().getFullYear() - MAX_AGE;
    return Array.from({ length: max - min + 1 }, (_, index) => {
      const year = min + index;
      return { value: year, label: String(year) };
    });
  }, []);

  const days = useMemo(() => {
    const count = daysInMonth(parts.year, parts.month);
    return Array.from({ length: count }, (_, index) => {
      const day = index + 1;
      return { value: day, label: String(day) };
    });
  }, [parts.year, parts.month]);

  const setPart = (next: { year?: number; month?: number; day?: number }) => {
    onChange(
      clampToAllowed(
        padIso(
          next.year ?? parts.year,
          next.month ?? parts.month,
          next.day ?? parts.day
        )
      )
    );
  };

  const age = ageFromBirthDate(safe);

  return (
    <div className="mx-auto w-1/2">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative w-full rounded-xl border border-primary/25 bg-primary-soft px-4 py-3 text-center"
      >
        <p className="text-xl font-semibold tracking-tight text-ink">{formatted}</p>
        <p className="mt-1 text-sm font-medium text-primary">
          {ageLabel.replace("%@", String(age))}
        </p>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {open ? (
        <div className="relative mt-3 overflow-hidden rounded-xl border border-border bg-card">
          <div className="pointer-events-none absolute inset-x-3 top-1/2 z-10 h-10 -translate-y-1/2 rounded-xl bg-ink/[0.06] dark:bg-white/10" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-gradient-to-b from-card to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12 bg-gradient-to-t from-card to-transparent" />
          <div className="relative flex">
            <WheelColumn
              items={days}
              value={Math.min(parts.day, days.length)}
              onChange={(day) => setPart({ day })}
            />
            <WheelColumn
              items={months}
              value={parts.month}
              onChange={(month) => setPart({ month })}
            />
            <WheelColumn
              items={years}
              value={parts.year}
              onChange={(year) => setPart({ year })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
