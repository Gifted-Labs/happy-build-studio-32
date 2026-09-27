import { useState, type FormEvent } from "react";

import { Icon } from "../landing/motion";
import { TurnstileWidget } from "../site/turnstile-widget";
import { useSubmission } from "../site/use-submission";

/**
 * Footer newsletter signup.
 *
 * The Turnstile widget is only mounted once the visitor has typed something, so
 * the challenge script is not loaded on every page view just to sit in the footer.
 */
export function NewsletterForm() {
  const { state, submit, isSubmitting } = useSubmission();
  const [token, setToken] = useState<string | null>(null);
  // Bumped after a failed submission to issue a fresh, unspent challenge.
  const [challengeAttempt, setChallengeAttempt] = useState(0);
  const [email, setEmail] = useState("");
  const engaged = email.length > 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await submit({
      kind: "newsletter",
      email,
      turnstileToken: token ?? "",
    });
    if (result.ok) setEmail("");
    else setChallengeAttempt((attempt) => attempt + 1);
  }

  if (state.status === "success") {
    return (
      <p role="status" className="mt-5 flex items-start gap-2 text-sm text-brand-mint">
        <Icon name="check_circle" className="mt-px shrink-0 text-[18px]" />
        You are subscribed — check your inbox for a confirmation.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-5">
      <div className="flex border-b border-white/25 pb-2">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-label="Email address"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          disabled={isSubmitting || !engaged || !token}
          aria-label="Subscribe"
          aria-busy={isSubmitting}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-mint text-ink-900 transition-opacity disabled:opacity-50"
        >
          <Icon name={isSubmitting ? "hourglass_top" : "arrow_forward"} className="text-[17px]" />
        </button>
      </div>

      {engaged ? (
        <TurnstileWidget
          onToken={setToken}
          action="newsletter"
          resetSignal={challengeAttempt}
          theme="dark"
          className="mt-4"
        />
      ) : null}

      {state.status === "error" ? (
        <p role="alert" className="mt-3 text-sm font-medium text-red-300">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
