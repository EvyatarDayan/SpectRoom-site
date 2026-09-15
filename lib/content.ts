/** Copy sourced from SpectRoom iOS Localizable.strings + About/Privacy views. */

export const APP = {
  name: "SpectRoom",
  tagline: "A safe space for meaningful connections",
  supportEmail: "spectroom.support@gmail.com",
} as const;

export const HERO = {
  badge: "🎁 Free during Beta",
  titleLine1: "Welcome to",
  titleLine2: "SpectRoom",
  subtitle: "A safe, understanding space built around you",
  description:
    "Connect with people who appreciate your unique perspective at your own pace.",
  notice:
    "SpectRoom is currently in early access and completely free to use. As an early member, you’re helping us build a better community!",
  primaryCta: "Get Started",
  secondaryCta: "How It Works",
} as const;

/** Full copy from SpectRoom iOS AboutView. */
export const ABOUT = {
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
  },
} as const;

export const FEATURES = [
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
] as const;

export const TRUST = [
  {
    icon: "shield" as const,
    title: "Protecting your safety",
    body: "Profile moderation, reporting tools on every profile and message, and timely action against violations. We do not tolerate harassment, discrimination, hate speech, or exploitation.",
  },
  {
    icon: "lock" as const,
    title: "Your data, your control",
    body: "You choose what to share. Sensitive details are always optional. We never sell your data to third parties.",
  },
  {
    icon: "heart" as const,
    title: "Communication & boundaries",
    body: "Connect at your own pace. Block, report, or limit who can contact you anytime - your comfort comes first.",
  },
] as const;

/** Full copy from SpectRoom iOS PrivacySafetyView. */
export const PRIVACY_SAFETY = {
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
        "Or email us at: spectroom.support@gmail.com",
      ],
      closing: "We are here to help and respond as quickly as possible.",
    },
  ],
} as const;

export const AUTH_STEPS = [
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
    detail: "Confirm your email before we enable SMS 2 factor authentication",
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
] as const;

export const FAQ_TABS = [
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
        question: "I didn’t receive my 6-digit verification code. What should I do?",
        answer:
          "Confirm your number includes the correct country code, then tap Resend. Please wait a few seconds before requesting a new code - delivery can take a moment.",
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
        question: "Who can I contact about privacy or safety?",
        answer:
          "Use in-app Support → Help & Safety, or email spectroom.support@gmail.com. We are here to help and respond as quickly as possible.",
      },
    ],
  },
  {
    id: "beta",
    label: "Beta Access & Support",
    items: [
      {
        question: "Is SpectRoom free during beta?",
        answer:
          "Yes. SpectRoom is currently in early access and completely free to use. Standard features will remain free, though we may introduce optional paid tiers in the future.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          "We’d love to hear from you. Email spectroom.support@gmail.com for safety concerns, bugs, feedback, or account help.",
      },
    ],
  },
] as const;
