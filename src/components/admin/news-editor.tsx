import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { removeNews, saveNews } from "../../lib/admin";
import type { NewsStory } from "../../lib/content";
import { CheckboxField, ImagePreview, TextAreaField, TextField } from "./fields";
import { UploadButton } from "./upload";
import { EditorFrame, EditorSection } from "./editor-chrome";

/**
 * Create and edit news stories — the cards on /news.
 *
 * Far smaller than the project editor because a story is a photograph, a date, a
 * headline and a paragraph. Anything longer belongs on a project page.
 */

type NewsForm = {
  id: string;
  title: string;
  date: string;
  sortDate: string;
  body: string;
  image: string;
  link: string;
  published: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);

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

function blank(): NewsForm {
  return {
    id: "",
    title: "",
    date: longDate(today()),
    sortDate: today(),
    body: "",
    image: "",
    link: "",
    published: false,
  };
}

export function NewsEditor({ story, onClose }: { story: NewsStory | null; onClose: () => void }) {
  const router = useRouter();
  const existing = story !== null;
  const [form, setForm] = useState<NewsForm>(() =>
    story ? { ...story, link: story.link ?? "" } : blank(),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof NewsForm>(key: K, value: NewsForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

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
    const result = await saveNews({ data: { ...form, link: form.link.trim() || null } });
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    await router.invalidate();
    onClose();
  }

  async function destroy() {
    if (!existing) return onClose();
    setBusy(true);
    setError(null);
    const result = await removeNews({ data: form.id });
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    await router.invalidate();
    onClose();
  }

  return (
    <EditorFrame
      title={existing ? form.title || form.id : "New story"}
      published={form.published}
      existing={existing}
      busy={busy}
      error={error}
      onClose={onClose}
      onSave={save}
      onDelete={destroy}
      deleteLabel="Delete this story"
    >
      <EditorSection
        title="The story"
        description="A headline, a date, a photograph and a paragraph — as the card on /news shows it."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Reference"
            value={form.id}
            onChange={(value) => set("id", value)}
            disabled={existing}
            placeholder="community-hub"
            hint={
              existing
                ? "Fixed once created — it is the anchor this story is linked to."
                : "Lowercase words joined by hyphens. Identifies the story on the page."
            }
          />
          <TextField
            label="Headline"
            value={form.title}
            onChange={(value) => set("title", value)}
          />
          <TextField
            label="Date"
            type="date"
            value={form.sortDate}
            onChange={setDate}
            hint="Orders the stories — newest first."
          />
          <TextField
            label="Date as written"
            value={form.date}
            onChange={(value) => set("date", value)}
            hint="Shown on the card."
          />
          <div className="md:col-span-2">
            <TextAreaField
              label="Story"
              value={form.body}
              onChange={(value) => set("body", value)}
              rows={3}
              hint="Two lines are shown on the card; keep it to the point."
            />
          </div>
          <div>
            <TextField
              label="Photograph"
              value={form.image}
              onChange={(value) => set("image", value)}
            />
            <ImagePreview src={form.image} />
            <UploadButton
              prefix="news"
              label="Upload a photograph"
              onUploaded={(key) => set("image", key)}
            />
          </div>
          <TextField
            label="Link"
            type="url"
            value={form.link}
            onChange={(value) => set("link", value)}
            hint="Optional. Where “Read story” goes — a project page, say. Left empty, the card stands on its own."
          />
        </div>
      </EditorSection>

      <CheckboxField
        label="Publish this story"
        hint="Published stories appear on /news straight away."
        checked={form.published}
        onChange={(value) => set("published", value)}
      />
    </EditorFrame>
  );
}
