import { useState } from "react";
import { ActionLink, LandingFooter, LandingNav, SectionLabel } from "../landing/reference-layout";
import { Icon } from "../landing/motion";
import { siteImages } from "../site/page-shell";
import { useRealPhoto } from "../site/real-photos-context";

const team = [
  {
    name: "Daniel Kwarteng",
    role: "Volunteer Coordinator",
    image: siteImages.community,
  },
  {
    name: "Ama Owusu",
    role: "Programs and Operations",
    image: siteImages.about,
  },
  {
    name: "Efua Mensah",
    role: "Community Outreach Manager",
    image: siteImages.health,
  },
];

function AboutHero() {
  const heroPhoto = useRealPhoto("community", 0, siteImages.about);

  return (
    <header className="relative flex min-h-[540px] items-end overflow-hidden bg-navy-900 pb-20 pt-32 text-white md:min-h-[620px]">
      <img
        src={heroPhoto}
        alt="A young person participating in a Life Story Foundation program"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/55 to-navy-900/5" />
      <div className="relative z-10 mx-auto w-full max-w-max-width px-6">
        <h1 className="font-display text-[2.75rem] leading-none md:text-[4.5rem]">About us</h1>
        <div className="mt-5 flex items-center gap-2 text-sm text-white/75">
          <a href="/" className="transition-colors hover:text-brand-mint">
            Home
          </a>
          <Icon name="chevron_right" className="text-[17px]" />
          <span>About Us</span>
        </div>
      </div>
    </header>
  );
}

function FoundationStory() {
  const educationPhoto = useRealPhoto("education", 4, siteImages.education);
  const communityPhoto = useRealPhoto("community", 1, siteImages.community);

  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="mx-auto grid max-w-max-width items-center gap-16 px-6 lg:grid-cols-2">
        <div className="relative mx-auto h-[560px] w-full max-w-[520px]">
          <img
            src={educationPhoto}
            alt="Children learning together"
            className="absolute left-[8%] top-[10%] h-[370px] w-[62%] rounded-lg object-cover shadow-xl"
          />
          <img
            src={communityPhoto}
            alt="Community volunteers"
            className="absolute right-0 top-0 h-[230px] w-[44%] rounded-lg border-4 border-surface-page object-cover"
          />
          <img
            src={siteImages.health}
            alt="Community health outreach"
            className="absolute bottom-0 left-0 h-[250px] w-[44%] rounded-lg border-4 border-surface-page object-cover shadow-lg"
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
          <div className="mt-8 overflow-hidden rounded-lg bg-white px-6 shadow-sm">
            {[
              [
                "track_changes",
                "Mission-driven organization",
                "We focus on sustainable programs that strengthen communities and expand opportunity.",
              ],
              [
                "verified",
                "Transparent, trusted, and impactful",
                "Clear reporting and responsible stewardship guide every partnership we build.",
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
            <ActionLink href="/contact">Connect With Us</ActionLink>
            <div className="flex items-center gap-3">
              <img
                src={siteImages.about}
                alt="Life Story Foundation team member"
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

function PurposeCards() {
  const purposes = [
    {
      icon: "flag",
      title: "Our Mission",
      body: "To connect communities with practical resources and locally led development programs.",
      image: useRealPhoto("community", 2, siteImages.community),
    },
    {
      icon: "visibility",
      title: "Our Vision",
      body: "A Ghana where every child can learn, thrive, and shape a hopeful future.",
      image: siteImages.water,
    },
    {
      icon: "favorite",
      title: "Our Values",
      body: "Dignity, transparency, partnership, and responsibility shape the way we serve.",
      image: useRealPhoto("education", 5, siteImages.education),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>OUR APPROACH</SectionLabel>
          <h2 className="font-display text-h1 text-navy-900">Smart solutions for real impact</h2>
          <p className="mt-4 text-body text-on-surface-variant">
            Shared solutions for meaningful, community-led change with measurable outcomes.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {purposes.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-lg bg-surface-page p-3">
              <img
                src={item.image}
                alt=""
                className="aspect-[4/3] w-full rounded-md object-cover"
              />
              <div className="p-5">
                <span className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-primary text-white">
                  <Icon name={item.icon} filled className="text-[20px]" />
                </span>
                <h3 className="font-display text-xl text-navy-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center text-sm text-on-surface-variant">
          Let&apos;s make something good work together.{" "}
          <a href="/get-involved" className="font-semibold text-primary underline">
            Get involved
          </a>
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  const communityPhoto = useRealPhoto("community", 3, siteImages.community);
  const educationPhoto = useRealPhoto("education", 6, siteImages.education);

  return (
    <section className="bg-surface-muted py-24 md:py-32">
      <div className="mx-auto grid max-w-max-width items-center gap-16 px-6 lg:grid-cols-2">
        <div className="relative mx-auto h-[570px] w-full max-w-[520px]">
          <img
            src={communityPhoto}
            alt="A child supported by community programs"
            className="absolute inset-y-0 left-[8%] w-[76%] rounded-lg object-cover"
          />
          <div className="absolute left-0 top-12 rounded-lg bg-white p-5 shadow-xl">
            <strong className="block font-display text-2xl text-navy-900">500+</strong>
            <span className="text-sm text-on-surface-variant">People supported</span>
          </div>
          <img
            src={educationPhoto}
            alt="Students in a Life Story Foundation program"
            className="absolute bottom-8 right-0 h-[210px] w-[42%] rounded-lg border-4 border-surface-muted object-cover"
          />
        </div>
        <div>
          <SectionLabel>WHY CHOOSE US</SectionLabel>
          <h2 className="font-display text-h1 text-navy-900">
            Transforming generosity into meaningful change
          </h2>
          <p className="mt-5 text-body text-on-surface-variant">
            We design practical programs across education, healthcare, clean water, and family
            support with communities at the center.
          </p>
          <div className="mt-8 grid overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-[1fr_190px]">
            <div className="p-6">
              <h3 className="font-display text-lg text-navy-900">Real-time impact tracking</h3>
              <div className="my-4 h-px bg-border" />
              {[
                "Transparent, easy-to-read reports",
                "Project milestones and updates",
                "Visible community outcomes",
              ].map((item) => (
                <div
                  key={item}
                  className="mt-4 flex items-center gap-3 text-sm text-on-surface-variant"
                >
                  <Icon name="check_circle" filled className="text-[18px] text-brand-mint" />
                  {item}
                </div>
              ))}
            </div>
            <img
              src={siteImages.health}
              alt="Community outreach participants"
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

function ImpactHighlights() {
  const features = [
    [
      "encrypted",
      "Secure and responsible",
      "Every contribution is handled with clear stewardship.",
    ],
    [
      "monitoring",
      "Real-time impact tracking",
      "Follow milestones and measurable community outcomes.",
    ],
    [
      "diversity_3",
      "Multi-cause support",
      "Help education, healthcare, clean water, and families.",
    ],
  ];
  const stats = [
    ["6+", "Years of local service"],
    ["500+", "People supported"],
    ["20+", "Community projects"],
  ];

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6 text-center">
        <SectionLabel>OUR CORE FEATURES</SectionLabel>
        <h2 className="font-display text-h1 text-navy-900">Highlights of our impactful work</h2>
        <p className="mx-auto mt-4 max-w-2xl text-body text-on-surface-variant">
          From secure giving experiences to real-time impact tracking, our work is built to last.
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

function CauseGallery() {
  const educationPhoto = useRealPhoto("education", 7, siteImages.education);
  const causes = [
    [educationPhoto, "Education", "Education for children and young people", "/projects#education"],
    [
      siteImages.water,
      "Clean Water",
      "Safe water and sanitation programs",
      "/projects#clean-water",
    ],
    [
      siteImages.health,
      "Healthcare",
      "Community healthcare and medical aid",
      "/projects#healthcare",
    ],
  ];

  return (
    <section className="bg-surface-page py-24 md:py-32">
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
              Practical programs address immediate needs while strengthening long-term local
              capacity.
            </p>
            <div className="mt-6">
              <ActionLink href="/projects">View Our Projects</ActionLink>
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {causes.map(([image, category, title, href]) => (
            <article key={title} className="group relative aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                  {category}
                </span>
                <h3 className="mt-6 font-display text-xl">{title}</h3>
                <a
                  href={href}
                  className="mt-5 flex items-center justify-between border-t border-white/25 pt-4 text-sm font-semibold"
                >
                  Read more <Icon name="arrow_outward" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center text-sm text-on-surface-variant">
          Let&apos;s create lasting change together.{" "}
          <a href="/donate" className="font-semibold text-primary underline">
            Donate today
          </a>
        </div>
      </div>
    </section>
  );
}

function StoryBand() {
  const backgroundPhoto = useRealPhoto("community", 5, siteImages.community);

  return (
    <section className="relative flex h-[560px] items-center justify-center overflow-hidden text-center text-white">
      <img
        src={backgroundPhoto}
        alt="Life Story Foundation community program"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy-900/78" />
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <SectionLabel dark>WATCH OUR STORY</SectionLabel>
        <h2 className="font-display text-h1">Together we&apos;re changing lives</h2>
        <p className="mx-auto mt-5 max-w-2xl text-body text-white/70">
          Through collective support from donors, volunteers, and partners, we create opportunity
          and dignity in the communities we serve.
        </p>
        <a
          href="/projects"
          aria-label="Explore our community work"
          className="mx-auto mt-16 grid h-20 w-20 place-items-center rounded-full bg-brand-mint text-ink-900 shadow-xl"
        >
          <Icon name="play_arrow" filled className="text-[30px]" />
        </a>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-max-width px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel>MEET OUR VOLUNTEERS</SectionLabel>
            <h2 className="max-w-xl font-display text-h1 text-navy-900">
              Working together to build a better future
            </h2>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-body text-on-surface-variant">
              Our volunteers bring skill, care, and local understanding to every community
              partnership.
            </p>
            <div className="mt-6">
              <ActionLink href="/get-involved#volunteer">View All Volunteers</ActionLink>
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-xl">{member.name}</h3>
                <p className="mt-2 text-sm text-white/75">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-center gap-3">
          <span className="h-2 w-8 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>
      </div>
    </section>
  );
}

function TestimonialBand() {
  return (
    <section className="relative overflow-hidden py-24 text-white md:py-32">
      <img
        src={siteImages.health}
        alt="Community healthcare volunteers"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/75 via-navy-900/35 to-navy-900/70" />
      <div className="relative z-10 mx-auto grid max-w-max-width items-end gap-12 px-6 lg:grid-cols-2">
        <div className="pb-4">
          <SectionLabel dark>REAL EXPERIENCES</SectionLabel>
          <h2 className="max-w-xl font-display text-h1">Building trust through real experiences</h2>
        </div>
        <blockquote className="rounded-lg bg-white p-8 text-ink-900 shadow-2xl md:p-10">
          <div className="mb-8 text-brand-mint">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
          <p className="font-display text-xl leading-8">
            Life Story keeps us informed and shows how support becomes practical change. Their
            transparent approach gives our community confidence in every contribution.
          </p>
          <div className="mt-12 flex items-center gap-3 border-t border-border pt-6">
            <img
              src={siteImages.about}
              alt="Akosua Boateng"
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <cite className="not-italic font-semibold">Akosua Boateng</cite>
              <div className="text-sm text-on-surface-variant">Community partner</div>
            </div>
          </div>
        </blockquote>
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
      "How do you choose the programs you support?",
      "Programs are planned with community leaders around clear needs and sustainable outcomes.",
    ],
    [
      "Can I volunteer with your organization?",
      "Yes. Our Get Involved page lists ways to contribute time, expertise, and practical support.",
    ],
    [
      "How can I receive a donation receipt?",
      "Contact our team after donating and we will provide the appropriate confirmation.",
    ],
    [
      "How do I get updates about the causes I support?",
      "Our News page shares project milestones, stories, and upcoming opportunities.",
    ],
  ];
  const [open, setOpen] = useState(0);
  const bannerPhoto = useRealPhoto("community", 4, siteImages.community);

  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="mx-auto grid max-w-max-width items-center gap-16 px-6 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[520px]">
          <img
            src={bannerPhoto}
            alt="Community support program"
            className="aspect-[4/5] w-[82%] rounded-lg object-cover"
          />
          <div className="absolute bottom-8 right-0 w-[230px] rounded-lg bg-navy-900 p-6 text-white shadow-xl">
            <div className="text-brand-mint">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
            <div className="mt-5 font-display text-3xl">4.9/5</div>
            <p className="mt-3 text-sm text-white/65">Trusted by our community and partners.</p>
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

export function ReferenceAboutPage() {
  return (
    <div className="min-h-screen bg-surface-page font-body text-on-surface antialiased">
      <LandingNav />
      <main>
        <AboutHero />
        <FoundationStory />
        <PurposeCards />
        <ImpactSection />
        <ImpactHighlights />
        <CauseGallery />
        <StoryBand />
        <TeamSection />
        <TestimonialBand />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
