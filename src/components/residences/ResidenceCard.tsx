import Link from "next/link";
import { Figure, ArrowRight } from "@/components/ui/Primitives";
import { SafeHostel } from "@/types/hostel.types";

interface ResidenceCardProps {
  item: SafeHostel;
}

export function ResidenceCard({ item }: ResidenceCardProps) {
  // Format tenant type to user-facing badge
  const getTenantBadge = (tenantType?: string) => {
    switch (tenantType?.toLowerCase()) {
      case "girls":
        return "Girls Only";
      case "boys":
        return "Boys Only";
      case "co-ed":
      default:
        return "Co-ed Living";
    }
  };

  // Locality and City text
  const localityName =
    typeof item.location?.locality === "object" && item.location.locality !== null
      ? item.location.locality.name
      : typeof item.location?.locality === "string"
        ? item.location.locality
        : "";

  const cityName =
    typeof item.location?.city === "object" && item.location.city !== null
      ? item.location.city.city
      : typeof item.location?.city === "string"
        ? item.location.city
        : "";

  const localityDisplay =
    localityName && cityName
      ? `${localityName} · ${cityName}`
      : localityName || cityName || item.location?.address || "Prime Location";

  // Price and Frequency
  const rentAmount = Number(item.rent?.amount || 0);
  const priceDisplay =
    rentAmount > 0 ? `₹${rentAmount.toLocaleString("en-IN")}` : "₹50,000";

  const frequencyName =
    typeof item.rent?.frequency === "object" && item.rent.frequency !== null
      ? item.rent.frequency.name
      : typeof item.rent?.frequency === "string"
        ? item.rent.frequency
        : "Monthly";

  const frequencySuffix = frequencyName.toLowerCase().includes("year") ? "/yr" : "/mo";

  return (
    <Link
      href={`/hostels/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-ink/10 bg-[#faf8f4] transition-all duration-300 hover:border-ink/25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
    >
      {/* Residence Image */}
      <div className="relative aspect-[373/220] w-full shrink-0 overflow-hidden rounded-t-[14px]">
        <Figure
          src={item.frontImage?.url || "/images/image03.png"}
          alt={`${item.title} residence interior`}
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 44vw, 90vw"
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Occupancy Badge */}
        <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] absolute left-4 top-4 rounded-full bg-[#faf8f4] px-3 py-1.5 text-[9px] tracking-[0.18em] text-ink shadow-sm">
          {getTenantBadge(item.tenantType)}
        </span>
      </div>

      {/* Residence Details */}
      <div className="flex flex-1 flex-col px-5 pb-3 pt-4">
        <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-[9px] uppercase tracking-[0.24em] text-[#88847c]">
          {localityDisplay}
        </p>

        <h3 className="mt-2 text-[clamp(27px,3vw,36px)] font-light uppercase leading-[1.05] tracking-[-0.055em] text-ink">
          {item.title}
        </h3>

        <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-2 text-[9px] uppercase tracking-[0.08em] text-[#88847c]">
          {item.location?.address || "Prime location"}
        </p>

        {/* Price and Action */}
        <div className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3">
          <div className="min-w-0">
            <span className="block text-[10px] uppercase text-[#88847c] tracking-[0.04em] font-light">
              Starts from
            </span>

            <span className="mt-0.5 block whitespace-nowrap text-[17px] font-medium leading-none tracking-[-0.04em] text-ink">
              {priceDisplay}
              <span className="ml-1 text-[9px] font-normal tracking-normal text-[#88847c]">
                {frequencySuffix}
              </span>
            </span>
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border-b-2 border-ink/30 px-3 py-2 font-mono text-[9px] leading-[1.7857] tracking-[0.18em] text-[#77736c] uppercase transition-colors group-hover:bg-ink group-hover:text-[#faf8f4] lg:text-[11px]">
            <span className="lg:hidden">View</span>
            <span className="hidden lg:inline">View Residence</span>
            <ArrowRight />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ResidenceCard;

