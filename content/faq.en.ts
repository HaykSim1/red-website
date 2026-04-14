import type { FaqDocument } from "@/content/types";

export const faqEn: FaqDocument = {
  metaTitle: "FAQ — Red Auto",
  metaDescription: "Answers to common questions about the Red Auto app.",
  pageTitle: "Frequently asked questions",
  items: [
    {
      question: "What is Red Auto?",
      answer:
        "Red Auto connects people who need auto parts with sellers. Buyers describe a need; sellers reply with structured offers (price, condition, pickup/delivery flag, description, photos). It is not a traditional shopping catalog.",
    },
    {
      question: "How do I sign in?",
      answer:
        "Sign-in uses your phone number and a one-time passcode (OTP). There is one account model: you can create requests, and after becoming an approved seller you can submit offers.",
    },
    {
      question: "How do I become a seller?",
      answer:
        "New accounts start as buyers. Submit a seller application (shop name, address, phone, optional logo). Admins approve or reject applications. After approval you may need to sign in again so your access token reflects the seller role.",
    },
    {
      question: "Is there in-app chat?",
      answer:
        "No. Sellers respond with structured offers rather than a free-form chat thread.",
    },
    {
      question: "Does Red Auto handle payments or shipping?",
      answer:
        "No. The platform does not process payments or arrange delivery. You arrange details directly with the other party outside the app.",
    },
    {
      question: "How do I pick an offer?",
      answer:
        "Compare offers on your request and select one. After selection you can access the seller’s contact details to reach them outside the app.",
    },
  ],
};
