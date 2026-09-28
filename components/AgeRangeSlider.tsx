"use client";

import { useCallback, useRef } from "react";

const THUMB = 28;

export default function AgeRangeSlider({
  min,
  max,
  absoluteMin,
  absoluteMax,
  onChangeMin,
  onChangeMax,
}: {
  min: number;
  max: number;
  absoluteMin: number;
  absoluteMax: number;
  onChangeMin: (value: number) => void;
  onChangeMax: (value: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);

  const ageFromClientX = useCallback(
    (clientX: number) => {
      const el = track.current;
      if (!el) return min;
      const rect = el.getBoundingClientRect();
      const usable = Math.max(rect.width - THUMB, 1);
      const relative = (clientX - rect.left - THUMB / 2) / usable;
      const span = Math.max(absoluteMax - absoluteMin, 1);
      const raw = absoluteMin + relative * span;
      return Math.round(Math.min(absoluteMax, Math.max(absoluteMin, raw)));
    },
    [absoluteMax, absoluteMin, min]
  );

  const onPointerDown = (which: "min" | "max") => (event: React.PointerEvent) => {
    event.preventDefault();
    dragging.current = which;
    event.currentTarget.setPointerCapture(event.pointerId);
    const age = ageFromClientX(event.clientX);
    if (which === "min") onChangeMin(age);
    else onChangeMax(age);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    const age = ageFromClientX(event.clientX);
    if (dragging.current === "min") onChangeMin(age);
    else onChangeMax(age);
  };

  const onPointerUp = () => {
    dragging.current = null;
  };

  const span = Math.max(absoluteMax - absoluteMin, 1);
  const minPct = ((min - absoluteMin) / span) * 100;
  const maxPct = ((max - absoluteMin) / span) * 100;

  return (
    <div ref={track} className="relative h-11 w-full select-none touch-none">
      <div
        className="absolute left-[14px] right-[14px] top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-ink/[0.08] dark:bg-white/10"
        aria-hidden
      />
      <div
        className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/45 to-primary"
        style={{
          left: `calc(14px + (100% - 28px) * ${minPct / 100})`,
          width: `calc((100% - 28px) * ${(maxPct - minPct) / 100})`,
        }}
        aria-hidden
      />
      <Thumb
        pct={minPct}
        z={dragging.current === "min" ? 3 : 1}
        label={`${min}`}
        onPointerDown={onPointerDown("min")}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      <Thumb
        pct={maxPct}
        z={2}
        label={`${max}`}
        onPointerDown={onPointerDown("max")}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </div>
  );
}

function Thumb({
  pct,
  z,
  label,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  pct: number;
  z: number;
  label: string;
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerUp: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="absolute top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
      style={{
        left: `calc(14px + (100% - 28px) * ${pct / 100})`,
        zIndex: z,
      }}
    >
      <span className="pointer-events-none relative mx-auto block h-7 w-7 rounded-full border-[3px] border-primary bg-card shadow-[0_2px_5px_rgba(0,0,0,0.18)]">
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
      </span>
    </button>
  );
}
