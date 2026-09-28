import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { removeProject, saveProject } from "../../lib/admin";
import type { Project } from "../../lib/content";
import { CheckboxField, ImagePreview, Repeater, TextAreaField, TextField } from "./fields";
import { UploadButton } from "./upload";

/**
 * Create and edit outreaches.
 *
 * The form mirrors the project page section by section, because the person
 * filling it in is describing an event they ran, not populating a database —
 * the labels name what each field becomes on the page.
 */

type Metric = { icon: string; value: string; label: string };
type Expectation = { icon: string; title: string; body: string };
type Step = { title: string; body: string; detail: string };
type Faq = { question: string; answer: string };
type Photo = { id: string; src: string; alt: string };

type ProjectForm = {
  slug: string;
  shortTitle: string;
  title: string;
  category: string;
  date: string;
  sortDate: string;
  location: string;
  status: string;
  heroImage: string;
  secondaryImage: string;
  summary: string;
  published: boolean;
  /** Blank-line separated; one paragraph per block, as the page renders them. */
  description: string;
  metrics: Metric[];
  expectations: Expectation[];
  steps: Step[];
  faqs: Faq[];
  gallery: Photo[];
};

const today = () => new Date().toISOString().slice(0, 10);

/** "2025-12-25" → "December 25, 2025", the form the site writes dates in. */
function longDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function blank(): ProjectForm {
  return {
    slug: "",
    shortTitle: "",
    title: "",
    category: "Community",
    date: longDate(today()),
    sortDate: today(),
    location: "",
    status: "Completed",
    heroImage: "",
    secondaryImage: "",
    summary: "",
    // New outreaches start as drafts: a half-written page should never be one
    // save away from being the live one.
    published: false,
    description: "",
    metrics: [],
    expectations: [],
    steps: [],
    faqs: [],
    gallery: [],
  };
}

function fromProject(project: Project): ProjectForm {
  return {
    ...project,
    description: project.description.join("\n\n"),
    faqs: project.faqs.map(([question, answer]) => ({ question, answer })),
    gallery: project.gallery.map((photo) => ({ ...photo })),
    metrics: project.metrics.map((metric) => ({ ...metric })),
    expectations: project.expectations.map((item) => ({ ...item })),
    steps: project.steps.map((step) => ({ ...step })),
  };
}

/** Drop rows the editor added and left empty rather than failing validation. */
function toInput(form: ProjectForm) {
  return {
    ...form,
    description: form.description
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    metrics: form.metrics.filter((metric) => metric.value.trim() && metric.label.trim()),
    expectations: form.expectations.filter((item) => item.title.trim() && item.body.trim()),
    steps: form.steps.filter((step) => step.title.trim() && step.body.trim()),
    faqs: form.faqs
      .filter((faq) => faq.question.trim() && faq.answer.trim())
      .map((faq) => [faq.question, faq.answer] as [string, string]),
    gallery: form.gallery
      .filter((photo) => photo.src.trim())
      // A row added in the editor has no id yet; the gallery is rewritten
      // wholesale on save, so one only has to be stable within this list.
      .map((photo) => ({ ...photo, id: photo.id || crypto.randomUUID() })),
  };
}

const SECTION = "rounded-lg border border-slate-200 bg-slate-50 p-4";
const SECTION_TITLE = "text-sm font-semibold text-slate-800";

export function ProjectEditor({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const existing = project !== null;
  const [form, setForm] = useState<ProjectForm>(() => (project ? fromProject(project) : blank()));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  // Photographs are filed under the outreach they belong to, so the bucket stays
  // browsable. Before the address has been typed they go to a holding folder.
  const uploadPrefix = `projects/${form.slug.trim() || "unsorted"}`;

  /**
   * The date drives two fields: the one the page shows and the one the listing
   * orders by. Rewriting the display text alongside it saves retyping, but only
   * while it still matches — once it has been worded by hand it is left alone.
   */
  const setDate = (iso: string) =>
    setForm((current) => ({
      ...current,
      sortDate: iso,
      date:
        current.date === longDate(current.sortDate) || !current.date.trim()
          ? longDate(iso)
          : current.date,
    }));

  async function save() {
    setBusy(true);
    setError(null);
    const result = await saveProject({ data: toInput(form) });
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Re-run the route loader so the list reflects what was just written,
    // rather than the client's idea of it.
    await router.invalidate();
    onClose();
  }

  async function destroy() {
    if (!existing) return onClose();
    setBusy(true);
    setError(null);
    const result = await removeProject({ data: form.slug });
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    await router.invalidate();
    onClose();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          {existing ? form.shortTitle || form.slug : "New outreach"}
        </h2>
        <span
          className={`rounded px-2 py-1 text-xs font-semibold ${
            form.published ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700"
          }`}
        >
          {form.published ? "Published" : "Draft"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-sm font-semibold text-slate-500"
        >
          Back to list
        </button>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <section className={SECTION}>
        <h3 className={SECTION_TITLE}>The basics</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <TextField
            label="Web address"
            value={form.slug}
            onChange={(value) => set("slug", value)}
            disabled={existing}
            placeholder="krofrom-christmas-outreach"
            hint={
              existing
                ? "Fixed once created — changing it would break every link to this page."
                : "Lowercase words joined by hyphens. The page will live at /projects/<this>."
            }
          />
          <TextField
            label="Short title"
            value={form.shortTitle}
            onChange={(value) => set("shortTitle", value)}
            hint="Used on cards and in the sidebar."
          />
          <TextField
            label="Full title"
            value={form.title}
            onChange={(value) => set("title", value)}
            hint="The heading at the top of the project page."
          />
          <TextField
            label="Category"
            value={form.category}
            onChange={(value) => set("category", value)}
            hint="Education, Community, Children & Welfare…"
          />
          <TextField
            label="Date"
            type="date"
            value={form.sortDate}
            onChange={setDate}
            hint="Orders the outreach in the listing — newest first."
          />
          <TextField
            label="Date as written"
            value={form.date}
            onChange={(value) => set("date", value)}
            hint="Shown on the page. Filled in from the date above; reword it freely."
          />
          <TextField
            label="Location"
            value={form.location}
            onChange={(value) => set("location", value)}
            placeholder="Krofrom, Kumasi"
          />
          <TextField
            label="Status"
            value={form.status}
            onChange={(value) => set("status", value)}
            placeholder="Completed"
          />
        </div>

        <div className="mt-4">
          <TextAreaField
            label="Summary"
            value={form.summary}
            onChange={(value) => set("summary", value)}
            rows={3}
            hint="One or two sentences. Used on the card, the page intro, and when the link is shared."
          />
        </div>
      </section>

      <section className={SECTION}>
        <h3 className={SECTION_TITLE}>Photographs</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <TextField
              label="Main photograph"
              value={form.heroImage}
              onChange={(value) => set("heroImage", value)}
              hint="Leads the project page and the card in the listing."
            />
            <ImagePreview src={form.heroImage} />
            <UploadButton
              prefix={uploadPrefix}
              label="Upload a photograph"
              onUploaded={(key) => set("heroImage", key)}
            />
          </div>
          <div>
            <TextField
              label="Supporting photograph"
              value={form.secondaryImage}
              onChange={(value) => set("secondaryImage", value)}
              hint="Used beside the summary further down the page."
            />
            <ImagePreview src={form.secondaryImage} />
            <UploadButton
              prefix={uploadPrefix}
              label="Upload a photograph"
              onUploaded={(key) => set("secondaryImage", key)}
            />
          </div>
        </div>

        <div className="mt-4">
          <Repeater<Photo>
            label="Gallery"
            hint="Shown as a grid on the project page. Describe each photograph for anyone using a screen reader; leave the description empty only if the image adds nothing to the story."
            value={form.gallery}
            onChange={(value) => set("gallery", value)}
            columns={[
              { key: "src", label: "Image", placeholder: "projects/…/01.jpg" },
              { key: "alt", label: "Description", textarea: true },
            ]}
            empty={{ id: "", src: "", alt: "" }}
            addLabel="Add a photograph"
            renderExtra={(row) => <ImagePreview src={row.src} />}
          />
          <UploadButton
            prefix={uploadPrefix}
            label="Upload photographs to the gallery"
            multiple
            onUploaded={(key) =>
              setForm((current) => ({
                ...current,
                gallery: [...current.gallery, { id: "", src: key, alt: "" }],
              }))
            }
          />
          <p className="mt-2 text-xs text-slate-500">
            JPEG or PNG, up to 20 MB. Location data is removed from every photograph before it is
            stored. iPhone photos saved as HEIC have to be exported as JPEG first.
          </p>
        </div>
      </section>

      <section className={SECTION}>
        <h3 className={SECTION_TITLE}>The story</h3>
        <div className="mt-3">
          <TextAreaField
            label="Description"
            value={form.description}
            onChange={(value) => set("description", value)}
            rows={8}
            hint="Leave a blank line between paragraphs."
          />
        </div>

        <div className="mt-4 space-y-4">
          <Repeater<Metric>
            label="Figures"
            hint="Only numbers the foundation actually recorded. An invented figure on a charity's page is worse than none."
            value={form.metrics}
            onChange={(value) => set("metrics", value)}
            columns={[
              { key: "icon", label: "Icon", placeholder: "restaurant", width: "w-40" },
              { key: "value", label: "Figure", placeholder: "100+", width: "w-32" },
              { key: "label", label: "What it counts" },
            ]}
            empty={{ icon: "volunteer_activism", value: "", label: "" }}
            addLabel="Add a figure"
          />

          <Repeater<Expectation>
            label="What guided the outreach"
            value={form.expectations}
            onChange={(value) => set("expectations", value)}
            columns={[
              { key: "icon", label: "Icon", placeholder: "diversity_3", width: "w-40" },
              { key: "title", label: "Heading" },
              { key: "body", label: "Detail", textarea: true },
            ]}
            empty={{ icon: "volunteer_activism", title: "", body: "" }}
            addLabel="Add a point"
          />

          <Repeater<Step>
            label="How it happened"
            hint="The steps listed down the project page, in order."
            value={form.steps}
            onChange={(value) => set("steps", value)}
            columns={[
              { key: "title", label: "Step" },
              { key: "body", label: "What happened", textarea: true },
              { key: "detail", label: "Why it mattered", textarea: true },
            ]}
            empty={{ title: "", body: "", detail: "" }}
            addLabel="Add a step"
          />

          <Repeater<Faq>
            label="Questions and answers"
            value={form.faqs}
            onChange={(value) => set("faqs", value)}
            columns={[
              { key: "question", label: "Question" },
              { key: "answer", label: "Answer", textarea: true },
            ]}
            empty={{ question: "", answer: "" }}
            addLabel="Add a question"
          />
        </div>
      </section>

      <CheckboxField
        label="Publish this outreach"
        hint="Published outreaches appear on /projects and in the sitemap straight away. Unpublished ones are visible only here."
        checked={form.published}
        onChange={(value) => set("published", value)}
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-600">
          Cancel
        </button>
        {existing ? (
          <ConfirmDelete label="Delete this outreach" onConfirm={destroy} disabled={busy} />
        ) : null}
      </div>
    </div>
  );
}

/**
 * Deletion behind a second click rather than a browser `confirm()`, which blocks
 * the page and reads as a system error rather than a decision.
 */
export function ConfirmDelete({
  label,
  onConfirm,
  disabled,
}: {
  label: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        disabled={disabled}
        className="ml-auto text-sm font-semibold text-red-700 disabled:opacity-50"
      >
        {label}
      </button>
    );
  }

  return (
    <span className="ml-auto flex items-center gap-3 text-sm">
      <span className="text-slate-600">This cannot be undone.</span>
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className="rounded bg-red-700 px-3 py-1.5 font-semibold text-white disabled:opacity-50"
      >
        Delete
      </button>
      <button type="button" onClick={() => setArmed(false)} className="text-slate-600">
        Keep it
      </button>
    </span>
  );
}
