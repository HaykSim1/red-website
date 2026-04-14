import type { ContactDocument } from "@/content/types";

export const contactEn: ContactDocument = {
  metaTitle: "Contact — Red Auto",
  metaDescription: "How to reach Red Auto support.",
  pageTitle: "Contact",
  intro:
    "Fill in the form and we will deliver your message to info@red-auto.store. You can also email us directly.",
  emailLabel: "Email (direct)",
  form: {
    sectionTitle: "Write to us",
    nameLabel: "Name",
    phoneLabel: "Phone",
    emailLabel: "Email",
    messageLabel: "Message",
    submit: "Send",
    sending: "Sending…",
    success: "Thank you. Your message has been sent.",
    errorGeneric: "Could not send. Please try again or email info@red-auto.store.",
    errorNotConfigured: "Email sending is not configured on the server yet. Please contact the site administrator.",
    rateLimited: "Too many requests. Please try again later.",
    val: {
      nameMin: "Name must be at least 2 characters.",
      nameMax: "Name is too long.",
      phoneMin: "Phone must be at least 6 characters.",
      phoneMax: "Phone is too long.",
      phoneInvalid: "Enter a valid phone number (digits, +, spaces, parentheses).",
      emailInvalid: "Enter a valid email address.",
      emailMax: "Email is too long.",
      messageMin: "Message must be at least 10 characters.",
      messageMax: "Message is too long.",
      localeInvalid: "Invalid language.",
    },
  },
};
