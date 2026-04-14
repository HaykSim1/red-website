import { z } from "zod";

import { locales } from "@/lib/i18n";

const phoneRegex = /^[+()\d\s-]{6,32}$/;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, { message: "name_min" }).max(120, { message: "name_max" }),
  phone: z
    .string()
    .trim()
    .min(6, { message: "phone_min" })
    .max(32, { message: "phone_max" })
    .regex(phoneRegex, { message: "phone_invalid" }),
  email: z.string().trim().email({ message: "email_invalid" }).max(320, { message: "email_max" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "message_min" })
    .max(5000, { message: "message_max" }),
  locale: z.enum(locales, { message: "locale_invalid" }),
  /** Honeypot — must stay empty (checked in API route after parse) */
  website: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
