export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f3ee] px-6 py-16 text-[#000]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8e4db]/50 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="mb-8 font-mono text-xs uppercase tracking-[3px] text-[#77736b]">
          AURUS
        </p>

        <h1 className="mb-6 font-serif text-5xl font-normal leading-tight md:text-7xl">
          A new chapter
          <br />
          <span className="italic">is on its way.</span>
        </h1>

        <p className="mx-auto max-w-lg text-sm leading-7 text-[#77736b] md:text-base">
          We're making a few thoughtful improvements to our website.
          Our residences remain at the heart of everything we do,
          and we'll be back online soon.
        </p>

        <div className="mx-auto mt-12 h-px w-16 bg-[#000]/20" />

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[2px] text-[#77736b]">
          Thank you for your patience
        </p>
      </div>
    </main>
  );
}