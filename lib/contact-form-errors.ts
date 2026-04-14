import type { ZodError } from "zod";

import type { ContactDocument } from "@/content/types";

const messageKeys = new Set([
  "name_min",
  "name_max",
  "phone_min",
  "phone_max",
  "phone_invalid",
  "email_invalid",
  "email_max",
  "message_min",
  "message_max",
  "locale_invalid",
]);

export function mapContactZodErrors(
  error: ZodError,
  form: ContactDocument["form"],
): Record<string, string> {
  const out: Record<string, string> = {};
  const { val } = form;

  for (const issue of error.issues) {
    const pathKey = issue.path[0];
    if (typeof pathKey !== "string") continue;
    const code = messageKeys.has(issue.message) ? issue.message : "generic";
    out[pathKey] = resolveValMessage(code, val, form.errorGeneric);
  }
  return out;
}

function resolveValMessage(
  code: string,
  val: ContactDocument["form"]["val"],
  generic: string,
): string {
  switch (code) {
    case "name_min":
      return val.nameMin;
    case "name_max":
      return val.nameMax;
    case "phone_min":
      return val.phoneMin;
    case "phone_max":
      return val.phoneMax;
    case "phone_invalid":
      return val.phoneInvalid;
    case "email_invalid":
      return val.emailInvalid;
    case "email_max":
      return val.emailMax;
    case "message_min":
      return val.messageMin;
    case "message_max":
      return val.messageMax;
    case "locale_invalid":
      return val.localeInvalid;
    default:
      return generic;
  }
}
