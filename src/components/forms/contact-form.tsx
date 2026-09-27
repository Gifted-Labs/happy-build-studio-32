import { useState, type FormEvent } from "react";

import { Icon } from "../landing/motion";
import { TurnstileWidget } from "../site/turnstile-widget";
import { useSubmission } from "../site/use-submission";
import { Field, SubmissionError, SubmissionSuccess, SubmitButton, TextareaField } from "./fields";

export function ContactForm() {
  const { state, submit, reset, isSubmitting, fieldError } = useSubmission();
  const [token, setToken] = useState<string | null>(null);
  // Bumped after a failed submission to issue a fresh, unspent challenge.
  const [challengeAttempt, setChallengeAttempt] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);

    const result = await submit({
      kind: "contact",
      name: String(values.get("name") ?? ""),
      email: String(values.get("email") ?? ""),
      subject: String(values.get("subject") ?? ""),
      message: String(values.get("message") ?? ""),
      turnstileToken: token ?? "",
    });

    if (result.ok) form.reset();
    else setChallengeAttempt((attempt) => attempt + 1);
  }

  if (state.status === "success") {
    return (
      <SubmissionSuccess
        title="Message received"
        body="Thank you for getting in touch. We have sent a confirmation to your email address and our team will reply soon."
        reference={state.reference}
        onReset={reset}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-5 rounded-lg bg-white p-6 shadow-xl md:grid-cols-2 md:p-8"
    >
      {state.status === "error" ? (
        <div className="md:col-span-2">
          <SubmissionError>{state.message}</SubmissionError>
        </div>
      ) : null}

      <Field
        name="name"
        label="Full name"
        required
        autoComplete="name"
        error={fieldError("name")}
      />
      <Field
        name="email"
        label="Email address"
        type="email"
        required
        autoComplete="email"
        error={fieldError("email")}
      />
      <Field
        name="subject"
        label="Subject"
        required
        className="md:col-span-2"
        error={fieldError("subject")}
      />
      <TextareaField
        name="message"
        label="Message"
        required
        className="md:col-span-2"
        error={fieldError("message")}
      />

      <div className="md:col-span-2">
        <TurnstileWidget onToken={setToken} action="contact" resetSignal={challengeAttempt} />
        {fieldError("turnstileToken") ? (
          <p role="alert" className="mt-2 text-sm font-medium text-destructive">
            {fieldError("turnstileToken")}
          </p>
        ) : null}
      </div>

      <SubmitButton
        pending={isSubmitting}
        disabled={!token}
        className="md:col-span-2 md:justify-self-start"
      >
        Send Message <Icon name="arrow_outward" />
      </SubmitButton>
    </form>
  );
}
