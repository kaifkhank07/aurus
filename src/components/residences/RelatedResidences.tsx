import { ExploreResidenceItem } from "@/data/residences";
import { ArrowRight, Container, Eyebrow, Figure } from "../ui/Primitives";
import Link from "next/link";

interface RelatedResidencesProps {
  items?: ExploreResidenceItem[];
}

export default function RelatedResidences({ items = [] }: RelatedResidencesProps) {
    if (!items || items.length === 0) {
        return null;
    }
    const filteredItems = items.slice(0, 3);
    return (
        <section className="py-8 sm:py-12 lg:py-16">
            <Container className="space-y-4 sm:space-y-6 lg:space-y-10">
                {/* Eyebrow Header */}
                <Eyebrow>{'More // You might also like'}</Eyebrow>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredItems.map((item) => (
                        <ResidenceCard key={item.id || item._id || item.slug || item.name} item={item} />
                    ))}
                </div>
            </Container>
        </section>
    );
}

function ResidenceCard({ item }: { item: ExploreResidenceItem }) {
    return (
        <Link
            href={item.href}
            className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-ink/10 bg-[#faf8f4] transition-all duration-300 hover:border-ink/25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        >
            {/* Residence Image */}
            <div className="relative aspect-[373/220] w-full shrink-0 overflow-hidden rounded-t-[14px]">
                <Figure
                    src={item.image}
                    alt={`${item.name} residence interior`}
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 44vw, 90vw"
                    className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Occupancy Badge */}
                <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] absolute left-4 top-4 rounded-full bg-[#faf8f4] px-3 py-1.5 text-[9px] tracking-[0.18em] text-ink shadow-sm">
                    {item.occupancy}
                </span>

                {/* Featured Badge */}
                {item.featured && (
                    <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] absolute right-4 top-4 rounded-full bg-[#d8c89b] px-3 py-1.5 text-[9px] tracking-[0.18em] text-ink shadow-sm">
                        Featured
                    </span>
                )}
            </div>

            {/* Residence Details */}
            <div className="flex flex-1 flex-col px-5 pb-3 pt-4">
                <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-[9px] uppercase tracking-[0.24em] text-[#88847c]">
                    {item.locality}
                </p>

                <h3 className="mt-2 text-[clamp(27px,3vw,36px)] font-light uppercase leading-[1.05] tracking-[-0.055em] text-ink">
                    {item.name}
                </h3>

                <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-2 text-[9px] uppercase tracking-[0.08em] text-[#88847c]">
                    {item.distance}
                </p>

                {/* Price and Action */}
                <div className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3">
                    <div className="min-w-0">
                        <span className="block text-[10px] uppercase text-[#88847c] tracking-[0.04em] font-light">
                            Starts from
                        </span>

                        <span className="mt-0.5 block whitespace-nowrap text-[17px] font-medium leading-none tracking-[-0.04em] text-ink">
                            {item.priceFrom}
                            <span className="ml-1 text-[9px] font-normal tracking-normal text-[#88847c]">
                                /mo
                            </span>
                        </span>
                    </div>

                    <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex shrink-0 items-center gap-2 rounded-full border-b-2 border-ink/30 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-[#77736c] transition-colors group-hover:bg-ink group-hover:text-[#faf8f4]">
                        View Residence
                        <ArrowRight />
                    </span>
                </div>
            </div>
        </Link>
    );
}
