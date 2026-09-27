import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type SiteLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
};

/**
 * Internal links go through the router so navigation stays client-side; anything
 * else (mailto:, tel:, absolute URLs) falls back to a plain anchor.
 *
 * Accepts a single `href` including an optional `#hash`, so callers can keep
 * writing paths the way they appear in the design rather than splitting them
 * into router props by hand.
 */
export function SiteLink({ href, children, ...rest }: SiteLinkProps) {
  if (!href.startsWith("/")) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const [beforeHash, hash] = href.split("#");
  const [path, query] = beforeHash.split("?");

  // Numeric values are coerced so the router serialises `?amount=50` rather than
  // `?amount="50"` — routes validating with Number() would otherwise see NaN.
  const search = query
    ? Object.fromEntries(
        Array.from(new URLSearchParams(query), ([key, value]) => [
          key,
          value !== "" && Number.isFinite(Number(value)) ? Number(value) : value,
        ]),
      )
    : undefined;

  return (
    <Link to={path || "/"} hash={hash} search={search} {...rest}>
      {children}
    </Link>
  );
}
