import Image from "next/image";

/** Join class names without leaving stray or doubled spaces. */
const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(" ");

import Link from "next/link";

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`h-[0.9em] w-[0.9em] shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" strokeLinecap="square" />
    </svg>
  );
}

/** Mono eyebrow + hairline rule. Figma: Space Mono 14px / 25px / +2px. */
// export function Eyebrow({
//   children,
//   rule = true,
//   dark = false,
//   right,
// }: {
//   children: React.ReactNode;
//   rule?: boolean;
//   dark?: boolean;
//   right?: React.ReactNode;
// }) {
//   return (
//     <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
//       <span className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] whitespace-nowrap ${dark ? "text-white" : "text-ink"}`}>
//         {children}
//       </span>
//       {rule && (
//         <span
//           aria-hidden="true"
//           className={`h-px min-w-6 flex-1 ${dark ? "bg-line-dark" : "bg-line"}`}
//         />
//       )}
//       {right}
//     </div>
//   );
// }


export function Eyebrow({
  children,
  rule = true,
  dark = false,
  right,
}: {
  children: React.ReactNode;
  rule?: boolean;
  dark?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex w-full flex-wrap sm:flex-nowrap items-center justify-between gap-x-4 gap-y-2">
        <span className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] whitespace-nowrap ${dark ? "text-white" : "text-ink"}`}>
          {children}
        </span>
        {right}
      </div>

      {rule && (
        <span
          aria-hidden="true"
          className={`h-px w-full ${dark ? "bg-line-dark" : "bg-line"}`}
        />
      )}
    </div>
  );
}


export function PillButton({
  href,
  children,
  variant = "light",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "light" | "dark" | "solid";
  className?: string;
}) {
  const styles = {
    light:
      "border-white/60 text-white hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink",
    dark: "border-ink/35 text-ink hover:bg-ink hover:text-cream focus-visible:bg-ink focus-visible:text-cream",
    solid: "border-ink bg-ink text-cream hover:bg-transparent hover:text-ink",
  }[variant];

  return (
    <Link
      href={href}
      className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex h-[min(2.2917vw,44px)] min-h-[40px] items-center gap-2.5 rounded-full border px-[min(1.4583vw,28px)] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ink/40 ${styles} ${className}`}
    >
      {children}
      <ArrowRight />
    </Link>
  );
}

export function GhostButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex h-[min(2.8125vw,54px)] min-h-[46px] items-center gap-2.5 border border-ink/30 px-[min(1.5625vw,30px)] text-ink transition-colors duration-300 hover:bg-ink hover:text-cream outline-none focus-visible:ring-2 focus-visible:ring-ink/40 ${className}`}
    >
      {children}
    </Link>
  );
}

export function Figure({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  dark = false,
  quiet = false,
  imageRef,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  dark?: boolean;
  quiet?: boolean;
  imageRef?: React.Ref<HTMLImageElement>;
}) {
  // `relative` and an incoming `absolute` have equal specificity, so adding
  // both lets CSS source order decide and the element silently falls back
  // into flow. Only supply `relative` when the caller has not positioned it.
  const positioned = /(^|\s)(absolute|fixed|sticky|relative)(\s|$)/.test(className);
  const position = positioned ? "" : "relative";

  if (!src) {
    return (
      <div
        role="img"
        aria-label={`Placeholder: ${alt}`}
        className={cx(
          position,
          quiet ? "" : "flex items-center justify-center p-4 text-center",
          dark ? "bg-white/[0.06] text-white/35" : "bg-ink/[0.07] text-ink/35",
          className,
        )}
      >
        <span
          className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] leading-relaxed ${quiet ? "absolute right-8 bottom-8 max-w-[32ch] text-right opacity-70" : ""
            }`}
        >
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={cx(position, "overflow-hidden", className)}>
      <Image ref={imageRef} src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

/**
 * Page grid. Figma: 1920 frame, 1683 content column at x=121,
 * i.e. a 120px gutter = 6.25vw.
 */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-[6.25vw] ${className}`}>
      {children}
    </div>
  );
}

/** Rounded panel that bleeds to a small page inset (hero, dark sections, footer). */
export function Panel({
  children,
  className = "",
  innerClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[1920px] lg:px-[min(1.3021vw,25px)]">
      {/* <div className={`rounded-panel overflow-hidden ${className}`}> */}
      <div className={`overflow-hidden ${className}`}>
        {/* Figma: 25px panel inset + 87px padding = the 112px text origin */}
        <div className={`px-6 sm:px-10 lg:px-[min(4.5313vw,87px)] ${innerClassName}`}>{children}</div>
      </div>
    </div>
  );
}
