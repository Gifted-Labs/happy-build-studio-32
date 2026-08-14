export type ProjectOutreach = {
  slug: string;
  shortTitle: string;
  title: string;
  category: string;
  date: string;
  location: string;
  status: string;
  heroImage: string;
  secondaryImage: string;
  summary: string;
  description: string[];
  metrics: Array<{ icon: string; value: string; label: string }>;
  expectations: Array<{ icon: string; title: string; body: string }>;
  steps: Array<{ title: string; body: string; detail: string }>;
  gallery: Array<{ src: string; alt: string }>;
  faqs: Array<[string, string]>;
};

const images = {
  education:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCA7KQHl5sxpX799eLNbYZ0ev5K0U2uinFh-OXOm9Vc16KJqX106YPdpMJSsHDKk9qjhIZqiCEG0QwQ7ynl2ASmFyOrZ3rexuveWqTwIgYQH1GqOqXkdAVygEz2RVRYHf_Hhd-LNhs-RcL6R1wPe2V49taTew5BzdmHBrYnsdseXutaxUc_0JRF7fbVMsfw7CDR4U1uXGu--xEk750Wjo71A-ZdRBP8hETrduqrOp41HQnUbA59n2oCA",
  water:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA0eCmEkDEG_M5aeXAtJ8b1TDiDn3NQSzNwjMNnQHxkpwD53MCIeBKNuXrWiJ0xWtGHqWJiIZLEAnTwCGtkiaQ0kZx7N7H7HiIEcDqtRBuY9f_wee0QfhiOhzwF9qJpq5_ESwaNKn1YmEnSXEZ4ktz2lmrS__h8Av4YWZXyMqCKBLVySwusPYVrbgfTnIz6OGfXvArSCYReMBOq6pbgVeOVydI55-59rZhcfVByfOao-BiuUf3LZNyrdw",
  health:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCdIYlHU0r1pPf81EGne1bifk3SMmVrYQOfRbKmtRqkSbZ1GyPvsBn49fLI2ZBD_-FVHvkufatDS70uiW8IHdRX-pi3diGpKTzxoQwywAzg-Tevhl9TcpSbx_LZAkR4wke_LxE-Wbzvy-rakc5I1OPaQ4vgM15RV1LEj8CuyEptbXlv06_eshvhhCbfZN_mWIsLbwVvu4PKvFn423gqVg86musB_mLljAcuoyBDA_rZfjK5WktRz7l5A",
  community:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDK-DRJPTtY8fZkl0-2Z9ovuJDoGVFhHIvc9FyZ1ZqbZwbSL0051U1OUVlLXeSACe9_vo1TaHrNF0cOBGCyARZj8LR-SxO6NuZpOMr9ukhzu57HqTLcoENPYSFuCTaBLSFMCxTZIAY7b6t2Tin7M-mTd-9rBDBPfaSr6ogJVK52RoXJM-4VnLH7w7wQI_NXw1_1-A2x0Ps1sNpUf1jKbtYifC1CHUp_aHCK4mwtgJn7I0_XwTgr3MmFhA",
  about:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDkqkr_eKhXcFCdoH3DL7SSr3LLJXp5te4_ow7xkXTaxbWVwohdyEeQ18KUTB-Y8TSbP_5osvgFJNld0KVlFWNNbF-JzuZAhEcIbYztAXEfDEDdJRp7NpzSJhw5RshMLB6VYEvFM_9p3Dr1mgGziRDJdBeq6AAbOtkdxgjmwBe8richKMGU2Zej-nUO2i8tz5cZy5EVZo5lkYDnVbSwIo2gILCIRr5xg-dahMfct0xvuoLxpn64-lWIMQ",
  news: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrPnPr3180x9otLK7KATn1aA4MIYNTBkuXnqF5BXUY0ch3HtXHRIUNGw3uthQWh3apMzN0vFHvN1ZNAzIzbYvQXcqH3aEmDR7tdHI_nNF39yhiDSJByTpUaT7WgPt3jJn8i0yCfuBTLY4rn5E3AFaWYTxMoOWvdoZ-0d-zDbDwZJIFRPriaeP1cHdAcJhrzb-Zww5tadS9ZmIGlbZ2PyfSTWzMpKEVka6Sl_jiIaD93rsOZD-Za-Ag2g",
};

export const projects: ProjectOutreach[] = [
  {
    slug: "education-access",
    shortTitle: "Education Access Outreach",
    title: "New Beginnings School Learning Outreach",
    category: "Education",
    date: "July 20, 2026",
    location: "Kumasi, Ashanti Region",
    status: "Completed",
    heroImage: images.education,
    secondaryImage: images.about,
    summary:
      "A practical learning outreach providing materials, mentoring, and digital-skills sessions for students at New Beginnings School.",
    description: [
      "This outreach was designed with teachers and community leaders to address immediate learning-resource gaps while giving students access to encouragement, mentoring, and practical digital skills.",
      "Alongside the distribution of learning materials, volunteers led small-group sessions focused on study habits, confidence, creative problem-solving, and pathways into further education. Teachers also received reusable classroom resources for continued use after the outreach.",
    ],
    metrics: [
      { icon: "school", value: "185", label: "Students reached" },
      { icon: "menu_book", value: "420", label: "Learning kits supplied" },
      { icon: "diversity_3", value: "18", label: "Volunteer mentors" },
      { icon: "co_present", value: "6", label: "Skills workshops" },
    ],
    expectations: [
      {
        icon: "record_voice_over",
        title: "Mentoring and learning support",
        body: "Students work in small groups with volunteers on confidence, study skills, and future pathways.",
      },
      {
        icon: "devices",
        title: "Practical digital sessions",
        body: "Age-appropriate digital literacy activities introduce useful tools and responsible technology habits.",
      },
    ],
    steps: [
      {
        title: "Identify learning priorities",
        body: "Teachers and local leaders identify the most urgent material and learning-support gaps.",
        detail:
          "The team reviews class sizes, available resources, age groups, and the subjects where additional support can make the greatest practical difference.",
      },
      {
        title: "Prepare and deliver the outreach",
        body: "Materials, facilitators, and workshop plans are matched to the school timetable.",
        detail:
          "Volunteers receive role assignments and safeguarding guidance before supporting distribution, mentoring, and facilitated learning activities.",
      },
      {
        title: "Review learning outcomes",
        body: "Teacher feedback and participation records guide follow-up support.",
        detail:
          "The foundation documents resources delivered, participation, teacher observations, and recommendations for the next school engagement.",
      },
    ],
    gallery: [
      { src: images.education, alt: "Students receiving learning materials" },
      { src: images.about, alt: "A mentoring conversation during the outreach" },
      { src: images.community, alt: "Volunteers supporting a community session" },
      { src: images.news, alt: "Community members gathered at a program venue" },
      { src: images.health, alt: "A facilitator speaking with a parent and child" },
    ],
    faqs: [
      [
        "Can I donate learning materials to this project?",
        "Yes. Contact the team first so donated materials can be matched to current classroom needs.",
      ],
      [
        "Can education professionals volunteer?",
        "Yes. Teachers, mentors, facilitators, and digital-skills professionals can register through Get Involved.",
      ],
      [
        "Will the school receive follow-up support?",
        "Follow-up depends on teacher feedback, program priorities, and available resources after the initial outreach.",
      ],
      [
        "Can I sponsor a future school outreach?",
        "Yes. The partnership team can prepare a defined sponsorship scope for a future education program.",
      ],
    ],
  },
  {
    slug: "clean-water-access",
    shortTitle: "Clean Water Access",
    title: "Akwapim Clean Water & Sanitation Outreach",
    category: "Clean Water",
    date: "May 18, 2026",
    location: "Aburi, Eastern Region",
    status: "Completed",
    heroImage: images.water,
    secondaryImage: images.community,
    summary:
      "A community-led water and sanitation program combining reliable access points with hygiene education and local maintenance training.",
    description: [
      "The clean-water outreach brought residents, local leaders, technicians, and volunteers together around a shared goal: safer daily water access supported by practical local knowledge.",
      "Beyond infrastructure, the project included hygiene sessions, household water-storage guidance, and training for community stewards responsible for reporting faults and coordinating routine maintenance.",
    ],
    metrics: [
      { icon: "water_drop", value: "3", label: "Water points improved" },
      { icon: "groups", value: "640", label: "Residents reached" },
      { icon: "engineering", value: "22", label: "Local stewards trained" },
      { icon: "health_and_safety", value: "8", label: "Hygiene sessions" },
    ],
    expectations: [
      {
        icon: "plumbing",
        title: "Reliable local infrastructure",
        body: "Technicians assess water points and complete priority improvements with local oversight.",
      },
      {
        icon: "sanitizer",
        title: "Household hygiene education",
        body: "Families receive practical guidance on safe storage, sanitation, and protecting shared water sources.",
      },
    ],
    steps: [
      {
        title: "Assess water access and risks",
        body: "Local usage patterns and infrastructure conditions are documented.",
        detail:
          "Community consultations and technical inspections identify reliability, sanitation, and maintenance priorities before work begins.",
      },
      {
        title: "Implement improvements and training",
        body: "Repairs and education sessions are delivered alongside community stewards.",
        detail:
          "Local stewards participate throughout delivery so they understand the system, reporting process, and routine care requirements.",
      },
      {
        title: "Monitor reliability",
        body: "Stewards share maintenance updates and emerging concerns.",
        detail:
          "The foundation reviews reported faults, usage feedback, and hygiene-session outcomes to guide future support.",
      },
    ],
    gallery: [
      { src: images.water, alt: "Residents gathering at a clean water point" },
      { src: images.community, alt: "Community leaders participating in planning" },
      { src: images.health, alt: "A household health and hygiene session" },
      { src: images.education, alt: "Young people taking part in an education session" },
      { src: images.news, alt: "A community gathering during the outreach" },
    ],
    faqs: [
      [
        "Who maintains the water points after the outreach?",
        "Trained local stewards coordinate routine checks and report technical issues through agreed community channels.",
      ],
      [
        "Does the project include sanitation education?",
        "Yes. Hygiene, safe storage, sanitation, and protection of shared water sources are core parts of the outreach.",
      ],
      [
        "Can technical professionals volunteer?",
        "Yes. Relevant water, engineering, public-health, and training experience can support future programs.",
      ],
      [
        "How can a partner support another community?",
        "Contact the partnership team to discuss technical scope, funding, equipment, and suitable locations.",
      ],
    ],
  },
  {
    slug: "community-health-outreach",
    shortTitle: "Community Health Outreach",
    title: "Maternal & Family Health Outreach",
    category: "Healthcare",
    date: "March 9, 2026",
    location: "Ada Foah, Greater Accra Region",
    status: "Completed",
    heroImage: images.health,
    secondaryImage: images.about,
    summary:
      "A family health outreach providing screenings, maternal-care guidance, nutrition education, and supported referrals.",
    description: [
      "The health outreach created an accessible setting where families could speak with trained practitioners, receive basic screenings, and learn about maternal health, nutrition, child wellbeing, and preventive care.",
      "Cases requiring additional attention were connected to referral partners. Volunteers supported registration, participant flow, health education, documentation, and follow-up communication.",
    ],
    metrics: [
      { icon: "medical_services", value: "310", label: "Health screenings" },
      { icon: "pregnant_woman", value: "95", label: "Mothers supported" },
      { icon: "stethoscope", value: "14", label: "Health professionals" },
      { icon: "partner_exchange", value: "4", label: "Referral partners" },
    ],
    expectations: [
      {
        icon: "health_metrics",
        title: "Accessible basic screenings",
        body: "Participants receive checks and guidance in a respectful, community-based setting.",
      },
      {
        icon: "nutrition",
        title: "Family nutrition education",
        body: "Practical sessions connect everyday nutrition decisions with maternal and child wellbeing.",
      },
    ],
    steps: [
      {
        title: "Plan with local health partners",
        body: "Priority services and referral pathways are agreed before the outreach.",
        detail:
          "The team confirms practitioner roles, screening stations, safeguarding, privacy, equipment, and referral contacts.",
      },
      {
        title: "Deliver screening and education",
        body: "Families move through registration, screening, consultation, and learning stations.",
        detail:
          "Volunteers support an orderly and respectful experience while qualified practitioners provide all clinical guidance.",
      },
      {
        title: "Complete referrals and reporting",
        body: "Participants needing additional support receive clear next steps.",
        detail:
          "Program records capture participation, referrals, education sessions, and operational lessons without compromising personal dignity.",
      },
    ],
    gallery: [
      { src: images.health, alt: "A health worker speaking with a mother" },
      { src: images.about, alt: "A community support conversation" },
      { src: images.community, alt: "Families taking part in an outreach" },
      { src: images.news, alt: "Community members gathered for a program" },
      { src: images.education, alt: "Young participants at a foundation program" },
    ],
    faqs: [
      [
        "Are the screenings a replacement for hospital care?",
        "No. They provide basic checks and guidance; urgent or ongoing needs are referred to qualified healthcare providers.",
      ],
      [
        "Who provides clinical guidance?",
        "Clinical services are delivered by qualified practitioners and approved health partners.",
      ],
      [
        "Can health professionals volunteer?",
        "Yes. Registration is reviewed against the needs, responsibilities, and professional requirements of each outreach.",
      ],
      [
        "How are participant details protected?",
        "The team limits data collection, uses it only for program delivery, and prioritizes privacy and dignity.",
      ],
    ],
  },
  {
    slug: "community-support-drive",
    shortTitle: "Community Support Drive",
    title: "Community Food & Livelihood Support Drive",
    category: "Community Support",
    date: "January 27, 2026",
    location: "Cape Coast, Central Region",
    status: "Completed",
    heroImage: images.community,
    secondaryImage: images.news,
    summary:
      "A coordinated outreach combining household food support with practical livelihood starter resources and community referrals.",
    description: [
      "The support drive responded to immediate household needs while creating pathways toward greater stability. Community representatives helped identify priorities and organize dignified distribution.",
      "Selected participants also joined livelihood sessions covering budgeting, small-enterprise planning, local support networks, and the responsible use of starter resources.",
    ],
    metrics: [
      { icon: "family_restroom", value: "240", label: "Households reached" },
      { icon: "restaurant", value: "3,600", label: "Meals supported" },
      { icon: "business_center", value: "36", label: "Livelihood starter kits" },
      { icon: "volunteer_activism", value: "28", label: "Volunteers involved" },
    ],
    expectations: [
      {
        icon: "grocery",
        title: "Dignified household support",
        body: "Distribution is organized with local representatives around clear household priorities.",
      },
      {
        icon: "storefront",
        title: "Livelihood starter guidance",
        body: "Participants receive practical planning support alongside selected starter resources.",
      },
    ],
    steps: [
      {
        title: "Coordinate local priorities",
        body: "Community representatives help define needs and a transparent delivery approach.",
        detail:
          "The team confirms intended households, distribution logistics, safeguarding considerations, and available referral pathways.",
      },
      {
        title: "Deliver support and workshops",
        body: "Volunteers coordinate distribution while facilitators lead livelihood sessions.",
        detail:
          "Activities are scheduled to minimize waiting and support a calm, respectful experience for participating households.",
      },
      {
        title: "Review and connect follow-up",
        body: "Feedback and referrals identify opportunities for continued support.",
        detail:
          "The team documents delivery totals, participation, local feedback, referrals, and recommendations for future community work.",
      },
    ],
    gallery: [
      { src: images.community, alt: "Volunteers supporting a community distribution" },
      { src: images.news, alt: "A community gathering at a support hub" },
      { src: images.about, alt: "A support conversation with a community member" },
      { src: images.health, alt: "A family receiving practical guidance" },
      { src: images.water, alt: "Residents participating in a foundation program" },
    ],
    faqs: [
      [
        "How are participating households identified?",
        "Community representatives and program partners help assess needs using the criteria agreed for each outreach.",
      ],
      [
        "Can food or household items be donated?",
        "Contact the team before donating goods so items can be matched to a current need and delivery plan.",
      ],
      [
        "What is included in a livelihood starter kit?",
        "Contents vary by the participant plan, local opportunity, funding, and the practical purpose of each kit.",
      ],
      [
        "Can companies sponsor a support drive?",
        "Yes. Corporate partners can discuss funding, goods, logistics, volunteers, or livelihood resources with our team.",
      ],
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
