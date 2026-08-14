import { createFileRoute } from "@tanstack/react-router";
import { ActionBand, InfoGrid, PageShell, siteImages } from "../components/site/page-shell";
import { Icon } from "../components/landing/motion";
import { SectionLabel } from "../components/landing/reference-layout";

export const Route = createFileRoute("/donate")({
  validateSearch: (search: Record<string, unknown>) => {
    const amount = Number(search.amount);
    return { amount: Number.isFinite(amount) && amount > 0 ? amount : undefined };
  },
  component: DonatePage,
});

function DonatePage() {
  const { amount } = Route.useSearch();

  return (
    <PageShell
      eyebrow="MAKE A DONATION"
      title="Turn generosity into practical support"
      intro="Your contribution supports education, healthcare, clean water, and community-led development across Ghana."
      image={siteImages.health}
    >
      <section className="bg-surface-page py-24 md:py-32">
        <div className="mx-auto grid max-w-max-width items-start gap-12 px-6 lg:grid-cols-2">
          <div>
            <SectionLabel>YOUR IMPACT</SectionLabel>
            <h2 className="font-display text-h1 text-navy-900">Give with clarity and confidence</h2>
            <p className="mt-5 text-body-lg text-on-surface-variant">
              Donations help cover school materials, community health outreach, clean water systems,
              transport, local staff, and project monitoring.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                ["GH₵50", "Learning materials"],
                ["GH₵100", "Health outreach"],
                ["GH₵250", "Water project supplies"],
                ["Monthly", "Reliable program support"],
              ].map(([amount, use]) => (
                <div key={amount} className="min-h-[130px] rounded-lg bg-white p-5 shadow-sm">
                  <strong className="block font-display text-h3 text-navy-900">{amount}</strong>
                  <div className="my-3 h-px bg-border" />
                  <span className="text-body-sm text-on-surface-variant">{use}</span>
                </div>
              ))}
            </div>
          </div>
          <form
            action="mailto:contact@lifestory.org"
            method="post"
            encType="text/plain"
            className="space-y-5 rounded-lg bg-navy-900 p-6 text-white shadow-2xl md:p-8"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-mint text-ink-900">
              <Icon name="volunteer_activism" className="text-[22px]" />
            </span>
            <h2 className="font-display text-h3">Donation enquiry</h2>
            <label className="block text-sm font-semibold">
              Amount in Ghana cedis
              <input
                required
                type="number"
                min="1"
                name="amount"
                placeholder="50"
                defaultValue={amount}
                className="mt-2 h-12 w-full rounded-md border border-white/20 bg-white/10 px-4 font-normal outline-none placeholder:text-white/50 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15"
              />
            </label>
            <label className="block text-sm font-semibold">
              Full name
              <input
                required
                name="name"
                autoComplete="name"
                className="mt-2 h-12 w-full rounded-md border border-white/20 bg-white/10 px-4 font-normal outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15"
              />
            </label>
            <label className="block text-sm font-semibold">
              Email address
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-md border border-white/20 bg-white/10 px-4 font-normal outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-brand-mint px-6 py-3 font-semibold text-ink-900 transition-colors hover:bg-white"
            >
              Contact the Donation Team
            </button>
            <p className="text-center text-body-sm text-white/60">
              Our team will reply with the available secure payment options.
            </p>
          </form>
        </div>
      </section>
      <InfoGrid
        eyebrow="GIVE WITH CONFIDENCE"
        title="Responsible support from enquiry to impact"
        items={[
          {
            icon: "encrypted",
            title: "Secure Process",
            body: "Our team provides the current approved payment options and confirms each contribution.",
          },
          {
            icon: "monitoring",
            title: "Clear Reporting",
            body: "Project milestones and practical outcomes show how community support is being used.",
          },
          {
            icon: "tune",
            title: "Choose a Cause",
            body: "Direct your support toward education, healthcare, clean water, or community needs.",
          },
          {
            icon: "event_repeat",
            title: "Regular Giving",
            body: "Speak with the donation team about reliable monthly support for ongoing programs.",
          },
        ]}
      />
      <ActionBand
        title="Need help before making a contribution?"
        body="Our team can explain current priorities, payment options, and how your preferred cause is supported."
        actionLabel="Contact the Team"
        actionHref="/contact"
      />
    </PageShell>
  );
}
