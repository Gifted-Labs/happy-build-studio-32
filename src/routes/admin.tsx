import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Inbox } from "../components/admin/inbox";
import { NewsEditor } from "../components/admin/news-editor";
import { ProjectEditor } from "../components/admin/project-editor";
import { loadAdmin } from "../lib/admin";
import type { NewsStory, Project } from "../lib/content";

/**
 * The foundation's admin area: the submission inbox, and the editor for the
 * content the site reads from D1 — outreaches, their photographs, and news.
 *
 * Deliberately not in the site's page shell: this is an internal tool, it should
 * not look like the public site, and it must never appear in the navigation. It
 * is absent from the prerender list (see src/lib/site-pages.ts), so it is only
 * ever rendered per request, behind Cloudflare Access.
 */
export const Route = createFileRoute("/admin")({
  loader: () => loadAdmin(),
  head: () => ({
    meta: [
      { title: "Admin — Life Story Foundation" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "inbox" | "projects" | "news";

function TabButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold ${
        active ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
      }`}
    >
      {children}
      <span className="ml-2 text-xs opacity-70">{count}</span>
    </button>
  );
}

/** One row in the projects or news list. */
function ContentRow({
  title,
  meta,
  published,
  onEdit,
}: {
  title: string;
  meta: string;
  published: boolean;
  onEdit: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-slate-900">{title}</span>
          <span className="mt-1 block text-sm text-slate-500">{meta}</span>
        </span>
        <span
          className={`shrink-0 rounded px-2 py-1 text-xs font-semibold ${
            published ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700"
          }`}
        >
          {published ? "Published" : "Draft"}
        </span>
        <span className="shrink-0 text-sm font-semibold text-slate-500">Edit</span>
      </button>
    </li>
  );
}

function AdminPage() {
  const result = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("inbox");
  /** The record being edited, or "new" for a blank one; null while listing. */
  const [editingProject, setEditingProject] = useState<Project | "new" | null>(null);
  const [editingStory, setEditingStory] = useState<NewsStory | "new" | null>(null);

  if (!result.ok) {
    return (
      <main className="mx-auto max-w-2xl p-10 font-sans">
        <h1 className="text-xl font-semibold text-slate-900">Life Story admin</h1>
        <p className="mt-3 rounded-lg bg-red-50 p-4 text-sm text-red-800">{result.error}</p>
        <p className="mt-3 text-sm text-slate-500">
          This page is restricted to administrators signed in through Cloudflare Access.
        </p>
      </main>
    );
  }

  const { email, submissions, counts, projects, news } = result.data;

  return (
    <main className="mx-auto max-w-5xl p-6 font-sans md:p-10">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Life Story admin</h1>
        <p className="text-sm text-slate-500">Signed in as {email}</p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        <TabButton active={tab === "inbox"} onClick={() => setTab("inbox")} count={counts.total}>
          Submissions
        </TabButton>
        <TabButton
          active={tab === "projects"}
          onClick={() => setTab("projects")}
          count={projects.length}
        >
          Outreaches
        </TabButton>
        <TabButton active={tab === "news"} onClick={() => setTab("news")} count={news.length}>
          News
        </TabButton>
      </div>

      <div className="mt-8">
        {tab === "inbox" ? <Inbox rows={submissions} counts={counts} /> : null}

        {tab === "projects" ? (
          editingProject ? (
            <ProjectEditor
              project={editingProject === "new" ? null : editingProject}
              onClose={() => setEditingProject(null)}
            />
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  Changes go live as soon as they are saved and published.
                </p>
                <button
                  type="button"
                  onClick={() => setEditingProject("new")}
                  className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  New outreach
                </button>
              </div>
              {projects.length === 0 ? (
                <p className="mt-10 rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No outreaches yet.
                </p>
              ) : (
                <ul className="mt-6 space-y-3">
                  {projects.map((project) => (
                    <ContentRow
                      key={project.slug}
                      title={project.shortTitle}
                      meta={`${project.date} · ${project.location} · ${project.gallery.length} photo${
                        project.gallery.length === 1 ? "" : "s"
                      }`}
                      published={project.published}
                      onEdit={() => setEditingProject(project)}
                    />
                  ))}
                </ul>
              )}
            </div>
          )
        ) : null}

        {tab === "news" ? (
          editingStory ? (
            <NewsEditor
              story={editingStory === "new" ? null : editingStory}
              onClose={() => setEditingStory(null)}
            />
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  Short updates for the news page. Longer accounts belong on a project page.
                </p>
                <button
                  type="button"
                  onClick={() => setEditingStory("new")}
                  className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  New story
                </button>
              </div>
              {news.length === 0 ? (
                <p className="mt-10 rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No stories yet.
                </p>
              ) : (
                <ul className="mt-6 space-y-3">
                  {news.map((story) => (
                    <ContentRow
                      key={story.id}
                      title={story.title}
                      meta={story.date}
                      published={story.published}
                      onEdit={() => setEditingStory(story)}
                    />
                  ))}
                </ul>
              )}
            </div>
          )
        ) : null}
      </div>
    </main>
  );
}
