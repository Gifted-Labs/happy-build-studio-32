export function BrandedLoader({ exiting = false }: { exiting?: boolean }) {
  return (
    <div
      id="initial-brand-loader"
      role="status"
      aria-live="polite"
      aria-label="Loading Life Story Foundation"
      className={`brand-loader-overlay ${exiting ? "brand-loader-overlay--exiting" : ""}`}
    >
      <div className="brand-loader-lockup">
        <div className="brand-loader-mark" aria-hidden="true">
          <span className="brand-loader-ring brand-loader-ring--outer" />
          <span className="brand-loader-ring brand-loader-ring--inner" />
          <span className="brand-loader-orbit">
            <span className="brand-loader-dot" />
          </span>
          <span className="brand-loader-logo">
            <img
              src="/life-story-bird-white.png"
              alt=""
              width="895"
              height="990"
              className="h-12 w-auto object-contain"
            />
          </span>
        </div>
        <div className="mt-6 text-center uppercase text-white">
          <strong className="block font-display text-lg">Life Story</strong>
          <span className="mt-1 block text-[0.65rem] font-semibold text-white/65">Foundation</span>
        </div>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
