import { aboutData } from "@/data/about";
import { Container, Eyebrow } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export default function Values() {

    return (
        <section className="py-8 sm:py-12 lg:py-16">
            <Container>
                {/* Eyebrow Header */}
                <Eyebrow>{aboutData.values.eyebrow}</Eyebrow>

                {/* Heading */}
                <div className="mt-8 sm:mt-10 lg:mt-12">
                    <Heading
                        title1={aboutData.values.titleTop}
                        title2={aboutData.values.titleAccent}
                        className="uppercase max-w-[18ch] sm:max-w-lg lg:max-w-2xl"
                    />
                </div>

                {/* 4 Pillar Cards Grid */}
                <ViewReveal duration={800}>
                    <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                        {aboutData.values.items.map((item) => (
                            <div
                                key={item.number}
                                className="flex flex-col justify-start gap-3 rounded-[10px] lg:border border-ink/10 border-t-2 border-t-[#C5A059] bg-[#FAF8F5] p-3 sm:p-4 transition-all duration-300 hover:border-ink/20 hover:border-t-[#D9AC58] hover:bg-[#FAF8F5] hover:shadow-sm"
                            >
                                <span className="font-mono text-[10px] sm:text-[14px] tracking-[1px] text-ink font-medium">
                                    {item.number}
                                </span>

                                <h4 className="font-sans uppercase font-regular text-[16px] sm:text-[18px] tracking-[-0.02em] text-ink">
                                    {item.title}
                                </h4>

                                <p className="font-sans font-regular text-[10px] sm:text-[13px] leading-[1.4] tracking-[-0.01em] text-muted">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </ViewReveal>
            </Container>
        </section>
    )
}