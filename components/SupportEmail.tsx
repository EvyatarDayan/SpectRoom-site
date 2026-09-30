"use client";

import type { ReactNode } from "react";

const SUPPORT_EMAIL = "spectroom.support@gmail.com";
const CONTACT_PLACEHOLDER = "{{contactUs}}";

const LINK_CLASS =
  "font-semibold text-primary underline-offset-2 transition-colors hover:text-primary-hover hover:underline";

/** Renders plain text with the support email as a blue mailto link. */
export function withSupportEmailLinks(text: string): ReactNode {
  if (!text.includes(SUPPORT_EMAIL)) return text;

  const parts = text.split(SUPPORT_EMAIL);
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 ? (
        <a href={`mailto:${SUPPORT_EMAIL}`} className={LINK_CLASS}>
          {SUPPORT_EMAIL}
        </a>
      ) : null}
    </span>
  ));
}

/** Replaces {{contactUs}} (or the support email) with a Contact us action. */
export function withSupportContactLinks(
  text: string,
  contactLabel: string,
  onContact: () => void
): ReactNode {
  const source = text.includes(CONTACT_PLACEHOLDER)
    ? text
    : text.includes(SUPPORT_EMAIL)
      ? text.replaceAll(SUPPORT_EMAIL, CONTACT_PLACEHOLDER)
      : text;

  if (!source.includes(CONTACT_PLACEHOLDER)) return source;

  const parts = source.split(CONTACT_PLACEHOLDER);
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 ? (
        <button type="button" onClick={onContact} className={LINK_CLASS}>
          {contactLabel}
        </button>
      ) : null}
    </span>
  ));
}

export function SupportEmailLink({ className }: { className?: string }) {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className={className ?? LINK_CLASS}
    >
      {SUPPORT_EMAIL}
    </a>
  );
}
