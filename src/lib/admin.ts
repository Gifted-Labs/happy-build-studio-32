import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import type { NewsStory, Project } from "./content";
import {
  deleteNews,
  deleteProject,
  readNews,
  readProjects,
  replaceGallery,
  upsertNews,
  upsertProject,
} from "./server/content-store";
import { AccessDenied, requireAdmin } from "./server/access";
import { getDb } from "./server/env";
import type { SubmissionKind } from "./submissions";

/**
 * Everything /admin can read and write.
 *
 * Lives outside `lib/server/` because the client imports it — it is an RPC
 * boundary, not server-only code. Every handler here goes through `adminContext`
 * first; that check is what stands between the public internet and both the
 * personal details of everyone who has contacted the foundation and the ability
 * to change what the site says.
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

export type AdminData = {
  /** The signed-in administrator, shown so it is obvious whose session this is. */
  email: string;
  submissions: SubmissionRow[];
  counts: { total: number; failed: number; byKind: Record<string, number> };
  /** Includes unpublished drafts, which the public pages never return. */
  projects: Project[];
  news: NewsStory[];
};

export type AdminResult<T> = { ok: true; data: T } | { ok: false; error: string };

/** Newest first, capped — the inbox is for reading enquiries, not bulk export. */
const PAGE_SIZE = 200;

/**
 * Verify the caller and hand back a database handle.
 *
 * Fails closed on anything, not only AccessDenied. An unexpected error inside
 * verification must not become a 500 that leaves the caller guessing whether the
 * page is protected — it is a refusal.
 */
async function adminContext(): Promise<
  { ok: true; db: D1Database; email: string } | { ok: false; error: string }
> {
  let email: string;
  try {
    email = await requireAdmin(getRequest());
  } catch (error) {
    const reason = error instanceof AccessDenied ? error.message : String(error);
    console.warn("[admin] denied:", reason);
    return { ok: false, error: "Not authorised." };
  }

  const db = getDb();
  if (!db) return { ok: false, error: "No database binding on this environment." };

  return { ok: true, db, email };
}

/** Report a failed write as a message rather than an exception the UI cannot use. */
function failed(action: string, error: unknown): { ok: false; error: string } {
  console.error(`[admin] ${action} failed:`, error);
  return { ok: false, error: `Could not ${action}. The change was not saved.` };
}

/* ------------------------------------------------------------------ reads */

export const loadAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminResult<AdminData>> => {
    const context = await adminContext();
    if (!context.ok) return context;
    const { db, email } = context;

    const submissions = await db
      .prepare(
        `SELECT id, kind, name, email, subject, message, amount, interest, country,
                email_status, email_error, created_at
           FROM submissions
          ORDER BY created_at DESC
          LIMIT ${PAGE_SIZE}`,
      )
      .all<SubmissionRow>();

    // Counts come from the whole table, not the capped page, so the tabs keep
    // showing totals however many rows were fetched.
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
    let failedCount = 0;
    for (const row of totals.results ?? []) {
      byKind[row.kind] = row.n;
      total += row.n;
      failedCount += row.failed ?? 0;
    }

    const [projects, news] = await Promise.all([
      readProjects(db, { drafts: true }),
      readNews(db, { drafts: true }),
    ]);

    return {
      ok: true,
      data: {
        email,
        submissions: submissions.results ?? [],
        counts: { total, failed: failedCount, byKind },
        projects,
        news,
      },
    };
  },
);

/* ----------------------------------------------------------- write schemas */

/**
 * A URL slug. Anything else would produce a project page at an address the site
 * cannot link to, so it is rejected at the boundary rather than sanitised —
 * silently changing what the editor typed is how two records end up disagreeing
 * about which one is live.
 */
const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.")
  .max(80);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker.");
const line = (max: number) => z.string().trim().min(1).max(max);

const photoSchema = z.object({
  id: z.string().trim().min(1).max(120),
  src: z.string().trim().min(1).max(500),
  // Empty is allowed and means decorative; it is a choice the editor makes.
  alt: z.string().trim().max(300),
});

const projectSchema = z.object({
  slug,
  shortTitle: line(120),
  title: line(200),
  category: line(60),
  date: line(60),
  sortDate: isoDate,
  location: line(160),
  status: line(40),
  heroImage: line(500),
  secondaryImage: line(500),
  summary: line(700),
  description: z.array(z.string().trim().min(1).max(4000)).max(30),
  metrics: z
    .array(z.object({ icon: z.string().trim().max(60), value: line(40), label: line(160) }))
    .max(12),
  expectations: z
    .array(z.object({ icon: z.string().trim().max(60), title: line(120), body: line(1000) }))
    .max(12),
  steps: z
    .array(z.object({ title: line(120), body: line(1000), detail: z.string().trim().max(1000) }))
    .max(12),
  faqs: z.array(z.tuple([line(300), line(2000)])).max(20),
  gallery: z.array(photoSchema).max(60),
  published: z.boolean(),
});

const newsSchema = z.object({
  id: slug,
  title: line(200),
  date: line(60),
  sortDate: isoDate,
  body: line(2000),
  image: line(500),
  link: z.string().trim().max(500).nullable(),
  published: z.boolean(),
});

/** Turn a schema failure into the first readable message, for display in the UI. */
function firstIssue(error: z.ZodError): string {
  const issue = error.issues[0];
  const path = issue?.path.join(".");
  return path ? `${path}: ${issue.message}` : (issue?.message ?? "That input is not valid.");
}

/* ----------------------------------------------------------------- writes */

export const saveProject = createServerFn({ method: "POST" })
  .validator((input: unknown) => projectSchema.safeParse(input))
  .handler(async ({ data: parsed }): Promise<AdminResult<{ slug: string }>> => {
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const context = await adminContext();
    if (!context.ok) return context;

    const { gallery, ...project } = parsed.data;
    try {
      await upsertProject(context.db, project);
      await replaceGallery(context.db, project.slug, gallery);
    } catch (error) {
      return failed("save this outreach", error);
    }

    console.log(`[admin] ${context.email} saved project ${project.slug}`);
    return { ok: true, data: { slug: project.slug } };
  });

export const removeProject = createServerFn({ method: "POST" })
  .validator((input: unknown) => slug.safeParse(input))
  .handler(async ({ data: parsed }): Promise<AdminResult<null>> => {
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const context = await adminContext();
    if (!context.ok) return context;

    try {
      await deleteProject(context.db, parsed.data);
    } catch (error) {
      return failed("delete this outreach", error);
    }

    console.log(`[admin] ${context.email} deleted project ${parsed.data}`);
    return { ok: true, data: null };
  });

export const saveNews = createServerFn({ method: "POST" })
  .validator((input: unknown) => newsSchema.safeParse(input))
  .handler(async ({ data: parsed }): Promise<AdminResult<{ id: string }>> => {
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const context = await adminContext();
    if (!context.ok) return context;

    const story = { ...parsed.data, link: parsed.data.link || null };
    try {
      await upsertNews(context.db, story);
    } catch (error) {
      return failed("save this story", error);
    }

    console.log(`[admin] ${context.email} saved story ${story.id}`);
    return { ok: true, data: { id: story.id } };
  });

export const removeNews = createServerFn({ method: "POST" })
  .validator((input: unknown) => slug.safeParse(input))
  .handler(async ({ data: parsed }): Promise<AdminResult<null>> => {
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const context = await adminContext();
    if (!context.ok) return context;

    try {
      await deleteNews(context.db, parsed.data);
    } catch (error) {
      return failed("delete this story", error);
    }

    console.log(`[admin] ${context.email} deleted story ${parsed.data}`);
    return { ok: true, data: null };
  });
