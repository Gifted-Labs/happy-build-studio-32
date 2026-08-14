import { useEffect } from "react";

type RevealDirection = "up" | "left" | "right" | "scale";

export function MotionController() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealObserver = reducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-revealed");
              revealObserver?.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );

    const counterObserver = reducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const element = entry.target as HTMLElement;
              const raw = element.dataset.counterValue;
              if (!raw) return;
              const match = raw.match(/^([\d,.]+)(.*)$/);
              if (!match) return;

              const target = Number(match[1].replaceAll(",", ""));
              const suffix = match[2];
              const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
              const startedAt = performance.now();

              const tick = (time: number) => {
                const progress = Math.min((time - startedAt) / 1100, 1);
                const value = target * (1 - Math.pow(1 - progress, 3));
                element.textContent = `${value.toLocaleString(undefined, {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                })}${suffix}`;
                if (progress < 1) requestAnimationFrame(tick);
              };

              requestAnimationFrame(tick);
              counterObserver?.unobserve(element);
            });
          },
          { threshold: 0.5 },
        );

    const targets = new Set<HTMLElement>();
    let parallaxElements: HTMLElement[] = [];
    let frame = 0;

    const register = (elements: Iterable<HTMLElement>, direction: RevealDirection, stagger = 0) => {
      Array.from(elements).forEach((element, index) => {
        if (targets.has(element)) return;
        targets.add(element);
        element.classList.add("premium-reveal", `premium-reveal--${direction}`);
        element.style.setProperty("--reveal-delay", `${Math.min(index * stagger, 360)}ms`);
        if (reducedMotion) element.classList.add("is-revealed");
        else revealObserver?.observe(element);
      });
    };

    const initialize = () => {
      register(
        document.querySelectorAll<HTMLElement>(
          "main > section:first-child > .relative.z-10 > div, main > header .relative.z-10 > *",
        ),
        "up",
        110,
      );

      const splitPanels = document.querySelectorAll<HTMLElement>(
        'main > section:not(:first-child) [class*="lg:grid-cols"] > div',
      );
      Array.from(splitPanels).forEach((element, index) => {
        if (element.offsetHeight > window.innerHeight * 1.2) return;
        register([element], index % 2 === 0 ? "left" : "right");
      });

      register(
        document.querySelectorAll<HTMLElement>("main > section:not(:first-child) h2"),
        "up",
        45,
      );
      register(
        document.querySelectorAll<HTMLElement>("main > section:not(:first-child) article"),
        "up",
        90,
      );
      register(
        document.querySelectorAll<HTMLElement>(
          "main > section:not(:first-child) aside, main > section:not(:first-child) form, main > section:not(:first-child) blockquote",
        ),
        "scale",
        80,
      );
      register(
        document.querySelectorAll<HTMLElement>(
          'main > section:not(:first-child) [class*="md:grid-cols"] > a',
        ),
        "up",
        90,
      );

      document
        .querySelectorAll<HTMLElement>('strong[class*="text-4xl"], strong[class*="text-3xl"]')
        .forEach((element) => {
          const value = element.textContent?.trim();
          if (!value || !/^\d/.test(value)) return;
          element.dataset.counterValue = value;
          if (reducedMotion) return;
          const match = value.match(/^([\d,.]+)(.*)$/);
          if (match) element.textContent = `${match[1].includes(".") ? "0.0" : "0"}${match[2]}`;
          counterObserver?.observe(element);
        });

      parallaxElements = Array.from(
        document.querySelectorAll<HTMLElement>(
          "main > section:first-child > img:first-child, main > header > img:first-child",
        ),
      );
      parallaxElements.forEach((element) => element.classList.add("premium-parallax"));

      const updateParallax = () => {
        frame = 0;
        if (reducedMotion || window.innerWidth < 768) return;
        const shift = Math.min(window.scrollY * 0.065, 42);
        parallaxElements.forEach((element) =>
          element.style.setProperty("--parallax-shift", `${shift}px`),
        );
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(updateParallax);
      };

      updateParallax();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    };

    let cleanupParallax = () => {};
    const initTimer = window.setTimeout(
      () => {
        cleanupParallax = initialize();
      },
      reducedMotion ? 0 : 580,
    );

    return () => {
      window.clearTimeout(initTimer);
      cleanupParallax();
      revealObserver?.disconnect();
      counterObserver?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
