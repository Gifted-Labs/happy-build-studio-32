import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { AccessDenied, requireAdmin } from "./server/access";
import { getDb } from "./server/env";
import type { SubmissionKind } from "./submissions";

/**
 * Admin data access.
 *
 * Lives outside `lib/server/` because the client imports it — it is an RPC
 * boundary, not server-only code. Every handler here calls `requireAdmin` first;
 * the Access check is what stands between the public internet and the personal
 * details of everyone who has contacted the foundation.
 */

export type SubmissionRow = {
  id: string;
  kind: SubmissionKind;
  name: string | null;
  email: string;
  subject: string | null;
  message: string | null;
  amount: number | null;
  interest: string | null;
  country: string | null;
  email_status: string;
  email_error: string | null;
  created_at: string;
};

export type InboxResult =
  | {
      ok: true;
      rows: SubmissionRow[];
      counts: { total: number; failed: number; byKind: Record<string, number> };
    }
  | { ok: false; error: string };

/** Newest first, capped — the inbox is for reading enquiries, not bulk export. */
const PAGE_SIZE = 200;

export const loadInbox = createServerFn({ method: "GET" })
  .validator((kind: unknown) => (typeof kind === "string" && kind ? kind : undefined))
  .handler(async ({ data: kind }): Promise<InboxResult> => {
    try {
      await requireAdmin(getRequest());
    } catch (error) {
      if (error instanceof AccessDenied) {
        console.warn("[admin] denied:", error.message);
        return { ok: false, error: "Not authorised." };
      }
      throw error;
    }

    const db = getDb();
    if (!db) return { ok: false, error: "No database binding on this environment." };

    const where = kind ? "WHERE kind = ?" : "";
    const bind = kind ? [kind] : [];

    const rows = await db
      .prepare(
        `SELECT id, kind, name, email, subject, message, amount, interest, country,
                email_status, email_error, created_at
           FROM submissions ${where}
          ORDER BY created_at DESC
          LIMIT ${PAGE_SIZE}`,
      )
      .bind(...bind)
      .all<SubmissionRow>();

    // Counts come from the whole table, not the filtered page, so the tabs keep
    // showing totals while a filter is applied.
    const totals = await db
      .prepare(
        `SELECT kind,
                COUNT(*) AS n,
                SUM(CASE WHEN email_status = 'failed' THEN 1 ELSE 0 END) AS failed
           FROM submissions GROUP BY kind`,
      )
      .all<{ kind: string; n: number; failed: number }>();

    const byKind: Record<string, number> = {};
    let total = 0;
    let failed = 0;
    for (const row of totals.results ?? []) {
      byKind[row.kind] = row.n;
      total += row.n;
      failed += row.failed ?? 0;
    }

    return { ok: true, rows: rows.results ?? [], counts: { total, failed, byKind } };
  });
