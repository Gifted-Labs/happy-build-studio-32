import { useState } from "react";

import type { SubmissionRow } from "../../lib/admin";
import { kindLabel, type SubmissionKind } from "../../lib/submissions";

/**
 * The submission inbox: contact, donation, newsletter and volunteer forms.
 *
 * Until this existed the only way to read an enquiry was a wrangler command, so
 * the page's job is simply to make them visible — and to show when the
 * notification email failed, since that is when nobody was told a message came in.
 */

const KINDS: SubmissionKind[] = ["contact", "donation-enquiry", "newsletter", "volunteer"];

export function formatWhen(value: string): string {
  const date = new Date(value.endsWith("Z") ? value : `${value}Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function Row({ row }: { row: SubmissionRow }) {
  const [open, setOpen] = useState(false);
  const failed = row.email_status === "failed";

  return (
    <li className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-4 p-4 text-left"
        aria-expanded={open}
      >
        <span className="mt-1 inline-block min-w-[9rem] rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
          {kindLabel(row.kind)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-slate-900">
            {row.name ?? row.email}
            {row.subject ? (
              <span className="font-normal text-slate-500"> — {row.subject}</span>
            ) : null}
          </span>
          <span className="mt-1 block text-sm text-slate-500">
            {row.email}
            {row.amount ? ` · GH₵${row.amount}` : ""}
            {row.interest ? ` · ${row.interest}` : ""}
            {` · ${formatWhen(row.created_at)}`}
          </span>
        </span>
        {failed ? (
          <span
            title={row.email_error ?? "Email delivery failed"}
            className="shrink-0 rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800"
          >
            email failed
          </span>
        ) : null}
        <span className="shrink-0 font-mono text-xs text-slate-400">{row.id}</span>
      </button>

      {open ? (
        <div className="border-t border-slate-100 p-4 text-sm">
          {row.message ? (
            <p className="whitespace-pre-wrap text-slate-800">{row.message}</p>
          ) : (
            <p className="italic text-slate-400">No message provided.</p>
          )}
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 sm:grid-cols-4">
            {[
              ["Country", row.country ?? "—"],
              ["Email status", row.email_status],
              ["Reference", row.id],
              ["Received", formatWhen(row.created_at)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-semibold text-slate-600">{label}</dt>
                <dd className="break-words">{value}</dd>
              </div>
            ))}
          </dl>
          {row.email_error ? (
            <p className="mt-3 rounded bg-amber-50 p-3 text-xs text-amber-900">{row.email_error}</p>
          ) : null}
          <a
            href={`mailto:${row.email}${row.subject ? `?subject=Re: ${encodeURIComponent(row.subject)}` : ""}`}
            className="mt-4 inline-block rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
          >
            Reply by email
          </a>
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
  const visible = filter === "all" ? rows : rows.filter((row) => row.kind === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {(["all", ...KINDS] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filter === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {value === "all" ? "All" : kindLabel(value)}
            <span className="ml-2 text-xs opacity-70">
              {value === "all" ? counts.total : (counts.byKind[value] ?? 0)}
            </span>
          </button>
        ))}
        {counts.failed > 0 ? (
          <span className="ml-auto rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
            {counts.failed} email{counts.failed === 1 ? "" : "s"} failed to send
          </span>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-500">
          Nothing here yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </ul>
      )}
    </div>
  );
}
