import { createFileRoute } from "@tanstack/react-router";
import { ActionBand, PageShell, SplitFeature, siteImages } from "../components/site/page-shell";
import { ResponsiveImage } from "../components/site/responsive-image";
import { ActionLink, SectionLabel } from "../components/landing/reference-layout";
import { Icon } from "../components/landing/motion";
import { loadNews } from "../lib/content";

export const Route = createFileRoute("/news")({
  // Read per request, so a story published in /admin appears without a deploy.
  loader: () => loadNews(),
  component: NewsPage,
});

function NewsPage() {
  const stories = Route.useLoaderData();

  return (
    <PageShell
      eyebrow="NEWS AND STORIES"
      title="Updates from the communities we serve"
      intro="Follow project milestones, community voices, volunteer opportunities, and the practical lessons shaping our work."
      image={siteImages.news}
    >
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-max-width px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionLabel>LATEST UPDATES</SectionLabel>
              <h2 className="max-w-xl font-display text-h1 text-navy-900">
                Stories, updates, and impact that inspire change
              </h2>
            </div>
            <div className="max-w-xl lg:justify-self-end">
              <p className="text-body text-on-surface-variant">
                Follow community initiatives, practical milestones, and the people helping each
                program move forward.
              </p>
              <div className="mt-6">
                <ActionLink href="/get-involved">Join Our Work</ActionLink>
              </div>
            </div>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {stories.map((story) => (
              <article
                id={story.id}
                key={story.id}
                className="group relative aspect-[4/5] scroll-mt-24 overflow-hidden rounded-lg"
              >
                <ResponsiveImage
                  src={story.image}
                  alt=""
                  width={800}
                  height={1000}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  fit="cover"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="flex items-center gap-2 text-sm text-white/75">
                    <Icon name="calendar_month" className="text-[17px]" /> {story.date}
                  </p>
                  <h2 className="mt-4 font-display text-xl">{story.title}</h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/70">{story.body}</p>
                  <a
                    href={story.link ?? `#${story.id}`}
                    className="mt-5 flex items-center justify-between border-t border-white/25 pt-4 text-sm font-semibold"
                  >
                    Read story <Icon name="arrow_outward" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SplitFeature
        eyebrow="FEATURED STORY"
        title="A community hub built around shared opportunity"
        body="The new hub creates one reliable place for tutoring, practical skills workshops, and community meetings. It reflects what becomes possible when local knowledge and committed support work together."
        image={siteImages.news}
        imageAlt="Life Story Foundation community hub"
        actionLabel="Support Community Programs"
        actionHref="/donate"
      />
      <ActionBand
        title="Bring your skills to the story"
        body="See where volunteers and partners can contribute to upcoming work."
        actionLabel="View Opportunities"
        actionHref="/get-involved"
      />
    </PageShell>
  );
}
