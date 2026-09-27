import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Cloudflare's documented always-passes test site key, paired with the test
 * secret in lib/server/turnstile.ts so forms work in development without keys.
 */
const TEST_SITE_KEY = "1x00000000000000000000AA";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || TEST_SITE_KEY;

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      /** Names the protected surface; the server verifies it back. */
      action?: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
      appearance?: "always" | "execute" | "interaction-only";
    },
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Loaded once per document, shared by every widget on the page. */
let scriptPromise: Promise<void> | undefined;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();

  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Turnstile failed to load")));
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

type TurnstileWidgetProps = {
  /** Called with a token when the challenge passes, or null when it expires. */
  onToken: (token: string | null) => void;
  /**
   * Names the surface being protected. The server requires the token's action to
   * match the form it was submitted to, so this must agree with the submission's
   * `kind` — see lib/server/turnstile.ts.
   */
  action: string;
  /**
   * Bump to discard the current token and issue a fresh challenge.
   *
   * Turnstile tokens are single-use: once siteverify redeems one, it cannot be
   * redeemed again. These forms stay mounted after a failed submission, so
   * without this a visitor correcting a validation error would resubmit the
   * spent token and be told they are a bot. Each form bumps this when a
   * submission fails.
   */
  resetSignal?: number;
  className?: string;
  theme?: "light" | "dark" | "auto";
};

/**
 * Renders a Turnstile challenge and reports its token upward.
 *
 * Rendered explicitly rather than via auto-detection so the widget's lifecycle
 * matches the component's, multiple forms can coexist on one page, and each can
 * be reset independently.
 */
export function TurnstileWidget({
  onToken,
  action,
  resetSignal = 0,
  className,
  theme = "auto",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Held in a ref so re-renders from the parent never re-create the widget.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  // The live widget id, kept outside the effect so a reset can reach it.
  const widgetIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          action,
          theme,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch((error) => {
        console.error("[turnstile]", error);
        onTokenRef.current(null);
      });

    return () => {
      cancelled = true;
      const widgetId = widgetIdRef.current;
      widgetIdRef.current = undefined;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // Widget already gone; nothing to clean up.
        }
      }
    };
  }, [action, theme]);

  /**
   * Clear the spent token on reset so the submit button disables until the
   * visitor solves the fresh challenge — resetting the widget alone would leave
   * the form holding a token that siteverify has already rejected.
   */
  useEffect(() => {
    if (resetSignal === 0) return;
    const widgetId = widgetIdRef.current;
    if (!widgetId || !window.turnstile) return;

    onTokenRef.current(null);
    try {
      window.turnstile.reset(widgetId);
    } catch (error) {
      console.error("[turnstile] reset failed", error);
    }
  }, [resetSignal]);

  return <div ref={containerRef} className={className} />;
}
