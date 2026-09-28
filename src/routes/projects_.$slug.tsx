import { useEffect, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { ActionLink, SectionLabel } from "../components/landing/reference-layout";
import { Icon } from "../components/landing/motion";
import { ActionBand, PageShell, siteImages } from "../components/site/page-shell";
import { ResponsiveImage } from "../components/site/responsive-image";
import { SiteLink } from "../components/site/site-link";
import { resolveImage, cfImage } from "../lib/media";
import { loadProjectPage } from "../lib/content";

const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://lifestorycharitablefoundation.com"
).replace(/\/$/, "");

export const Route = createFileRoute("/projects_/$slug")({
  /**
   * Read per request. A project added in /admin is reachable at its URL straight
   * away; an unpublished or unknown slug is a 404 rather than an empty page.
   */
  loader: async ({ params }) => {
    const page = await loadProjectPage({ data: params.slug });
    if (!page) throw notFound();
    return page;
  },
  /**
   * Per-page metadata. Without this every project inherits the root's single
   * site-wide title, so search results and shared links are indistinguishable
   * from one another and from the home page.
   */
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    if (!project) return {};
    const title = `${project.shortTitle} — Life Story Foundation`;
    const image = resolveImage(project.heroImage);

    return {
      meta: [
        { title },
        { name: "description", content: project.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: project.summary },
        { property: "og:type", content: "article" },
        { property: "og:image", content: image },
        { property: "og:url", content: `${SITE_URL}/projects/${project.slug}` },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/projects/${project.slug}` }],
    };
  },
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { project, siblings } = Route.useLoaderData();
  const [openStep, setOpenStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeImage, setActiveImage] = useState<number | null>(null);

  useEffect(() => {
    if (activeImage === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
      if (event.key === "ArrowLeft") {
        setActiveImage((current) =>
          current === null ? null : (current - 1 + project.gallery.length) % project.gallery.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveImage((current) =>
          current === null ? null : (current + 1) % project.gallery.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeImage, project.gallery.length]);

  const moveGallery = (direction: number) => {
    setActiveImage((current) => {
      if (current === null) return null;
      return (current + direction + project.gallery.length) % project.gallery.length;
    });
  };

  return (
    <PageShell
      eyebrow={project.category.toUpperCase()}
      title={project.title}
      intro={project.summary}
      image={project.heroImage}
    >
      <section className="bg-surface-page py-24 md:py-32">
        <div className="mx-auto grid max-w-max-width items-start gap-12 px-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24">
            <nav
              aria-label="Explore projects"
              className="overflow-hidden rounded-lg bg-white shadow-sm"
            >
              <div className="bg-primary px-5 py-4 font-display text-lg text-white">
                Explore Our Projects
              </div>
              <div className="p-3">
                {siblings.map((item) => (
                  <SiteLink
                    key={item.slug}
                    href={`/projects/${item.slug}`}
                    aria-current={item.slug === project.slug ? "page" : undefined}
                    className={`flex min-h-14 items-center justify-between gap-3 border-b border-border px-3 text-sm font-semibold transition-colors last:border-b-0 ${
                      item.slug === project.slug
                        ? "text-primary"
                        : "text-navy-900 hover:text-primary"
                    }`}
                  >
                    {item.shortTitle}
                    <Icon name="arrow_outward" className="shrink-0 text-[17px]" />
                  </SiteLink>
                ))}
              </div>
            </nav>

            <div className="relative min-h-[300px] overflow-hidden rounded-lg p-6 text-white">
              <ResponsiveImage
                src={siteImages.community}
                alt="Life Story Foundation community support"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 320px, 100vw"
                fit="cover"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-navy-900/82" />
              <div className="relative z-10 flex min-h-[252px] flex-col justify-between">
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-mint text-ink-900">
                    <Icon name="support_agent" className="text-[21px]" />
                  </span>
                  <h2 className="mt-6 font-display text-xl">Support this outreach</h2>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Ask about sponsoring, volunteering, or supporting a future community visit.
                  </p>
                </div>
                <SiteLink
                  href="/contact"
                  className="flex items-center justify-between border-t border-white/20 pt-4 text-sm font-semibold text-brand-mint"
                >
                  Contact our team <Icon name="arrow_outward" className="text-[17px]" />
                </SiteLink>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <ResponsiveImage
              src={project.heroImage}
              alt={`${project.title} featured view`}
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 70vw, 100vw"
              priority
              fit="cover"
              className="aspect-[16/9] w-full rounded-lg object-cover shadow-sm"
            />

            <div className="mt-6 grid overflow-hidden rounded-lg bg-navy-900 text-white sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["calendar_month", "Outreach date", project.date],
                ["location_on", "Location", project.location],
                ["category", "Program area", project.category],
                ["task_alt", "Project status", project.status],
              ].map(([icon, label, value], index) => (
                <div
                  key={label}
                  className={`p-5 ${index ? "border-t border-white/15 sm:border-l sm:border-t-0" : ""}`}
                >
                  <Icon name={icon} className="text-[20px] text-brand-mint" />
                  <div className="mt-4 text-xs font-semibold uppercase text-white/50">{label}</div>
                  <div className="mt-1 font-semibold">{value}</div>
                </div>
              ))}
            </div>

            <div className="py-14">
              <SectionLabel>PROJECT DESCRIPTION</SectionLabel>
              <h2 className="max-w-3xl font-display text-h1 text-navy-900">
                Community priorities translated into practical action
              </h2>
              <div className="mt-6 space-y-5 text-body text-on-surface-variant">
                {project.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <section aria-labelledby="project-results" className="border-y border-border py-14">
              <SectionLabel>OUTREACH RESULTS</SectionLabel>
              <h2 id="project-results" className="font-display text-h1 text-navy-900">
                Measurable results from the day
              </h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {project.metrics.map((metric) => (
                  <article key={metric.label} className="rounded-lg bg-white p-5 shadow-sm">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white">
                      <Icon name={metric.icon} filled className="text-[19px]" />
                    </span>
                    <strong className="mt-6 block font-display text-3xl text-navy-900">
                      {metric.value}
                    </strong>
                    <div className="my-3 h-px bg-border" />
                    <span className="text-sm font-semibold text-on-surface-variant">
                      {metric.label}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid items-center gap-12 py-16 lg:grid-cols-[1fr_0.78fr]">
              <div>
                <SectionLabel>WHAT TO EXPECT</SectionLabel>
                <h2 className="font-display text-h1 text-navy-900">
                  Practical support designed around the community
                </h2>
                <p className="mt-5 text-body text-on-surface-variant">
                  Every outreach combines focused delivery with participation, learning, and clear
                  follow-up responsibilities.
                </p>
                <div className="mt-8 space-y-6">
                  {project.expectations.map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white">
                        <Icon name={item.icon} className="text-[20px]" />
                      </span>
                      <div>
                        <h3 className="font-display text-lg text-navy-900">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveImage
                src={project.secondaryImage}
                alt={`${project.title} community activity`}
                width={800}
                height={1000}
                sizes="(min-width: 1024px) 35vw, 100vw"
                fit="cover"
                className="aspect-[4/5] w-full rounded-lg object-cover"
              />
            </section>

            <section className="border-t border-border py-16">
              <SectionLabel>OUR PROCESS</SectionLabel>
              <h2 className="font-display text-h1 text-navy-900">How the outreach was delivered</h2>
              <p className="mt-5 max-w-3xl text-body text-on-surface-variant">
                Each stage connects community input, responsible delivery, and documented learning.
              </p>
              <div className="mt-8 divide-y divide-border">
                {project.steps.map((step, index) => {
                  const isOpen = openStep === index;
                  return (
                    <div key={step.title}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`step-${index}-detail`}
                        onClick={() => setOpenStep(isOpen ? -1 : index)}
                        className="flex min-h-20 w-full items-center justify-between gap-5 py-5 text-left"
                      >
                        <span>
                          <span className="block text-xs font-semibold text-primary">
                            {String(index + 1).padStart(2, "0")}.
                          </span>
                          <span className="mt-1 block font-display text-lg text-navy-900">
                            {step.title}
                          </span>
                          <span className="mt-2 block text-sm text-on-surface-variant">
                            {step.body}
                          </span>
                        </span>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-white">
                          <Icon name={isOpen ? "remove" : "add"} className="text-[18px]" />
                        </span>
                      </button>
                      {isOpen ? (
                        <p
                          id={`step-${index}-detail`}
                          className="pb-6 pr-12 text-sm leading-6 text-on-surface-variant"
                        >
                          {step.detail}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="border-t border-border py-16">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <SectionLabel>PROJECT GALLERY</SectionLabel>
                  <h2 className="font-display text-h1 text-navy-900">Moments from the outreach</h2>
                </div>
                <p className="max-w-md text-sm leading-6 text-on-surface-variant">
                  Select any image to view it at full size and move through the complete project
                  gallery.
                </p>
              </div>
              <div className="mt-10 grid gap-4 md:auto-rows-[220px] md:grid-cols-3">
                {project.gallery.map((image, index) => (
                  <article
                    key={`${image.src}-${index}`}
                    className={`overflow-hidden rounded-lg ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Open gallery image ${index + 1}: ${image.alt}`}
                      className="group relative h-full min-h-[240px] w-full overflow-hidden text-left md:min-h-0"
                    >
                      <ResponsiveImage
                        src={image.src}
                        alt={image.alt}
                        width={800}
                        height={800}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        fit="cover"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-navy-900/0 transition-colors group-hover:bg-navy-900/25" />
                      <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white text-navy-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        <Icon name="zoom_in" className="text-[20px]" />
                      </span>
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="border-t border-border py-16">
              <SectionLabel>PROJECT QUESTIONS</SectionLabel>
              <h2 className="font-display text-h1 text-navy-900">Frequently asked questions</h2>
              <div className="mt-8 space-y-3">
                {project.faqs.map(([question, answer], index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={question} className="overflow-hidden rounded-lg bg-white shadow-sm">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`project-faq-${index}`}
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        className="flex min-h-16 w-full items-center justify-between gap-4 px-5 text-left font-semibold text-navy-900"
                      >
                        <span>
                          {index + 1}. {question}
                        </span>
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-white">
                          <Icon name={isOpen ? "remove" : "add"} className="text-[18px]" />
                        </span>
                      </button>
                      {isOpen ? (
                        <p
                          id={`project-faq-${index}`}
                          className="border-t border-border px-5 py-5 text-sm leading-6 text-on-surface-variant"
                        >
                          {answer}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <ActionLink href="/faq">View General FAQs</ActionLink>
              </div>
            </section>
          </div>
        </div>
      </section>

      <ActionBand
        title="Help make the next outreach possible"
        body="Your contribution can support materials, transport, local coordination, volunteers, and responsible follow-up."
        actionLabel="Support Our Projects"
        actionHref="/donate"
      />

      {activeImage !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project gallery viewer"
          className="premium-lightbox fixed inset-0 z-[1100] grid place-items-center bg-navy-900/95 p-4 backdrop-blur-md md:p-8"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            aria-label="Close gallery"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white text-navy-900"
          >
            <Icon name="close" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              moveGallery(-1);
            }}
            aria-label="Previous gallery image"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-900 md:left-8"
          >
            <Icon name="arrow_back" />
          </button>
          <figure
            className="max-w-[min(1100px,82vw)] text-center text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={cfImage(resolveImage(project.gallery[activeImage].src), {
                width: 1600,
                fit: "scale-down",
              })}
              alt={project.gallery[activeImage].alt}
              className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-sm text-white/75">
              {project.gallery[activeImage].alt} · {activeImage + 1} of {project.gallery.length}
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              moveGallery(1);
            }}
            aria-label="Next gallery image"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-900 md:right-8"
          >
            <Icon name="arrow_forward" />
          </button>
        </div>
      ) : null}
    </PageShell>
  );
}
