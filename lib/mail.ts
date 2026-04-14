import nodemailer from "nodemailer";

const DEFAULT_CONTACT_TO = "info@red-auto.store";

export function getContactFormTo(): string {
  return process.env.CONTACT_TO?.trim() || DEFAULT_CONTACT_TO;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildContactEmailHtml(input: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5;">
  <h2 style="color:#1c1b1b;">Red Auto — contact form</h2>
  <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
  <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
  <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
  <hr style="border:none;border-top:1px solid #eae7e7;margin:16px 0;" />
  <pre style="white-space:pre-wrap;font-family:inherit;margin:0;">${escapeHtml(input.message)}</pre>
</body>
</html>`;
}

export async function sendContactFormEmail(input: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): Promise<void> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;

  if (!host || !user || !pass || !from) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  const port = Number(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const to = getContactFormTo();
  const subject = `Red Auto contact: ${input.name}`;

  await transporter.sendMail({
    from,
    to,
    replyTo: input.email,
    subject,
    text: `Name: ${input.name}\nPhone: ${input.phone}\nEmail: ${input.email}\n\n${input.message}`,
    html: buildContactEmailHtml(input),
  });
}
