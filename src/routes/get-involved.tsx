import { createFileRoute } from "@tanstack/react-router";
import {
  ActionBand,
  InfoGrid,
  PageShell,
  SplitFeature,
  StatsBand,
  siteImages,
} from "../components/site/page-shell";
import { getProjectPhotoSets } from "../lib/google-drive";

export const Route = createFileRoute("/get-involved")({
  loader: () => getProjectPhotoSets(),
  component: GetInvolvedPage,
});

function GetInvolvedPage() {
  const photoSets = Route.useLoaderData();
  const heroImage = photoSets.communitySupportDrive[1]?.url ?? siteImages.community;

  return (
    <PageShell
      eyebrow="GET INVOLVED"
      title="Choose how you want to make a difference"
      intro="Give time, expertise, funding, or a platform. We will help connect your contribution to a clear community need."
      image={heroImage}
    >
      <InfoGrid
        eyebrow="WAYS TO HELP"
        title="There is more than one way to contribute"
        items={[
          {
            id: "volunteer",
            icon: "volunteer_activism",
            title: "Volunteer",
            body: "Support programs in education, health, communications, events, and operations.",
          },
          {
            id: "partner",
            icon: "handshake",
            title: "Partner",
            body: "Build a long-term collaboration through funding, expertise, equipment, or services.",
          },
          {
            id: "fundraise",
            icon: "campaign",
            title: "Fundraise",
            body: "Create a community, workplace, school, or personal campaign for a defined project.",
          },
          {
            id: "workshops",
            icon: "co_present",
            title: "Join a Workshop",
            body: "Learn from community leaders and gain practical skills in sustainable development work.",
          },
        ]}
      />
      <SplitFeature
        eyebrow="START A CONVERSATION"
        title="We will help you find the right fit"
        body="Tell us what you care about, what experience you bring, and how much time you can offer. Our team will match you with a current need and explain the next steps clearly."
        image={siteImages.health}
        imageAlt="People discussing a community program"
        actionLabel="Contact Our Team"
        actionHref="/contact"
      />
      <StatsBand
        eyebrow="VOLUNTEER IMPACT"
        title="Shared effort creates stronger programs"
        intro="Volunteers and partners expand our skills, reach, and ability to respond to practical community priorities."
        items={[
          { icon: "volunteer_activism", value: "100+", label: "Active volunteers" },
          { icon: "schedule", value: "2K+", label: "Hours contributed" },
          { icon: "handshake", value: "15+", label: "Program partners" },
        ]}
      />
      <ActionBand
        title="Prefer to support from anywhere?"
        body="A donation helps fund materials, transport, local staff, and essential project delivery."
        actionLabel="Make a Donation"
        actionHref="/donate"
      />
    </PageShell>
  );
}
