/**
 * Every D1 query behind the site's editable content.
 *
 * Kept apart from lib/content.ts (the public read path) and lib/admin.ts (the
 * authenticated write path) so both use the same SQL and the same row mapping —
 * a column added here cannot show up in one and not the other. Nothing in this
 * file checks permissions: it is server-only, and its callers are responsible
 * for deciding who may call them.
 */
import type {
  NewsStory,
  Project,
  ProjectExpectation,
  ProjectMetric,
  ProjectPhoto,
  ProjectStep,
} from "../content";
import { newsStories as seedNews } from "../../data/news";
import { projects as seedProjects } from "../../data/projects";

/** A project as stored; the JSON columns are still strings here. */
type ProjectRow = {
  slug: string;
  short_title: string;
  title: string;
  category: string;
  date: string;
  sort_date: string;
  location: string;
  status: string;
  hero_image: string;
  secondary_image: string;
  summary: string;
  description: string;
  metrics: string;
  expectations: string;
  steps: string;
  faqs: string;
  published: number;
};

type PhotoRow = { id: string; project_slug: string; src: string; alt: string };

type NewsRow = {
  id: string;
  title: string;
  date: string;
  sort_date: string;
  body: string;
  image: string;
  link: string | null;
  published: number;
};

const PROJECT_COLUMNS = `slug, short_title, title, category, date, sort_date, location, status,
         hero_image, secondary_image, summary, description, metrics, expectations, steps, faqs,
         published`;

const NEWS_COLUMNS = `id, title, date, sort_date, body, image, link, published`;

/**
 * A column that will not parse is bad data in one project, not a reason to fail
 * the request — the page renders without that section instead of 500ing.
 */
function safeJson<T>(value: string | null, fallback: T, context: string): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as T;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    console.warn(`[content] Could not parse ${context}; falling back.`);
    return fallback;
  }
}

function toProject(row: ProjectRow, gallery: ProjectPhoto[]): Project {
  return {
    slug: row.slug,
    shortTitle: row.short_title,
    title: row.title,
    category: row.category,
    date: row.date,
    sortDate: row.sort_date,
    location: row.location,
    status: row.status,
    heroImage: row.hero_image,
    secondaryImage: row.secondary_image,
    summary: row.summary,
    description: safeJson<string[]>(row.description, [], `${row.slug}.description`),
    metrics: safeJson<ProjectMetric[]>(row.metrics, [], `${row.slug}.metrics`),
    expectations: safeJson<ProjectExpectation[]>(row.expectations, [], `${row.slug}.expectations`),
    steps: safeJson<ProjectStep[]>(row.steps, [], `${row.slug}.steps`),
    faqs: safeJson<Array<[string, string]>>(row.faqs, [], `${row.slug}.faqs`),
    gallery,
    published: row.published === 1,
  };
}

function toNews(row: NewsRow): NewsStory {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    sortDate: row.sort_date,
    body: row.body,
    image: row.image,
    link: row.link,
    published: row.published === 1,
  };
}

/* ------------------------------------------------------------------ reads */

/** Galleries for the given projects, one query rather than one per project. */
export async function galleriesFor(
  db: D1Database,
  slugs: string[],
): Promise<Map<string, ProjectPhoto[]>> {
  const byProject = new Map<string, ProjectPhoto[]>();
  if (slugs.length === 0) return byProject;

  const placeholders = slugs.map(() => "?").join(", ");
  const { results } = await db
    .prepare(
      `SELECT id, project_slug, src, alt
         FROM project_photos
        WHERE project_slug IN (${placeholders})
        ORDER BY position, created_at`,
    )
    .bind(...slugs)
    .all<PhotoRow>();

  for (const row of results ?? []) {
    const list = byProject.get(row.project_slug) ?? [];
    list.push({ id: row.id, src: row.src, alt: row.alt });
    byProject.set(row.project_slug, list);
  }
  return byProject;
}

async function withGalleries(db: D1Database, rows: ProjectRow[]): Promise<Project[]> {
  const galleries = await galleriesFor(
    db,
    rows.map((row) => row.slug),
  );
  return rows.map((row) => toProject(row, galleries.get(row.slug) ?? []));
}

/**
 * Outreaches, newest first, each with its gallery.
 *
 * `drafts` is what separates the public listing from the admin one: unpublished
 * projects must be invisible on the site and visible in /admin, and getting that
 * backwards is exactly the mistake a single flag here prevents.
 */
export async function readProjects(db: D1Database, { drafts = false } = {}): Promise<Project[]> {
  const { results } = await db
    .prepare(
      `SELECT ${PROJECT_COLUMNS} FROM projects
        ${drafts ? "" : "WHERE published = 1"}
        ORDER BY sort_date DESC, slug`,
    )
    .all<ProjectRow>();

  return withGalleries(db, results ?? []);
}

export async function readProject(
  db: D1Database,
  slug: string,
  { drafts = false } = {},
): Promise<Project | null> {
  const row = await db
    .prepare(
      `SELECT ${PROJECT_COLUMNS} FROM projects
        WHERE slug = ? ${drafts ? "" : "AND published = 1"}`,
    )
    .bind(slug)
    .first<ProjectRow>();
  if (!row) return null;

  const galleries = await galleriesFor(db, [slug]);
  return toProject(row, galleries.get(slug) ?? []);
}

/** Slug and title of every published outreach, for the project page's sidebar. */
export async function readProjectSiblings(
  db: D1Database,
): Promise<Array<{ slug: string; shortTitle: string }>> {
  const { results } = await db
    .prepare(
      `SELECT slug, short_title FROM projects WHERE published = 1 ORDER BY sort_date DESC, slug`,
    )
    .all<{ slug: string; short_title: string }>();

  return (results ?? []).map((row) => ({ slug: row.slug, shortTitle: row.short_title }));
}

export async function readNews(db: D1Database, { drafts = false } = {}): Promise<NewsStory[]> {
  const { results } = await db
    .prepare(
      `SELECT ${NEWS_COLUMNS} FROM news
        ${drafts ? "" : "WHERE published = 1"}
        ORDER BY sort_date DESC, id`,
    )
    .all<NewsRow>();

  return (results ?? []).map(toNews);
}

/* ----------------------------------------------------------------- writes */

/** Everything a project row needs; the gallery is written separately. */
export type ProjectInput = Omit<Project, "gallery">;
export type NewsInput = NewsStory;

const now = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");

/**
 * Create or replace a project.
 *
 * An upsert rather than separate create/update paths: the editor sends the whole
 * record either way, and a save that silently did nothing because the row had
 * been created by someone else in the meantime would be worse than overwriting.
 */
export async function upsertProject(db: D1Database, input: ProjectInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO projects (
         slug, short_title, title, category, date, sort_date, location, status,
         hero_image, secondary_image, summary, description, metrics, expectations,
         steps, faqs, published, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (slug) DO UPDATE SET
         short_title = excluded.short_title,
         title = excluded.title,
         category = excluded.category,
         date = excluded.date,
         sort_date = excluded.sort_date,
         location = excluded.location,
         status = excluded.status,
         hero_image = excluded.hero_image,
         secondary_image = excluded.secondary_image,
         summary = excluded.summary,
         description = excluded.description,
         metrics = excluded.metrics,
         expectations = excluded.expectations,
         steps = excluded.steps,
         faqs = excluded.faqs,
         published = excluded.published,
         updated_at = excluded.updated_at`,
    )
    .bind(
      input.slug,
      input.shortTitle,
      input.title,
      input.category,
      input.date,
      input.sortDate,
      input.location,
      input.status,
      input.heroImage,
      input.secondaryImage,
      input.summary,
      JSON.stringify(input.description),
      JSON.stringify(input.metrics),
      JSON.stringify(input.expectations),
      JSON.stringify(input.steps),
      JSON.stringify(input.faqs),
      input.published ? 1 : 0,
      now(),
    )
    .run();
}

/**
 * Replace a project's gallery wholesale.
 *
 * The editor always sends the full, ordered list, so diffing it against what is
 * stored would add a way for the two to disagree and buy nothing. Photos are
 * deleted and reinserted in one batch, which D1 runs as a transaction — a failed
 * save leaves the old gallery intact rather than an empty one.
 */
export async function replaceGallery(
  db: D1Database,
  slug: string,
  photos: Array<{ id: string; src: string; alt: string }>,
): Promise<void> {
  const statements = [db.prepare(`DELETE FROM project_photos WHERE project_slug = ?`).bind(slug)];

  photos.forEach((photo, index) => {
    statements.push(
      db
        .prepare(
          `INSERT INTO project_photos (id, project_slug, src, alt, position)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(photo.id, slug, photo.src, photo.alt, index),
    );
  });

  await db.batch(statements);
}

export async function deleteProject(db: D1Database, slug: string): Promise<void> {
  // Photos go explicitly rather than by cascade: D1 leaves foreign keys off
  // unless asked, so relying on ON DELETE CASCADE would orphan every row.
  await db.batch([
    db.prepare(`DELETE FROM project_photos WHERE project_slug = ?`).bind(slug),
    db.prepare(`DELETE FROM projects WHERE slug = ?`).bind(slug),
  ]);
}

export async function upsertNews(db: D1Database, input: NewsInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO news (id, title, date, sort_date, body, image, link, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET
         title = excluded.title,
         date = excluded.date,
         sort_date = excluded.sort_date,
         body = excluded.body,
         image = excluded.image,
         link = excluded.link,
         published = excluded.published,
         updated_at = excluded.updated_at`,
    )
    .bind(
      input.id,
      input.title,
      input.date,
      input.sortDate,
      input.body,
      input.image,
      input.link,
      input.published ? 1 : 0,
      now(),
    )
    .run();
}

export async function deleteNews(db: D1Database, id: string): Promise<void> {
  await db.prepare(`DELETE FROM news WHERE id = ?`).bind(id).run();
}

/* --------------------------------------------------------------- fallback */

const isoDate = (value: string): string => {
  const parsed = new Date(`${value} UTC`);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString().slice(0, 10)
    : parsed.toISOString().slice(0, 10);
};

/** The seed arrays in the shape the rest of the app consumes. */
export function seededProjects(): Project[] {
  return seedProjects.map((project) => ({
    ...project,
    sortDate: isoDate(project.date),
    gallery: project.gallery.map((photo, index) => ({
      id: `${project.slug}-${index + 1}`,
      src: photo.src,
      alt: photo.alt,
    })),
    published: true,
  }));
}

export function seededNews(): NewsStory[] {
  return seedNews.map((story) => ({
    ...story,
    sortDate: isoDate(story.date),
    link: null,
    published: true,
  }));
}
