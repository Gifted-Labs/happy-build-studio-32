import { createFileRoute } from "@tanstack/react-router";
import { ReferenceLandingPage } from "../components/landing/reference-layout";
import { RealPhotosProvider } from "../components/site/real-photos-context";
import { getProjectPhotoSets } from "../lib/google-drive";

export const Route = createFileRoute("/")({
  loader: () => getProjectPhotoSets(),
  component: Index,
});

function Index() {
  const photoSets = Route.useLoaderData();

  return (
    <RealPhotosProvider
      photos={{
        education: photoSets.educationAccess.map((photo) => photo.url),
        community: photoSets.communitySupportDrive.map((photo) => photo.url),
      }}
    >
      <ReferenceLandingPage />
    </RealPhotosProvider>
  );
}
