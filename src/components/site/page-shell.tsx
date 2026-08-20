import type { ReactNode } from "react";
import { LandingFooter, LandingNav, SectionLabel } from "../landing/reference-layout";
import { Icon, MotionReveal } from "../landing/motion";

export const siteImages = {
  about:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDkqkr_eKhXcFCdoH3DL7SSr3LLJXp5te4_ow7xkXTaxbWVwohdyEeQ18KUTB-Y8TSbP_5osvgFJNld0KVlFWNNbF-JzuZAhEcIbYztAXEfDEDdJRp7NpzSJhw5RshMLB6VYEvFM_9p3Dr1mgGziRDJdBeq6AAbOtkdxgjmwBe8richKMGU2Zej-nUO2i8tz5cZy5EVZo5lkYDnVbSwIo2gILCIRr5xg-dahMfct0xvuoLxpn64-lWIMQ",
  community:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDK-DRJPTtY8fZkl0-2Z9ovuJDoGVFhHIvc9FyZ1ZqbZwbSL0051U1OUVlLXeSACe9_vo1TaHrNF0cOBGCyARZj8LR-SxO6NuZpOMr9ukhzu57HqTLcoENPYSFuCTaBLSFMCxTZIAY7b6t2Tin7M-mTd-9rBDBPfaSr6ogJVK52RoXJM-4VnLH7w7wQI_NXw1_1-A2x0Ps1sNpUf1jKbtYifC1CHUp_aHCK4mwtgJn7I0_XwTgr3MmFhA",
  education:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCA7KQHl5sxpX799eLNbYZ0ev5K0U2uinFh-OXOm9Vc16KJqX106YPdpMJSsHDKk9qjhIZqiCEG0QwQ7ynl2ASmFyOrZ3rexuveWqTwIgYQH1GqOqXkdAVygEz2RVRYHf_Hhd-LNhs-RcL6R1wPe2V49taTew5BzdmHBrYnsdseXutaxUc_0JRF7fbVMsfw7CDR4U1uXGu--xEk750Wjo71A-ZdRBP8hETrduqrOp41HQnUbA59n2oCA",
  water:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA0eCmEkDEG_M5aeXAtJ8b1TDiDn3NQSzNwjMNnQHxkpwD53MCIeBKNuXrWiJ0xWtGHqWJiIZLEAnTwCGtkiaQ0kZx7N7H7HiIEcDqtRBuY9f_wee0QfhiOhzwF9qJpq5_ESwaNKn1YmEnSXEZ4ktz2lmrS__h8Av4YWZXyMqCKBLVySwusPYVrbgfTnIz6OGfXvArSCYReMBOq6pbgVeOVydI55-59rZhcfVByfOao-BiuUf3LZNyrdw",
  health:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCdIYlHU0r1pPf81EGne1bifk3SMmVrYQOfRbKmtRqkSbZ1GyPvsBn49fLI2ZBD_-FVHvkufatDS70uiW8IHdRX-pi3diGpKTzxoQwywAzg-Tevhl9TcpSbx_LZAkR4wke_LxE-Wbzvy-rakc5I1OPaQ4vgM15RV1LEj8CuyEptbXlv06_eshvhhCbfZN_mWIsLbwVvu4PKvFn423gqVg86musB_mLljAcuoyBDA_rZfjK5WktRz7l5A",
  news: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrPnPr3180x9otLK7KATn1aA4MIYNTBkuXnqF5BXUY0ch3HtXHRIUNGw3uthQWh3apMzN0vFHvN1ZNAzIzbYvQXcqH3aEmDR7tdHI_nNF39yhiDSJByTpUaT7WgPt3jJn8i0yCfuBTLY4rn5E3AFaWYTxMoOWvdoZ-0d-zDbDwZJIFRPriaeP1cHdAcJhrzb-Zww5tadS9ZmIGlbZ2PyfSTWzMpKEVka6Sl_jiIaD93rsOZD-Za-Ag2g",
};

type PageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, intro, image, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-surface-page font-body text-on-surface antialiased">
      <LandingNav />
      <main>
        <header className="relative flex min-h-[540px] items-end overflow-hidden bg-navy-900 pb-20 pt-32 text-white md:min-h-[620px]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/55 to-navy-900/5" />
          <MotionReveal className="relative z-10 mx-auto w-full max-w-max-width px-6 motion-enter-up">
            <SectionLabel dark>{eyebrow}</SectionLabel>
            <h1 className="max-w-4xl font-display text-[2.75rem] leading-[1.05] md:text-[4.5rem]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-body text-white/75 md:text-body-lg">{intro}</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
              <a href="/" className="transition-colors hover:text-brand-mint">
                Home
              </a>
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
};

type InfoGridProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  items: InfoItem[];
};

export function InfoGrid({ eyebrow, title, intro, items }: InfoGridProps) {
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article
              id={item.id}
              key={item.title}
              className="min-h-[260px] scroll-mt-24 rounded-lg bg-surface-page p-7"
            >
              <div className="mb-8 grid h-12 w-12 place-items-center rounded-full bg-primary text-white">
                <Icon name={item.icon} filled className="text-[21px]" />
              </div>
              <h3 className="mb-3 font-display text-h3 text-navy-900">{item.title}</h3>
              <p className="font-body-sm text-on-surface-variant">{item.body}</p>
              {item.href ? (
                <a
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  View project <Icon name="arrow_outward" className="text-[17px]" />
                </a>
              ) : null}
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
  image: string;
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
          <img src={image} alt={imageAlt} className="aspect-[4/3] h-full w-full object-cover" />
        </div>
        <div>
          <SectionLabel>{eyebrow}</SectionLabel>
          <h2 className="font-display text-h1 text-navy-900">{title}</h2>
          <p className="my-6 text-body-lg text-on-surface-variant">{body}</p>
          <a
            href={actionHref}
            className="inline-flex min-h-12 items-center gap-3 rounded-md bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
          >
            {actionLabel}
            <span className="grid h-7 w-7 place-items-center rounded-sm bg-white text-navy-900">
              <Icon name="arrow_outward" className="text-[17px]" />
            </span>
          </a>
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
        <a
          href={actionHref}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md bg-brand-mint px-6 py-3 font-semibold text-ink-900 transition-colors hover:bg-white"
        >
          {actionLabel} <Icon name="arrow_outward" />
        </a>
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
