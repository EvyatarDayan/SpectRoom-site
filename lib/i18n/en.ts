import type { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    about: "About",
    featuresSafety: "Features & Safety",
    supportFaq: "Support & FAQ",
    downloads: "Downloads",
    getEarlyAccess: "Get Early Access",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
    signIn: "Sign In",
    profile: "Profile",
    freePlan: "Free plan",
    proPlan: "Pro plan",
    premiumPlan: "Premium plan",
    scrollToTop: "Back to top",
  },
  app: {
    name: "SpectRoom",
    tagline: "A safe space for meaningful connections",
    supportEmail: "spectroom.support@gmail.com",
  },
  hero: {
    badge: "🎁 Free during Beta",
    titleLine1: "Welcome to",
    titleLine2: "SpectRoom",
    subtitle: "A safe, understanding space built around you",
    description:
      "Connect with people who appreciate your unique perspective at your own pace.",
    notice:
      "SpectRoom is currently in early access and completely free to use. As an early member, you're helping us build a better community!",
    primaryCta: "Get Started",
    secondaryCta: "How It Works",
  },
  about: {
    heading: "About SpectRoom",
    paragraphs: [
      "SpectRoom is a dating and connection app thoughtfully designed for autistic adults and the broader neurodivergent community.",
      "We believe that everyone deserves a space where communication styles are understood, sensory needs are respected, and individuality is celebrated - without judgment, pressure, or misunderstanding.",
    ],
    sections: [
      {
        title: "SpectRoom focuses on clarity, safety, and comfort.",
        body: "Our design considers the unique needs of neurodivergent users, such as reduced sensory overload, structured communication, clear boundaries, and personalized support settings. Whether you're seeking friendship, dating, or deeper relationships, SpectRoom offers a calm and supportive environment where you can express yourself at your own pace.",
      },
      {
        title: "Our mission is simple:",
        body: "Create a meaningful, inclusive space where neurodivergent people can connect authentically - and feel safe while doing so.",
      },
      {
        title:
          "SpectRoom is built with respect, empathy, and accessibility at its core.",
        body: "You're welcome here.",
      },
    ],
    studio: {
      heading: "About Abashelari Productions",
      paragraphs: [
        "Abashelari Productions is an independent technology and creative development studio based in Stockholm.",
        "We specialize in crafting thoughtful digital experiences with a focus on accessibility, education, and everyday empowerment. Our work spans mobile apps, interactive tools, and content designed to make life easier, more inclusive, and more enjoyable for users of all backgrounds.",
      ],
      sections: [
        {
          title:
            "Founded on a passion for innovation and human-centered design, Abashelari Productions develops products that combine technical reliability with emotional intelligence.",
          body: "We believe in building software that respects users, simplifies complex challenges, and brings real value to people's lives.",
        },
        {
          title: "",
          body: "From children's educational games to community-driven platforms like SpectRoom, our goal is to create meaningful digital products that leave a positive impact - one app at a time.",
        },
      ],
      visitLink: "Visit abashelari.com",
    },
  },
  features: {
    heading: "Built for trust and real relationships",
    subtitle:
      "The same experience you see in the SpectRoom app - calm discovery, comfortable chat, and security that stays out of the way.",
    items: [
      {
        title: "Customize Your Profile",
        subtitle: "Share how you connect best",
        body: "Add interests and sensory preferences to your profile. It helps others see what matters to you and how to make interaction easy.",
        image: "/assets/carousel-profile.png",
        imageAlt: "SpectRoom edit profile screen",
      },
      {
        title: "Discover Connections",
        subtitle: "Simple, pressure-free matching",
        body: "Browse up to 10 profiles a day at your own speed. Tap or swipe right if you feel a connection, or pass with no awkwardness.",
        image: "/assets/carousel-discover.png",
        imageAlt: "SpectRoom discover screen",
      },
      {
        title: "Chat Anytime",
        subtitle: "No pressure, no rush",
        body: "Connect through direct messaging with built-in tools designed to make starting and pacing conversations comfortable.",
        image: "/assets/carousel-chat.png",
        imageAlt: "SpectRoom chat screen",
      },
    ],
    trust: [
      {
        icon: "shield",
        title: "Protecting your safety",
        body: "Profile moderation, reporting tools on every profile and message, and timely action against violations. We do not tolerate harassment, discrimination, hate speech, or exploitation.",
      },
      {
        icon: "lock",
        title: "Your data, your control",
        body: "You choose what to share. Sensitive details are always optional. We never sell your data to third parties.",
      },
      {
        icon: "heart",
        title: "Communication & boundaries",
        body: "Connect at your own pace. Block, report, or limit who can contact you anytime - your comfort comes first.",
      },
    ],
  },
  privacy: {
    heading: "Privacy & Safety",
    intro:
      "Your privacy, comfort, and safety are our highest priorities. Our app is designed to support neurodivergent individuals in a respectful, secure, and transparent way. The following principles explain how we protect your information and how you can stay safe while using our platform.",
    sections: [
      {
        title: "1. Your Data, Your Control",
        paragraphs: [
          "You choose what personal information to share in your profile.",
          "Sensitive information - such as accessibility needs, support levels, health-related details, or communication preferences - is always optional.",
          "You can edit or remove your information at any time in your profile settings.",
          "You can delete your account at any time, and all associated data will be permanently removed from our servers within a reasonable timeframe.",
        ],
      },
      {
        title: "2. How We Use Your Information",
        lead: "We use the information you provide to:",
        paragraphs: [
          "Create your profile",
          "Match you with compatible users",
          "Improve your in-app experience",
          "Maintain a safe, supportive community",
        ],
        closing:
          "We never sell your data to third parties. We only share your data with trusted service providers who help us operate the app (e.g., secure servers, analytics). These providers follow strict privacy and security standards.",
      },
      {
        title: "3. Protecting Your Safety",
        lead: "We use several measures to keep you safe, including:",
        paragraphs: [
          "Profile moderation and automated detection of harmful behavior",
          "Reporting tools available on every profile and message",
          "Optional account verification",
          "Internal review of reports and timely action against violations",
        ],
        closing:
          "We do not tolerate harassment, discrimination, hate speech, or exploitation of any kind.",
      },
      {
        title: "4. Sensitive Information",
        lead: "Because our community includes neurodivergent users and people with accessibility needs, you may choose to share personal details. If you do, please remember:",
        paragraphs: [
          "Sharing is always voluntary",
          "You control who can view sensitive sections of your profile",
          "Sensitive details are never used for advertising or sold to third parties",
          "Use caution when sharing personal information with others",
        ],
      },
      {
        title: "5. Communication & Boundaries",
        lead: "Always communicate at your own pace and comfort level. We encourage:",
        paragraphs: [
          "Clear communication",
          "Respect for different communication styles",
          "Patience and understanding",
        ],
        closingLead: "If someone makes you uncomfortable, you can:",
        closingItems: [
          "Block the user",
          "Report their profile",
          "Limit who can contact you in your preferences",
        ],
      },
      {
        title: "6. Meeting in Person",
        lead: "If you decide to meet someone:",
        paragraphs: [
          "Use a public place",
          "Tell a friend or family member where you're going",
          "Consider using the app's check-in feature (if available)",
          "Trust your instincts - if something feels wrong, leave immediately",
        ],
        closing: "Your safety always comes first.",
      },
      {
        title: "7. Security Measures",
        lead: "We use industry-standard security technologies to protect your information, including:",
        paragraphs: [
          "Encrypted data transmission",
          "Secure password storage",
          "Fraud detection systems",
          "Continuous security monitoring",
        ],
        closing:
          "If a data or security issue is ever detected, we will notify you promptly and transparently.",
      },
      {
        title: "8. Your Responsibility",
        lead: "While we work hard to create a safe environment, you also play an important role. Please:",
        paragraphs: [
          "Keep personal details (address, financial info, work details) private",
          "Be cautious about sharing photos or videos",
          "Report any suspicious or harmful behavior",
        ],
        closing: "Together, we can maintain a respectful and safe community.",
      },
      {
        title: "9. Contact & Support",
        lead: "If you have any questions about privacy, need to report an issue, or want support:",
        paragraphs: [
          "In-app Support → Help & Safety",
          "{{contactUs}}",
        ],
        closing: "We are here to help and respond as quickly as possible.",
      },
    ],
    questionsPrefix: "Questions? Email",
  },
  steps: {
    heading: "Get started in four simple steps",
    items: [
      {
        step: 1,
        title: "Create Account",
        detail: "Email & password",
        image: "/assets/step-signup.png",
        imageAlt: "SpectRoom sign up screen",
      },
      {
        step: 2,
        title: "Verify Your Email",
        detail:
          "Confirm your email before we enable SMS 2 factor authentication",
        image: "/assets/step-email.png",
        imageAlt: "SpectRoom email verification screen",
      },
      {
        step: 3,
        title: "Security Code",
        detail: "Enter the 6-digit verification code sent to your phone",
        image: "/assets/step-sms.png",
        imageAlt: "SpectRoom SMS security code screen",
      },
      {
        step: 4,
        title: "Get Started",
        detail: "Complete your profile and start connecting",
        image: "/assets/step-welcome.png",
        imageAlt: "SpectRoom welcome and complete profile screen",
      },
    ],
  },
  faq: {
    heading: "Support & FAQ",
    subtitle:
      "Answers about verification, privacy, using SpectRoom, and early access.",
    searchLabel: "Search FAQ",
    searchPlaceholder: "Search questions…",
    empty: "No matching questions. Try a different search term.",
    tabs: [
      {
        id: "account",
        label: "Account & Verification",
        items: [
          {
            question: "Why do I need to verify both email and phone number?",
            answer:
              "We confirm your email first, then enable SMS 2 factor authentication with a 6-digit code. Dual verification helps keep accounts real and SpectRoom safer for everyone.",
          },
          {
            question: "Will my phone number be visible on my public profile?",
            answer:
              "Never. Your phone is used for security and will never be shared. Your email address is never shared either.",
          },
          {
            question:
              "I didn't receive my 6-digit verification code. What should I do?",
            answer:
              "Confirm your number includes the correct country code, then tap Resend. Please wait a few seconds before requesting a new code - delivery can take a moment.",
          },
          {
            question: "Can I change my email or phone number later?",
            answer:
              "Yes. You can update account details in your profile settings. For security, some changes may require you to verify the new email or phone number again.",
          },
          {
            question: "How do I reset my password?",
            answer:
              "On the sign-in screen, choose the forgot password option and follow the steps sent to your verified email. If you need more help, {{contactUs}}.",
          },
          {
            question: "How do I delete my account?",
            answer:
              "You can delete your account anytime in profile settings. Associated data is permanently removed from our servers within a reasonable timeframe.",
          },
        ],
      },
      {
        id: "using",
        label: "Using SpectRoom",
        items: [
          {
            question: "Who is SpectRoom for?",
            answer:
              "SpectRoom is thoughtfully designed for autistic adults and the broader neurodivergent community. Anyone seeking a calmer, clearer way to connect - for friendship, dating, or deeper relationships - is welcome.",
          },
          {
            question: "How does discovery and matching work?",
            answer:
              "You can browse up to 10 profiles a day at your own pace. Tap or swipe right if you feel a connection, or pass with no awkwardness. Matches open space for direct messaging when both people are interested.",
          },
          {
            question: "Do I have to reply to messages right away?",
            answer:
              "No. SpectRoom is built for low pressure. Chat when it feels comfortable - there is no rush and no penalty for taking your time.",
          },
          {
            question: "Can I share sensory preferences or communication needs?",
            answer:
              "Yes. You can add interests and sensory preferences to your profile so others understand how you connect best. Sensitive details are always optional, and you control what is visible.",
          },
          {
            question: "Is SpectRoom only for dating?",
            answer:
              "No. You can use SpectRoom for friendship, dating, or deeper relationships. Set your intentions clearly on your profile so others know what you are looking for.",
          },
        ],
      },
      {
        id: "safety",
        label: "Privacy & Safety",
        items: [
          {
            question: "How does SpectRoom protect my personal data?",
            answer:
              "Your privacy, comfort, and safety are our highest priorities. You choose what to share, sensitive information is always optional, and we never sell your data to third parties. We use encrypted data transmission, secure password storage, fraud detection, and continuous security monitoring.",
          },
          {
            question: "How do I report or block a user?",
            answer:
              "If someone makes you uncomfortable, you can block the user, report their profile, or limit who can contact you in your preferences. Reporting tools are available on every profile and message, and we review reports with timely action against violations.",
          },
          {
            question: "Are my chats private?",
            answer:
              "Messages are for you and the person you are chatting with. We do not sell conversation content. We may review reports or investigate safety concerns when needed to protect the community.",
          },
          {
            question: "What should I know before meeting someone in person?",
            answer:
              "Meet in a public place, tell a friend or family member where you are going, and trust your instincts. If something feels wrong, leave immediately. Your safety always comes first.",
          },
          {
            question: "Who can I contact about privacy or safety?",
            answer:
              "Use in-app Support → Help & Safety, or {{contactUs}}. We are here to help and respond as quickly as possible.",
          },
        ],
      },
      {
        id: "beta",
        label: "Early Access & Support",
        items: [
          {
            question: "Is SpectRoom free during early access?",
            answer:
              "Yes. SpectRoom is currently in early access and completely free to use. Standard features will remain free, though we may introduce optional paid tiers in the future.",
          },
          {
            question: "Where can I download SpectRoom?",
            answer:
              "Use the Downloads section on this site for iOS and Android. Store links will be available as soon as each release is published.",
          },
          {
            question: "Which platforms are supported?",
            answer:
              "SpectRoom is available for iOS, with Android support rolling out. Check the Downloads section for the latest availability.",
          },
          {
            question: "How can I share feedback or report a bug?",
            answer:
              "We welcome feedback from early members. {{contactUs}} to share bugs, ideas, or accessibility notes - your input helps us improve the app.",
          },
          {
            question: "How can I contact customer support?",
            answer:
              "We'd love to hear from you. {{contactUs}} about safety concerns, bugs, feedback, or account help.",
          },
        ],
      },
    ],
  },
  footer: {
    quickLinksTitle: "Quick Links",
    supportTitle: "Support & Contact",
    needHelp: "Need help?",
    privacyPolicy: "Privacy Policy",
    terms: "Terms of Service",
    guidelines: "Community Guidelines",
    safetyCenter: "Safety Center",
    copyright: "© 2026 SpectRoom. All rights reserved.",
    badge2fa: "Verified 2 factor authentication",
    badgePrivacy: "End-to-End Privacy",
  },
  modal: {
    eyebrow: "iOS Public Beta",
    title: "Get Started",
    steps: [
      "Install TestFlight from the App Store",
      "Open the invite link and accept",
      "Install SpectRoom and verify your account",
    ],
    cta: "Open TestFlight Invite",
    note: "Currently available on iOS. Android coming soon.",
    close: "Close",
  },
  carousel: {
    region: "SpectRoom app screenshots",
    previous: "Previous screenshot",
    next: "Next screenshot",
    goTo: "Go to screenshot",
  },
  downloads: {
    heading: "Downloads",
    subtitle: "Get SpectRoom on your phone and start connecting at your own pace.",
    iosLabel: "Temporary QR",
    iosStore: "iOS",
    androidLabel: "Temporary QR",
    androidStore: "Android",
  },
  auth: {
    title: "Sign in to SpectRoom",
    subtitle: "Use the same email and password as in the app.",
    email: "Email",
    password: "Password",
    submit: "Sign in",
    submitting: "Signing in...",
    codeTitle: "Enter your security code",
    codeSubtitle: "We sent a 6-digit code to your phone.",
    codeLabel: "6-digit code",
    verify: "Verify",
    verifying: "Verifying...",
    back: "Back",
    noAccount: "Don't have an account? Sign up in the SpectRoom app.",
    errorInvalid: "Invalid email or password.",
    errorCode: "That code is incorrect or expired.",
    errorMfa: "Could not send the verification code. Try again.",
    errorBanned: "This account is not available.",
    errorDeleted: "This account has been deleted.",
    errorFrozen: "This account is temporarily unavailable.",
    errorGeneric: "Something went wrong. Please try again.",
  },
  profile: {
    title: "My profile",
    subtitle:
      "Update your photos, details, and preferences here. Changes you save are reflected in the SpectRoom app as well.",
    signOut: "Sign out",
    signOutConfirm: "Are you sure?",
    cancel: "Cancel",
    loading: "Loading profile...",
    empty: "We couldn't load your profile.",
    backHome: "Back to home",
    save: "Save",
    saving: "Saving...",
    saved: "Profile saved.",
    savedButton: "Saved",
    errorSave: "Could not save your profile. Try again.",
    completion: "Profile %d% complete",
    photosHint: "Min 2 photos, max 5 photos",
    name: "My Name",
    email: "My Email",
    emailPrivacy: "Your email address is never shared",
    locationPrivacy: "Your address is never shared",
    dateOfBirth: "My Date of Birth",
    myAge: "My Age: %@",
    profilePhoto: "My Profile Photo",
    photos: "My Photos",
    add: "Add",
    changePhoto: "Tap to replace photo",
    aboutMe: "About Me",
    bioMin: "Min: %@ Max: 500",
    bioMax: "Max: %@",
    preferences: "My Preferences",
    iAm: "I Am",
    interestedIn: "I'm Interested In",
    lookingFor: "I'm Looking For",
    preferredAge: "My Preferred Age",
    lifestyle: "My Lifestyle",
    bodyType: "My Body Type",
    idealFirstDate: "My Ideal First Date",
    sensory: "My Sensory Preferences",
    energy: "My Energy Level Today",
    energySubtitle:
      "Helps matches understand your social capacity and response speed today.",
    location: "My Location",
    locationPlaceholder: "Select your location in Sweden",
    searchAddress: "Search Address",
    locationSearchPlaceholder: "Search for an address in Sweden",
    locationSwedenOnly: "SpectRoom is currently available in Sweden only.",
    locationSearching: "Searching...",
    locationUseAddress: "Use this address",
    noLocationResults: "No addresses found in Sweden",
    interests: "My Interests",
    genders: { man: "Man", woman: "Woman", nonbinary: "Non-binary" },
    looking: {
      romantic: "Romantic Relationship",
      inPerson: "In-Person Friendship",
      online: "Online Friendship",
      hobby: "Hobby Buddy",
      notSure: "Not Sure Yet",
    },
    lifestyleOpts: {
      preferNot: "Prefer not to share",
      independent: "I live independently",
      family: "I live with family or support staff",
      assisted: "I live in a shared or assisted setting",
    },
    bodyTypes: {
      preferNot: "Prefer not to share",
      slim: "Slim",
      average: "Average",
      athletic: "Athletic",
      fullBodied: "Full-bodied",
    },
    dates: {
      park: "Relaxing Park Walk",
      cafe: "Cozy Café Meet",
      museum: "Museum or Gallery Stroll",
      cinema: "Cinema Movie Night",
      video: "Friendly Video Chat",
    },
    energyOpts: {
      low: "Low Battery",
      lowDetail: "Taking time to recharge. Slow to reply today.",
      moderate: "Moderate Social",
      moderateDetail: "Open to casual text chats at a steady pace.",
      full: "Fully Social Mode",
      fullDetail: "High energy! Ready for fast chats, calls, or making plans.",
    },
    interestLabels: {
      Photography: "Photography",
      Music: "Music",
      Art: "Art",
      Reading: "Reading",
      Cooking: "Cooking",
      Travel: "Travel",
      Sports: "Sports",
      Gaming: "Gaming",
      Movies: "Movies",
      Nature: "Nature",
      Technology: "Technology",
      Fitness: "Fitness",
      Dancing: "Dancing",
      Writing: "Writing",
      Gardening: "Gardening",
      Animals: "Animals",
      Science: "Science",
      History: "History",
      Languages: "Languages",
      Volunteering: "Volunteering",
    },
    sensoryOpts: {
      lowNoiseEnvironments: {
        title: "Low-noise environments",
        subtitle: "Prefers quiet spaces, low-volume music, or peaceful outdoor spots",
      },
      dimSoftLighting: {
        title: "Dim / soft lighting",
        subtitle: "Enjoys cozy, warmly lit spaces over bright or fluorescent lights",
      },
      activeWalkingDates: {
        title: "Active / walking dates",
        subtitle: "Prefers moving, walking, or gentle activities over sitting still",
      },
      shortLowPressureMeetups: {
        title: "Short, low-pressure meetups",
        subtitle: "Prefers short first dates, like a quick 45-minute coffee",
      },
      fidgetStimFriendlySpaces: {
        title: "Fidget / stim-friendly spaces",
        subtitle: "Loves playing with fidgets, doodling, or having something to hold",
      },
      predictableSafeFoods: {
        title: "Predictable \"safe\" foods",
        subtitle: "Enjoys familiar menus with simple, consistent textures",
      },
      scentFreeEnvironments: {
        title: "Scent-free environments",
        subtitle: "Loves spaces free of strong perfumes, candles, or incense",
      },
      comfortableTemperatureZones: {
        title: "Comfortable temperature zones",
        subtitle: "Prefers predictable, temperature-controlled indoor spaces",
      },
      visuallyCalmSpaces: {
        title: "Visually calm spaces",
        subtitle: "Enjoys minimalist, clean, and uncluttered environments",
      },
      deepPressureClearTouch: {
        title: "Deep-pressure / clear touch",
        subtitle:
          "Prefers firm physical contact or clear verbal consent over unexpected light touches",
      },
    },
    validation: {
      fullName: "Enter your full name",
      age: "You must be 18 years or older",
      location: "Select a location in Sweden",
      bio: "\"About me\" must be at least 30 characters",
      photos: "Add at least 2 photos",
      profilePhoto: "Add a profile photo",
      interests: "Select at least 3 interests",
      gender: "Select your gender",
      interestedIn: "Select who you're interested in",
      lookingFor: "Select what you're looking for",
      idealFirstDate: "Select at least 1 ideal first date",
    },
  },
  billing: {
    title: "Account & Billing",
    subtitle:
      "A Free account is enough to use everything in SpectRoom. Pro and Premium unlock extra abilities if you want {{more}}.",
    compareMore: "more",
    compareTitle: "Compare plans",
    compareFeature: "Capability",
    compareRows: {
      swipes: {
        label: "Discover swipes / day",
        free: "10",
        pro: "15",
        premium: "20",
      },
      undos: {
        label: "Discover swipe undos / day",
        free: "3",
        pro: "6",
        premium: "Unlimited",
      },
      match: {
        label: "Match info",
        free: "Basic",
        pro: "Full breakdown",
        premium: "Full breakdown",
      },
      boost: {
        label: "Profile boost",
        free: "None",
        pro: "Every 14 days",
        premium: "Every 7 days",
      },
      media: {
        label: "Media messages / day",
        free: "5",
        pro: "20",
        premium: "50",
      },
      video: {
        label: "Video message size limit",
        free: "10 MB",
        pro: "20 MB",
        premium: "40 MB",
      },
    },
    loading: "Loading billing...",
    error: "Could not load billing. Try again.",
    currentPlan: "Your current plan is %@",
    monthly: "Monthly",
    yearly: "Yearly",
    monthlyAdj: "monthly",
    yearlyAdj: "yearly",
    savePercent: "-20%",
    noCharge: "No charge",
    perMonth: "/ Month",
    perYear: "/ Year",
    badgeCurrent: "Current",
    actionCurrent: "Current Plan",
    actionChangeTo: "Change to %@",
    actionCancel: "Cancel plan",
    actionRenew: "Renew my %@ plan",
    confirmChange: "Confirm plan change",
    confirmChangeMessage: "Are you sure you want to change your plan from %@ to %@?",
    confirm: "Confirm",
    confirming: "Confirming...",
    confirmed: "Confirmed",
    proration:
      "You will be charged %@ for the %@ plan. Any unused time on your current plan is prorated automatically.",
    downgradeFree:
      "You will move to Free at the end of your current billing period. No further charges will apply.",
    cancelConfirmTitle: "Are you sure you want to cancel your %@ plan?",
    cancelConfirmMessage:
      "You will still have this plan until the end of the current period, after that your plan will be set to the Free plan.",
    cancelYes: "Yes",
    cancelNo: "No",
    invoices: "Account History",
    invoicesEmpty: "No account history yet",
    exportPdf: "Export PDF",
    exportTitle: "SpectRoom Account History",
    exportExportedAt: "Exported: %@",
    exportAccount: "Account: %@",
    exportRange: "Activity from the last 3 years",
    exportError: "Couldn't export account history. Please try again.",
    exportFileName: "File name",
    exportFolder: "Folder",
    exportChangeFolder: "Change",
    exportDefaultFolder: "Downloads",
    planFree: "Free",
    planPro: "Pro",
    planPremium: "Premium",
    historyNew: "New plan - %@",
    historyChange: "Changed plan - %@",
    historyCancel: "Cancelled plan - %@",
    historyBilling: "Billing - %@",
    features: {
      swipes10: "Daily discover swipes: 10",
      swipes15: "Daily discover swipes: 15",
      swipes20: "Daily discover swipes: 20",
      undos3: "Discover swipes undos / day: 3",
      undos6: "Discover swipes undos / day: 6",
      undosUnlimited: "Discover swipes undos / day: Unlimited",
      matchBasic: "Match info: basic",
      matchFull: "Match info: full breakdown",
      boostNone: "Profile boost: None",
      boost14: "Profile boost: Every 14 days",
      boost7: "Profile boost: Every 7 days",
      media5: "Media messages / day: 5",
      media20: "Media messages / day: 20",
      media50: "Media messages / day: 50",
      video10: "Video size: 10 MB",
      video20: "Video size: 20 MB",
      video40: "Video size: 40 MB",
    },
  },
  support: {
    sectionHeading: "We'd love to hear from you",
    sectionSubtitle:
      "Whether it's a suggestion, feedback, bug report or anything else you want to share, hit the \"Contact us\" button and we'll get back to you as soon as we can.",
    sectionCta: "Contact Us",
    navTitle: "Help & Support",
    title: "We'd love to hear from you!",
    subtitle: "Select a topic and send us a message",
    topicLabel: "Topic",
    topics: {
      safety: "Safety",
      bug: "Bug",
      feedback: "Feedback",
      other: "Other",
    },
    messageLabel: "Message",
    messagePlaceholder: "Tell us a bit more...",
    messageMinChars: "Min 20 characters",
    buttonSend: "Send Message",
    buttonSent: "Message Sent ✓",
    attachmentLabel: "Photo (optional)",
    attachmentAdd: "Add photo from gallery",
    attachmentAdded: "Photo attached",
    attachmentRemove: "Remove photo",
    attachmentHint: "Max 5MB, JPG, PNG or HEIC.",
    guestName: "Name",
    guestEmail: "Email",
    guestNameRequired: "Please enter your name",
    guestEmailRequired: "Please enter your email",
    guestEmailInvalid: "Please enter a valid email",
    errorGeneric: "Something went wrong. Please try again.",
    errorTooLarge: "Image must be 5MB or smaller.",
    errorUnsupported: "Please choose a JPG, PNG, or HEIC image.",
  },
};
