import type { FaqDocument } from "@/content/types";

export const faqEn: FaqDocument = {
  metaTitle: "FAQ — Red Auto",
  metaDescription: "Everything you need to know about the premier high-precision automotive procurement platform in Armenia.",
  pageTitle: "Frequently Asked Questions",
  pageSubtitle: "Everything you need to know about the premier high-precision automotive procurement platform in Armenia.",
  supportCenterLabel: "SUPPORT CENTER",
  searchPlaceholder: "Search for answers...",
  categories: [
    { icon: "help_center", label: "General Info" },
    { icon: "shopping_cart", label: "Buying Guide" },
    { icon: "sell", label: "Selling Guide" },
  ],
  stillHaveQuestionsTitle: "Still have questions?",
  stillHaveQuestionsBody: "Our team is available for direct support.",
  contactSupportCta: "Contact Support",
  items: [
    {
      question: "What is Red Auto?",
      answer:
        "Red Auto is a high-precision, request-based marketplace specifically designed for the Armenian automotive landscape. Unlike traditional listing sites, we focus on matching specific buyer requests with expert sellers who can source the exact vehicle or part required.",
    },
    {
      question: "How do I sign in?",
      answer:
        "We value simplicity and security. You can sign in instantly using your Armenian phone number. We will send a one-time secure code via SMS to verify your identity, removing the need for complex passwords.",
    },
    {
      question: "How to become a seller?",
      answer:
        "Professionalism is key to our marketplace. To become a seller, apply through your user profile section. Our administration team reviews every application to ensure trust and high-quality procurement standards before granting approval.",
    },
    {
      question: "Is there in-app chat?",
      answer:
        "No, we prioritize efficiency over small talk. Sellers provide structured offers that contain all necessary technical details, conditions, and pricing. This eliminates the need for back-and-forth messaging and allows for clear, data-driven decisions.",
    },
    {
      question: "Does Red Auto handle payments?",
      answer:
        "Red Auto serves as the procurement coordination layer. We do not handle financial transactions. You pay the seller directly during the vehicle or part handoff, ensuring you have inspected the item before any funds are exchanged.",
    },
    {
      question: "How do I select an offer?",
      answer:
        "Our interface allows you to compare multiple structured offers side-by-side. You can evaluate offers based on price, technical condition reports, and the seller's location, allowing you to choose the best value for your specific request.",
    },
  ],
};
