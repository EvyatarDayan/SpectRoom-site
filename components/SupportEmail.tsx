import type { ReactNode } from "react";

const SUPPORT_EMAIL = "spectroom.support@gmail.com";

const EMAIL_CLASS =
  "font-semibold text-primary underline-offset-2 transition-colors hover:text-primary-hover hover:underline";

/** Renders plain text with the support email as a blue mailto link. */
export function withSupportEmailLinks(text: string): ReactNode {
  if (!text.includes(SUPPORT_EMAIL)) return text;

  const parts = text.split(SUPPORT_EMAIL);
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 ? (
        <a href={`mailto:${SUPPORT_EMAIL}`} className={EMAIL_CLASS}>
          {SUPPORT_EMAIL}
        </a>
      ) : null}
    </span>
  ));
}

export function SupportEmailLink({ className }: { className?: string }) {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className={className ?? EMAIL_CLASS}
    >
      {SUPPORT_EMAIL}
    </a>
  );
}
