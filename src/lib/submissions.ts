import { z } from "zod";

/**
 * Shapes for every form on the site. Shared by the client (to validate before
 * submitting) and the server function (which re-validates — client-side checks
 * are a convenience, never a trust boundary).
 */

const email = z
  .string()
  .trim()
  .min(1, "Email address is required")
  .max(254)
  .email("Enter a valid email address");

const name = z.string().trim().min(1, "Your name is required").max(120);

const message = z.string().trim().min(1, "A message is required").max(4000);

/** Present on every submission; verified server-side before anything is stored. */
const common = { turnstileToken: z.string().min(1, "Please complete the spam check") };

export const contactSchema = z.object({
  kind: z.literal("contact"),
  name,
  email,
  subject: z.string().trim().min(1, "A subject is required").max(200),
  message,
  ...common,
});

export const donationEnquirySchema = z.object({
  kind: z.literal("donation-enquiry"),
  name,
  email,
  // Whole cedis. Capped to keep an obvious typo out of the notification email.
  amount: z.coerce
    .number()
    .int("Enter a whole number of cedis")
    .positive("Enter an amount greater than zero")
    .max(10_000_000, "Please contact us directly for gifts of this size"),
  message: message.optional(),
  ...common,
});

export const newsletterSchema = z.object({
  kind: z.literal("newsletter"),
  email,
  ...common,
});

export const volunteerSchema = z.object({
  kind: z.literal("volunteer"),
  name,
  email,
  interest: z.enum(["volunteer", "partner", "fundraise", "workshops"]),
  message: message.optional(),
  ...common,
});

export const submissionSchema = z.discriminatedUnion("kind", [
  contactSchema,
  donationEnquirySchema,
  newsletterSchema,
  volunteerSchema,
]);

export type Submission = z.infer<typeof submissionSchema>;
export type SubmissionKind = Submission["kind"];

/** What the server function returns to the form. */
export type SubmissionResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const KIND_LABELS: Record<SubmissionKind, string> = {
  contact: "Contact message",
  "donation-enquiry": "Donation enquiry",
  newsletter: "Newsletter signup",
  volunteer: "Volunteer / partner interest",
};

export function kindLabel(kind: SubmissionKind): string {
  return KIND_LABELS[kind];
}

/**
 * A stored timestamp as a person reads it. D1 writes these without a zone; they
 * are UTC, so the `Z` is added when it is missing rather than letting the
 * browser read them as local time and shift every row by the offset.
 */
export function formatWhen(value: string): string {
  const date = new Date(value.endsWith("Z") ? value : `${value}Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
