import { createFileRoute } from "@tanstack/react-router";
import { ActionBand, InfoGrid, PageShell, siteImages } from "../components/site/page-shell";
import { Icon } from "../components/landing/motion";
import { SectionLabel } from "../components/landing/reference-layout";
import { ContactForm } from "../components/forms/contact-form";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return (
    <PageShell
      eyebrow="CONTACT US"
      title="Let us talk about how you can help"
      intro="Questions about projects, partnerships, volunteering, or donations are welcome. Our team will direct your message to the right person."
      image={siteImages.community}
    >
      <section className="bg-surface-page py-24 md:py-32">
        <div className="mx-auto grid max-w-max-width gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>CONTACT DETAILS</SectionLabel>
            <h2 className="font-display text-h1 text-navy-900">
              Start a conversation with our team
            </h2>
            <p className="mt-5 text-body text-on-surface-variant">
              Tell us what you care about and how you would like to contribute. We will direct your
              message to the right person.
            </p>
            <div className="mt-10 space-y-3 rounded-lg bg-navy-900 p-7 text-white">
              <a
                href="mailto:contact@lifestory.org"
                className="flex min-h-14 items-center gap-4 border-b border-white/15 pb-3 hover:text-brand-mint"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-mint text-ink-900">
                  <Icon name="mail" className="text-[19px]" />
                </span>
                contact@lifestory.org
              </a>
              {/* tel: uses the international form so the link works from abroad. */}
              <a
                href="tel:+233550446478"
                className="flex min-h-14 items-center gap-4 border-b border-white/15 pb-3 hover:text-brand-mint"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-mint text-ink-900">
                  <Icon name="call" className="text-[19px]" />
                </span>
                055 044 6478
              </a>
              <a
                href="tel:+233545765993"
                className="flex min-h-14 items-center gap-4 border-b border-white/15 pb-3 hover:text-brand-mint"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-mint text-ink-900">
                  <Icon name="call" className="text-[19px]" />
                </span>
                054 576 5993
              </a>
              <div className="flex min-h-14 items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-mint text-ink-900">
                  <Icon name="location_on" className="text-[19px]" />
                </span>
                Kumasi, Ghana
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <InfoGrid
        eyebrow="HOW WE CAN HELP"
        title="Connect with the right part of the foundation"
        items={[
          {
            icon: "volunteer_activism",
            title: "Volunteering",
            body: "Ask about current roles, time commitments, and practical ways to contribute.",
          },
          {
            icon: "handshake",
            title: "Partnerships",
            body: "Discuss funding, expertise, equipment, services, or a long-term collaboration.",
          },
          {
            icon: "favorite",
            title: "Donations",
            body: "Get help choosing a cause, confirming a gift, or arranging regular support.",
          },
          {
            icon: "campaign",
            title: "Media and Stories",
            body: "Request project information, community updates, or communications support.",
          },
        ]}
      />
      <ActionBand
        title="Ready to take the next step?"
        body="Explore the practical ways your time, skills, or support can strengthen a community program."
        actionLabel="Get Involved"
        actionHref="/get-involved"
      />
    </PageShell>
  );
}
