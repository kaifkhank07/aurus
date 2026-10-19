

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-display text-[clamp(1.5rem,1.77vw,34px)] tracking-[0.1em]">
        AURUS
      </span>
      <span className="font-display mt-1 text-[clamp(0.4rem,0.47vw,9px)] tracking-[0.18em]">
        LUXURY MANAGED RESIDENCES
      </span>
    </span>
  );
}
