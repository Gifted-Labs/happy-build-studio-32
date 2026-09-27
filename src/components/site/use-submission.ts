import { useCallback, useState } from "react";

import { submitForm } from "../../lib/submit-form";
import type { Submission, SubmissionResult } from "../../lib/submissions";

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

/**
 * Submit state for a single form.
 *
 * Every form on the site shares one server function, so this hook holds the
 * pending/success/error handling in one place rather than repeating it per page.
 */
export function useSubmission() {
  const [state, setState] = useState<State>({ status: "idle" });

  const submit = useCallback(async (payload: Submission): Promise<SubmissionResult> => {
    setState({ status: "submitting" });

    try {
      const result = await submitForm({ data: payload });

      if (result.ok) {
        setState({ status: "success", reference: result.reference });
      } else {
        setState({
          status: "error",
          message: result.error,
          fieldErrors: result.fieldErrors,
        });
      }
      return result;
    } catch (error) {
      console.error("[submission]", error);
      const message = "Something went wrong sending your message. Please try again.";
      setState({ status: "error", message });
      return { ok: false, error: message };
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return {
    state,
    submit,
    reset,
    isSubmitting: state.status === "submitting",
    fieldError: (field: string) =>
      state.status === "error" ? state.fieldErrors?.[field] : undefined,
  };
}
