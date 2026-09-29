import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  HeartHandshake,
  Inbox as InboxIcon,
  LayoutDashboard,
  Newspaper,
  Plus,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

import { Inbox } from "../components/admin/inbox";
import { NewsEditor } from "../components/admin/news-editor";
import { ProjectEditor } from "../components/admin/project-editor";
import {
  AdminShell,
  EmptyState,
  StatCard,
  StatusPill,
  type NavItem,
} from "../components/admin/shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { formatWhen, kindLabel } from "../lib/submissions";
import { loadAdmin, type SubmissionRow } from "../lib/admin";
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

type Section = "overview" | "inbox" | "projects" | "news";

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
        className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{title}</span>
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">{meta}</span>
        </span>
        <StatusPill published={published} />
        <span className="hidden shrink-0 text-sm font-medium text-primary sm:block">Edit</span>
      </button>
    </li>
  );
}

/** The landing view: what arrived, and what state the site's content is in. */
function Overview({
  data,
  onGo,
}: {
  data: {
    submissions: SubmissionRow[];
    counts: { total: number; failed: number; byKind: Record<string, number> };
    projects: Project[];
    news: NewsStory[];
  };
  onGo: (section: Section) => void;
}) {
  const { submissions, counts, projects, news } = data;
  const drafts =
    projects.filter((p) => !p.published).length + news.filter((s) => !s.published).length;
  const recent = submissions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Submissions"
          value={counts.total}
          hint="Across every form"
          icon={InboxIcon}
        />
        <StatCard
          label="Outreaches"
          value={projects.length}
          hint={`${projects.filter((p) => p.published).length} published`}
          icon={HeartHandshake}
        />
        <StatCard
          label="News stories"
          value={news.length}
          hint={`${news.filter((s) => s.published).length} published`}
          icon={Newspaper}
        />
        <StatCard
          label="Unsent emails"
          value={counts.failed}
          hint={counts.failed > 0 ? "Needs a reply by hand" : "All notifications delivered"}
          icon={TriangleAlert}
          tone={counts.failed > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Latest submissions</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onGo("inbox")}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing has come in yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((row) => (
                  <li key={row.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {row.name ?? row.email}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {kindLabel(row.kind)} · {formatWhen(row.created_at)}
                      </span>
                    </span>
                    {row.email_status === "failed" ? (
                      <TriangleAlert className="size-4 shrink-0 text-destructive" aria-hidden />
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add something</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" onClick={() => onGo("projects")}>
              <Plus aria-hidden />
              New outreach
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onGo("news")}>
              <Plus aria-hidden />
              New news story
            </Button>
            <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
              {drafts > 0
                ? `${drafts} unpublished ${drafts === 1 ? "record is" : "records are"} waiting — drafts stay invisible on the site until published.`
                : "Everything written is published. New records start as drafts."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminPage() {
  const result = Route.useLoaderData();
  const [section, setSection] = useState<Section>("overview");
  /** The record being edited, or "new" for a blank one; null while listing. */
  const [editingProject, setEditingProject] = useState<Project | "new" | null>(null);
  const [editingStory, setEditingStory] = useState<NewsStory | "new" | null>(null);

  if (!result.ok) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted/40 p-6 font-sans">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto size-8 text-destructive" aria-hidden />
          <h1 className="mt-4 text-lg font-semibold">Life Story admin</h1>
          <p className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {result.error}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            This page is restricted to administrators signed in through Cloudflare Access.
          </p>
        </div>
      </main>
    );
  }

  const { email, submissions, counts, projects, news } = result.data;

  const nav: Array<NavItem<Section>> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "inbox", label: "Submissions", icon: InboxIcon, count: counts.total },
    { id: "projects", label: "Outreaches", icon: HeartHandshake, count: projects.length },
    { id: "news", label: "News", icon: Newspaper, count: news.length },
  ];

  /** Leaving a section closes whatever it had open, so returning starts clean. */
  const go = (next: Section) => {
    setEditingProject(null);
    setEditingStory(null);
    setSection(next);
  };

  const editing = Boolean(editingProject || editingStory);

  const HEADINGS: Record<Section, { title: string; description: string }> = {
    overview: {
      title: "Overview",
      description: "What has come in, and what is live on the site.",
    },
    inbox: {
      title: "Submissions",
      description: "Contact, donation, newsletter and volunteer enquiries.",
    },
    projects: {
      title: "Outreaches",
      description: "Changes go live as soon as they are saved and published.",
    },
    news: {
      title: "News",
      description: "Short updates for the news page.",
    },
  };

  const actions =
    !editing && section === "projects" ? (
      <Button onClick={() => setEditingProject("new")}>
        <Plus aria-hidden />
        New outreach
      </Button>
    ) : !editing && section === "news" ? (
      <Button onClick={() => setEditingStory("new")}>
        <Plus aria-hidden />
        New story
      </Button>
    ) : null;

  return (
    <AdminShell
      nav={nav}
      current={section}
      onNavigate={go}
      email={email}
      title={HEADINGS[section].title}
      description={editing ? undefined : HEADINGS[section].description}
      actions={actions}
    >
      {section === "overview" ? (
        <Overview data={{ submissions, counts, projects, news }} onGo={go} />
      ) : null}

      {section === "inbox" ? <Inbox rows={submissions} counts={counts} /> : null}

      {section === "projects" ? (
        editingProject ? (
          <ProjectEditor
            project={editingProject === "new" ? null : editingProject}
            onClose={() => setEditingProject(null)}
          />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={HeartHandshake}
            title="No outreaches yet"
            body="Each outreach becomes a card on /projects and a page of its own."
            action={
              <Button onClick={() => setEditingProject("new")}>
                <Plus aria-hidden />
                New outreach
              </Button>
            }
          />
        ) : (
          <ul className="space-y-2">
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
        )
      ) : null}

      {section === "news" ? (
        editingStory ? (
          <NewsEditor
            story={editingStory === "new" ? null : editingStory}
            onClose={() => setEditingStory(null)}
          />
        ) : news.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No stories yet"
            body="Short updates for /news. Longer accounts belong on an outreach page."
            action={
              <Button onClick={() => setEditingStory("new")}>
                <Plus aria-hidden />
                New story
              </Button>
            }
          />
        ) : (
          <ul className="space-y-2">
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
        )
      ) : null}
    </AdminShell>
  );
}
