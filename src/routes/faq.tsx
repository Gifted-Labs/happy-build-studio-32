import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "../components/landing/motion";
import { PageShell, siteImages } from "../components/site/page-shell";
import { ResponsiveImage } from "../components/site/responsive-image";

export const Route = createFileRoute("/faq")({ component: FaqPage });

const faqGroups = [
  {
    id: "general",
    title: "General Questions",
    questions: [
      [
        "Can I make a recurring monthly donation?",
        "Yes. Our team can help you arrange a reliable monthly giving plan and direct it toward your preferred program area.",
      ],
      [
        "How do I know my donation is being used effectively?",
        "We connect each contribution to defined program needs and share milestones, project updates, and practical community outcomes.",
      ],
      [
        "Can I volunteer with your organization?",
        "Yes. We welcome volunteers for school outreaches, visits to children's homes, community events, communications, fundraising, and program operations.",
      ],
      [
        "How can I make a donation?",
        "Visit the Donate page to submit an enquiry. Our team will respond with the current approved and secure payment options.",
      ],
      [
        "How do I get updates about the causes I support?",
        "Follow our News page and foundation channels for project milestones, community stories, and upcoming opportunities.",
      ],
    ],
  },
  {
    id: "donations",
    title: "Donations & Contributions",
    questions: [
      [
        "Can I make a donation in honor of someone?",
        "Yes. You can dedicate a contribution in honor or memory of someone. Tell our donation team when making your enquiry.",
      ],
      [
        "Can I volunteer instead of donating money?",
        "Absolutely. Time, professional skills, equipment, services, and community connections can all strengthen our work.",
      ],
      [
        "Can corporations or organizations donate?",
        "Yes. We work with companies, institutions, and community groups on funding, sponsorship, equipment, and long-term partnerships.",
      ],
      [
        "Will I receive updates after donating?",
        "We share relevant program updates and can connect you with public reports and milestones for the work you support.",
      ],
      [
        "Are in-kind donations accepted?",
        "Selected in-kind donations are accepted when they match a current program need. Contact us before arranging delivery.",
      ],
    ],
  },
  {
    id: "volunteering",
    title: "Volunteering & Events",
    questions: [
      [
        "Do I need prior experience to volunteer?",
        "Not always. Some roles require specialist experience, while others include orientation, training, and guidance from our team.",
      ],
      [
        "What types of volunteer opportunities are available?",
        "Opportunities can include education support, children's home visits, community outreaches, communications, events, fundraising, administration, and project coordination.",
      ],
      [
        "Can I volunteer for a single event or on a regular basis?",
        "Yes. Opportunities range from one-day activities to recurring roles and longer program commitments.",
      ],
      [
        "Are there age restrictions for volunteering?",
        "Age requirements depend on the role, location, safeguarding needs, and level of responsibility involved.",
      ],
      [
        "Do volunteers receive any benefits or certificates?",
        "Where appropriate, volunteers receive orientation, practical experience, references, or confirmation of completed service.",
      ],
    ],
  },
  {
    id: "support",
    title: "Support & Communication",
    questions: [
      [
        "How can I get updates on your programs?",
        "Visit our News page and follow our official channels for stories, program updates, volunteer opportunities, and milestones.",
      ],
      [
        "How quickly will I receive a response to my inquiry?",
        "We aim to respond as soon as possible. More detailed partnership or project questions may require coordination with a program lead.",
      ],
      [
        "Can I provide feedback or suggestions about your programs?",
        "Yes. Constructive feedback is welcome and can be submitted through our Contact page for review by the relevant team.",
      ],
      [
        "Do you provide acknowledgment for donations?",
        "Yes. Contact the donation team after contributing so they can confirm the appropriate acknowledgment or receipt information.",
      ],
      [
        "How can I get in touch with a specific program coordinator?",
        "Send your request through the Contact page and include the program area. We will route it to the appropriate coordinator.",
      ],
    ],
  },
] as const;

function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(
    () => new Set(faqGroups.map((group) => `${group.id}-0`)),
  );

  const toggleItem = (id: string) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <PageShell
      eyebrow="FAQS"
      title="Frequently asked questions"
      intro="Clear answers about donations, volunteering, partnerships, programs, and staying connected with our work."
      image={siteImages.education}
    >
      <section className="bg-surface-page py-24 md:py-32">
        <div className="mx-auto grid max-w-max-width items-start gap-12 px-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24">
            <nav aria-label="FAQ categories" className="rounded-lg bg-white p-3 shadow-sm">
              {faqGroups.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="flex min-h-14 items-center justify-between gap-3 border-b border-border px-3 text-sm font-semibold text-navy-900 transition-colors last:border-b-0 hover:text-primary"
                >
                  {group.title}
                  <Icon name="arrow_outward" className="text-[17px]" />
                </a>
              ))}
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
              <div className="absolute inset-0 bg-navy-900/80" />
              <div className="relative z-10 flex min-h-[252px] flex-col justify-between">
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-mint text-ink-900">
                    <Icon name="support_agent" className="text-[21px]" />
                  </span>
                  <h2 className="mt-6 font-display text-xl">Contact Us</h2>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Join our community of supporters or ask about a specific opportunity.
                  </p>
                </div>
                <a
                  href="mailto:contact@lifestory.org"
                  className="border-t border-white/20 pt-4 text-sm font-semibold text-brand-mint"
                >
                  contact@lifestory.org
                </a>
              </div>
            </div>
          </aside>

          <div className="space-y-16">
            {faqGroups.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-24">
                <h2 className="mb-8 font-display text-h1 text-navy-900">{group.title}</h2>
                <div className="space-y-3">
                  {group.questions.map(([question, answer], index) => {
                    const itemId = `${group.id}-${index}`;
                    const isOpen = openItems.has(itemId);
                    return (
                      <div key={question} className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <h3>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`${itemId}-answer`}
                            onClick={() => toggleItem(itemId)}
                            className="flex min-h-16 w-full items-center justify-between gap-5 px-5 text-left font-semibold text-navy-900 md:px-6"
                          >
                            <span>
                              {index + 1}. {question}
                            </span>
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-white">
                              <Icon name={isOpen ? "remove" : "add"} className="text-[18px]" />
                            </span>
                          </button>
                        </h3>
                        {isOpen ? (
                          <div
                            id={`${itemId}-answer`}
                            className="border-t border-border px-5 py-5 text-sm leading-6 text-on-surface-variant md:px-6"
                          >
                            {answer}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
