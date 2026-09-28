/**
 * The news stories the site launched with.
 *
 * These are a seed, not the source of truth: migration 0003 loaded them into the
 * `news` table, /admin edits them there, and every page reads D1. What remains
 * here is the fallback used when there is no database binding — `vite dev` —
 * so the page still renders something recognisable while working on it locally.
 *
 * Editing this file changes nothing on the live site. Edit the stories in /admin.
 */
export const newsStories: Array<{
  id: string;
  image: string;
  date: string;
  title: string;
  body: string;
}> = [
  {
    id: "community-hub",
    image: "news1",
    date: "October 24, 2024",
    title: "Opening the New Community Hub in Kumasi",
    body: "The new hub gives families a shared place for tutoring, skills workshops, and local meetings.",
  },
  {
    id: "digital-divide",
    image: "news2",
    date: "October 12, 2024",
    title: "Bridging the Digital Divide with 50 New Laptops",
    body: "Students and teachers can now access digital learning resources through a locally managed computer program.",
  },
  {
    id: "volunteer-program",
    image: "news3",
    date: "September 28, 2024",
    title: "Volunteer Program Applications Are Open",
    body: "Our next volunteer intake supports education, community health, communications, and project coordination.",
  },
];
