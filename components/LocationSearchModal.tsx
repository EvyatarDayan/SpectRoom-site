"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, MapPin, Search, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageProvider";
import { searchSwedenLocations, type LocationSuggestion } from "@/lib/firebase/locationSearch";
import type { ProfileLocation } from "@/lib/firebase/profile";
import { SWEDEN_BOUNDS } from "@/lib/firebase/profileLimits";

function osmEmbed(lat?: number | null, lng?: number | null) {
  if (lat != null && lng != null) {
    const delta = 0.02;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;
  }
  const { minLng, minLat, maxLng, maxLat } = SWEDEN_BOUNDS;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik`;
}

export default function LocationSearchModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (location: ProfileLocation) => void;
}) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [preview, setPreview] = useState<LocationSuggestion | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults([]);
    setPreview(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    const handle = window.setTimeout(async () => {
      setSearching(true);
      try {
        setResults(await searchSwedenLocations(trimmed));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => window.clearTimeout(handle);
  }, [open, query]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const mapSrc = useMemo(
    () => osmEmbed(preview?.latitude, preview?.longitude),
    [preview]
  );

  if (!open) return null;

  const trimmed = query.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-search-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-xl">
        <div className="relative flex items-center px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-ink-soft hover:text-ink"
          >
            {t.profile.cancel}
          </button>
          <h2
            id="location-search-title"
            className="absolute inset-x-16 text-center text-base font-bold text-ink"
          >
            {t.profile.searchAddress}
          </h2>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4">
          <label className="flex h-12 items-center gap-2 rounded-[10px] border border-border bg-cream px-3">
            <Search size={18} className="shrink-0 text-ink-muted" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (!event.target.value.trim()) setPreview(null);
              }}
              placeholder={t.profile.locationSearchPlaceholder}
              autoFocus
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setPreview(null);
                }}
                className="text-ink-muted hover:text-ink"
                aria-label={t.profile.cancel}
              >
                <X size={18} />
              </button>
            ) : null}
          </label>

          <p className="text-xs text-ink-muted">{t.profile.locationSwedenOnly}</p>

          {trimmed ? (
            <div className="max-h-[180px] overflow-y-auto">
              {searching && results.length === 0 ? (
                <p className="py-3 text-center text-sm text-ink-muted">
                  {t.profile.locationSearching}
                </p>
              ) : results.length === 0 ? (
                <p className="py-3 text-center text-sm text-ink-muted">
                  {t.profile.noLocationResults}
                </p>
              ) : (
                <ul className="space-y-2">
                  {results.map((result) => {
                    const selected =
                      preview?.latitude === result.latitude &&
                      preview?.longitude === result.longitude &&
                      preview.displayString === result.displayString;
                    const title = result.title || result.displayString;
                    const subtitle = result.subtitle;
                    return (
                      <li key={`${result.latitude}-${result.longitude}-${result.displayString}`}>
                        <button
                          type="button"
                          onClick={() => setPreview(result)}
                          className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left ${
                            selected ? "bg-primary-soft" : "bg-cream-muted/60 hover:bg-cream-muted"
                          }`}
                        >
                          <MapPin
                            size={20}
                            className={`mt-0.5 shrink-0 ${selected ? "text-primary" : "text-ink-muted"}`}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-ink">{title}</span>
                            {subtitle ? (
                              <span className="mt-0.5 block text-xs text-ink-muted">
                                {subtitle}
                              </span>
                            ) : null}
                          </span>
                          {selected ? (
                            <Check size={20} className="mt-0.5 shrink-0 text-primary" />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : null}

          <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl border border-border">
            <iframe
              title={t.profile.searchAddress}
              src={mapSrc}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
            />
            {preview ? (
              <p className="pointer-events-none absolute left-3 top-3 max-w-[80%] rounded-xl bg-card/90 px-3 py-2 text-xs font-medium text-ink shadow-sm backdrop-blur">
                {preview.displayString}
              </p>
            ) : null}
          </div>

          {preview ? (
            <button
              type="button"
              onClick={() => {
                onSelect(preview);
                onClose();
              }}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary-hover"
            >
              <Check size={18} />
              {t.profile.locationUseAddress}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
