import { createFileRoute } from "@tanstack/react-router";
import { ReferenceLandingPage } from "../components/landing/reference-layout";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return <ReferenceLandingPage />;
}
