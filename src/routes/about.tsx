import { createFileRoute } from "@tanstack/react-router";
import { ReferenceAboutPage } from "../components/about/reference-about-layout";
import { RealPhotosProvider } from "../components/site/real-photos-context";
import { getProjectPhotoSets } from "../lib/google-drive";

export const Route = createFileRoute("/about")({
  loader: () => getProjectPhotoSets(),
  component: AboutPage,
});

function AboutPage() {
  const photoSets = Route.useLoaderData();

  return (
    <RealPhotosProvider
      photos={{
        education: photoSets.educationAccess.map((photo) => photo.url),
        community: photoSets.communitySupportDrive.map((photo) => photo.url),
      }}
    >
      <ReferenceAboutPage />
    </RealPhotosProvider>
  );
}
