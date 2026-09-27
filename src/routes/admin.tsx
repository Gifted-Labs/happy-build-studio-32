import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { loadInbox, type SubmissionRow } from "../lib/admin";
import { kindLabel, type SubmissionKind } from "../lib/submissions";

/**
 * Submission inbox.
 *
 * Deliberately not in the site's page shell: this is an internal tool, it should
 * not look like the public site, and it must never appear in the navigation.
 * It is also absent from vite.config.ts `pages`, so it is never prerendered —
 * the data is read per request, behind Cloudflare Access.
 */
export const Route = createFileRoute("/admin")({
  loader: () => loadInbox(),
  head: () => ({
    meta: [
      { title: "Submissions — Life Story Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const KINDS: SubmissionKind[] = ["contact", "donation-enquiry", "newsletter", "volunteer"];

function formatWhen(value: string): string {
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

function AdminPage() {
  const result = Route.useLoaderData();
  const [filter, setFilter] = useState<SubmissionKind | "all">("all");

  if (!result.ok) {
    return (
      <main className="mx-auto max-w-2xl p-10 font-sans">
        <h1 className="text-xl font-semibold text-slate-900">Submissions</h1>
        <p className="mt-3 rounded-lg bg-red-50 p-4 text-sm text-red-800">{result.error}</p>
        <p className="mt-3 text-sm text-slate-500">
          This page is restricted to administrators signed in through Cloudflare Access.
        </p>
      </main>
    );
  }

  const { rows, counts } = result;
  const visible = filter === "all" ? rows : rows.filter((row) => row.kind === filter);

  return (
    <main className="mx-auto max-w-5xl p-6 font-sans md:p-10">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Submissions</h1>
        <p className="text-sm text-slate-500">
          {counts.total} total
          {counts.failed > 0 ? (
            <span className="ml-2 rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
              {counts.failed} email{counts.failed === 1 ? "" : "s"} failed to send
            </span>
          ) : null}
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
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
    </main>
  );
}
