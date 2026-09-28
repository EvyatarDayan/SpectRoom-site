"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/LanguageProvider";
import { mapAuthError, useAuth } from "@/lib/AuthProvider";

const CODE_LENGTH = 6;

function digitsOnly(value: string) {
  return value.replace(/\D/g, "").slice(0, CODE_LENGTH);
}

export default function SignInPage() {
  const { t } = useLanguage();
  const { user, loading, step, signIn, verifyMfaCode, resetSignIn } = useAuth();
  const router = useRouter();
  const codeInputs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<
    | "errorInvalid"
    | "errorCode"
    | "errorMfa"
    | "errorBanned"
    | "errorDeleted"
    | "errorFrozen"
    | "errorGeneric"
    | null
  >(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/profile");
    }
  }, [loading, user, router]);

  const errorMessage = errorKey ? t.auth[errorKey] : null;

  const handleCredentials = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorKey(null);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      const mapped = mapAuthError(error);
      const keyMap = {
        invalid: "errorInvalid",
        code: "errorCode",
        mfa: "errorMfa",
        banned: "errorBanned",
        deleted: "errorDeleted",
        frozen: "errorFrozen",
        generic: "errorGeneric",
      } as const;
      setErrorKey(keyMap[mapped]);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === "mfa") {
      codeInputs.current[0]?.focus();
    }
  }, [step]);

  const handleCode = async (event: FormEvent) => {
    event.preventDefault();
    if (code.length < CODE_LENGTH) return;
    setSubmitting(true);
    setErrorKey(null);
    try {
      await verifyMfaCode(code);
      router.replace("/profile");
    } catch (error) {
      const mapped = mapAuthError(error);
      const keyMap = {
        invalid: "errorInvalid",
        code: "errorCode",
        mfa: "errorMfa",
        banned: "errorBanned",
        deleted: "errorDeleted",
        frozen: "errorFrozen",
        generic: "errorGeneric",
      } as const;
      setErrorKey(keyMap[mapped]);
    } finally {
      setSubmitting(false);
    }
  };

  const updateCode = (next: string, focusIndex?: number) => {
    const trimmed = digitsOnly(next);
    setCode(trimmed);
    const nextFocus = focusIndex ?? Math.min(trimmed.length, CODE_LENGTH - 1);
    window.requestAnimationFrame(() => {
      codeInputs.current[nextFocus]?.focus();
    });
  };

  const onDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      updateCode(value, Math.min(digitsOnly(value).length, CODE_LENGTH - 1));
      return;
    }
    const digit = digitsOnly(value).slice(-1);
    const chars = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] ?? "");
    chars[index] = digit;
    updateCode(chars.join(""), digit ? Math.min(index + 1, CODE_LENGTH - 1) : index);
  };

  const onDigitKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      event.preventDefault();
      const chars = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] ?? "");
      chars[index - 1] = "";
      updateCode(chars.join(""), index - 1);
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      codeInputs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      codeInputs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex max-w-md flex-col px-5 pb-16 pt-28 sm:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          {step === "mfa" ? t.auth.codeTitle : t.auth.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {step === "mfa" ? t.auth.codeSubtitle : t.auth.subtitle}
        </p>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200"
          >
            {errorMessage}
          </p>
        ) : null}

        {step === "mfa" ? (
          <form onSubmit={handleCode} className="mt-6 space-y-5">
            <div className="flex gap-2.5" role="group" aria-label={t.auth.codeLabel}>
              {Array.from({ length: CODE_LENGTH }, (_, index) => (
                <input
                  key={index}
                  ref={(node) => {
                    codeInputs.current[index] = node;
                  }}
                  value={code[index] ?? ""}
                  onChange={(event) => onDigitChange(index, event.target.value)}
                  onKeyDown={(event) => onDigitKeyDown(index, event)}
                  onFocus={(event) => event.target.select()}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={index === 0 ? CODE_LENGTH : 1}
                  aria-label={`${t.auth.codeLabel} ${index + 1}`}
                  className="h-14 min-w-0 flex-1 rounded-xl border border-black/20 bg-black/[0.06] text-center text-xl font-semibold tabular-nums text-ink outline-none focus:border-2 focus:border-primary dark:border-white/25 dark:bg-white/10"
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  resetSignIn();
                  setCode("");
                  setErrorKey(null);
                }}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-ink hover:bg-cream-muted"
              >
                {t.auth.back}
              </button>
              <button
                type="submit"
                disabled={submitting || code.length < CODE_LENGTH}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
              >
                {submitting ? t.auth.verifying : t.auth.verify}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCredentials} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                {t.auth.email}
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-ink outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                {t.auth.password}
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-ink outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? t.auth.submitting : t.auth.submit}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink-muted">{t.auth.noAccount}</p>
        <div id="mfa-recaptcha" />
      </main>
    </div>
  );
}
