import { createFileRoute } from "@tanstack/react-router";
import { ActionBand, InfoGrid, PageShell, siteImages } from "../components/site/page-shell";
import { Icon } from "../components/landing/motion";
import { SectionLabel } from "../components/landing/reference-layout";

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
              <a
                href="tel:+233000000000"
                className="flex min-h-14 items-center gap-4 border-b border-white/15 pb-3 hover:text-brand-mint"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-mint text-ink-900">
                  <Icon name="call" className="text-[19px]" />
                </span>
                +233 000 000 000
              </a>
              <div className="flex min-h-14 items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-mint text-ink-900">
                  <Icon name="location_on" className="text-[19px]" />
                </span>
                Accra, Ghana
              </div>
            </div>
          </div>
          <form
            action="mailto:contact@lifestory.org"
            method="post"
            encType="text/plain"
            className="grid gap-5 rounded-lg bg-white p-6 shadow-xl md:grid-cols-2 md:p-8"
          >
            <label className="text-sm font-semibold text-navy-900">
              Full name
              <input
                required
                name="name"
                autoComplete="name"
                className="mt-2 h-12 w-full rounded-md border border-input px-4 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>
            <label className="text-sm font-semibold text-navy-900">
              Email address
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-md border border-input px-4 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>
            <label className="text-sm font-semibold text-navy-900 md:col-span-2">
              Subject
              <input
                required
                name="subject"
                className="mt-2 h-12 w-full rounded-md border border-input px-4 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>
            <label className="text-sm font-semibold text-navy-900 md:col-span-2">
              Message
              <textarea
                required
                name="message"
                rows={6}
                className="mt-2 w-full resize-y rounded-md border border-input p-4 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-800 md:col-span-2 md:justify-self-start"
            >
              Send Message <Icon name="arrow_outward" />
            </button>
          </form>
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
