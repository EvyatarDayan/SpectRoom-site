export type Locale = "en" | "sv" | "da" | "no" | "fi" | "is";

export const DEFAULT_LOCALE: Locale = "sv";

export const LANG_META: Record<
  Locale,
  { flag: string; short: string; menuLabel: string }
> = {
  sv: { flag: "🇸🇪", short: "SV", menuLabel: "Svenska" },
  en: { flag: "🇬🇧", short: "EN", menuLabel: "English" },
  da: { flag: "🇩🇰", short: "DA", menuLabel: "Danish" },
  no: { flag: "🇳🇴", short: "NO", menuLabel: "Norwegian" },
  fi: { flag: "🇫🇮", short: "FI", menuLabel: "Finnish" },
  is: { flag: "🇮🇸", short: "IS", menuLabel: "Icelandic" },
};

export const LOCALE_STORAGE_KEY = "spectroom-locale";

export type Dictionary = {
  nav: {
    about: string;
    featuresSafety: string;
    supportFaq: string;
    downloads: string;
    getEarlyAccess: string;
    openMenu: string;
    closeMenu: string;
    themeToLight: string;
    themeToDark: string;
  };
  app: {
    name: string;
    tagline: string;
    supportEmail: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    description: string;
    notice: string;
    primaryCta: string;
    secondaryCta: string;
  };
  about: {
    heading: string;
    paragraphs: string[];
    sections: { title: string; body: string }[];
    studio: {
      heading: string;
      paragraphs: string[];
      sections: { title: string; body: string }[];
      visitLink: string;
    };
  };
  features: {
    heading: string;
    subtitle: string;
    items: {
      title: string;
      subtitle: string;
      body: string;
      image: string;
      imageAlt: string;
    }[];
    trust: { icon: "shield" | "lock" | "heart"; title: string; body: string }[];
  };
  privacy: {
    heading: string;
    intro: string;
    sections: {
      title: string;
      lead?: string;
      paragraphs: string[];
      closing?: string;
      closingLead?: string;
      closingItems?: string[];
    }[];
    questionsPrefix: string;
  };
  steps: {
    heading: string;
    items: {
      step: number;
      title: string;
      detail: string;
      image: string;
      imageAlt: string;
    }[];
  };
  faq: {
    heading: string;
    subtitle: string;
    searchLabel: string;
    searchPlaceholder: string;
    empty: string;
    tabs: {
      id: string;
      label: string;
      items: { question: string; answer: string }[];
    }[];
  };
  footer: {
    quickLinksTitle: string;
    supportTitle: string;
    needHelp: string;
    privacyPolicy: string;
    terms: string;
    guidelines: string;
    safetyCenter: string;
    copyright: string;
    badge2fa: string;
    badgePrivacy: string;
  };
  modal: {
    eyebrow: string;
    title: string;
    steps: string[];
    cta: string;
    note: string;
    close: string;
  };
  carousel: {
    region: string;
    previous: string;
    next: string;
    goTo: string;
  };
  downloads: {
    heading: string;
    subtitle: string;
    iosLabel: string;
    iosStore: string;
    androidLabel: string;
    androidStore: string;
  };
};
