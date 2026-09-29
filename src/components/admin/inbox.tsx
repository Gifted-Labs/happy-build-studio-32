import { useMemo, useState } from "react";
import { ChevronDown, Inbox as InboxIcon, Mail, Search, TriangleAlert } from "lucide-react";

import type { SubmissionRow } from "../../lib/admin";
import { formatWhen, kindLabel, type SubmissionKind } from "../../lib/submissions";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EmptyState } from "./shell";

/**
 * The submission inbox: contact, donation, newsletter and volunteer forms.
 *
 * Until this existed the only way to read an enquiry was a wrangler command, so
 * the page's job is simply to make them visible — and to show when the
 * notification email failed, since that is when nobody was told a message came in.
 */

const KINDS: SubmissionKind[] = ["contact", "donation-enquiry", "newsletter", "volunteer"];

/** The colour a kind is shown in, so the list can be scanned without reading. */
const KIND_TONE: Record<SubmissionKind, string> = {
  contact: "bg-sky-100 text-sky-800",
  "donation-enquiry": "bg-emerald-100 text-emerald-800",
  newsletter: "bg-violet-100 text-violet-800",
  volunteer: "bg-amber-100 text-amber-900",
};

function Row({ row }: { row: SubmissionRow }) {
  const [open, setOpen] = useState(false);
  const failed = row.email_status === "failed";

  return (
    <li
      className={cn(
        "overflow-hidden rounded-xl border bg-card transition-colors",
        failed ? "border-destructive/30" : "border-border",
        open && "ring-1 ring-ring/20",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50 md:gap-4"
        aria-expanded={open}
      >
        <span
          className={cn(
            "hidden shrink-0 rounded-md px-2 py-1 text-xs font-semibold sm:inline-block sm:min-w-[8.5rem] sm:text-center",
            KIND_TONE[row.kind] ?? "bg-muted text-muted-foreground",
          )}
        >
          {kindLabel(row.kind)}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">
            {row.name ?? row.email}
            {row.subject ? (
              <span className="font-normal text-muted-foreground"> — {row.subject}</span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
            {row.email}
            {row.amount ? ` · GH₵${row.amount}` : ""}
            {row.interest ? ` · ${row.interest}` : ""}
          </span>
        </span>

        {failed ? (
          <span
            title={row.email_error ?? "Email delivery failed"}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive"
          >
            <TriangleAlert className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Email failed</span>
          </span>
        ) : null}

        <span className="hidden shrink-0 text-xs text-muted-foreground md:block">
          {formatWhen(row.created_at)}
        </span>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-border bg-muted/30 p-4 text-sm">
          {row.message ? (
            <p className="whitespace-pre-wrap leading-relaxed">{row.message}</p>
          ) : (
            <p className="italic text-muted-foreground">No message provided.</p>
          )}

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
            {[
              ["Country", row.country ?? "—"],
              ["Email status", row.email_status],
              ["Reference", row.id],
              ["Received", formatWhen(row.created_at)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-0.5 break-words">{value}</dd>
              </div>
            ))}
          </dl>

          {row.email_error ? (
            <p className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
              {row.email_error}
            </p>
          ) : null}

          <Button asChild size="sm" className="mt-4">
            <a
              href={`mailto:${row.email}${
                row.subject ? `?subject=Re: ${encodeURIComponent(row.subject)}` : ""
              }`}
            >
              <Mail aria-hidden />
              Reply by email
            </a>
          </Button>
        </div>
      ) : null}
    </li>
  );
}

export function Inbox({
  rows,
  counts,
}: {
  rows: SubmissionRow[];
  counts: { total: number; failed: number; byKind: Record<string, number> };
}) {
  const [filter, setFilter] = useState<SubmissionKind | "all">("all");
  const [query, setQuery] = useState("");

  /**
   * Search covers every field an enquiry is remembered by — someone looking for
   * a message recalls the sender or a phrase in it, not its reference.
   */
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter !== "all" && row.kind !== filter) return false;
      if (!needle) return true;
      return [row.name, row.email, row.subject, row.message, row.interest]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(needle));
    });
  }, [rows, filter, query]);

  return (
    <div className="space-y-5">
      {counts.failed > 0 ? (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
          <div className="text-sm">
            <p className="font-semibold text-destructive">
              {counts.failed} notification email{counts.failed === 1 ? "" : "s"} could not be sent
            </p>
            <p className="mt-0.5 text-muted-foreground">
              The submission was saved, but nobody was alerted by email. Open the marked rows below
              and reply directly.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {(["all", ...KINDS] as const).map((value) => {
          const active = filter === value;
          const count = value === "all" ? counts.total : (counts.byKind[value] ?? 0);
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted",
              )}
            >
              {value === "all" ? "All" : kindLabel(value)}
              <span className={cn("text-xs tabular-nums", active ? "opacity-80" : "opacity-70")}>
                {count}
              </span>
            </button>
          );
        })}

        <div className="relative ml-auto w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, message…"
            aria-label="Search submissions"
            className="pl-9"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={InboxIcon}
          title={query.trim() || filter !== "all" ? "Nothing matches" : "No submissions yet"}
          body={
            query.trim() || filter !== "all"
              ? "Try a different search, or clear the filter to see everything."
              : "Enquiries from the contact, donation, newsletter and volunteer forms arrive here."
          }
          action={
            query.trim() || filter !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Showing {visible.length} of {rows.length}
          </p>
          <ul className="space-y-2">
            {visible.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
