-- Seed: the foundation's existing content, moved out of src/data/projects.ts and
-- src/routes/news.tsx into the tables the site now reads from.
--
-- Written as a migration rather than a script so the same content lands in the
-- local and remote databases by the same command that created the tables, and so
-- a fresh database is never empty. INSERT OR IGNORE makes a re-run harmless and,
-- more importantly, stops a replay from overwriting edits made since in /admin.

INSERT OR IGNORE INTO projects (
  slug, short_title, title, category, date, sort_date, location, status,
  hero_image, secondary_image, summary, description, metrics, expectations, steps, faqs
) VALUES (
  'krofrom-christmas-outreach', 'Krofrom Christmas Outreach', 'Christmas at Krofrom: Sharing a Festive Meal', 'Community',
  'December 25, 2025', '2025-12-25', 'Krofrom, Kumasi', 'Completed',
  'krofrom-christmas-outreach/hero', 'krofrom-christmas-outreach/secondary',
  'A Christmas Day meal shared with people living with drug and substance addiction, serving over 100 plates of food and drinks.',
  '["On Christmas Day 2025, the Life Story Foundation spent the season at Krofrom in Kumasi with people who are struggling with drug and substance addiction — a group too often left out of the celebrations happening around them.","The Foundation believes in treating everyone with respect and compassion, and in extending help to all who reach out. It was a joyful occasion: over 100 plates of food and drinks were served, and love and cheer were shared at every table."]',
  '[{"icon":"restaurant","value":"100+","label":"Plates of food and drinks served"}]',
  '[{"icon":"volunteer_activism","title":"Dignity first","body":"Everyone who came was received with respect, without conditions attached to sitting down and eating."},{"icon":"diversity_3","title":"A shared table","body":"Volunteers ate alongside guests rather than serving from a distance, so the day felt like a celebration rather than a handout."}]',
  '[{"title":"Meeting the community","body":"The Foundation went to Krofrom rather than asking people to travel.","detail":"Holding the meal where people already are removes the barrier that keeps many from attending."},{"title":"Preparing and serving","body":"Food and drinks were prepared for the day and served to everyone who came.","detail":"Over 100 plates went out across the celebration."},{"title":"Staying for the day","body":"Volunteers remained through the meal, sharing the occasion with those who attended.","detail":"The aim was company, not just catering."}]',
  '[["Where and when did this outreach take place?","At Krofrom in Kumasi, on Christmas Day — December 25, 2025."],["Who did the Foundation serve?","Individuals living with drug and substance addiction. The Foundation aims to extend help and show love to all who reach out to us, and this outreach was part of that commitment."],["How much food was provided?","Over 100 plates of food and drinks were served across the day."]]'
);

INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('krofrom-christmas-outreach-01', 'krofrom-christmas-outreach', 'krofrom-christmas-outreach/01', 'Foundation volunteers and community members gathered together at the Krofrom outreach', 0);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('krofrom-christmas-outreach-02', 'krofrom-christmas-outreach', 'krofrom-christmas-outreach/02', 'Volunteers and guests seated together during the Christmas celebration', 1);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('krofrom-christmas-outreach-03', 'krofrom-christmas-outreach', 'krofrom-christmas-outreach/03', 'The gathering seated in front of the Giving Back to Society banner', 2);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('krofrom-christmas-outreach-04', 'krofrom-christmas-outreach', 'krofrom-christmas-outreach/04', 'Guests seated at a table with drinks during the festive meal', 3);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('krofrom-christmas-outreach-05', 'krofrom-christmas-outreach', 'krofrom-christmas-outreach/05', 'A Life Story Foundation volunteer with a member of the Krofrom community', 4);

INSERT OR IGNORE INTO projects (
  slug, short_title, title, category, date, sort_date, location, status,
  hero_image, secondary_image, summary, description, metrics, expectations, steps, faqs
) VALUES (
  'books-and-pens', 'Books & Pens Donation', 'Books and Pens for Breman M/A Basic School', 'Education',
  'December 12, 2022', '2022-12-12', 'Breman M/A Basic School, Kumasi', 'Completed',
  'books-and-pens/hero', 'books-and-pens/secondary',
  'Exercise books and pens donated to over 200 pupils at Breman M/A Basic School in Kumasi, to support their learning.',
  '["On December 12, 2022, the Life Story Charitable Foundation visited Breman M/A Basic School in Kumasi with exercise books and pens for the pupils.","Over two hundred pupils received materials that day. The donation was made with love, to enhance their learning and to ease one of the practical costs that can stand between a child and their schoolwork."]',
  '[{"icon":"school","value":"200+","label":"Pupils reached"},{"icon":"menu_book","value":"Books & pens","label":"Materials donated"}]',
  '[{"icon":"menu_book","title":"Materials that get used","body":"Exercise books and pens are what pupils need daily, and what families most often have to find money for."},{"icon":"groups","title":"Handed over in person","body":"Volunteers distributed the materials to pupils directly at the school."}]',
  '[{"title":"Working with the school","body":"The Foundation arranged the visit with Breman M/A Basic School.","detail":"Going through the school keeps distribution orderly and reaches the pupils who are enrolled."},{"title":"Preparing the materials","body":"Exercise books and pens were gathered and packed ahead of the visit.","detail":"Enough was prepared to reach more than two hundred pupils."},{"title":"Distribution day","body":"Volunteers handed materials to pupils across the school on December 12, 2022.","detail":"Pupils received their books and pens directly."}]',
  '[["Which school received the donation?","Breman M/A Basic School in Kumasi, on December 12, 2022."],["How many pupils received materials?","Over two hundred pupils."],["What was donated?","Exercise books and pens, given to support the pupils'' day-to-day learning."]]'
);

INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('books-and-pens-01', 'books-and-pens', 'books-and-pens/01', 'Pupils at Breman M/A Basic School holding up their new exercise books', 0);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('books-and-pens-02', 'books-and-pens', 'books-and-pens/02', 'A volunteer handing exercise books to a pupil during the distribution', 1);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('books-and-pens-03', 'books-and-pens', 'books-and-pens/03', 'Pupils smiling with the exercise books they received', 2);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('books-and-pens-04', 'books-and-pens', 'books-and-pens/04', 'Schoolchildren displaying their donated exercise books', 3);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('books-and-pens-05', 'books-and-pens', 'books-and-pens/05', 'Stacks of exercise books prepared for distribution', 4);

INSERT OR IGNORE INTO projects (
  slug, short_title, title, category, date, sort_date, location, status,
  hero_image, secondary_image, summary, description, metrics, expectations, steps, faqs
) VALUES (
  'remar-childrens-home', 'Remar Children''s Home Visit', 'A Day at Remar Children''s Home', 'Children & Welfare',
  'September 16, 2020', '2020-09-16', 'Remar Kumasi Children''s Home, Patasi, Kumasi', 'Completed',
  'remar-childrens-home/hero', 'remar-childrens-home/secondary',
  'Foodstuffs and grocery items donated to Remar Kumasi Children''s Home in Patasi, on the birthday of the Foundation''s founder.',
  '["On September 16, 2020, the Life Story Charitable Foundation spent a day at the Remar Kumasi Children''s Home in Patasi, Kumasi, donating foodstuffs and grocery items.","The visit was made alongside Mr. Aboagye Divine, Founder and CEO of Life Story Group, and fell on his birthday — a day he chose to spend sharing love and kindness with the children of the home. In the Foundation''s own words, there is no joy or lessons to be learned anywhere quite like the orphanage."]',
  '[{"icon":"shopping_basket","value":"Foodstuffs & groceries","label":"Donated"}]',
  '[{"icon":"shopping_basket","title":"Provisions for the home","body":"Foodstuffs and grocery items that go directly into the home''s day-to-day running."},{"icon":"favorite","title":"Time with the children","body":"The day was spent at the home rather than dropping off supplies and leaving."}]',
  '[{"title":"Arranging the visit","body":"The Foundation arranged the day with Remar Kumasi Children''s Home in Patasi.","detail":"Coordinating with the home means the donation matches what it actually needs."},{"title":"Gathering provisions","body":"Foodstuffs and grocery items were assembled for the home.","detail":"Staples chosen to last beyond the day of the visit."},{"title":"Spending the day","body":"Volunteers handed over the donation and stayed with the children.","detail":"The visit fell on the founder''s birthday, September 16, 2020."}]',
  '[["Where did this visit take place?","Remar Kumasi Children''s Home in Patasi, Kumasi, on September 16, 2020."],["What was donated?","Foodstuffs and grocery items from the Life Story Charitable Foundation."],["Why that date?","September 16 is the birthday of Mr. Aboagye Divine, Founder and CEO of Life Story Group, who spent the day at the home with the children."]]'
);

INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('remar-childrens-home-01', 'remar-childrens-home', 'remar-childrens-home/01', 'Children and volunteers together during the visit to Remar Children''s Home', 0);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('remar-childrens-home-02', 'remar-childrens-home', 'remar-childrens-home/02', 'Children seated with volunteers at the home', 1);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('remar-childrens-home-03', 'remar-childrens-home', 'remar-childrens-home/03', 'Children of Remar Kumasi Children''s Home during the visit', 2);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('remar-childrens-home-04', 'remar-childrens-home', 'remar-childrens-home/04', 'A child at Remar Kumasi Children''s Home on the day of the visit', 3);
INSERT OR IGNORE INTO project_photos (id, project_slug, src, alt, position) VALUES ('remar-childrens-home-05', 'remar-childrens-home', 'remar-childrens-home/05', 'Children and volunteers sharing the day together', 4);

INSERT OR IGNORE INTO news (id, title, date, sort_date, body, image) VALUES (
  'community-hub', 'Opening the New Community Hub in Kumasi', 'October 24, 2024', '2024-10-24',
  'The new hub gives families a shared place for tutoring, skills workshops, and local meetings.', 'news1'
);
INSERT OR IGNORE INTO news (id, title, date, sort_date, body, image) VALUES (
  'digital-divide', 'Bridging the Digital Divide with 50 New Laptops', 'October 12, 2024', '2024-10-12',
  'Students and teachers can now access digital learning resources through a locally managed computer program.', 'news2'
);
INSERT OR IGNORE INTO news (id, title, date, sort_date, body, image) VALUES (
  'volunteer-program', 'Volunteer Program Applications Are Open', 'September 28, 2024', '2024-09-28',
  'Our next volunteer intake supports education, community health, communications, and project coordination.', 'news3'
);
