import type { MarketingContent } from "@/content/types";

export const marketingEn: MarketingContent = {
  metaTitle: "Red Auto — auto parts marketplace",
  metaDescription:
    "The no-nonsense marketplace for car parts in Armenia. Post a request, receive structured offers from sellers, and contact them directly.",
  nav: {
    home: "Home",
    privacy: "Privacy",
    terms: "Terms",
    faq: "FAQ",
    trust: "Trust",
    howItWorks: "How it works",
    forBuyers: "For Buyers",
    forSellers: "For Sellers",
    contactUs: "Contact Us",
  },
  langSwitcher: { hy: "Հայ", en: "EN", ru: "RU" },
  heroTitle: "One request — multiple offers.",
  heroSubtitle:
    "A platform designed to connect drivers with auto parts stores, helping users find the best offers.",
  heroCtaHowItWorks: "How it works",
  heroCtaDownload: "Get the app",
  features: [
    {
      title: "Built for Armenia",
      body: "Tailored specifically for the local market landscape, ensuring parts are available where you need them most.",
    },
    {
      title: "Structured offers",
      body: "Get accurate pricing and detailed condition information for every auto part.",
    },
    {
      title: "Direct connection",
      body: "No middlemen or extra fees. Connect directly with sellers and find the auto part that fits you best.",
    },
  ],
  howItWorks: {
    title: "How It Works",
    steps: [
      {
        title: "Create a request",
        body: "Upload a VIN, photo, or specify the needed auto part.",
      },
      {
        title: "Receive offers",
        body: "Sellers send offers with pricing and details.",
      },
      {
        title: "Compare",
        body: "Compare prices, condition, and options to find the best match.",
      },
      {
        title: "Contact",
        body: "Contact the seller directly and quickly get the needed part.",
      },
    ],
  },
  audiences: {
    title: "Who Red Auto is for",
    buyersTitle: "For Buyer",
    buyersSubtitle:
      "Stop calling multiple stores for a single auto part. On our platform, you can receive offers from dozens of specialized sellers across Armenia with a single request.",
    buyersBullets: [
      "Save time and stop wasting it searching for the right auto part",
      "Discover stores and parts you can’t easily find online",
      "Check seller reviews and ratings before making a choice",
    ],
    sellersTitle: "For Seller",
    sellersSubtitle:
      "Get new customers and increase sales without unnecessary advertising costs. Save time by avoiding endless phone calls.",
    sellersBullets: [
      " Receive ready-to-buy requests, Requests include all necessary information, including photos, VIN, and part details.",
      "Expand your customer base, Without extra advertising — simply send offers to buyers.",
      "Fast and easy connection with buyers, The buyer contacts you directly after selecting your offer.",
    ],
  },
  homeFaqTeaser: {
    title: "Have more questions?",
    body: "Explore our detailed guide on how we handle requests and seller verification.",
    cta: "Visit FAQ Page",
  },
  disclaimerLine:
    "Payments and delivery happen outside the app.",
  screenshotsSectionTitle: "The Entire Marketplace in Your Pocket",
  screenshotsEmpty: "Screenshots will be added soon.",
  // TODO: Replace placeholder screenshots in /public/screenshots/.
  // Recommended: 390×844px PNG or WebP (iPhone 14 Pro dimensions), portrait.
  // Files: home.jpg, requests.jpg, market.jpg
  screenshots: [
    {
      src: "/screenshots/home.jpg",
      title: "Track requests, receive offers, and connect with sellers in one app.",
      alt: "Red Auto app home screen",
    },
    {
      src: "/screenshots/requests.jpg",
      title: "Create requests in just a few steps.",
      alt: "List of part requests",
    },
    {
      src: "/screenshots/market.jpg",
      title: "Get instant notifications about new offers.",
      alt: "Open requests feed for sellers",
    },
  ],
  downloadSectionTitle: "Download the app",
  downloadAppStore: "App Store",
  downloadGooglePlay: "Google Play",
  downloadAppStoreBadgeAlt: "Download on the App Store",
  downloadGooglePlayBadgeAlt: "Get it on Google Play",
  downloadSoon: "Links will appear after the stores go live.",
  // TODO: Replace /public/logo.png with final brand logo. Recommended: 80×80px PNG with transparent background.
  footerTagline: "© 2024 Red Auto. High-precision automotive procurement for Armenia.",
  footerRights: "© Red Auto. All rights reserved.",
  footerFollowUs: "Follow us",
  footerResourcesLabel: "Resources",
  footerHelpLabel: "Help",
  contactSection: {
    title: "Get in touch",
    introLeft: "Use the form to send a message. We deliver it to info@red-auto.store.",
    infoTitle: "Contact details",
    phoneLabel: "Phone",
    emailLabel: "Email",
    addressLabel: "Address",
    phone: "+374 10 00 00 00", // TODO: replace with real phone number
    address: "Yerevan, Armenia",
    supportTitle: "Support Hub",
    businessTitle: "Business Inquiries",
    businessSubtitle: "Partnerships & Sellers",
    businessEmail: "info@red-auto.store",
    officeHoursTitle: "Office Hours",
    officeHoursMF: "Monday - Friday: 10:00 - 19:00",
    officeHoursSat: "Saturday: 11:00 - 16:00",
  },
};
