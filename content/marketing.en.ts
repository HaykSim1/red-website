import type { MarketingContent } from "@/content/types";

export const marketingEn: MarketingContent = {
  metaTitle: "Red Auto — auto parts marketplace",
  metaDescription:
    "Post what you need, compare structured offers from sellers. Red Auto connects buyers and sellers in Armenia.",
  nav: {
    home: "Home",
    privacy: "Privacy",
    terms: "Terms",
    faq: "FAQ",
    trust: "Trust",
  },
  langSwitcher: { hy: "Հայ", en: "EN", ru: "RU" },
  heroTitle: "Request a part. Pick an offer.",
  heroSubtitle:
    "Red Auto is a request-based marketplace—not a shopping catalog. Describe your need, receive structured offers, and contact the seller outside the app.",
  heroCtaHowItWorks: "How it works",
  features: [
    {
      title: "Built for Armenia",
      body: "Designed for the local market with clear buyer and seller flows.",
    },
    {
      title: "Structured offers",
      body: "Price, condition, pickup or delivery flag, notes, and photos—without a chat thread.",
    },
    {
      title: "You arrange the deal",
      body: "The platform does not process payments or shipping; you agree details directly.",
    },
  ],
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Post a request",
        body: "Describe the part, attach a saved vehicle or VIN, add photos, and publish.",
      },
      {
        title: "Receive offers",
        body: "Sellers respond with structured offers: price, condition, and pickup or delivery availability.",
      },
      {
        title: "Compare and select",
        body: "Review offers and pick one. Seller contact details unlock after selection.",
      },
      {
        title: "Contact the seller",
        body: "Arrange payment and handoff outside the app.",
      },
    ],
  },
  audiences: {
    title: "Who Red Auto is for",
    buyersTitle: "For buyers",
    buyersBullets: [
      "Save vehicles in your profile and attach them to requests quickly.",
      "Receive multiple offers and choose the best fit.",
      "No chat thread—only structured replies.",
    ],
    sellersTitle: "For sellers",
    sellersBullets: [
      "Browse the open requests feed and reply with an offer.",
      "Selling requires an admin-approved seller application.",
      "You can submit multiple offers when it makes sense.",
    ],
  },
  homeFaqTeaser: {
    title: "FAQ",
    body: "Answers about sign-in, becoming a seller, offers, and payments.",
    cta: "View all questions",
  },
  disclaimerLine:
    "Red Auto helps you find a part and contact a seller. Payments and delivery happen outside the app.",
  screenshotsSectionTitle: "Inside the app",
  screenshotsEmpty: "Screenshots will be added soon.",
  screenshots: [
    {
      src: "/screenshots/home.png",
      title: "Home",
      alt: "Red Auto app home screen",
    },
    {
      src: "/screenshots/requests.png",
      title: "Requests",
      alt: "List of part requests",
    },
    {
      src: "/screenshots/market.png",
      title: "Market",
      alt: "Open requests feed for sellers",
    },
  ],
  downloadSectionTitle: "Download the app",
  downloadAppStore: "App Store",
  downloadGooglePlay: "Google Play",
  downloadAppStoreBadgeAlt: "Download on the App Store",
  downloadGooglePlayBadgeAlt: "Get it on Google Play",
  downloadSoon: "Links will appear after the stores go live.",
  footerTagline: "Red Auto",
  footerRights: "© Red Auto. All rights reserved.",
  footerFollowUs: "Follow us",
  contactSection: {
    title: "Contact us",
    introLeft: "Use the form to send a message. We deliver it to info@red-auto.store.",
    infoTitle: "Contact details",
    phoneLabel: "Phone",
    emailLabel: "Email",
    addressLabel: "Address",
    phone: "+374 00 000 000",
    address: "Yerevan, Armenia",
  },
};
