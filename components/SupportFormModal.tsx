"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, PlusCircle, X } from "lucide-react";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/lib/AuthProvider";
import { useLanguage } from "@/lib/LanguageProvider";
import {
  SUPPORT_TOPICS,
  buildSupportMailto,
  isAllowedSupportImage,
  makeSupportTicketId,
  MAX_SUPPORT_IMAGE_BYTES,
  MAX_SUPPORT_MESSAGE,
  MIN_SUPPORT_MESSAGE,
  submitSupportMessage,
  type SupportTopicId,
} from "@/lib/firebase/support";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SupportFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [topic, setTopic] = useState<SupportTopicId>("safety");
  const [message, setMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [didAttemptSend, setDidAttemptSend] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [didSendSuccessfully, setDidSendSuccessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signedIn = Boolean(user);
  const showMinWarning =
    didAttemptSend &&
    !didSendSuccessfully &&
    message.trim().length < MIN_SUPPORT_MESSAGE;

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const clearPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setTopic("safety");
    setMessage("");
    setGuestName("");
    setGuestEmail("");
    clearPreview();
    setDidAttemptSend(false);
    setIsSending(false);
    setDidSendSuccessfully(false);
    setErrorMessage("");
  };

  const closeModal = () => {
    clearCloseTimer();
    onClose();
    resetForm();
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const topicLabel = (id: SupportTopicId) => t.support.topics[id];

  const handleImagePick = (file: File | null) => {
    if (!file) return;
    setErrorMessage("");

    if (!isAllowedSupportImage(file)) {
      setErrorMessage(t.support.errorUnsupported);
      return;
    }
    if (file.size > MAX_SUPPORT_IMAGE_BYTES) {
      setErrorMessage(t.support.errorTooLarge);
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreviewUrl(url);
    setImageFile(file);
  };

  const handleSend = async () => {
    if (isSending || didSendSuccessfully) return;

    setDidAttemptSend(true);
    setErrorMessage("");

    const trimmed = message.trim();
    if (trimmed.length < MIN_SUPPORT_MESSAGE) return;

    if (!signedIn) {
      const name = guestName.trim();
      const email = guestEmail.trim();
      if (!name) {
        setErrorMessage(t.support.guestNameRequired);
        return;
      }
      if (!email) {
        setErrorMessage(t.support.guestEmailRequired);
        return;
      }
      if (!isValidEmail(email)) {
        setErrorMessage(t.support.guestEmailInvalid);
        return;
      }

      setIsSending(true);
      const ticketId = makeSupportTicketId();
      const mailto = buildSupportMailto({
        ticketId,
        topic: topicLabel(topic),
        name,
        email,
        message: trimmed,
      });
      window.location.href = mailto;
      setIsSending(false);
      setDidSendSuccessfully(true);
      clearCloseTimer();
      closeTimerRef.current = setTimeout(() => closeModal(), 2000);
      return;
    }

    setIsSending(true);
    try {
      const ticketId = makeSupportTicketId();
      await submitSupportMessage({
        ticketId,
        userId: user!.uid,
        userName: profile?.name?.trim() || user!.displayName || "Unknown",
        userEmail: profile?.email?.trim() || user!.email || "",
        topic: topicLabel(topic),
        message: trimmed,
        imageFile,
      });
      setDidSendSuccessfully(true);
      clearCloseTimer();
      closeTimerRef.current = setTimeout(() => closeModal(), 2000);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      if (code === "image-too-large") {
        setErrorMessage(t.support.errorTooLarge);
      } else if (code === "image-unsupported") {
        setErrorMessage(t.support.errorUnsupported);
      } else {
        setErrorMessage(t.support.errorGeneric);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={isSending ? undefined : closeModal}
      labelledBy={titleId}
      overlayClassName="px-4 py-6"
      panelClassName="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-border bg-cream shadow-xl"
    >
      <div className="relative flex shrink-0 items-center px-4 py-3">
        <button
          type="button"
          onClick={closeModal}
          disabled={isSending}
          className="z-10 inline-flex h-9 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-cream-muted disabled:opacity-50"
        >
          {t.modal.close}
        </button>
        <h2
          id={titleId}
          className="pointer-events-none absolute inset-x-0 text-center text-base font-bold text-ink sm:text-lg"
        >
          {t.support.navTitle}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <h3 className="text-xl font-bold text-ink sm:text-2xl">
            {t.support.title}
          </h3>
          <p className="mt-2 text-sm text-ink-soft sm:text-base">
            {t.support.subtitle}
          </p>
        </div>

        {!signedIn ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="block text-left text-sm font-medium text-ink-muted">
              {t.support.guestName}
              <input
                type="text"
                value={guestName}
                disabled={didSendSuccessfully || isSending}
                onChange={(e) => setGuestName(e.target.value)}
                autoComplete="name"
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-ink outline-none transition-shadow placeholder:text-ink-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:opacity-50"
              />
            </label>
            <label className="block text-left text-sm font-medium text-ink-muted">
              {t.support.guestEmail}
              <input
                type="email"
                value={guestEmail}
                disabled={didSendSuccessfully || isSending}
                onChange={(e) => setGuestEmail(e.target.value)}
                autoComplete="email"
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-ink outline-none transition-shadow placeholder:text-ink-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:opacity-50"
              />
            </label>
          </div>
        ) : null}

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-ink-muted">
            {t.support.topicLabel}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {SUPPORT_TOPICS.map((id) => {
              const selected = id === topic;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={didSendSuccessfully || isSending}
                  onClick={() => {
                    if (didSendSuccessfully) {
                      setDidSendSuccessfully(false);
                      setDidAttemptSend(false);
                      setMessage("");
                      clearPreview();
                    }
                    setTopic(id);
                  }}
                  className={`rounded-full px-3.5 py-2.5 text-sm transition-colors disabled:opacity-60 ${
                    selected
                      ? "bg-primary font-semibold text-white"
                      : "border border-primary/30 bg-card font-medium text-ink hover:border-primary/50"
                  }`}
                >
                  {topicLabel(id)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="support-message"
            className="mb-2 block text-sm font-medium text-ink-muted"
          >
            {t.support.messageLabel}
          </label>
          <textarea
            id="support-message"
            value={message}
            disabled={didSendSuccessfully || isSending}
            maxLength={MAX_SUPPORT_MESSAGE}
            rows={6}
            placeholder={t.support.messagePlaceholder}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_SUPPORT_MESSAGE))}
            className={`w-full resize-none rounded-xl border bg-card px-3.5 py-3 text-sm leading-relaxed text-ink outline-none transition-shadow placeholder:text-ink-muted focus:ring-2 disabled:opacity-50 ${
              showMinWarning
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                : "border-border focus:border-primary/40 focus:ring-primary/15"
            }`}
          />
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p
              className={`text-sm font-bold text-red-600 ${
                showMinWarning ? "opacity-100" : "opacity-0"
              }`}
              aria-live="polite"
            >
              {t.support.messageMinChars}
            </p>
            <p className="text-xs text-ink-muted">
              {message.length} / {MAX_SUPPORT_MESSAGE}
            </p>
          </div>
        </div>

        {signedIn ? (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-ink-muted">
              {t.support.attachmentLabel}
            </p>

            {previewUrl && imageFile ? (
              <div
                className={`flex items-center gap-3 rounded-xl border border-border bg-card p-3 ${
                  didSendSuccessfully ? "opacity-50" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt=""
                  className="size-[72px] shrink-0 rounded-[10px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {t.support.attachmentAdded}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {t.support.attachmentHint}
                  </p>
                </div>
                {!didSendSuccessfully ? (
                  <button
                    type="button"
                    onClick={clearPreview}
                    disabled={isSending}
                    aria-label={t.support.attachmentRemove}
                    className="rounded-full p-1 text-ink-muted transition-colors hover:bg-cream-muted hover:text-ink disabled:opacity-50"
                  >
                    <X size={22} />
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  disabled={didSendSuccessfully || isSending}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-primary/25 bg-card px-3.5 py-3.5 text-left text-sm font-medium text-primary transition-colors hover:border-primary/40 disabled:opacity-50"
                >
                  <ImagePlus size={18} aria-hidden />
                  <span className="flex-1">{t.support.attachmentAdd}</span>
                  <PlusCircle size={18} aria-hidden />
                </button>
                <p className="mt-2 text-xs text-ink-muted">
                  {t.support.attachmentHint}
                </p>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
              className="hidden"
              onChange={(e) => {
                handleImagePick(e.target.files?.[0] ?? null);
              }}
            />
          </div>
        ) : null}

        {errorMessage ? (
          <p role="alert" className="mt-4 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={isSending || didSendSuccessfully}
          className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-90 ${
            didSendSuccessfully
              ? "bg-green-500"
              : "bg-primary hover:bg-primary-hover"
          }`}
        >
          {isSending ? (
            <Spinner
              className="size-5 border-white/30 border-t-white"
              label={t.support.buttonSend}
            />
          ) : didSendSuccessfully ? (
            t.support.buttonSent
          ) : (
            t.support.buttonSend
          )}
        </button>
      </div>
    </Modal>
  );
}
