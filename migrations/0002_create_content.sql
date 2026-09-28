-- Content the foundation edits for itself: outreaches, their photographs, and
-- news stories. Everything else on the site (mission, about, FAQ copy) stays in
-- code, where it changes about once a year and a deploy is the cheaper answer.
--
-- These tables are read on every request to /projects, /projects/:slug and
-- /news, so each one carries the index its read path actually uses.

CREATE TABLE IF NOT EXISTS projects (
  slug             TEXT PRIMARY KEY,
  short_title      TEXT NOT NULL,
  title            TEXT NOT NULL,
  category         TEXT NOT NULL,
  -- `date` is shown as written ("December 25, 2025"); `sort_date` is the ISO
  -- form the listing orders by. Keeping both means the display string stays the
  -- foundation's own wording without the order depending on parsing it.
  date             TEXT NOT NULL,
  sort_date        TEXT NOT NULL,
  location         TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'Completed',
  -- Image references, resolved by resolveImage() in src/lib/media.ts: a key in
  -- the media manifest, an R2 object key, or an absolute URL.
  hero_image       TEXT NOT NULL,
  secondary_image  TEXT NOT NULL,
  summary          TEXT NOT NULL,
  -- JSON arrays. Nested, order-sensitive, and only ever read as a whole with
  -- the project, so a column each would buy nothing but joins.
  description      TEXT NOT NULL DEFAULT '[]',  -- string[]
  metrics          TEXT NOT NULL DEFAULT '[]',  -- {icon,value,label}[]
  expectations     TEXT NOT NULL DEFAULT '[]',  -- {icon,title,body}[]
  steps            TEXT NOT NULL DEFAULT '[]',  -- {title,body,detail}[]
  faqs             TEXT NOT NULL DEFAULT '[]',  -- [question, answer][]
  -- 0 keeps a draft out of the public site while still listing it in /admin.
  published        INTEGER NOT NULL DEFAULT 1,
  created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- The listing is "published outreaches, newest first" — the whole page in one
-- index-ordered scan.
CREATE INDEX IF NOT EXISTS idx_projects_published_date
  ON projects (published, sort_date DESC);

-- A project's gallery. Separate from `projects` because this is the table the
-- admin area appends to on every upload, and photographs outnumber projects by
-- an order of magnitude.
CREATE TABLE IF NOT EXISTS project_photos (
  id            TEXT PRIMARY KEY,
  project_slug  TEXT NOT NULL REFERENCES projects (slug) ON DELETE CASCADE,
  src           TEXT NOT NULL,
  -- Empty means decorative. It is a deliberate choice in the editor, not an
  -- omission, so the column is NOT NULL with an empty default.
  alt           TEXT NOT NULL DEFAULT '',
  position      INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_project_photos_project
  ON project_photos (project_slug, position);

CREATE TABLE IF NOT EXISTS news (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  date        TEXT NOT NULL,
  sort_date   TEXT NOT NULL,
  body        TEXT NOT NULL,
  image       TEXT NOT NULL,
  -- Optional link for "Read story"; without one the card stays self-contained.
  link        TEXT,
  published   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_news_published_date
  ON news (published, sort_date DESC);
