import type { MediaKey } from "../lib/media";

export type ProjectOutreach = {
  slug: string;
  shortTitle: string;
  title: string;
  category: string;
  date: string;
  location: string;
  status: string;
  heroImage: MediaKey;
  secondaryImage: MediaKey;
  summary: string;
  description: string[];
  metrics: Array<{ icon: string; value: string; label: string }>;
  expectations: Array<{ icon: string; title: string; body: string }>;
  steps: Array<{ title: string; body: string; detail: string }>;
  gallery: Array<{ src: MediaKey; alt: string }>;
  faqs: Array<[string, string]>;
};

/**
 * The foundation's completed outreaches, newest first.
 *
 * Every date, place, and figure here comes from the foundation's own account of
 * the event. Where a project's record gives no number, its `metrics` list is
 * short or empty rather than padded — an invented figure on a charity's page is
 * worse than an absent one.
 */
export const projects: ProjectOutreach[] = [
  {
    slug: "krofrom-christmas-outreach",
    shortTitle: "Krofrom Christmas Outreach",
    title: "Christmas at Krofrom: Sharing a Festive Meal",
    category: "Community",
    date: "December 25, 2025",
    location: "Krofrom, Kumasi",
    status: "Completed",
    heroImage: "krofrom-christmas-outreach/hero",
    secondaryImage: "krofrom-christmas-outreach/secondary",
    summary:
      "A Christmas Day meal shared with people living with drug and substance addiction, serving over 100 plates of food and drinks.",
    description: [
      "On Christmas Day 2025, the Life Story Foundation spent the season at Krofrom in Kumasi with people who are struggling with drug and substance addiction — a group too often left out of the celebrations happening around them.",
      "The Foundation believes in treating everyone with respect and compassion, and in extending help to all who reach out. It was a joyful occasion: over 100 plates of food and drinks were served, and love and cheer were shared at every table.",
    ],
    metrics: [{ icon: "restaurant", value: "100+", label: "Plates of food and drinks served" }],
    expectations: [
      {
        icon: "volunteer_activism",
        title: "Dignity first",
        body: "Everyone who came was received with respect, without conditions attached to sitting down and eating.",
      },
      {
        icon: "diversity_3",
        title: "A shared table",
        body: "Volunteers ate alongside guests rather than serving from a distance, so the day felt like a celebration rather than a handout.",
      },
    ],
    steps: [
      {
        title: "Meeting the community",
        body: "The Foundation went to Krofrom rather than asking people to travel.",
        detail:
          "Holding the meal where people already are removes the barrier that keeps many from attending.",
      },
      {
        title: "Preparing and serving",
        body: "Food and drinks were prepared for the day and served to everyone who came.",
        detail: "Over 100 plates went out across the celebration.",
      },
      {
        title: "Staying for the day",
        body: "Volunteers remained through the meal, sharing the occasion with those who attended.",
        detail: "The aim was company, not just catering.",
      },
    ],
    gallery: [
      {
        src: "krofrom-christmas-outreach/01",
        alt: "Foundation volunteers and community members gathered together at the Krofrom outreach",
      },
      {
        src: "krofrom-christmas-outreach/02",
        alt: "Volunteers and guests seated together during the Christmas celebration",
      },
      {
        src: "krofrom-christmas-outreach/03",
        alt: "The gathering seated in front of the Giving Back to Society banner",
      },
      {
        src: "krofrom-christmas-outreach/04",
        alt: "Guests seated at a table with drinks during the festive meal",
      },
      {
        src: "krofrom-christmas-outreach/05",
        alt: "A Life Story Foundation volunteer with a member of the Krofrom community",
      },
    ],
    faqs: [
      [
        "Where and when did this outreach take place?",
        "At Krofrom in Kumasi, on Christmas Day — December 25, 2025.",
      ],
      [
        "Who did the Foundation serve?",
        "Individuals living with drug and substance addiction. The Foundation aims to extend help and show love to all who reach out to us, and this outreach was part of that commitment.",
      ],
      [
        "How much food was provided?",
        "Over 100 plates of food and drinks were served across the day.",
      ],
    ],
  },
  {
    slug: "books-and-pens",
    shortTitle: "Books & Pens Donation",
    title: "Books and Pens for Breman M/A Basic School",
    category: "Education",
    date: "December 12, 2022",
    location: "Breman M/A Basic School, Kumasi",
    status: "Completed",
    heroImage: "books-and-pens/hero",
    secondaryImage: "books-and-pens/secondary",
    summary:
      "Exercise books and pens donated to over 200 pupils at Breman M/A Basic School in Kumasi, to support their learning.",
    description: [
      "On December 12, 2022, the Life Story Charitable Foundation visited Breman M/A Basic School in Kumasi with exercise books and pens for the pupils.",
      "Over two hundred pupils received materials that day. The donation was made with love, to enhance their learning and to ease one of the practical costs that can stand between a child and their schoolwork.",
    ],
    metrics: [
      { icon: "school", value: "200+", label: "Pupils reached" },
      { icon: "menu_book", value: "Books & pens", label: "Materials donated" },
    ],
    expectations: [
      {
        icon: "menu_book",
        title: "Materials that get used",
        body: "Exercise books and pens are what pupils need daily, and what families most often have to find money for.",
      },
      {
        icon: "groups",
        title: "Handed over in person",
        body: "Volunteers distributed the materials to pupils directly at the school.",
      },
    ],
    steps: [
      {
        title: "Working with the school",
        body: "The Foundation arranged the visit with Breman M/A Basic School.",
        detail:
          "Going through the school keeps distribution orderly and reaches the pupils who are enrolled.",
      },
      {
        title: "Preparing the materials",
        body: "Exercise books and pens were gathered and packed ahead of the visit.",
        detail: "Enough was prepared to reach more than two hundred pupils.",
      },
      {
        title: "Distribution day",
        body: "Volunteers handed materials to pupils across the school on December 12, 2022.",
        detail: "Pupils received their books and pens directly.",
      },
    ],
    gallery: [
      {
        src: "books-and-pens/01",
        alt: "Pupils at Breman M/A Basic School holding up their new exercise books",
      },
      {
        src: "books-and-pens/02",
        alt: "A volunteer handing exercise books to a pupil during the distribution",
      },
      { src: "books-and-pens/03", alt: "Pupils smiling with the exercise books they received" },
      { src: "books-and-pens/04", alt: "Schoolchildren displaying their donated exercise books" },
      { src: "books-and-pens/05", alt: "Stacks of exercise books prepared for distribution" },
    ],
    faqs: [
      [
        "Which school received the donation?",
        "Breman M/A Basic School in Kumasi, on December 12, 2022.",
      ],
      ["How many pupils received materials?", "Over two hundred pupils."],
      [
        "What was donated?",
        "Exercise books and pens, given to support the pupils' day-to-day learning.",
      ],
    ],
  },
  {
    slug: "remar-childrens-home",
    shortTitle: "Remar Children's Home Visit",
    title: "A Day at Remar Children's Home",
    category: "Children & Welfare",
    date: "September 16, 2020",
    location: "Remar Kumasi Children's Home, Patasi, Kumasi",
    status: "Completed",
    heroImage: "remar-childrens-home/hero",
    secondaryImage: "remar-childrens-home/secondary",
    summary:
      "Foodstuffs and grocery items donated to Remar Kumasi Children's Home in Patasi, on the birthday of the Foundation's founder.",
    description: [
      "On September 16, 2020, the Life Story Charitable Foundation spent a day at the Remar Kumasi Children's Home in Patasi, Kumasi, donating foodstuffs and grocery items.",
      "The visit was made alongside Mr. Aboagye Divine, Founder and CEO of Life Story Group, and fell on his birthday — a day he chose to spend sharing love and kindness with the children of the home. In the Foundation's own words, there is no joy or lessons to be learned anywhere quite like the orphanage.",
    ],
    metrics: [{ icon: "shopping_basket", value: "Foodstuffs & groceries", label: "Donated" }],
    expectations: [
      {
        icon: "shopping_basket",
        title: "Provisions for the home",
        body: "Foodstuffs and grocery items that go directly into the home's day-to-day running.",
      },
      {
        icon: "favorite",
        title: "Time with the children",
        body: "The day was spent at the home rather than dropping off supplies and leaving.",
      },
    ],
    steps: [
      {
        title: "Arranging the visit",
        body: "The Foundation arranged the day with Remar Kumasi Children's Home in Patasi.",
        detail: "Coordinating with the home means the donation matches what it actually needs.",
      },
      {
        title: "Gathering provisions",
        body: "Foodstuffs and grocery items were assembled for the home.",
        detail: "Staples chosen to last beyond the day of the visit.",
      },
      {
        title: "Spending the day",
        body: "Volunteers handed over the donation and stayed with the children.",
        detail: "The visit fell on the founder's birthday, September 16, 2020.",
      },
    ],
    gallery: [
      {
        src: "remar-childrens-home/01",
        alt: "Children and volunteers together during the visit to Remar Children's Home",
      },
      { src: "remar-childrens-home/02", alt: "Children seated with volunteers at the home" },
      {
        src: "remar-childrens-home/03",
        alt: "Children of Remar Kumasi Children's Home during the visit",
      },
      {
        src: "remar-childrens-home/04",
        alt: "A child at Remar Kumasi Children's Home on the day of the visit",
      },
      { src: "remar-childrens-home/05", alt: "Children and volunteers sharing the day together" },
    ],
    faqs: [
      [
        "Where did this visit take place?",
        "Remar Kumasi Children's Home in Patasi, Kumasi, on September 16, 2020.",
      ],
      [
        "What was donated?",
        "Foodstuffs and grocery items from the Life Story Charitable Foundation.",
      ],
      [
        "Why that date?",
        "September 16 is the birthday of Mr. Aboagye Divine, Founder and CEO of Life Story Group, who spent the day at the home with the children.",
      ],
    ],
  },
];

/** Look up a single outreach by its URL slug. */
export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
