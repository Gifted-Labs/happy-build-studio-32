# Life Story Foundation

Marketing site for the Life Story Foundation. TanStack Start + React, prerendered to
static HTML and deployed as a Cloudflare Worker. The only server-side logic is the
handler behind the site's four forms.

## Local development

```bash
npm install
npm run dev
```

Forms work out of the box. Turnstile falls back to Cloudflare's documented test
keys, and with no D1 binding present submissions are logged instead of stored —
`vite dev` has no bindings, so this is expected and keeps the UI exercisable.

To run the real thing — actual Worker runtime, actual D1 — build and serve it:

```bash
cp .dev.vars.example .dev.vars   # already carries the Turnstile test secret
npm run db:migrate               # create the schema in local D1
npm run preview:worker           # builds, then `wrangler dev`
```

Leaving `RESEND_API_KEY` blank is fine: submissions are still stored, and the row
records `email_status='failed'`.

## Deploying

> [!IMPORTANT]
> Set `VITE_TURNSTILE_SITE_KEY` in `.env` before building for production (see
> `.env.example`). It is baked in at build time, and without it the build silently
> ships Cloudflare's always-passes **test** site key — which either blocks every
> genuine submission or leaves the forms with no bot protection at all.

### First deploy only

```bash
cp .env.example .env             # then fill in VITE_TURNSTILE_SITE_KEY
npx wrangler login

# 1. Create the database, then paste the id it prints into wrangler.jsonc
#    under d1_databases[0].database_id
npx wrangler d1 create lifestory-submissions

# 2. Create the table
npm run db:migrate:remote

# 3. Set the two secrets (each prompts for the value)
npx wrangler secret put TURNSTILE_SECRET_KEY   # from the Turnstile dashboard
npx wrangler secret put RESEND_API_KEY         # from the Resend dashboard
```

The Turnstile **site** key and **secret** key are a pair from the same dashboard
widget — a mismatched pair fails every verification. The site key is already in
`.env`; only the secret needs setting.

### Turnstile hostname allowlist

`TURNSTILE_HOSTNAMES` in `wrangler.jsonc` lists the hostnames a solved challenge
may come from. It matters because one widget is registered for several domains, so
`success: true` alone only proves the token came from *a* page using our site key —
not from ours. The handler additionally requires the token's `action` to equal the
submission's `kind`, so a token minted at the newsletter box cannot be spent
against the contact form.

Two things to know:

- The production list deliberately excludes `localhost` and `127.0.0.1`. Local runs
  get their own list from `.dev.vars`, which also allows `example.com` — the
  hostname Cloudflare's test keys report regardless of where the widget was solved.
- The `workers.dev` hostname is **not** in the list yet. Until you add it, the forms
  will reject submissions made from that URL even though the keys are correct. Add
  it to both `TURNSTILE_HOSTNAMES` and the widget's own domain list.

Because test secrets cannot mint an `action`, the action check is skipped when a
published Cloudflare test secret is in use, and logs a warning saying so. A real
secret never matches that list, so production is always strict.

`RESEND_FROM` and `NOTIFY_EMAIL` are not secrets and already live in
`wrangler.jsonc` under `vars`. `RESEND_FROM` must be a sender Resend has verified
for the domain, or every send is rejected.

### Every deploy

```bash
npm run deploy
```

Run `npm run db:migrate:remote` as well whenever `migrations/` has gained a file.

## Project photographs

The project photos live in the public R2 bucket `lifestory-media`, served from the
host in `VITE_MEDIA_HOST`. `src/lib/media.ts` maps each slot to an object key
(`projects/<slug>/hero.jpg`, `secondary.jpg`, `01`–`05.jpg`).

To add or replace one:

```bash
npx wrangler r2 object put "lifestory-media/projects/<slug>/01.jpg" \
  --file path/to/photo.jpg --content-type image/jpeg --remote
```

The `--remote` flag is not optional. Without it wrangler writes to the **local**
simulator in `.wrangler/state` and reports success, while the public URL keeps
returning 404.

Strip metadata before uploading — phone photos carry GPS coordinates, and these
were taken at schools and a children's home:

```bash
magick input.jpg -auto-orient -strip -resize '2400x2400>' -quality 86 output.jpg
```

> [!IMPORTANT]
> `VITE_IMAGE_TRANSFORM` is set to `false`, and must stay that way until
> `lifestorycharitablefoundation.com` is attached. `cfImage()` builds a **relative** `/cdn-cgi/image/`
> URL, which is served by the Cloudflare zone hosting the site — it does not exist
> on `*.workers.dev`. Turning transforms on before the domain is attached makes
> every image 404. Once the zone is live, enable Image Transformations on it and
> set this to `true` to get the responsive `srcset` ladder.

## How the build works

`npm run build` runs vite **twice** (`scripts/build.mjs`), because one pass cannot
produce both outputs: nitro's cloudflare preset takes over vite's server output and
emits `index.mjs`, while the prerenderer needs to boot `dist/server/server.js`.

1. **Prerender pass** (nitro off) renders every route to static HTML.
2. **Worker pass** (nitro on) builds the deployable Worker, and the first pass's
   finished static site is copied over its asset directory.

Consequences worth knowing before changing the build:

- `wrangler.jsonc` in the repo root is **not** what gets deployed. Nitro merges it
  with its own values into `dist/server/wrangler.json`, which is what ships. Nitro
  always overrides `main` and `assets.directory`, so those are not set in the root
  file. Everything else — bindings, `vars`, `name` — passes through, and this is
  the only way the Worker gets its D1 binding.
- One build warning is expected and harmless: `Wrangler config assets is
  overridden and will be ignored`. The keys are deep-merged, so the
  `html_handling` set in the root file does survive alongside nitro's values.
- `cloudflare:workers` is handled differently per pass — aliased to a stub in pass
  1 (whose output Node actually executes) and externalized in pass 2 (whose output
  only runs on Workers). See the comment in `vite.config.ts`.
- Pages are served as Workers static assets rather than server-rendered, which
  keeps them free, unmetered, and clear of the Free plan's 10 ms CPU limit.

## Form submissions

One server function (`src/lib/submit-form.ts`) handles all four forms, in this
order deliberately:

1. **Verify Turnstile** — reject bots before spending any quota on them.
2. **Write to D1** — the submission is durable from this point on.
3. **Send email** — best-effort. A failure is recorded against the row and the
   visitor still sees success, because their message is already stored.

That third point is the design's load-bearing one: Resend's free tier allows 100
emails a day and two are sent per submission, so email is the component most
likely to be unavailable. Treating it as non-critical means a rate-limited send
never costs the foundation an enquiry. Rows where `email_status = 'failed'` are
the ones needing a human follow-up:

```bash
npx wrangler d1 execute lifestory-submissions --remote \
  --command "SELECT id, kind, email, created_at, email_error FROM submissions WHERE email_status = 'failed' ORDER BY created_at DESC"
```

Server-only code lives in `src/lib/server/`, which the framework refuses to bundle
into the client. The server function itself sits outside that directory on
purpose — it is an RPC boundary the client is *meant* to import.
