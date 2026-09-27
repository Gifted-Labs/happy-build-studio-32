    -- Every form submission on the site lands in this one table, discriminated by
-- `kind`. Writing here is the first thing a handler does, so a submission is
-- never lost to a failed or rate-limited email send.

CREATE TABLE IF NOT EXISTS submissions (
  id            TEXT PRIMARY KEY,
  kind          TEXT NOT NULL CHECK (
                  kind IN ('contact', 'donation-enquiry', 'newsletter', 'volunteer')
                ),
  name          TEXT,
  email         TEXT NOT NULL,
  subject       TEXT,
  message       TEXT,
  -- Whole Ghana cedis; NULL for non-donation kinds.
  amount        INTEGER,
  interest      TEXT,
  -- Set by Cloudflare, useful for spotting abuse patterns.
  country       TEXT,
  user_agent    TEXT,
  -- 'pending' | 'sent' | 'failed' | 'skipped' — email is best-effort on top of
  -- this row, so its outcome is recorded rather than allowed to fail the request.
  email_status  TEXT NOT NULL DEFAULT 'pending',
  email_error   TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- The admin view lists newest-first, optionally filtered by kind. Without these
-- indexes that becomes a full table scan, which burns D1's free-tier row-read
-- allowance far faster than necessary.
CREATE INDEX IF NOT EXISTS idx_submissions_created
  ON submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_kind_created
  ON submissions (kind, created_at DESC);

-- Supports "have we already seen this address?" without scanning.
CREATE INDEX IF NOT EXISTS idx_submissions_email
  ON submissions (email);
