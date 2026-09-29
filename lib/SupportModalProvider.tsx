"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import SupportFormModal from "@/components/SupportFormModal";

type SupportModalContextValue = {
  openSupport: () => void;
  closeSupport: () => void;
};

const SupportModalContext = createContext<SupportModalContextValue | null>(null);

export function SupportModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSupport = useCallback(() => setOpen(true), []);
  const closeSupport = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openSupport, closeSupport }),
    [openSupport, closeSupport]
  );

  return (
    <SupportModalContext.Provider value={value}>
      {children}
      <SupportFormModal open={open} onClose={closeSupport} />
    </SupportModalContext.Provider>
  );
}

export function useSupportModal() {
  const ctx = useContext(SupportModalContext);
  if (!ctx) {
    throw new Error("useSupportModal must be used within SupportModalProvider");
  }
  return ctx;
}
