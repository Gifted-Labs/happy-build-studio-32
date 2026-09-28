import { createServerFn } from "@tanstack/react-start";

import {
  readNews,
  readProject,
  readProjectSiblings,
  readProjects,
  seededNews,
  seededProjects,
} from "./server/content-store";
import { getDb } from "./server/env";

/**
 * The site's editable content: outreaches, their photographs, and news stories.
 *
 * D1 is the source of truth — /admin writes here and the public pages read it on
 * every request, so a published change is live immediately without a deploy. The
 * arrays in src/data/ are the seed that migration 0003 loaded, kept as a fallback
 * for `vite dev`, which has no D1 binding. See `withFallback`.
 *
 * Read handlers here are deliberately unauthenticated — this is the same content
 * the public pages show — and only ever return published rows. Drafts and every
 * write live in lib/admin.ts, behind `requireAdmin`.
 */

export type ProjectMetric = { icon: string; value: string; label: string };
export type ProjectExpectation = { icon: string; title: string; body: string };
export type ProjectStep = { title: string; body: string; detail: string };
export type ProjectPhoto = { id: string; src: string; alt: string };

export type Project = {
  slug: string;
  shortTitle: string;
  title: string;
  category: string;
  /** As the foundation writes it, e.g. "December 25, 2025". */
  date: string;
  /** ISO date; what the listing orders by. */
  sortDate: string;
  location: string;
  status: string;
  heroImage: string;
  secondaryImage: string;
  summary: string;
  description: string[];
  metrics: ProjectMetric[];
  expectations: ProjectExpectation[];
  steps: ProjectStep[];
  faqs: Array<[string, string]>;
  gallery: ProjectPhoto[];
  published: boolean;
};

export type NewsStory = {
  id: string;
  title: string;
  date: string;
  sortDate: string;
  body: string;
  image: string;
  link: string | null;
  published: boolean;
};

/**
 * Run a read against D1, or fall back to the seed when there is no binding.
 *
 * `getDb` already throws in production when the binding is missing, so this only
 * ever falls back under `vite dev`. A query that *fails* is not covered here on
 * purpose: stale-looking content quietly served in place of a broken database
 * would hide the fault instead of surfacing it.
 */
async function withFallback<T>(
  read: (db: D1Database) => Promise<T>,
  fallback: () => T,
): Promise<T> {
  const db = getDb();
  if (!db) return fallback();
  return read(db);
}

/** Every published outreach, newest first, each with its gallery. */
export const loadProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<Project[]> => withFallback((db) => readProjects(db), seededProjects),
);

export type ProjectPage = {
  project: Project;
  /** Slug and title of every published outreach, for the sidebar. */
  siblings: Array<{ slug: string; shortTitle: string }>;
};

/**
 * One outreach plus the sidebar listing, in a single round trip.
 *
 * Returns null for an unknown or unpublished slug so the route can answer 404
 * rather than render an empty page.
 */
export const loadProjectPage = createServerFn({ method: "GET" })
  .validator((slug: unknown): string => (typeof slug === "string" ? slug : ""))
  .handler(async ({ data: slug }): Promise<ProjectPage | null> => {
    if (!slug) return null;

    return withFallback(
      async (db) => {
        const [project, siblings] = await Promise.all([
          readProject(db, slug),
          readProjectSiblings(db),
        ]);
        return project ? { project, siblings } : null;
      },
      () => {
        const all = seededProjects();
        const project = all.find((candidate) => candidate.slug === slug);
        if (!project) return null;
        return {
          project,
          siblings: all.map(({ slug: id, shortTitle }) => ({ slug: id, shortTitle })),
        };
      },
    );
  });

/** Every published news story, newest first. */
export const loadNews = createServerFn({ method: "GET" }).handler(async (): Promise<NewsStory[]> =>
  withFallback((db) => readNews(db), seededNews),
);
