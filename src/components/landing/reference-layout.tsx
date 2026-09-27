import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "./motion";
import { ResponsiveImage } from "../site/responsive-image";
import { SiteLink } from "../site/site-link";
import { NewsletterForm } from "../forms/newsletter-form";
import type { MediaKey } from "../../lib/media";

/**
 * Named slots this layout uses, resolved against the manifest in lib/media.ts.
 * Swapping a photograph means changing the manifest, not this file.
 */
const images = {
  hero: "hero",
  about: "about",
  community: "community",
  education: "education",
  water: "water",
  health: "health",
  news1: "news1",
  news2: "news2",
  news3: "news3",
  portrait: "portrait",
  landscape: "landscape",
} satisfies Record<string, MediaKey>;

const navigation = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Projects", "/projects"],
  ["News", "/news"],
  ["FAQs", "/faq"],
  ["Contact", "/contact"],
];

export function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <span
      className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        dark ? "bg-white/10 text-white" : "bg-surface-muted text-primary"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-mint" />
      {children}
    </span>
  );
}

export function ActionLink({ href, children }: { href: string; children: string }) {
  return (
    <SiteLink
      href={href}
      className="inline-flex min-h-11 items-center gap-3 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
    >
      {children}
      <span className="grid h-7 w-7 place-items-center rounded-sm bg-white text-navy-900">
        <Icon name="arrow_outward" className="text-[17px]" />
      </span>
    </SiteLink>
  );
}

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 48);
      setMenuOpen(false);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed z-50 transition-all duration-300 ${
        scrolled
          ? "inset-x-0 top-0 h-16 bg-navy-900 shadow-xl"
          : "left-1/2 top-5 h-[72px] w-[min(92%,1240px)] -translate-x-1/2 rounded-lg bg-navy-900/95 shadow-xl backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-full max-w-max-width items-center justify-between px-5 md:px-7">
        <SiteLink href="/" className="flex items-center gap-2">
          <img
            src="/life-story-bird-white.png"
            alt=""
            width="895"
            height="990"
            className="h-11 w-auto object-contain"
          />
          <span className="uppercase leading-none text-white">
            <strong className="block font-display text-base">Life Story</strong>
            <span className="mt-1 block text-[0.625rem] font-semibold">Foundation</span>
          </span>
        </SiteLink>
        <div className="hidden items-center gap-7 md:flex">
          {navigation.map(([label, href]) => (
            <SiteLink
              key={label}
              href={href}
              className="text-sm font-medium text-white/80 hover:text-brand-mint"
            >
              {label}
            </SiteLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-md text-white transition-colors hover:bg-white/10 md:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} className="text-[24px]" />
          </button>
          <SiteLink
            href="/donate"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-brand-mint px-4 text-sm font-semibold text-ink-900"
          >
            Donate <Icon name="arrow_outward" className="text-[18px]" />
          </SiteLink>
        </div>
      </div>
      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-lg border border-white/10 bg-navy-900 p-2 shadow-2xl md:hidden"
        >
          {navigation.map(([label, href]) => (
            <SiteLink
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 items-center rounded-md px-4 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-brand-mint"
            >
              {label}
            </SiteLink>
          ))}
        </div>
      ) : null}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative flex h-[clamp(680px,92svh,820px)] min-h-[680px] items-end overflow-hidden bg-navy-900 text-white">
      <ResponsiveImage
        src={images.hero}
        alt="Children learning together"
        width={2000}
        height={1200}
        sizes="100vw"
        priority
        fit="cover"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.22_0.08_254/0.92)_0%,oklch(0.22_0.08_254/0.68)_35%,oklch(0.22_0.08_254/0.1)_72%)]" />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-max-width flex-col justify-between px-6 pb-14 pt-36">
        <div className="max-w-md">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 text-sm backdrop-blur-md">
            <div className="flex -space-x-2">
              {[images.portrait, images.about, images.community].map((src) => (
                <ResponsiveImage
                  key={src}
                  src={src}
                  alt=""
                  width={56}
                  height={56}
                  fit="cover"
                  className="h-7 w-7 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            Hope begins with you
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/75">
            Every contribution adds up to real change through education, healthcare, clean water,
            and sustainable community support.
          </p>
        </div>
        <div className="grid items-end gap-8 md:grid-cols-[1fr_280px]">
          <h1 className="max-w-3xl font-display text-[2.7rem] leading-[1.08] md:text-[4.25rem]">
            Turning small contributions into meaningful impact every day
          </h1>
          <div className="border-l border-white/25 pl-6">
            <div className="mb-4 text-xl font-bold">4.9/5</div>
            <p className="font-semibold">Trusted by donors and community partners</p>
            <SiteLink
              href="/donate"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-mint"
            >
              Support our work <Icon name="arrow_forward" className="text-[18px]" />
            </SiteLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCollage() {
  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="mx-auto grid max-w-max-width items-center gap-16 px-6 lg:grid-cols-2">
        <div className="relative mx-auto h-[560px] w-full max-w-[520px]">
          <ResponsiveImage
            src={images.about}
            alt="Community volunteer"
            width={666}
            height={760}
            sizes="(min-width: 1024px) 333px, 64vw"
            fit="cover"
            className="absolute left-[13%] top-[8%] h-[380px] w-[64%] rounded-lg object-cover shadow-xl"
          />
          <ResponsiveImage
            src={images.community}
            alt="Community gathering"
            width={448}
            height={440}
            sizes="(min-width: 1024px) 224px, 43vw"
            fit="cover"
            className="absolute right-0 top-0 h-[220px] w-[43%] rounded-lg border-4 border-surface-page object-cover"
          />
          <ResponsiveImage
            src={images.education}
            alt="Education program"
            width={448}
            height={500}
            sizes="(min-width: 1024px) 224px, 43vw"
            fit="cover"
            className="absolute bottom-0 left-0 h-[250px] w-[43%] rounded-lg border-4 border-surface-page object-cover shadow-lg"
          />
        </div>
        <div>
          <SectionLabel>ABOUT US</SectionLabel>
          <h2 className="max-w-xl font-display text-h1 text-navy-900">
            Growing together to create lasting impact
          </h2>
          <p className="mt-5 max-w-xl text-body text-on-surface-variant">
            From grassroots initiatives to larger community programs, we grow with one purpose: to
            serve people with integrity, compassion, and practical support.
          </p>
          <div className="mt-8 rounded-lg bg-white px-6 shadow-sm">
            {[
              [
                "layers",
                "Mission-driven organization",
                "We create meaningful, sustainable change with communities.",
              ],
              [
                "verified",
                "Transparent, trusted, and impactful",
                "Every contribution is directed toward clear and measurable results.",
              ],
            ].map(([icon, title, body], index) => (
              <div
                key={title}
                className={`flex gap-4 py-6 ${index ? "border-t border-border" : ""}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <Icon name={icon} className="text-[20px]" />
                </span>
                <div>
                  <h3 className="font-display text-lg text-navy-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <ActionLink href="/about">More About Us</ActionLink>
            <div className="flex items-center gap-3">
              <ResponsiveImage
                src={images.portrait}
                alt="Foundation director"
                width={88}
                height={88}
                fit="cover"
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-navy-900">Life Story Team</div>
                <div className="text-sm text-on-surface-variant">Community-led foundation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesMatrix() {
  const services = [
    [
      "school",
      "Education support",
      "Scholarships, supplies, digital learning access, and mentorship.",
    ],
    [
      "health_and_safety",
      "Healthcare outreach",
      "Screenings, nutrition support, and essential health education.",
    ],
    ["restaurant", "Food security", "Community food programs and practical family assistance."],
    [
      "water_drop",
      "Clean water access",
      "Safe water systems, sanitation, training, and maintenance.",
    ],
  ];

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel>OUR SERVICES</SectionLabel>
            <h2 className="max-w-xl font-display text-h1 text-navy-900">
              Delivering support where it is needed most
            </h2>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-body text-on-surface-variant">
              We focus on reaching vulnerable communities with timely assistance and sustainable
              programs.
            </p>
            <div className="mt-6">
              <ActionLink href="/projects">View All Projects</ActionLink>
            </div>
          </div>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_330px]">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {services.map(([icon, title, body], index) => (
              <article
                key={title}
                className={`min-h-[220px] border-border p-6 ${index % 2 === 0 ? "sm:border-r" : ""} ${
                  index < 2 ? "border-b" : ""
                }`}
              >
                <span className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-primary text-white">
                  <Icon name={icon} className="text-[20px]" />
                </span>
                <h3 className="font-display text-lg text-navy-900">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-on-surface-variant">{body}</p>
                <SiteLink
                  href="/projects"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-900"
                >
                  Read more <Icon name="arrow_outward" className="text-[16px]" />
                </SiteLink>
              </article>
            ))}
          </div>
          <aside className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden rounded-lg bg-navy-900 p-8 text-center text-white">
            <div className="flex -space-x-2">
              {[images.portrait, images.about, images.community, images.education].map((src) => (
                <ResponsiveImage
                  key={src}
                  src={src}
                  alt=""
                  width={80}
                  height={80}
                  fit="cover"
                  className="h-10 w-10 rounded-full border-2 border-navy-900 object-cover"
                />
              ))}
            </div>
            <div className="my-7 h-px w-full bg-white/15" />
            <div className="text-brand-mint">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
            <p className="mt-5 max-w-[230px] font-display text-xl">
              Trusted by communities, volunteers, and donors
            </p>
            <SiteLink
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-mint px-5 py-3 font-semibold text-ink-900"
            >
              Contact us <Icon name="arrow_outward" />
            </SiteLink>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-primary/20" />
          </aside>
        </div>
        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-on-surface-variant">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white">
            <Icon name="call" className="text-[16px]" />
          </span>
          Let us build meaningful work together.{" "}
          <SiteLink href="/contact" className="font-semibold text-primary underline">
            Contact the team
          </SiteLink>
        </div>
      </div>
    </section>
  );
}

function ImpactSplit() {
  return (
    <section className="bg-surface-muted py-24 md:py-32">
      <div className="mx-auto grid max-w-max-width items-center gap-16 px-6 lg:grid-cols-2">
        <div className="relative mx-auto h-[570px] w-full max-w-[520px]">
          <ResponsiveImage
            src={images.community}
            alt="Child receiving support"
            width={790}
            height={1140}
            sizes="(min-width: 1024px) 395px, 76vw"
            fit="cover"
            className="absolute inset-y-0 left-[8%] w-[76%] rounded-lg object-cover"
          />
          <div className="absolute left-0 top-12 rounded-lg bg-white p-5 shadow-xl">
            <strong className="block font-display text-2xl text-navy-900">500+</strong>
            <span className="text-sm text-on-surface-variant">Active volunteers</span>
          </div>
          <ResponsiveImage
            src={images.water}
            alt="Community project"
            width={436}
            height={420}
            sizes="(min-width: 1024px) 218px, 42vw"
            fit="cover"
            className="absolute bottom-8 right-0 h-[210px] w-[42%] rounded-lg border-4 border-surface-muted object-cover"
          />
        </div>
        <div>
          <SectionLabel>WHY CHOOSE US</SectionLabel>
          <h2 className="font-display text-h1 text-navy-900">
            Transforming generosity into meaningful change
          </h2>
          <p className="mt-5 text-body text-on-surface-variant">
            We design sustainable programs across education, healthcare, clean water, and family
            support.
          </p>
          <div className="mt-8 grid overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-[1fr_190px]">
            <div className="p-6">
              <h3 className="font-display text-lg text-navy-900">Real-time impact tracking</h3>
              <div className="my-4 h-px bg-border" />
              {[
                "Clear progress reporting",
                "Ongoing project updates",
                "Visible community outcomes",
              ].map((item) => (
                <div
                  key={item}
                  className="mt-4 flex items-center gap-3 text-sm text-on-surface-variant"
                >
                  <Icon name="check_circle" filled className="text-[18px] text-brand-mint" /> {item}
                </div>
              ))}
            </div>
            <ResponsiveImage
              src={images.education}
              alt="Children in a supported community"
              width={600}
              height={440}
              sizes="(min-width: 1024px) 300px, 50vw"
              fit="cover"
              className="h-full min-h-[220px] w-full object-cover"
            />
          </div>
          <div className="mt-8">
            <ActionLink href="/contact">Contact Us</ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryBand() {
  return (
    <section className="relative flex h-[560px] items-center justify-center overflow-hidden text-center text-white">
      <ResponsiveImage
        src={images.landscape}
        alt="Ghana landscape"
        width={2000}
        height={1120}
        sizes="100vw"
        fit="cover"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy-900/75" />
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <SectionLabel dark>WATCH OUR STORY</SectionLabel>
        <h2 className="font-display text-h1">Together we are changing lives</h2>
        <p className="mx-auto mt-5 max-w-2xl text-body text-white/70">
          Collective support from donors, volunteers, and partners provides opportunity and dignity
          to communities.
        </p>
        <SiteLink
          href="/about"
          aria-label="Read our story"
          className="mx-auto mt-16 grid h-20 w-20 place-items-center rounded-full bg-brand-mint text-ink-900 shadow-xl"
        >
          <Icon name="play_arrow" filled className="text-[30px]" />
        </SiteLink>
      </div>
    </section>
  );
}

function CauseGallery() {
  const causes = [
    [
      images.education,
      "Education",
      "Education for children and young people",
      "/projects#education",
    ],
    [images.water, "Clean Water", "Safe water and sanitation programs", "/projects#clean-water"],
    [images.health, "Healthcare", "Community healthcare and medical aid", "/projects#healthcare"],
  ];

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel>OUR CAUSES</SectionLabel>
            <h2 className="max-w-xl font-display text-h1 text-navy-900">
              Dedicated to meaningful and lasting change
            </h2>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-body text-on-surface-variant">
              We focus on programs that address root causes and help communities build lasting
              capacity.
            </p>
            <div className="mt-6">
              <ActionLink href="/contact">Contact Us Now</ActionLink>
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {causes.map(([image, category, title, href]) => (
            <article key={title} className="group relative aspect-[4/5] overflow-hidden rounded-lg">
              <ResponsiveImage
                src={image}
                alt=""
                width={800}
                height={1000}
                sizes="(min-width: 768px) 33vw, 100vw"
                fit="cover"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                  {category}
                </span>
                <h3 className="mt-6 font-display text-xl">{title}</h3>
                <SiteLink
                  href={href}
                  className="mt-5 flex items-center justify-between border-t border-white/25 pt-4 text-sm font-semibold"
                >
                  Read more <Icon name="arrow_outward" />
                </SiteLink>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center text-sm text-on-surface-variant">
          Find the cause that speaks to you.{" "}
          <SiteLink href="/projects" className="font-semibold text-primary underline">
            Explore all projects
          </SiteLink>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const features = [
    ["encrypted", "Secure giving", "Clear and responsible donation stewardship."],
    ["monitoring", "Impact tracking", "Project milestones and measurable outcomes."],
    ["diversity_3", "Multi-cause support", "Education, healthcare, water, and families."],
  ];
  const stats = [
    ["6+", "Years of impact"],
    ["500+", "Children supported"],
    ["20+", "Active projects"],
  ];

  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6 text-center">
        <SectionLabel>OUR CORE FEATURES</SectionLabel>
        <h2 className="font-display text-h1 text-navy-900">Highlights of our impactful work</h2>
        <p className="mx-auto mt-4 max-w-2xl text-body text-on-surface-variant">
          Built to connect generosity with transparent and meaningful community outcomes.
        </p>
        <div className="mt-14 grid gap-8 text-left md:grid-cols-3">
          {features.map(([icon, title, body]) => (
            <div key={title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white">
                <Icon name={icon} className="text-[20px]" />
              </span>
              <div>
                <h3 className="font-display text-lg text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 grid overflow-hidden rounded-lg bg-navy-900 p-8 text-left text-white shadow-xl md:grid-cols-3 md:p-12">
          {stats.map(([number, label], index) => (
            <div
              key={label}
              className={`py-6 md:px-8 ${index ? "border-t border-white/15 md:border-l md:border-t-0" : ""}`}
            >
              <span className="mb-8 grid h-11 w-11 place-items-center rounded-full bg-brand-mint text-ink-900">
                <Icon name="favorite" filled className="text-[19px]" />
              </span>
              <strong className="block font-display text-4xl">{number}</strong>
              <div className="my-4 h-px bg-white/15" />
              <span className="font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Programs() {
  const cards = [
    [images.news1, "Community", "Opening a new community support hub", "/news#community-hub"],
    [images.news2, "Education", "Expanding access to digital learning", "/news#digital-divide"],
    [
      images.news3,
      "Volunteer",
      "Applications open for our volunteer program",
      "/news#volunteer-program",
    ],
  ];
  return (
    <section className="bg-surface-muted py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel>UPCOMING PROGRAMS</SectionLabel>
            <h2 className="max-w-xl font-display text-h1 text-navy-900">
              Join us in creating change that matters
            </h2>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-body text-on-surface-variant">
              Connect, contribute, and participate in community outreach and fundraising programs.
            </p>
            <div className="mt-6">
              <ActionLink href="/get-involved">View Opportunities</ActionLink>
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map(([image, category, title, href]) => (
            <article key={title} className="overflow-hidden rounded-lg bg-white p-2 shadow-sm">
              <ResponsiveImage
                src={image}
                alt=""
                width={800}
                height={600}
                sizes="(min-width: 768px) 33vw, 100vw"
                fit="cover"
                className="aspect-[4/3] w-full rounded-md object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Icon name="location_city" className="text-[18px]" /> {category}
                </div>
                <h3 className="mt-4 min-h-[58px] font-display text-lg text-navy-900">{title}</h3>
                <SiteLink
                  href={href}
                  className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm font-semibold text-navy-900"
                >
                  Read more <Icon name="arrow_outward" />
                </SiteLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DonationSection() {
  const [amount, setAmount] = useState(50);
  const amounts = [10, 25, 50, 100, 250, 500];
  return (
    <section className="bg-navy-900 py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-max-width items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <SectionLabel dark>MAKE A DONATION</SectionLabel>
          <h2 className="max-w-xl font-display text-h1">Your kindness can change a life today</h2>
          <p className="mt-5 max-w-xl text-body text-white/70">
            Every contribution helps provide education, clean water, healthcare, and hope.
          </p>
          <div className="mt-14 flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-mint text-ink-900">
              <Icon name="volunteer_activism" />
            </span>
            <div>
              <h3 className="font-display text-lg">Secure and simple giving</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/65">
                Choose an amount and continue to our donation team for the available secure payment
                options.
              </p>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap gap-6 border-t border-white/15 pt-6 text-sm text-white/65">
            <span className="flex items-center gap-2">
              <Icon name="check_circle" filled className="text-brand-mint" /> Confirmation support
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check_circle" filled className="text-brand-mint" /> Responsible
              stewardship
            </span>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white text-ink-900 shadow-2xl">
          <h3 className="border-b border-border px-7 py-5 text-center font-display text-lg">
            How much would you like to donate?
          </h3>
          <div className="p-7">
            <p className="mb-6 text-sm text-on-surface-variant">
              All donations directly support Life Story Foundation programs.
            </p>
            <label className="mb-3 block text-sm font-semibold">Donation amount</label>
            <div className="grid grid-cols-3 gap-3">
              {amounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className={`h-12 rounded-md text-sm font-semibold ${amount === value ? "bg-brand-mint text-ink-900" : "bg-surface-muted text-navy-900"}`}
                >
                  GHS {value}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              aria-label="Custom donation amount"
              className="mt-4 h-12 w-full rounded-md border border-input px-4 text-center outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <SiteLink
              href={`/donate?amount=${amount}`}
              className="mt-6 block rounded-md bg-primary px-6 py-4 text-center font-semibold text-white"
            >
              Donate now
            </SiteLink>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
              <Icon name="lock" className="text-[15px]" /> Secure donation enquiry
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const questions = [
    [
      "Can I make a recurring monthly donation?",
      "Yes. Our team can help arrange a reliable monthly giving plan for your preferred cause.",
    ],
    [
      "How do I know my donation is used effectively?",
      "We share project updates, program milestones, and clear reports on community outcomes.",
    ],
    [
      "Can I volunteer with the foundation?",
      "Yes. Visit our Get Involved page to see current opportunities and ways to contribute.",
    ],
    [
      "How can I support a specific project?",
      "Contact our team or select a program area on the Projects page.",
    ],
    [
      "How do I receive updates?",
      "Follow our News page for stories, milestones, and upcoming opportunities.",
    ],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="mx-auto grid max-w-max-width items-center gap-16 px-6 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[520px]">
          <ResponsiveImage
            src={images.about}
            alt="Community support"
            width={854}
            height={1068}
            sizes="(min-width: 1024px) 427px, 82vw"
            fit="cover"
            className="aspect-[4/5] w-[82%] rounded-lg object-cover"
          />
          <div className="absolute bottom-8 right-0 w-[230px] rounded-lg bg-navy-900 p-6 text-white shadow-xl">
            <div className="text-brand-mint">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
            <div className="mt-5 font-display text-3xl">4.9/5</div>
            <p className="mt-3 text-sm text-white/65">Trusted for transparency and care.</p>
          </div>
        </div>
        <div>
          <SectionLabel>FREQUENTLY ASKED QUESTIONS</SectionLabel>
          <h2 className="font-display text-h1 text-navy-900">
            Your questions answered with transparency and care
          </h2>
          <div className="mt-8 space-y-3">
            {questions.map(([question, answer], index) => (
              <div key={question} className="overflow-hidden rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setOpen(open === index ? -1 : index)}
                  className="flex min-h-16 w-full items-center justify-between gap-4 px-5 text-left font-semibold text-navy-900"
                >
                  <span>
                    {index + 1}. {question}
                  </span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-white">
                    <Icon name={open === index ? "remove" : "add"} className="text-[18px]" />
                  </span>
                </button>
                {open === index ? (
                  <p className="border-t border-border px-5 py-5 text-sm leading-6 text-on-surface-variant">
                    {answer}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <ActionLink href="/faq">View All FAQs</ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialBand() {
  return (
    <section className="relative min-h-[600px] overflow-hidden py-24 text-white">
      <ResponsiveImage
        src={images.hero}
        alt="Community volunteers"
        width={2000}
        height={1200}
        sizes="100vw"
        fit="cover"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy-900/70" />
      <div className="relative z-10 mx-auto grid min-h-[410px] max-w-max-width items-end gap-12 px-6 lg:grid-cols-2">
        <div>
          <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 text-sm">
            <div className="flex -space-x-2">
              {[images.portrait, images.about, images.community].map((src) => (
                <ResponsiveImage
                  key={src}
                  src={src}
                  alt=""
                  width={56}
                  height={56}
                  fit="cover"
                  className="h-7 w-7 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            What people say
          </div>
          <h2 className="max-w-xl font-display text-h1">Building trust through real experiences</h2>
        </div>
        <blockquote className="rounded-lg bg-white p-8 text-ink-900 shadow-2xl md:p-10">
          <div className="mb-8 text-brand-mint">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
          <p className="font-display text-xl leading-8">
            Life Story keeps us informed and shows how support becomes practical change. Their
            commitment to communities gives me confidence in every contribution.
          </p>
          <div className="mt-12 flex items-center gap-3 border-t border-border pt-6">
            <ResponsiveImage
              src={images.portrait}
              alt="Kojo Boateng"
              width={88}
              height={88}
              fit="cover"
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <cite className="not-italic font-semibold">Kojo Boateng</cite>
              <div className="text-sm text-on-surface-variant">Community partner</div>
            </div>
          </div>
        </blockquote>
      </div>
    </section>
  );
}

function Stories() {
  const stories = [
    [
      images.news1,
      "October 24, 2024",
      "Opening the New Community Hub in Kumasi",
      "/news#community-hub",
    ],
    [images.news2, "October 12, 2024", "Bridging the Digital Divide", "/news#digital-divide"],
    [
      images.news3,
      "September 28, 2024",
      "Volunteer Program Applications Open",
      "/news#volunteer-program",
    ],
  ];
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel>LATEST STORIES</SectionLabel>
            <h2 className="max-w-xl font-display text-h1 text-navy-900">
              Stories, updates, and impact that inspire change
            </h2>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-body text-on-surface-variant">
              Stay informed with community initiatives, milestones, and opportunities.
            </p>
            <div className="mt-6">
              <ActionLink href="/news">View All Stories</ActionLink>
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stories.map(([image, date, title, href]) => (
            <SiteLink
              key={title}
              href={href}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg"
            >
              <ResponsiveImage
                src={image}
                alt=""
                width={800}
                height={1000}
                sizes="(min-width: 768px) 33vw, 100vw"
                fit="cover"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="flex items-center gap-2 text-sm text-white/75">
                  <Icon name="calendar_month" className="text-[17px]" /> {date}
                </div>
                <h3 className="mt-4 font-display text-xl">{title}</h3>
              </div>
            </SiteLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-navy-900 py-16 text-white/70">
      <div className="mx-auto max-w-max-width px-6">
        <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-10 md:flex-row md:items-center">
          <SiteLink href="/" className="flex items-center gap-3">
            <img
              src="/life-story-bird-white.png"
              alt=""
              width="895"
              height="990"
              className="h-12 w-auto"
            />
            <span className="font-display text-xl uppercase text-white">Life Story Foundation</span>
          </SiteLink>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-white">Follow our work</span>
            {["public", "share", "mail"].map((icon) => (
              <span
                key={icon}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20"
              >
                <Icon name={icon} className="text-[17px]" />
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-lg text-white">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {navigation.map(([label, href]) => (
                <li key={label}>
                  <SiteLink href={href} className="hover:text-brand-mint">
                    {label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg text-white">Our Projects</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <SiteLink href="/projects#education">Education support</SiteLink>
              </li>
              <li>
                <SiteLink href="/projects#healthcare">Community healthcare</SiteLink>
              </li>
              <li>
                <SiteLink href="/projects#clean-water">Clean water access</SiteLink>
              </li>
              <li>
                <SiteLink href="/projects#community">Community support</SiteLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg text-white">Get Involved</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <SiteLink href="/get-involved#volunteer">Volunteer</SiteLink>
              </li>
              <li>
                <SiteLink href="/get-involved#partner">Partner</SiteLink>
              </li>
              <li>
                <SiteLink href="/get-involved#fundraise">Fundraise</SiteLink>
              </li>
              <li>
                <SiteLink href="/donate">Monthly giving</SiteLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg text-white">Stay Connected</h3>
            <p className="mt-5 text-sm leading-6">Receive project updates and community stories.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="border-t border-white/15 pt-8 text-center text-sm">
          Copyright {new Date().getFullYear()} Life Story Foundation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function ReferenceLandingPage() {
  return (
    <div className="min-h-screen bg-surface-page font-body text-on-surface antialiased">
      <LandingNav />
      <main>
        <Hero />
        <AboutCollage />
        <ServicesMatrix />
        <ImpactSplit />
        <StoryBand />
        <CauseGallery />
        <Highlights />
        <Programs />
        <DonationSection />
        <FaqSection />
        <TestimonialBand />
        <Stories />
      </main>
      <LandingFooter />
    </div>
  );
}
