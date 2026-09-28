import type { ReactNode } from "react";
import { LandingFooter, LandingNav, SectionLabel } from "../landing/reference-layout";
import { Icon, MotionReveal } from "../landing/motion";
import { ResponsiveImage } from "./responsive-image";
import { SiteLink } from "./site-link";
import type { ImageRef, MediaKey } from "../../lib/media";

/** Slots the interior pages draw on. See lib/media.ts for the manifest. */
export const siteImages = {
  about: "about",
  community: "community",
  education: "education",
  water: "water",
  health: "health",
  news: "news1",
  portrait: "portrait",
  landscape: "landscape",
  hero: "hero",
} satisfies Record<string, MediaKey>;

type PageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  image: ImageRef;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, intro, image, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-surface-page font-body text-on-surface antialiased">
      <LandingNav />
      <main>
        <header className="relative flex min-h-[540px] items-end overflow-hidden bg-navy-900 pb-20 pt-32 text-white md:min-h-[620px]">
          <ResponsiveImage
            src={image}
            alt=""
            width={2000}
            height={1240}
            sizes="100vw"
            priority
            fit="cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/55 to-navy-900/5" />
          <MotionReveal className="relative z-10 mx-auto w-full max-w-max-width px-6 motion-enter-up">
            <SectionLabel dark>{eyebrow}</SectionLabel>
            <h1 className="max-w-4xl font-display text-[2.75rem] leading-[1.05] md:text-[4.5rem]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-body text-white/75 md:text-body-lg">{intro}</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
              <SiteLink href="/" className="transition-colors hover:text-brand-mint">
                Home
              </SiteLink>
              <Icon name="chevron_right" className="text-[17px]" />
              <span>{eyebrow}</span>
            </div>
          </MotionReveal>
        </header>
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}

export type InfoItem = {
  id?: string;
  href?: string;
  icon: string;
  title: string;
  body: string;
  /** Optional photograph. Given one, the card leads with it instead of the icon. */
  image?: ImageRef;
  imageAlt?: string;
};

type InfoGridProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  items: InfoItem[];
  /** Columns at the widest breakpoint. Match it to the item count so the row fills. */
  columns?: 3 | 4;
};

export function InfoGrid({ eyebrow, title, intro, items, columns = 4 }: InfoGridProps) {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <SectionLabel>{eyebrow}</SectionLabel>
          <h2 className="font-display text-h1 text-navy-900">{title}</h2>
          {intro ? (
            <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">{intro}</p>
          ) : null}
        </div>
        <div
          className={`grid grid-cols-1 gap-5 md:grid-cols-2 ${
            columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          }`}
        >
          {items.map((item) => (
            <article
              id={item.id}
              key={item.title}
              className="flex min-h-[260px] flex-col overflow-hidden rounded-lg bg-surface-page scroll-mt-24"
            >
              {item.image ? (
                <ResponsiveImage
                  src={item.image}
                  alt={item.imageAlt ?? item.title}
                  width={800}
                  height={450}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
                  fit="cover"
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-7">
                {item.image ? null : (
                  <div className="mb-8 grid h-12 w-12 place-items-center rounded-full bg-primary text-white">
                    <Icon name={item.icon} filled className="text-[21px]" />
                  </div>
                )}
                <h3 className="mb-3 font-display text-h3 text-navy-900">{item.title}</h3>
                <p className="font-body-sm text-on-surface-variant">{item.body}</p>
                {item.href ? (
                  <SiteLink
                    href={item.href}
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary"
                  >
                    View project <Icon name="arrow_outward" className="text-[17px]" />
                  </SiteLink>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type SplitFeatureProps = {
  eyebrow: string;
  title: string;
  body: string;
  image: ImageRef;
  imageAlt: string;
  actionLabel: string;
  actionHref: string;
};

export function SplitFeature({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  actionLabel,
  actionHref,
}: SplitFeatureProps) {
  return (
    <section className="bg-surface-muted py-24 md:py-32">
      <div className="mx-auto grid max-w-max-width items-center gap-12 px-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg">
          <ResponsiveImage
            src={image}
            alt={imageAlt}
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 50vw, 100vw"
            fit="cover"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>
        <div>
          <SectionLabel>{eyebrow}</SectionLabel>
          <h2 className="font-display text-h1 text-navy-900">{title}</h2>
          <p className="my-6 text-body-lg text-on-surface-variant">{body}</p>
          <SiteLink
            href={actionHref}
            className="inline-flex min-h-12 items-center gap-3 rounded-md bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
          >
            {actionLabel}
            <span className="grid h-7 w-7 place-items-center rounded-sm bg-white text-navy-900">
              <Icon name="arrow_outward" className="text-[17px]" />
            </span>
          </SiteLink>
        </div>
      </div>
    </section>
  );
}

export function ActionBand({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string;
  body: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <section className="bg-navy-900 py-20 text-white md:py-24">
      <div className="mx-auto flex max-w-max-width flex-col justify-between gap-8 px-6 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="font-display text-h1">{title}</h2>
          <p className="mt-3 text-body-lg text-white/70">{body}</p>
        </div>
        <SiteLink
          href={actionHref}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md bg-brand-mint px-6 py-3 font-semibold text-ink-900 transition-colors hover:bg-white"
        >
          {actionLabel} <Icon name="arrow_outward" />
        </SiteLink>
      </div>
    </section>
  );
}

export function PhotoGallery({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  items: Array<{ id: string; alt: string; url: string }>;
}) {
  if (items.length === 0) return null;

  return (
    <section className="bg-surface-muted py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <SectionLabel>{eyebrow}</SectionLabel>
          <h2 className="font-display text-h1 text-navy-900">{title}</h2>
          {intro ? (
            <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">{intro}</p>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg">
              <img
                src={item.url}
                alt={item.alt}
                loading="lazy"
                className="aspect-square h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsBand({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: Array<{ icon: string; value: string; label: string }>;
}) {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6 text-center">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h2 className="font-display text-h1 text-navy-900">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-body text-on-surface-variant">{intro}</p>
        <div className="mt-14 grid overflow-hidden rounded-lg bg-navy-900 p-8 text-left text-white shadow-xl md:grid-cols-3 md:p-12">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`py-6 md:px-8 ${index ? "border-t border-white/15 md:border-l md:border-t-0" : ""}`}
            >
              <span className="mb-8 grid h-11 w-11 place-items-center rounded-full bg-brand-mint text-ink-900">
                <Icon name={item.icon} filled className="text-[19px]" />
              </span>
              <strong className="block font-display text-4xl">{item.value}</strong>
              <div className="my-4 h-px bg-white/15" />
              <span className="font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
