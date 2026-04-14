"use client";

import type { CSSProperties, FormEvent } from "react";
import { useCallback, useState } from "react";

import type { ContactDocument } from "@/content/types";
import { mapContactZodErrors } from "@/lib/contact-form-errors";
import { contactFormSchema } from "@/lib/contact-schema";
import type { Locale } from "@/lib/i18n";

interface ContactFormProps {
  form: ContactDocument["form"];
  locale: Locale;
}

export function ContactForm({ form, locale }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const validateClient = useCallback(() => {
    const parsed = contactFormSchema.safeParse({
      name,
      phone,
      email,
      message,
      locale,
      website: honeypot,
    });
    if (!parsed.success) {
      setFieldErrors(mapContactZodErrors(parsed.error, form));
      setFormError(null);
      return false;
    }
    setFieldErrors({});
    return true;
  }, [name, phone, email, message, locale, honeypot, form]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validateClient()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          message: message.trim(),
          locale,
          website: honeypot,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        errors?: Record<string, string>;
        message?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setHoneypot("");
        setFieldErrors({});
        return;
      }

      if (data.errors) {
        setFieldErrors(data.errors);
        setStatus("idle");
        return;
      }

      setFormError(data.message ?? form.errorGeneric);
      setStatus("idle");
    } catch {
      setFormError(form.errorGeneric);
      setStatus("idle");
    }
  }

  const inputStyle = (hasError: boolean): CSSProperties => ({
    width: "100%",
    minHeight: 48,
    padding: "12px 14px",
    borderRadius: "var(--radius-button)",
    border: hasError ? "2px solid var(--color-error)" : "1px solid var(--color-outline)",
    background: "var(--color-surface-container-lowest)",
    color: "var(--color-on-surface)",
    fontSize: 14,
    fontFamily: "inherit",
    WebkitAppearance: "none",
    appearance: "none",
  });

  const labelStyle: CSSProperties = {
    display: "block",
    marginBottom: "var(--space-xxs)",
    fontWeight: 600,
    fontSize: 13,
    color: "var(--color-on-surface-variant)",
  };

  const err = (key: string) => fieldErrors[key];

  if (status === "success") {
    return (
      <p className="u-body" role="status" style={{ color: "var(--color-tertiary)", maxWidth: 480 }}>
        {form.success}
      </p>
    );
  }

  return (
    <form
      aria-label={form.sectionTitle}
      onSubmit={handleSubmit}
      noValidate
      style={{ maxWidth: 480 }}
    >
      <p className="visually-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}
        />
      </p>

      <div style={{ marginBottom: "var(--space-md)" }}>
        <label htmlFor="contact-name" style={labelStyle}>
          {form.nameLabel}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle(Boolean(err("name")))}
          aria-invalid={Boolean(err("name"))}
          aria-describedby={err("name") ? "contact-name-err" : undefined}
        />
        {err("name") ? (
          <p id="contact-name-err" className="u-caption" style={{ color: "var(--color-error)", marginTop: 4 }}>
            {err("name")}
          </p>
        ) : null}
      </div>

      <div style={{ marginBottom: "var(--space-md)" }}>
        <label htmlFor="contact-phone" style={labelStyle}>
          {form.phoneLabel}
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle(Boolean(err("phone")))}
          aria-invalid={Boolean(err("phone"))}
          aria-describedby={err("phone") ? "contact-phone-err" : undefined}
        />
        {err("phone") ? (
          <p id="contact-phone-err" className="u-caption" style={{ color: "var(--color-error)", marginTop: 4 }}>
            {err("phone")}
          </p>
        ) : null}
      </div>

      <div style={{ marginBottom: "var(--space-md)" }}>
        <label htmlFor="contact-email" style={labelStyle}>
          {form.emailLabel}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle(Boolean(err("email")))}
          aria-invalid={Boolean(err("email"))}
          aria-describedby={err("email") ? "contact-email-err" : undefined}
        />
        {err("email") ? (
          <p id="contact-email-err" className="u-caption" style={{ color: "var(--color-error)", marginTop: 4 }}>
            {err("email")}
          </p>
        ) : null}
      </div>

      <div style={{ marginBottom: "var(--space-lg)" }}>
        <label htmlFor="contact-message" style={labelStyle}>
          {form.messageLabel}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ ...inputStyle(Boolean(err("message"))), minHeight: 140, resize: "vertical" }}
          aria-invalid={Boolean(err("message"))}
          aria-describedby={err("message") ? "contact-message-err" : undefined}
        />
        {err("message") ? (
          <p id="contact-message-err" className="u-caption" style={{ color: "var(--color-error)", marginTop: 4 }}>
            {err("message")}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p className="u-body" role="alert" style={{ color: "var(--color-error)", marginBottom: "var(--space-md)" }}>
          {formError}
        </p>
      ) : null}

      <button type="submit" className="u-gradient-cta" disabled={status === "sending"}>
        {status === "sending" ? form.sending : form.submit}
      </button>
    </form>
  );
}
