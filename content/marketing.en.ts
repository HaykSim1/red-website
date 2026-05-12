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
  heroTitle: "Request a part. Pick an offer.",
  heroSubtitle:
    "The no-nonsense marketplace for car parts in Armenia. We connect buyers with direct sellers for precision automotive procurement.",
  heroCtaHowItWorks: "How it works",
  heroCtaDownload: "Get the app",
  features: [
    {
      title: "Built for Armenia",
      body: "Tailored specifically for the local market landscape, ensuring parts are available where you need them most.",
    },
    {
      title: "Structured offers",
      body: "Get transparent pricing and detailed condition reports (New, Used, Refurbished) for every quote received.",
    },
    {
      title: "Direct deals",
      body: "No middleman fees. Connect directly with sellers to finalize payments and coordinate delivery terms.",
    },
  ],
  howItWorks: {
    title: "Simple Workflow",
    steps: [
      {
        title: "Post request",
        body: "Tell us what you need. VIN, part name, or photos.",
      },
      {
        title: "Receive offers",
        body: "Local sellers bid on your request within minutes.",
      },
      {
        title: "Compare",
        body: "Evaluate by price, condition, and seller rating.",
      },
      {
        title: "Contact",
        body: "Message the seller and close the deal offline.",
      },
    ],
  },
  audiences: {
    title: "Who Red Auto is for",
    buyersTitle: "For Buyers",
    buyersSubtitle:
      "Stop calling around. One request reaches dozens of specialized part sellers across Armenia simultaneously.",
    buyersBullets: [
      "Save hours of search time",
      "Access hidden inventory",
      "Verified seller history",
    ],
    sellersTitle: "For Sellers",
    sellersSubtitle:
      "Get qualified leads directly to your phone. Turn your idle inventory into revenue without expensive ads.",
    sellersBullets: [
      "Daily high-intent requests",
      "Direct communication with buyers",
      "Inventory-specific targeting",
    ],
  },
  homeFaqTeaser: {
    title: "Have more questions?",
    body: "Explore our detailed guide on how we handle requests and seller verification.",
    cta: "Visit FAQ Page",
  },
  disclaimerLine:
    "Payments and delivery happen outside the app.",
  screenshotsSectionTitle: "Precision in your pocket",
  screenshotsEmpty: "Screenshots will be added soon.",
  // TODO: Replace placeholder screenshots in /public/screenshots/.
  // Recommended: 390×844px PNG or WebP (iPhone 14 Pro dimensions), portrait.
  // Files: home.jpg, requests.jpg, market.jpg
  screenshots: [
    {
      src: "/screenshots/home.jpg",
      title: "Home",
      alt: "Red Auto app home screen",
    },
    {
      src: "/screenshots/requests.jpg",
      title: "Requests",
      alt: "List of part requests",
    },
    {
      src: "/screenshots/market.jpg",
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
    businessEmail: "partners@redauto.am",
    officeHoursTitle: "Office Hours",
    officeHoursMF: "Monday - Friday: 10:00 - 19:00",
    officeHoursSat: "Saturday: 11:00 - 16:00",
  },
};
