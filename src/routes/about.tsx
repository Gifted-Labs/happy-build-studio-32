import { createFileRoute } from "@tanstack/react-router";
import { ReferenceAboutPage } from "../components/about/reference-about-layout";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return <ReferenceAboutPage />;
}
