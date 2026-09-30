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
    signIn: string;
    profile: string;
    freePlan: string;
    proPlan: string;
    premiumPlan: string;
    scrollToTop: string;
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
  support: {
    sectionHeading: string;
    sectionSubtitle: string;
    sectionCta: string;
    navTitle: string;
    title: string;
    subtitle: string;
    topicLabel: string;
    topics: {
      safety: string;
      bug: string;
      feedback: string;
      other: string;
    };
    messageLabel: string;
    messagePlaceholder: string;
    messageMinChars: string;
    buttonSend: string;
    buttonSent: string;
    attachmentLabel: string;
    attachmentAdd: string;
    attachmentAdded: string;
    attachmentRemove: string;
    attachmentHint: string;
    guestName: string;
    guestEmail: string;
    guestNameRequired: string;
    guestEmailRequired: string;
    guestEmailInvalid: string;
    errorGeneric: string;
    errorTooLarge: string;
    errorUnsupported: string;
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
  auth: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    submitting: string;
    codeTitle: string;
    codeSubtitle: string;
    codeLabel: string;
    verify: string;
    verifying: string;
    back: string;
    noAccount: string;
    errorInvalid: string;
    errorCode: string;
    errorMfa: string;
    errorBanned: string;
    errorDeleted: string;
    errorFrozen: string;
    errorGeneric: string;
  };
  profile: {
    title: string;
    subtitle: string;
    signOut: string;
    signOutConfirm: string;
    cancel: string;
    loading: string;
    empty: string;
    backHome: string;
    save: string;
    saving: string;
    saved: string;
    savedButton: string;
    errorSave: string;
    completion: string;
    photosHint: string;
    name: string;
    email: string;
    emailPrivacy: string;
    locationPrivacy: string;
    dateOfBirth: string;
    myAge: string;
    profilePhoto: string;
    photos: string;
    add: string;
    changePhoto: string;
    aboutMe: string;
    bioMin: string;
    bioMax: string;
    preferences: string;
    iAm: string;
    interestedIn: string;
    lookingFor: string;
    preferredAge: string;
    lifestyle: string;
    bodyType: string;
    idealFirstDate: string;
    sensory: string;
    energy: string;
    energySubtitle: string;
    location: string;
    locationPlaceholder: string;
    searchAddress: string;
    locationSearchPlaceholder: string;
    locationSwedenOnly: string;
    locationSearching: string;
    locationUseAddress: string;
    noLocationResults: string;
    interests: string;
    genders: { man: string; woman: string; nonbinary: string };
    looking: {
      romantic: string;
      inPerson: string;
      online: string;
      hobby: string;
      notSure: string;
    };
    lifestyleOpts: {
      preferNot: string;
      independent: string;
      family: string;
      assisted: string;
    };
    bodyTypes: {
      preferNot: string;
      slim: string;
      average: string;
      athletic: string;
      fullBodied: string;
    };
    dates: {
      park: string;
      cafe: string;
      museum: string;
      cinema: string;
      video: string;
    };
    energyOpts: {
      low: string;
      lowDetail: string;
      moderate: string;
      moderateDetail: string;
      full: string;
      fullDetail: string;
    };
    interestLabels: Record<string, string>;
    sensoryOpts: Record<string, { title: string; subtitle: string }>;
    validation: {
      fullName: string;
      age: string;
      location: string;
      bio: string;
      photos: string;
      profilePhoto: string;
      interests: string;
      gender: string;
      interestedIn: string;
      lookingFor: string;
      idealFirstDate: string;
    };
  };
  billing: {
    title: string;
    subtitle: string;
    compareMore: string;
    compareTitle: string;
    compareFeature: string;
    compareRows: {
      swipes: { label: string; free: string; pro: string; premium: string };
      undos: { label: string; free: string; pro: string; premium: string };
      match: { label: string; free: string; pro: string; premium: string };
      boost: { label: string; free: string; pro: string; premium: string };
      media: { label: string; free: string; pro: string; premium: string };
      video: { label: string; free: string; pro: string; premium: string };
    };
    loading: string;
    error: string;
    currentPlan: string;
    monthly: string;
    yearly: string;
    monthlyAdj: string;
    yearlyAdj: string;
    savePercent: string;
    noCharge: string;
    perMonth: string;
    perYear: string;
    badgeCurrent: string;
    actionCurrent: string;
    actionChangeTo: string;
    actionCancel: string;
    actionRenew: string;
    confirmChange: string;
    confirmChangeMessage: string;
    confirm: string;
    confirming: string;
    confirmed: string;
    proration: string;
    downgradeFree: string;
    cancelConfirmTitle: string;
    cancelConfirmMessage: string;
    cancelYes: string;
    cancelNo: string;
    invoices: string;
    invoicesEmpty: string;
    exportPdf: string;
    exportTitle: string;
    exportExportedAt: string;
    exportAccount: string;
    exportRange: string;
    exportError: string;
    exportFileName: string;
    exportFolder: string;
    exportChangeFolder: string;
    exportDefaultFolder: string;
    planFree: string;
    planPro: string;
    planPremium: string;
    historyNew: string;
    historyChange: string;
    historyCancel: string;
    historyBilling: string;
    features: {
      swipes10: string;
      swipes15: string;
      swipes20: string;
      undos3: string;
      undos6: string;
      undosUnlimited: string;
      matchBasic: string;
      matchFull: string;
      boostNone: string;
      boost14: string;
      boost7: string;
      media5: string;
      media20: string;
      media50: string;
      video10: string;
      video20: string;
      video40: string;
    };
  };
};
