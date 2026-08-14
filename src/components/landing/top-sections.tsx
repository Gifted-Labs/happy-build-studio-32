import { useEffect, useState, type FormEvent } from "react";
import { Icon, MotionReveal } from "./motion";

const heroImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuCUiZedOspvoax75aOqwYEAFd9x4ocwb3duusyDUWcEc_LY_BBnxV_-jppwffBln-IGF7JMwIEsoRQihY23Ad3czGWNXu6gLBpjvXB9z-Z8uzhQzCPUSqKj09peffHRsseDD0M5O3DzZS4Dm7zIyxeun3EtiwkoSARW_Fg8VY8jbBACqcLc6Je1lyk4si_l_rEgbgN2TRCgVYJXXwsxESfXIztIvGahChHAOKE7JZs9TDQlXlQZ-O3ZuQ";
const aboutImg1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuDkqkr_eKhXcFCdoH3DL7SSr3LLJXp5te4_ow7xkXTaxbWVwohdyEeQ18KUTB-Y8TSbP_5osvgFJNld0KVlFWNNbF-JzuZAhEcIbYztAXEfDEDdJRp7NpzSJhw5RshMLB6VYEvFM_9p3Dr1mgGziRDJdBeq6AAbOtkdxgjmwBe8richKMGU2Zej-nUO2i8tz5cZy5EVZo5lkYDnVbSwIo2gILCIRr5xg-dahMfct0xvuoLxpn64-lWIMQ";
const aboutImg2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuDK-DRJPTtY8fZkl0-2Z9ovuJDoGVFhHIvc9FyZ1ZqbZwbSL0051U1OUVlLXeSACe9_vo1TaHrNF0cOBGCyARZj8LR-SxO6NuZpOMr9ukhzu57HqTLcoENPYSFuCTaBLSFMCxTZIAY7b6t2Tin7M-mTd-9rBDBPfaSr6ogJVK52RoXJM-4VnLH7w7wQI_NXw1_1-A2x0Ps1sNpUf1jKbtYifC1CHUp_aHCK4mwtgJn7I0_XwTgr3MmFhA";
const causeEdu = "https://lh3.googleusercontent.com/aida-public/AB6AXuBCA7KQHl5sxpX799eLNbYZ0ev5K0U2uinFh-OXOm9Vc16KJqX106YPdpMJSsHDKk9qjhIZqiCEG0QwQ7ynl2ASmFyOrZ3rexuveWqTwIgYQH1GqOqXkdAVygEz2RVRYHf_Hhd-LNhs-RcL6R1wPe2V49taTew5BzdmHBrYnsdseXutaxUc_0JRF7fbVMsfw7CDR4U1uXGu--xEk750Wjo71A-ZdRBP8hETrduqrOp41HQnUbA59n2oCA";
const causeWater = "https://lh3.googleusercontent.com/aida-public/AB6AXuA0eCmEkDEG_M5aeXAtJ8b1TDiDn3NQSzNwjMNnQHxkpwD53MCIeBKNuXrWiJ0xWtGHqWJiIZLEAnTwCGtkiaQ0kZx7N7H7HiIEcDqtRBuY9f_wee0QfhiOhzwF9qJpq5_ESwaNKn1YmEnSXEZ4ktz2lmrS__h8Av4YWZXyMqCKBLVySwusPYVrbgfTnIz6OGfXvArSCYReMBOq6pbgVeOVydI55-59rZhcfVByfOao-BiuUf3LZNyrdw";
const causeHealth = "https://lh3.googleusercontent.com/aida-public/AB6AXuBCdIYlHU0r1pPf81EGne1bifk3SMmVrYQOfRbKmtRqkSbZ1GyPvsBn49fLI2ZBD_-FVHvkufatDS70uiW8IHdRX-pi3diGpKTzxoQwywAzg-Tevhl9TcpSbx_LZAkR4wke_LxE-Wbzvy-rakc5I1OPaQ4vgM15RV1LEj8CuyEptbXlv06_eshvhhCbfZN_mWIsLbwVvu4PKvFn423gqVg86musB_mLljAcuoyBDA_rZfjK5WktRz7l5A";

function handleSiteSearch(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const input = event.currentTarget.elements.namedItem("site-search") as HTMLInputElement;
  const query = input.value.trim().toLowerCase();

  if (!query) {
    input.setCustomValidity("Enter a topic to search for.");
    input.reportValidity();
    return;
  }

  const sections = Array.from(document.querySelectorAll<HTMLElement>("main section")).slice(1);
  const match = sections.find((section) => section.textContent?.toLowerCase().includes(query));

  if (!match) {
    input.setCustomValidity("No matching section was found.");
    input.reportValidity();
    return;
  }

  input.setCustomValidity("");
  match.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function DynamicIslandNav() {
  const navigation = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "h-16 bg-navy-900/95 shadow-lg backdrop-blur-xl"
          : "h-20 bg-gradient-to-b from-navy-900/70 to-navy-900/10 backdrop-blur-[2px]"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-max-width items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/life-story-bird-white.png"
            alt=""
            width="895"
            height="990"
            className={`w-auto object-contain transition-all duration-300 ${
              scrolled ? "h-12" : "h-14"
            }`}
          />
          <span className="uppercase leading-none text-white">
            <strong className="block font-display text-base sm:text-lg">Life Story</strong>
            <span className="mt-1 block text-[0.625rem] font-semibold sm:text-xs">Foundation</span>
          </span>
        </a>
        <div className={`hidden items-center md:flex ${scrolled ? "gap-6" : "gap-8"}`}>
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-white/90 transition-colors duration-300 hover:text-gold-500"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="/donate"
          className={`flex items-center gap-2 rounded-full bg-gold-500 font-semibold text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-600 ${
            scrolled ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm"
          }`}
        >
          <Icon name="volunteer_activism" className="text-[18px]" />
          Donate
        </a>
      </div>
    </nav>
  );
}

export function Hero() {
  return (
    <section className="relative flex h-[clamp(640px,calc(100svh-40px),780px)] items-center bg-navy-900 pb-32 pt-28">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="motion-zoom-out h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImg}')` }}
        />
      </div>
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.22 0.08 254 / 0.96) 0%, oklch(0.22 0.08 254 / 0.78) 34%, oklch(0.22 0.08 254 / 0.18) 64%, transparent 82%)",
        }}
      />
      <div className="relative z-20 mx-auto w-full max-w-max-width px-6">
        <div className="max-w-[760px] text-surface">
          <MotionReveal
            as="h1"
            className="mb-6 font-display text-[2.25rem] uppercase leading-[1.05] motion-enter-up md:text-[3.75rem]"
            delay={0.18}
          >
            Turning small contributions into <span className="text-gold-500">meaningful impact</span>{" "}
            every day
          </MotionReveal>
          <MotionReveal as="p" className="mb-8 max-w-lg font-body text-body-lg text-surface-variant motion-enter-up" delay={0.28}>
            Every child deserves a future defined by opportunity, not poverty. Join us in providing education, healthcare, and clean water to communities in Ghana.
          </MotionReveal>
          <MotionReveal className="flex flex-wrap gap-4 motion-enter-up" delay={0.38}>
            <a href="/donate" className="flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 font-h4 text-h4 text-ink-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gold-600">Donate Now <Icon name="arrow_forward" /></a>
            <a href="/projects" className="rounded-full border-2 border-surface/30 px-8 py-4 font-h4 text-h4 text-surface transition-all duration-300 hover:-translate-y-1 hover:bg-surface/10">Our Projects</a>
          </MotionReveal>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-30 translate-y-1/2 px-5">
        <MotionReveal className="mx-auto max-w-[800px] motion-enter-up" delay={0.5}>
          <form
            role="search"
            onSubmit={handleSiteSearch}
            className="flex items-center gap-2 rounded-lg border border-border/80 bg-white/95 p-2 shadow-2xl backdrop-blur-md"
          >
            <div className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-md border border-transparent bg-surface-muted px-4 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
              <Icon name="search" className="shrink-0 text-[21px] text-ink-500" />
              <input
                name="site-search"
                type="search"
                aria-label="Search the site"
                placeholder="Search causes and projects"
                onInput={(event) => event.currentTarget.setCustomValidity("")}
                className="min-w-0 flex-1 bg-transparent text-sm text-navy-900 outline-none placeholder:text-ink-500"
              />
            </div>
            <button
              type="submit"
              className="h-14 shrink-0 rounded-md bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 sm:px-7"
            >
              Search
            </button>
          </form>
        </MotionReveal>
      </div>
    </section>
  );
}

export function GivingTogether() {
  return (
    <section className="mx-auto max-w-max-width px-6 py-section-desktop pt-28">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <MotionReveal className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl motion-enter-right" delay={0.12}>
            <img src={aboutImg1} alt="Community giving" className="h-full w-full object-cover" />
          </MotionReveal>
          <MotionReveal className="absolute -bottom-6 -right-4 z-20 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-lg motion-enter-up" delay={0.3}>
            <div className="flex -space-x-2">
              {[aboutImg2, causeEdu, causeHealth].map((src, i) => (
                <img key={i} src={src} alt="" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <div>
              <div className="font-display text-h3 text-navy-900">500+</div>
              <div className="text-body-sm text-on-surface-variant">Active Volunteers</div>
            </div>
          </MotionReveal>
        </div>
        <MotionReveal className="space-y-6 motion-enter-left" delay={0.16}>
          <span className="block font-overline text-overline uppercase tracking-widest text-primary">WHO WE ARE</span>
          <h2 className="font-display text-h1 text-navy-900">Giving together a smile, saving one step</h2>
          <p className="font-body text-body text-on-surface-variant">Life Story Foundation is a Ghana-based NGO dedicated to rewriting the narrative for children and families facing extreme hardship. We believe every person has a story worth telling.</p>
          <a href="/about" className="inline-flex items-center gap-3 rounded-full bg-navy-900 px-8 py-3 font-h4 text-h4 text-surface transition-all hover:-translate-y-0.5 hover:bg-navy-800">
            Learn More <Icon name="chevron_right" />
          </a>
        </MotionReveal>
      </div>
    </section>
  );
}

export function EmbraceNewFields() {
  const features = ["Education Support", "Orphan Care", "Clean Water Access", "Food Security"];
  return (
    <section className="bg-surface-muted py-section-desktop">
      <div className="mx-auto grid max-w-max-width grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <MotionReveal className="space-y-6 motion-enter-right" delay={0.12}>
          <span className="block font-overline text-overline uppercase tracking-widest text-primary">OUR SERVICES</span>
          <h2 className="font-display text-h1 text-navy-900">Embrace new fields with our service</h2>
          <p className="font-body text-body text-on-surface-variant">Through our integrated community development programs, we address the root causes of poverty, providing the tools and support necessary for long-term self-sufficiency and dignity.</p>
          <ul className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <MotionReveal as="li" key={f} className="flex items-center gap-2 motion-enter-up" delay={0.2 + i * 0.07}>
                <Icon name="check_circle" className="font-bold text-secondary" />
                <span className="font-h4 text-body text-navy-900">{f}</span>
              </MotionReveal>
            ))}
          </ul>
        </MotionReveal>
        <div className="relative">
          <MotionReveal className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl motion-enter-left" delay={0.15}>
            <img src={aboutImg2} alt="Community outreach" className="h-full w-full object-cover" />
          </MotionReveal>
          <MotionReveal className="absolute -bottom-6 left-4 z-20 rounded-2xl bg-white p-4 shadow-lg motion-enter-up" delay={0.32}>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10"><Icon name="trending_up" className="text-primary" /></div>
              <div>
                <div className="font-h4 text-navy-900">92% Impact Rate</div>
                <div className="text-body-sm text-on-surface-variant">Funds reach communities</div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

export function InnovateJourney() {
  const items = [
    { icon: "menu_book", title: "Education", body: "Quality schooling and mentorship programs." },
    { icon: "medical_services", title: "Healthcare", body: "Essential medical care and nutrition." },
    { icon: "water_drop", title: "Clean Water", body: "Safe drinking water and sanitation." },
    { icon: "volunteer_activism", title: "Community", body: "Empowering local leadership." },
  ];
  return (
    <section className="mx-auto max-w-max-width px-6 py-section-desktop">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <MotionReveal className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl motion-enter-right" delay={0.12}>
          <img src={causeEdu} alt="Education program" className="h-full w-full object-cover" />
        </MotionReveal>
        <MotionReveal className="space-y-6 motion-enter-left" delay={0.16}>
          <span className="block font-overline text-overline uppercase tracking-widest text-primary">OUR IMPACT</span>
          <h2 className="font-display text-h1 text-navy-900">Innovate new journey to a new era of change</h2>
          <div className="grid grid-cols-2 gap-4">
            {items.map((it, i) => (
              <MotionReveal key={it.title} className="rounded-xl border border-border bg-white p-4 motion-enter-up" delay={0.22 + i * 0.08}>
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10">
                  <Icon name={it.icon} filled className="text-primary" />
                </div>
                <h4 className="mb-1 font-h4 text-navy-900">{it.title}</h4>
                <p className="text-body-sm text-on-surface-variant">{it.body}</p>
              </MotionReveal>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
