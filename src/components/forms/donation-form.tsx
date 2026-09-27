import { useState, type FormEvent } from "react";

import { Icon } from "../landing/motion";
import { TurnstileWidget } from "../site/turnstile-widget";
import { useSubmission } from "../site/use-submission";
import { Field, SubmissionError, SubmissionSuccess, SubmitButton, TextareaField } from "./fields";

/**
 * Donation *enquiry* form — the foundation takes no payments on the site, so this
 * collects intent and the team follows up with payment details.
 */
export function DonationForm({ defaultAmount }: { defaultAmount?: number }) {
  const { state, submit, reset, isSubmitting, fieldError } = useSubmission();
  const [token, setToken] = useState<string | null>(null);
  // Bumped after a failed submission to issue a fresh, unspent challenge.
  const [challengeAttempt, setChallengeAttempt] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const message = String(values.get("message") ?? "").trim();

    const result = await submit({
      kind: "donation-enquiry",
      name: String(values.get("name") ?? ""),
      email: String(values.get("email") ?? ""),
      amount: Number(values.get("amount") ?? 0),
      ...(message ? { message } : {}),
      turnstileToken: token ?? "",
    });

    if (result.ok) form.reset();
    else setChallengeAttempt((attempt) => attempt + 1);
  }

  if (state.status === "success") {
    return (
      <SubmissionSuccess
        variant="dark"
        title="Enquiry received"
        body="Thank you for offering your support. We have emailed you a confirmation, and our team will follow up with the ways you can complete your contribution."
        reference={state.reference}
        onReset={reset}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-lg bg-navy-900 p-6 text-white shadow-2xl md:p-8"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-mint text-ink-900">
        <Icon name="volunteer_activism" className="text-[22px]" />
      </span>
      <h2 className="font-display text-h3">Donation enquiry</h2>

      {state.status === "error" ? <SubmissionError>{state.message}</SubmissionError> : null}

      <Field
        name="amount"
        label="Amount in Ghana cedis"
        type="number"
        inputMode="numeric"
        min={1}
        required
        variant="dark"
        placeholder="50"
        defaultValue={defaultAmount}
        error={fieldError("amount")}
      />
      <Field
        name="name"
        label="Full name"
        required
        variant="dark"
        autoComplete="name"
        error={fieldError("name")}
      />
      <Field
        name="email"
        label="Email address"
        type="email"
        required
        variant="dark"
        autoComplete="email"
        error={fieldError("email")}
      />
      <TextareaField
        name="message"
        label="Anything we should know? (optional)"
        rows={3}
        variant="dark"
        error={fieldError("message")}
      />

      <TurnstileWidget
        onToken={setToken}
        action="donation-enquiry"
        resetSignal={challengeAttempt}
        theme="dark"
      />

      <SubmitButton pending={isSubmitting} disabled={!token} variant="dark" className="w-full">
        Contact the Donation Team
      </SubmitButton>

      <p className="text-center text-body-sm text-white/60">
        Our team will reply with the available ways to give.
      </p>
    </form>
  );
}
