import { createFileRoute } from "@tanstack/react-router";
import {
  ActionBand,
  InfoGrid,
  PageShell,
  PhotoGallery,
  SplitFeature,
  StatsBand,
  siteImages,
} from "../components/site/page-shell";
import { getProjectPhotoSets } from "../lib/google-drive";

export const Route = createFileRoute("/projects")({
  loader: () => getProjectPhotoSets(),
  component: ProjectsPage,
});

function ProjectsPage() {
  const photoSets = Route.useLoaderData();
  const galleryPhotos = [...photoSets.educationAccess, ...photoSets.communitySupportDrive];
  const heroImage = photoSets.educationAccess[0]?.url ?? siteImages.education;

  return (
    <PageShell
      eyebrow="OUR PROJECTS"
      title="Practical programs built around real needs"
      intro="From classrooms to clinics and clean water systems, each project is planned with the people who will use and sustain it."
      image={heroImage}
    >
      <InfoGrid
        eyebrow="PROGRAM AREAS"
        title="Four connected paths to opportunity"
        items={[
          {
            id: "education",
            href: "/projects/education-access",
            icon: "school",
            title: "Education",
            body: "School materials, scholarships, mentoring, and vocational pathways for young people.",
          },
          {
            id: "healthcare",
            href: "/projects/community-health-outreach",
            icon: "health_and_safety",
            title: "Healthcare",
            body: "Community screenings, nutrition support, maternal care, and essential health education.",
          },
          {
            id: "clean-water",
            href: "/projects/clean-water-access",
            icon: "water_drop",
            title: "Clean Water",
            body: "Reliable water access, sanitation facilities, maintenance training, and hygiene programs.",
          },
          {
            id: "community",
            href: "/projects/community-support-drive",
            icon: "groups",
            title: "Community Support",
            body: "Local leadership, food security, family support, and resilient livelihoods.",
          },
        ]}
      />
      <SplitFeature
        eyebrow="FEATURED PROJECT"
        title="Safe water creates time for school, work, and family"
        body="Our water projects pair durable infrastructure with local maintenance teams and practical sanitation education. That combination keeps systems working and helps communities protect the health gains they create."
        image={siteImages.water}
        imageAlt="Community clean water project"
        actionLabel="View Project Details"
        actionHref="/projects/clean-water-access"
      />
      <StatsBand
        eyebrow="OUR REACH"
        title="Programs designed for measurable progress"
        intro="Each project is connected to clear outcomes, accountable delivery, and long-term community ownership."
        items={[
          { icon: "school", value: "500+", label: "Children supported" },
          { icon: "water_drop", value: "20+", label: "Active projects" },
          { icon: "diversity_3", value: "12", label: "Partner communities" },
        ]}
      />
      <PhotoGallery
        eyebrow="FROM THE FIELD"
        title="Photos from our project communities"
        intro="Real moments from our Education Access and Community Support outreaches."
        items={galleryPhotos}
      />
      <ActionBand
        title="Build the next project with us"
        body="Partner with Life Story to fund, volunteer, or bring specialist expertise to a community program."
        actionLabel="Become a Partner"
        actionHref="/get-involved#partner"
      />
    </PageShell>
  );
}
