import { useState } from "react";
import { Icon, MotionReveal } from "./motion";

const ctaBg = "https://lh3.googleusercontent.com/aida-public/AB6AXuA2T-BIPmm9vR1mFOCYv0F4f7tWZgI3hPQK-r-4nSj6H5UKLwedKGVub514pTo5jEbyFBQYMtw4i-3kEPQ8zQqUBECGR4f4aQe7tgN_fxmVhN3vXj33cZkzUs0KMnUCHXrNKsJV3WoAGzb_Ob49WOnSzkEYBYtmRweAlsrww6KLkql3CcVUcOI7-zpsWRQAJxfjN3NGk_5y8-ohDI0Trb4q9ZxZAzPnS8NMotI5w9E3iO6ZMfhlChhMzA";
const t1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuBoPaOmA2ZZb_-Mu-pHCyKK_KAAhGeddqDJgeffhM9xKTZVXJJO1DDsvayRmlXkfrA9Ljn5R2-8YZfEq5dj-iyVTG9apF_CXmUR0cEt8xDFRactSSisfURUbPELvFx6mUbxl8cp1Bj_OOkecidaWf2bVdSq1-cdk7oAOpm1coirYHa84u2eGDRFqV9INN7vkn80KzzgYAxLkoyZS7Ofw_ZlBMcuFYnL-pSlw5P4txjU6vHegdVYIu_VRA";
const t2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuB1MwQg7YMZFjjEFF-VfsVU78YQJe3LrRefpj1Z-fYhNJWQe18sNIpy65iSUamvePSr2DnzlzwhxOBz4R8dheoGT57uLsDvgLvDwYJYYdOD-M-6I4cuJT3gEljRi_OlkYdl0INQwtJTZk7YatAYyPwRdzpoW-RNHn7PKQ648isKFTsIEnnWsokGp2jG1GNRkRVj5zU1Kl8YPdmdRxVAcRhNPx9e5bb2QpjZiOuziFODiaAyU6W3EDKV8g";
const news1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCrPnPr3180x9otLK7KATn1aA4MIYNTBkuXnqF5BXUY0ch3HtXHRIUNGw3uthQWh3apMzN0vFHvN1ZNAzIzbYvQXcqH3aEmDR7tdHI_nNF39yhiDSJByTpUaT7WgPt3jJn8i0yCfuBTLY4rn5E3AFaWYTxMoOWvdoZ-0d-zDbDwZJIFRPriaeP1cHdAcJhrzb-Zww5tadS9ZmIGlbZ2PyfSTWzMpKEVka6Sl_jiIaD93rsOZD-Za-Ag2g";
const news2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuALqinUzqYCOxqFynwS9hKbbMPPQu3LHvmzIgT8kMLVbBcou0GhwhWHg7rl8MsLo-7ZHd197ZliLYLf40K_qi-p6ETPeYaiYauWOwDEvgaGQvwEfGy9aTEHUZGYJCWHhFDrVELN2qBkvpFSdHg5mh1DuTOa4JjOBKXCdgxSZA2ihCjkwUZ_XAXQ3WiBEBD2wTK-sggXWEoTw1PXgae0wFJlfdJR4zTohXjaqtQwQ3Tu94HbJ-WVyYXyRA";
const news3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuBaIVrTzUS7XK2lifzCg3gKVubYIgHHMCwsKIQ2mdIJ2fS-dvvXC3lbhBPpEgL3YlqWDWP4NgF8nAc6M1qoz2maJXm2vyF2Pu8CgAkieyyyxrXlnMLkTxYI8AzzhdMcyWB8Pow0mVake7LhUg1i2FIF3rPwKBi2Q8XsiMH-qLFH1KPI0eZvdPSd-QMcvL9egBPJaiiuDVAyL15weQIWI5Ys6D_wSzvZVi8ff67cGxwsVtYl63SXCoAlMw";
const causeWater = "https://lh3.googleusercontent.com/aida-public/AB6AXuA0eCmEkDEG_M5aeXAtJ8b1TDiDn3NQSzNwjMNnQHxkpwD53MCIeBKNuXrWiJ0xWtGHqWJiIZLEAnTwCGtkiaQ0kZx7N7H7HiIEcDqtRBuY9f_wee0QfhiOhzwF9qJpq5_ESwaNKn1YmEnSXEZ4ktz2lmrS__h8Av4YWZXyMqCKBLVySwusPYVrbgfTnIz6OGfXvArSCYReMBOq6pbgVeOVydI55-59rZhcfVByfOao-BiuUf3LZNyrdw";

export function ImpactBand() {
  const stats = [["6+", "Years of Impact"], ["500+", "Children Supported"], ["20+", "Active Projects"], ["15+", "Trusted Partners"]];
  return (
    <section className="bg-navy-900 py-section-desktop text-surface">
      <div className="mx-auto max-w-max-width px-6">
        <MotionReveal className="mb-10 text-center motion-enter-up" delay={0.06}>
          <span className="mb-1 block font-overline text-overline text-gold-500">OUR REACH</span>
          <h2 className="font-display text-h1 text-white">Making a real difference</h2>
        </MotionReveal>
        <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map(([n, l], i) => (
            <MotionReveal key={l} className="motion-enter-up" delay={0.12 + i * 0.1}>
              <div className="mb-1 font-display text-display text-gold-500">{n}</div>
              <div className="font-overline text-overline uppercase tracking-widest text-surface-variant">{l}</div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureGrid() {
  const features = [
    { icon: "school", title: "Education Programs", body: "Empowering young minds through quality schooling, vocational training, and mentorship." },
    { icon: "health_and_safety", title: "Health Initiatives", body: "Providing essential medical care, nutrition support, and wellness education." },
    { icon: "water_drop", title: "Clean Water Projects", body: "Securing sustainable access to safe drinking water in rural areas." },
    { icon: "groups", title: "Community Building", body: "Strengthening local governance and empowering grassroots leadership." },
  ];
  return (
    <section className="bg-surface-muted py-section-desktop">
      <div className="mx-auto max-w-max-width px-6">
        <MotionReveal className="mb-10 text-center motion-enter-up" delay={0.06}>
          <span className="mb-1 block font-overline text-overline uppercase text-primary">WHAT WE DO</span>
          <h2 className="font-display text-h1 text-navy-900">Customize to anyone&apos;s different target</h2>
        </MotionReveal>
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <MotionReveal key={f.title} className="group motion-enter-up motion-lift rounded-2xl border border-border bg-white p-6 shadow-sm" delay={0.1 + i * 0.1}>
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-primary/10">
                <Icon name={f.icon} filled className="text-[28px] text-primary" />
              </div>
              <h3 className="mb-2 font-display text-h3 text-navy-900">{f.title}</h3>
              <p className="font-body-sm text-on-surface-variant">{f.body}</p>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function News() {
  const posts = [
    { img: news1, date: "October 24, 2024", title: "Opening the New Community Hub in Kumasi", href: "/news#community-hub" },
    { img: news2, date: "October 12, 2024", title: "Bridging the Digital Divide: 50 New Laptops Donated", href: "/news#digital-divide" },
    { img: news3, date: "September 28, 2024", title: "Join Our Winter Volunteer Program: Applications Open", href: "/news#volunteer-program" },
  ];
  return (
    <section className="bg-surface-page py-section-desktop">
      <div className="mx-auto max-w-max-width px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="mb-1 block font-overline text-overline uppercase text-primary">RECENT UPDATES</span>
            <h2 className="font-display text-h1 text-navy-900">Helpful local newsletter</h2>
          </div>
          <a href="/news" className="flex items-center gap-2 font-semibold text-primary">Read all posts <Icon name="chevron_right" /></a>
        </div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {posts.map((p, i) => (
            <MotionReveal as="article" key={p.title} className="group cursor-pointer motion-enter-up" delay={0.1 + i * 0.12}>
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mb-2 text-body-sm text-ink-500">{p.date}</div>
              <h3 className="mb-4 font-display text-h3 leading-tight text-navy-900 transition-colors group-hover:text-primary">{p.title}</h3>
              <a href={p.href} className="flex items-center gap-1 font-h4 text-body-sm text-primary">Read more <Icon name="arrow_right_alt" className="text-[18px]" /></a>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DepthKnowledge() {
  return (
    <section className="bg-navy-900 py-section-desktop text-surface">
      <div className="mx-auto grid max-w-max-width grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <MotionReveal className="aspect-[4/3] overflow-hidden rounded-2xl motion-enter-right" delay={0.12}>
          <img src={causeWater} alt="Workshop" className="h-full w-full object-cover" />
        </MotionReveal>
        <MotionReveal className="space-y-6 motion-enter-left" delay={0.18}>
          <span className="block font-overline text-overline text-gold-500">WORKSHOPS</span>
          <h2 className="font-display text-h1 text-white">More in-depth knowledge with a workshop</h2>
          <p className="font-body text-body-lg text-surface-variant">Gain hands-on experience and learn from community leaders who have transformed their villages through sustainable practices.</p>
          <a href="/get-involved#workshops" className="inline-flex items-center gap-3 rounded-full bg-gold-500 px-8 py-3 font-h4 text-h4 text-ink-900 transition-all hover:-translate-y-0.5 hover:bg-gold-600">
            Join a Workshop <Icon name="arrow_forward" />
          </a>
        </MotionReveal>
      </div>
    </section>
  );
}

export function DonationCta() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const amounts = [10, 25, 50, 100, 250];
  return (
    <section className="bg-surface-muted py-section-desktop">
      <div className="mx-auto max-w-max-width px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <MotionReveal className="space-y-4 motion-enter-right" delay={0.1}>
            <span className="block font-overline text-overline uppercase tracking-widest text-primary">MAKE A DIFFERENCE</span>
            <h2 className="font-display text-h1 text-navy-900">Your kindness starts with a <span className="italic text-gold-600">meaningful</span> donation</h2>
            <p className="font-body text-body text-on-surface-variant">Every donation, no matter the size, directly funds education, clean water, and healthcare for children and families in Ghana.</p>
          </MotionReveal>
          <MotionReveal className="rounded-3xl bg-navy-900 p-8 shadow-2xl motion-enter-left" delay={0.2}>
            <h3 className="mb-6 text-center font-display text-h3 text-white">Choose an amount</h3>
            <div className="mb-6 grid grid-cols-5 gap-2">
              {amounts.map((a) => (
                <button key={a} onClick={() => setSelectedAmount(a)} className={`rounded-xl py-3 text-sm font-semibold transition-all ${selectedAmount === a ? "bg-gold-500 text-ink-900" : "bg-surface/10 text-surface hover:bg-surface/20"}`}>
                  GH₵{a}
                </button>
              ))}
            </div>
            <div className="mb-4 space-y-3">
              <input type="text" placeholder="Full name" className="h-12 w-full rounded-xl border border-surface/20 bg-surface/10 px-4 text-white placeholder:text-surface-variant focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold-500" />
              <input type="email" placeholder="Email address" className="h-12 w-full rounded-xl border border-surface/20 bg-surface/10 px-4 text-white placeholder:text-surface-variant focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
            <a href={`/donate?amount=${selectedAmount}`} className="block w-full rounded-xl bg-gold-500 py-4 text-center font-h4 text-h4 text-ink-900 transition-all hover:bg-gold-600">Donate GH₵{selectedAmount}</a>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const items = [
    { img: t1, quote: "Partnering with Life Story has allowed us to see real change on the ground. Their transparency and dedication is truly inspirational.", name: "Kojo Boateng", role: "Regional Community Lead" },
    { img: t2, quote: "The scholarship program changed my daughter's life. Now she wants to be a doctor to help her own community.", name: "Ama Serwaa", role: "Beneficiary Mother" },
    { img: t1, quote: "Life Story's clean water project transformed our village. Our children no longer walk miles for water.", name: "Kwame Mensah", role: "Village Chief" },
  ];
  return (
    <section className="mx-auto max-w-max-width px-6 py-section-desktop">
      <MotionReveal className="mb-10 text-center motion-enter-up" delay={0.06}>
        <span className="mb-1 block font-overline text-overline uppercase text-primary">TESTIMONIALS</span>
        <h2 className="font-display text-h1 text-navy-900">Your kindness moved</h2>
      </MotionReveal>
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        {items.map((t, i) => (
          <MotionReveal key={t.name + i} className="flex flex-col items-center rounded-2xl border border-border bg-white p-8 text-center shadow-sm motion-enter-up" delay={0.12 + i * 0.1}>
            <img src={t.img} alt={t.name} className="mb-4 h-16 w-16 rounded-full border-4 border-surface-page object-cover shadow-sm" />
            <Icon name="format_quote" className="mb-3 text-[32px] text-gold-500 opacity-30" />
            <p className="mb-4 text-body text-on-surface-variant italic">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-auto">
              <div className="font-h4 text-navy-900">{t.name}</div>
              <div className="font-body-sm text-on-surface-variant">{t.role}</div>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative flex h-96 items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-10 bg-navy-900/70" />
      <img src={ctaBg} alt="Ghana landscape" className="motion-zoom-out absolute inset-0 z-0 h-full w-full object-cover" />
      <MotionReveal className="relative z-20 px-6 text-center motion-enter-up" delay={0.12}>
        <h2 className="mx-auto mb-8 max-w-2xl font-display text-h1 leading-tight text-white">
          Putting some heart for a <span className="italic text-gold-500">safe place</span>
        </h2>
        <a href="/donate" className="inline-block transform rounded-full bg-gold-500 px-8 py-4 font-h4 text-h4 text-ink-900 shadow-xl transition-all hover:scale-105 hover:bg-gold-600">Donate Now</a>
      </MotionReveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-900 pt-16 text-surface-variant">
      <div className="mx-auto grid max-w-max-width grid-cols-1 gap-10 px-6 pb-12 md:grid-cols-4">
        <MotionReveal className="motion-enter-up" delay={0.05}>
          <a href="/" className="mb-5 inline-flex">
            <img
              src="/490944534_1259268959535099_5059518161237736784_n.jpg"
              alt="Life Story Foundation"
              width="877"
              height="620"
              loading="lazy"
              className="h-24 w-auto rounded-md bg-white object-contain p-2"
            />
          </a>
          <p className="text-body-sm">A Ghana-based non-profit rewriting stories through education, healthcare, and clean water.</p>
        </MotionReveal>
        <MotionReveal className="motion-enter-up" delay={0.12}>
          <h4 className="mb-4 font-h4 text-white">Explore</h4>
          <ul className="space-y-2 text-body-sm">
            {[
              ["About Us", "/about"],
              ["Projects", "/projects"],
              ["News", "/news"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={label}><a href={href} className="hover:text-gold-500">{label}</a></li>
            ))}
          </ul>
        </MotionReveal>
        <MotionReveal className="motion-enter-up" delay={0.18}>
          <h4 className="mb-4 font-h4 text-white">Get Involved</h4>
          <ul className="space-y-2 text-body-sm">
            {[
              ["Donate", "/donate"],
              ["Volunteer", "/get-involved#volunteer"],
              ["Partner", "/get-involved#partner"],
              ["Fundraise", "/get-involved#fundraise"],
            ].map(([label, href]) => (
              <li key={label}><a href={href} className="hover:text-gold-500">{label}</a></li>
            ))}
          </ul>
        </MotionReveal>
        <MotionReveal className="motion-enter-up" delay={0.24}>
          <h4 className="mb-4 font-h4 text-white">Contact</h4>
          <ul className="space-y-2 text-body-sm">
            <li className="flex items-start gap-2"><Icon name="location_on" className="text-gold-500" /> Accra, Ghana</li>
            <li><a href="mailto:contact@lifestory.org" className="flex items-start gap-2 hover:text-gold-500"><Icon name="mail" className="text-gold-500" /> contact@lifestory.org</a></li>
            <li><a href="tel:+233000000000" className="flex items-start gap-2 hover:text-gold-500"><Icon name="call" className="text-gold-500" /> +233 000 000 000</a></li>
          </ul>
        </MotionReveal>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-body-sm">© {new Date().getFullYear()} Life Story Foundation. All rights reserved.</div>
    </footer>
  );
}
