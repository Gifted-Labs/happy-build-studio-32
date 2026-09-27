import { useState, type FormEvent } from "react";

import { Icon } from "../landing/motion";
import { SectionLabel } from "../landing/reference-layout";
import { TurnstileWidget } from "../site/turnstile-widget";
import { useSubmission } from "../site/use-submission";
import {
  Field,
  SelectField,
  SubmissionError,
  SubmissionSuccess,
  SubmitButton,
  TextareaField,
} from "./fields";

const INTERESTS: Array<[string, string]> = [
  ["volunteer", "Volunteering my time"],
  ["partner", "Partnering with the foundation"],
  ["fundraise", "Fundraising for a project"],
  ["workshops", "Joining a workshop"],
];

/**
 * Interest form on the Get Involved page. Previously this page only linked off to
 * the contact page; capturing interest here keeps the intent attached to the way
 * the person wants to help.
 */
export function VolunteerForm() {
  const { state, submit, reset, isSubmitting, fieldError } = useSubmission();
  const [token, setToken] = useState<string | null>(null);
  // Bumped after a failed submission to issue a fresh, unspent challenge.
  const [challengeAttempt, setChallengeAttempt] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const message = String(values.get("message") ?? "").trim();
    const interest = String(values.get("interest") ?? "volunteer");

    const result = await submit({
      kind: "volunteer",
      name: String(values.get("name") ?? ""),
      email: String(values.get("email") ?? ""),
      interest: interest as "volunteer" | "partner" | "fundraise" | "workshops",
      ...(message ? { message } : {}),
      turnstileToken: token ?? "",
    });

    if (result.ok) form.reset();
    else setChallengeAttempt((attempt) => attempt + 1);
  }

  return (
    <section id="register" className="scroll-mt-24 bg-surface-page py-24 md:py-32">
      <div className="mx-auto grid max-w-max-width gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionLabel>REGISTER YOUR INTEREST</SectionLabel>
          <h2 className="font-display text-h1 text-navy-900">Tell us how you would like to help</h2>
          <p className="mt-5 text-body text-on-surface-variant">
            Share what you care about and the time or skills you can offer. Our team will match you
            with a current need and explain the next steps clearly.
          </p>
        </div>

        {state.status === "success" ? (
          <SubmissionSuccess
            title="Thank you for stepping forward"
            body="We have your details and have emailed you a confirmation. Our team will be in touch about opportunities that fit."
            reference={state.reference}
            onReset={reset}
          />
        ) : (
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
            <SelectField
              name="interest"
              label="How would you like to help?"
              options={INTERESTS}
              defaultValue="volunteer"
              className="md:col-span-2"
              error={fieldError("interest")}
            />
            <TextareaField
              name="message"
              label="Your experience or availability (optional)"
              rows={4}
              className="md:col-span-2"
              error={fieldError("message")}
            />

            <div className="md:col-span-2">
              <TurnstileWidget
                onToken={setToken}
                action="volunteer"
                resetSignal={challengeAttempt}
              />
            </div>

            <SubmitButton
              pending={isSubmitting}
              disabled={!token}
              className="md:col-span-2 md:justify-self-start"
            >
              Register My Interest <Icon name="arrow_outward" />
            </SubmitButton>
          </form>
        )}
      </div>
    </section>
  );
}
