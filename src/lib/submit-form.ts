import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { submissionSchema, type Submission, type SubmissionResult } from "./submissions";
import { getDb, isDev } from "./server/env";
import { verifyTurnstile } from "./server/turnstile";
import { sendAcknowledgement, sendNotification } from "./server/email";

/** Short, human-quotable reference, e.g. "LS-8F3K2Q". */
function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const body = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `LS-${body}`;
}

type Meta = { country?: string; userAgent?: string; ip?: string };

function requestMeta(): Meta {
  try {
    const request = getRequest();
    return {
      country: request.headers.get("cf-ipcountry") ?? undefined,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? undefined,
      ip: request.headers.get("cf-connecting-ip") ?? undefined,
    };
  } catch {
    // No ambient request (e.g. during prerendering) — metadata is optional.
    return {};
  }
}

async function persist(submission: Submission, reference: string, meta: Meta): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  await db
    .prepare(
      `INSERT INTO submissions
         (id, kind, name, email, subject, message, amount, interest, country, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      reference,
      submission.kind,
      "name" in submission ? submission.name : null,
      submission.email,
      "subject" in submission ? submission.subject : null,
      "message" in submission ? (submission.message ?? null) : null,
      "amount" in submission ? submission.amount : null,
      "interest" in submission ? submission.interest : null,
      meta.country ?? null,
      meta.userAgent ?? null,
    )
    .run();

  return true;
}

async function recordEmailOutcome(
  reference: string,
  status: "sent" | "failed" | "skipped",
  error?: string,
): Promise<void> {
  const db = getDb();
  if (!db) return;

  await db
    .prepare(`UPDATE submissions SET email_status = ?, email_error = ? WHERE id = ?`)
    .bind(status, error?.slice(0, 500) ?? null, reference)
    .run();
}

/**
 * Handle a submission from any of the site's forms.
 *
 * Deliberate ordering:
 *   1. Verify Turnstile — reject bots before spending any quota on them.
 *   2. Write to D1 — the submission is durable from this point on.
 *   3. Send email — best-effort. A failure here is recorded against the row and
 *      the visitor still sees success, because their message is safely stored.
 *
 * That last point is the important one: Resend's free tier allows 100 emails a
 * day, so email is the component most likely to be unavailable. Treating it as
 * non-critical means a rate-limited send never costs the foundation an enquiry.
 */
export const submitForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }): Promise<SubmissionResult> => {
    try {
      return await handle(data);
    } catch (error) {
      /**
       * Anything unhandled reaching here is a fault at our end, not the
       * visitor's — most likely a missing key or binding. Left to throw it
       * becomes a 500 the client can only report as "something went wrong",
       * which is exactly the message that tells nobody anything. The detail goes
       * to the logs; the visitor gets a way to reach the foundation regardless.
       */
      console.error("[submissions] unhandled failure", error);
      return {
        ok: false,
        error:
          "Something went wrong at our end and your message was not sent. " +
          "Please try again in a moment, or email us directly at contact@lifestory.org.",
      };
    }
  });

async function handle(data: unknown): Promise<SubmissionResult> {
  const parsed = submissionSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const submission = parsed.data;
  const meta = requestMeta();

  /**
   * The submission's own `kind` is the expected Turnstile action, and each form
   * mints its token with that action. So a token is only ever spendable on the
   * form it came from — a newsletter token cannot be replayed against the
   * contact handler. The kinds are already valid action strings (1-32 chars,
   * alphanumeric and hyphens), so no separate mapping is needed.
   */
  const human = await verifyTurnstile(submission.turnstileToken, submission.kind, meta.ip);
  if (!human) {
    return {
      ok: false,
      error: "We could not verify that you are human. Please reload and try again.",
    };
  }

  const reference = makeReference();

  let stored = false;
  try {
    stored = await persist(submission, reference, meta);
  } catch (error) {
    console.error("[submissions] failed to persist", error);
    return {
      ok: false,
      error: "We could not save your message just now. Please try again in a moment.",
    };
  }

  if (!stored && isDev) {
    console.info("[submissions] (dev, not persisted)", reference, submission.kind);
  }

  // Email is best-effort from here on; the submission is already safe.
  try {
    await sendNotification(submission, reference);
    await sendAcknowledgement(submission, reference);
    await recordEmailOutcome(reference, "sent");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("[submissions] email failed", detail);
    await recordEmailOutcome(reference, "failed", detail).catch(() => {});
  }

  return { ok: true, reference };
}
