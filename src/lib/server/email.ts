import { bindings } from "./env";
import { kindLabel, type Submission } from "../submissions";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type SendArgs = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

/** Escape untrusted values before they land in an email body. */
function line(label: string, value: string | number | undefined): string {
  if (value === undefined || value === "") return "";
  return `${label}: ${value}\n`;
}

async function send({ to, subject, text, replyTo }: SendArgs): Promise<void> {
  const apiKey = bindings.RESEND_API_KEY;
  const from = bindings.RESEND_FROM;

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and RESEND_FROM must both be configured.");
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
  }
}

/** Plain-text summary of a submission, for the internal notification. */
function summarise(submission: Submission, reference: string): string {
  const parts = [
    `${kindLabel(submission.kind)}`,
    `Reference: ${reference}`,
    "",
    line("Email", submission.email),
  ];

  if ("name" in submission) parts.push(line("Name", submission.name));
  if ("subject" in submission) parts.push(line("Subject", submission.subject));
  if ("amount" in submission) parts.push(line("Amount", `GH₵${submission.amount}`));
  if ("interest" in submission) parts.push(line("Interest", submission.interest));
  if ("message" in submission && submission.message) {
    parts.push("", "Message:", submission.message);
  }

  return parts.filter(Boolean).join("").trimEnd();
}

/**
 * Tell the foundation a submission arrived. Reply-to is set to the sender so
 * staff can answer straight from their inbox.
 */
export async function sendNotification(submission: Submission, reference: string): Promise<void> {
  const to = bindings.NOTIFY_EMAIL;
  if (!to) throw new Error("NOTIFY_EMAIL is not configured.");

  await send({
    to,
    subject: `[${kindLabel(submission.kind)}] ${reference}`,
    text: summarise(submission, reference),
    replyTo: submission.email,
  });
}

const ACKNOWLEDGEMENTS: Record<Submission["kind"], { subject: string; body: string }> = {
  contact: {
    subject: "We received your message",
    body: "Thank you for contacting the Life Story Foundation. We have your message and someone from our team will reply as soon as they can.",
  },
  "donation-enquiry": {
    subject: "Thank you for your donation enquiry",
    body: "Thank you for offering to support our work. Our team will be in touch shortly with the ways you can complete your contribution.",
  },
  newsletter: {
    subject: "You are on the list",
    body: "Thank you for subscribing. You will now receive project milestones, community stories, and opportunities to get involved.",
  },
  volunteer: {
    subject: "Thank you for your interest in volunteering",
    body: "Thank you for offering your time and skills. Our team will review your interest and follow up with current opportunities that fit.",
  },
};

/** Acknowledge receipt to the person who submitted the form. */
export async function sendAcknowledgement(
  submission: Submission,
  reference: string,
): Promise<void> {
  const { subject, body } = ACKNOWLEDGEMENTS[submission.kind];

  await send({
    to: submission.email,
    subject,
    text: `${body}\n\nYour reference is ${reference}.\n\n— Life Story Foundation`,
    replyTo: bindings.NOTIFY_EMAIL,
  });
}
