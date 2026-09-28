import { createFileRoute } from "@tanstack/react-router";
import {
  ActionBand,
  InfoGrid,
  PageShell,
  SplitFeature,
  StatsBand,
  siteImages,
} from "../components/site/page-shell";
import { loadProjects } from "../lib/content";

const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://lifestorycharitablefoundation.com"
).replace(/\/$/, "");

export const Route = createFileRoute("/projects")({
  // Read per request: an outreach added in /admin appears here without a deploy.
  loader: () => loadProjects(),
  head: () => ({
    meta: [
      { title: "Our Projects — Life Story Foundation" },
      {
        name: "description",
        content:
          "Completed outreaches by the Life Story Foundation across Kumasi — school materials for pupils, a Christmas meal at Krofrom, and provisions for a children's home.",
      },
      { property: "og:title", content: "Our Projects — Life Story Foundation" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/projects` }],
  }),
  component: ProjectsPage,
});

/** Icon per project category, so the grid stays in step with the data. */
const CATEGORY_ICONS: Record<string, string> = {
  Education: "school",
  Community: "groups",
  "Children & Welfare": "volunteer_activism",
};

/**
 * Built from whatever outreaches are published, so one added in /admin shows up
 * here automatically instead of drifting out of sync with a hand-written list.
 */
function ProjectsPage() {
  const projects = Route.useLoaderData();
  const featured = projects[0];

  return (
    <PageShell
      eyebrow="OUR PROJECTS"
      title="Outreaches built around real needs"
      intro="Each outreach is planned with the schools, homes, and communities it serves — and recorded here as it actually happened."
      // With nothing published yet the page still needs a header image.
      image={featured?.heroImage ?? siteImages.community}
    >
      <InfoGrid
        eyebrow="OUR OUTREACHES"
        title="Where the Foundation has worked"
        columns={3}
        items={projects.map((project) => ({
          id: project.slug,
          href: `/projects/${project.slug}`,
          icon: CATEGORY_ICONS[project.category] ?? "favorite",
          title: project.shortTitle,
          body: project.summary,
          // Each card leads with that outreach's own hero photograph.
          image: project.heroImage,
          imageAlt: project.gallery[0]?.alt ?? project.shortTitle,
        }))}
      />
      {featured ? (
        <SplitFeature
          eyebrow="FEATURED PROJECT"
          title={featured.title}
          body={featured.summary}
          image={featured.secondaryImage}
          imageAlt={featured.gallery[0]?.alt ?? featured.shortTitle}
          actionLabel="View Project Details"
          actionHref={`/projects/${featured.slug}`}
        />
      ) : null}
      <StatsBand
        eyebrow="OUR REACH"
        title="What these outreaches delivered"
        intro="Figures recorded from the Foundation's own account of each outreach."
        items={[
          { icon: "school", value: "200+", label: "Pupils given books and pens" },
          { icon: "restaurant", value: "100+", label: "Plates served at Krofrom" },
          { icon: "diversity_3", value: `${projects.length}`, label: "Outreaches completed" },
        ]}
      />
      <ActionBand
        title="Build the next project with us"
        body="Partner with Life Story to fund, volunteer, or bring specialist expertise to a community program."
        actionLabel="Become a Partner"
        actionHref="/get-involved#partner"
      />
    </PageShell>
  );
}
