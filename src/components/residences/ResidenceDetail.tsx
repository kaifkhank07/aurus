"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Primitives";
import {
  staticResidenceDetail,
  type ResidenceDetail as ResidenceDetailType,
} from "@/data/residenceDetails";
import { Heading } from "../utils/Heading";

function CheckCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`${className} shrink-0 stroke-current text-ink`}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" strokeWidth="1.2" />
      <path
        d="M7 10l2 2 4-4"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <path d="M12.031 2C6.495 2 2 6.492 2 12.028c0 1.947.556 3.766 1.521 5.308L2 22l4.809-1.493a10.024 10.024 0 005.222 1.526c5.536 0 10.031-4.492 10.031-10.005C22.062 6.492 17.567 2 12.031 2zm0 18.283c-1.637 0-3.176-.465-4.497-1.272l-.323-.198-2.854.887.896-2.781-.212-.338a8.232 8.232 0 01-1.285-4.553c0-4.567 3.716-8.283 8.275-8.283 4.559 0 8.275 3.716 8.275 8.283 0 4.567-3.716 8.267-8.275 8.267zm4.536-6.196c-.249-.125-1.472-.727-1.7-.81-.228-.083-.395-.125-.562.125-.167.249-.645.81-.79 1-.146.125-.291.146-.541.021-.249-.125-1.054-.389-2.008-1.239-.742-.662-1.243-1.48-1.389-1.729-.146-.249-.016-.384.108-.508.112-.112.249-.291.374-.437.125-.146.167-.249.249-.416.083-.167.042-.312-.021-.437-.062-.125-.562-1.352-.77-1.852-.203-.487-.41-.421-.562-.429l-.479-.008c-.167 0-.437.062-.666.312-.228.249-.874.853-.874 2.081 0 1.228.895 2.414 1.02 2.581.125.167 1.76 2.688 4.264 3.769.596.257 1.061.41 1.424.526.598.19 1.143.163 1.574.099.48-.072 1.472-.603 1.68-1.186.208-.583.208-1.082.146-1.186-.063-.105-.229-.167-.479-.292z" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

export interface ResidenceDetailProps {
  data?: ResidenceDetailType;
}

export function ResidenceDetail({
  data = staticResidenceDetail,
}: ResidenceDetailProps) {
  const [activeHeroImage, setActiveHeroImage] = useState(data.mainImage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <section className="py-6 sm:py-10 lg:py-14 bg-cream">
      <Container>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 sm:pb-8">
          <div>
            <Heading
              title1={data.title}
              title2={data.subtitle}
              className="max-w-[70%] sm:max-w-none"
            />
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="bg-ink text-white font-mono text-[9px] sm:text-[10px] lg:text-[13px] uppercase px-4 sm:px-6 3xl:px-8 py-1.5 rounded-full font-medium">
              {data.genderBadge}
            </span>
            <span className="border border-ink/25 bg-white/40 text-ink font-mono text-[9px] sm:text-[10px] lg:text-[13px] uppercase px-4 sm:px-6 3xl:px-8 py-1.5 rounded-full font-medium">
              {data.locationBadge}
            </span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="lg:col-span-2 lg:row-span-2 relative aspect-[16/10] sm:aspect-[1.5/1] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-neutral-200 group">
            <Image
              src={activeHeroImage}
              alt={`${data.title} main interior view`}
              fill
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
            />
          </div>

          {data.galleryImages.slice(0, 2).map((img, idx) => (
            <div key={idx} className="relative aspect-[16/10] sm:aspect-[1.5/1] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-neutral-200 group">
              <Image
                src={img}
                alt={`${data.title} main interior view`}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
            </div>
          ))}
        </div>

        {/* Details & Sticky Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-8 sm:mt-12">
          {/* Left Column: Residence Features and Content */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-10">
            {/* Description */}
            <p className="font-sans text-ink text-lg sm:text-xl lg:text-[28px] 3xl:text-[35px] font-regular leading-sung max-w-3xl">
              {data.description}
            </p>

            {/* Key Specs Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-ink/15 overflow-hidden bg-[#FAF8F4]/80">
              {data.keySpecs.map((spec, index) => (
                <div key={spec.label} className={`p-4 sm:p-5 flex flex-col justify-center border-r border-ink/15
                ${index < 2 ? 'border-b lg:border-b-0 border-ink/15' : 'border-b-0'}
                `}>
                  <span className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] tracking-[2px] text-[#88847C] block mb-1 font-medium">
                    {spec.label}
                  </span>
                  <span className="font-sans text-ink text-sm sm:text-[15px] lg:text-[18px] font-medium leading-tight">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/*  */}
            <div className="sm:hidden lg:sticky lg:top-28 rounded-[20px] border border-ink/10 bg-white p-6 sm:p-7">
              {/* Price Header */}
              <span className="font-mono uppercase text-[10px] sm:text-[14px] text-[#77736B] font-regular block">
                STARTS FROM
              </span>
              <div className="mt-1 flex items-baseline">
                <span className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
                  {data.pricing.startsFrom}
                </span>
                <span className="ml-1 text-xs text-[#77736B] font-normal">
                  {data.pricing.period}
                </span>
              </div>

              {/* Room Options & Inclusions List */}
              <div className="divide-y divide-ink/10 border-y border-ink/10 my-6 py-0.5">
                {data.pricing.roomOptions.map((opt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 lg:py-3 font-sans  text-xs sm:text-[14px] text-ink font-regular"
                  >
                    <span className="text-[#77736B]">{opt.type}</span>
                    <span className="text-ink">{opt.status}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full rounded-full bg-ink py-3.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-white hover:bg-ink/85 transition text-center block cursor-pointer shadow-xs"
                >
                  {data.pricing.scheduleVisitText}
                </button>

                <a
                  href={`https://wa.me/${data.pricing.whatsappNumber}?text=${encodeURIComponent(
                    `Hello! I'm interested in visiting ${data.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full border border-ink/30 py-2.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-ink hover:border-ink hover:bg-ink/5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  {data.pricing.whatsappText}
                </a>

                <a
                  href={`tel:${data.pricing.callNumber}`}
                  className="w-full rounded-full border border-ink/30 py-2.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-ink hover:border-ink hover:bg-ink/5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneIcon className="w-4 h-4 text-ink" />
                  {data.pricing.callText}
                </a>
              </div>

              {/* Disclaimer */}
              <p className="font-sans text-[10px] sm:text-[11px] text-[#88847C] leading-relaxed text-center mt-5 font-light">
                {data.pricing.disclaimer}
              </p>
            </div>

            {/* Included in your stay */}
            <div>
              <h2 className="font-sans text-ink text-lg sm:text-xl lg:text-[28px] 3xl:text-[35px] font-regular leading-sung mb-4">
                Included in your stay
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-ink/15">
                {data.includedInStay.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-ink/15 py-3 sm:py-3.5 flex items-center gap-3 pr-4"
                  >
                    <CheckCircleIcon className="w-4 h-4 text-ink shrink-0" />
                    <span className="font-sans text-[13.5px] sm:text-[14.5px] lg:text-[18px] text-ink font-light">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Every Aurus Chapter includes */}
            <div>
              <h2 className="font-sans text-ink text-lg sm:text-xl lg:text-[28px] 3xl:text-[35px] font-regular leading-sung mb-4">
                Every Aurus Chapter includes
              </h2>
              <div className="flex flex-wrap gap-3 3xl:gap-4">
                {data.chapterIncludes.map((chip, index) => (
                  <span
                    key={index}
                    className="px-4 lg:px-6 py-2 rounded-full border border-ink/15 font-mono uppercase font-regular text-[10px] sm:text-[11px] lg:text-[13px] tracking-[1.5px] text-ink transition-colors hover:border-ink/40"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Near campus */}
            <div>
              <h2 className="font-sans text-ink text-lg sm:text-xl lg:text-[28px] 3xl:text-[35px] font-regular leading-sung mb-1">
                Near campus
              </h2>
              <p className="font-sans text-xs sm:text-[13px] lg:text-[16px] 3xl:text-[19px] text-[#77736C] font-regular mb-3.5">
                {data.nearCampus.distance}
              </p>
              <div className="flex flex-wrap gap-3 3xl:gap-4">
                {data.nearCampus.colleges.map((college, index) => (
                  <span
                    key={index}
                    className="px-4 lg:px-6 py-2 rounded-full bg-ink text-white font-mono uppercase font-regular text-[10px] sm:text-[11px] lg:text-[13px] tracking-[1.5px]"
                  >
                    {college}
                  </span>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="font-sans text-ink text-lg sm:text-xl lg:text-[28px] 3xl:text-[35px] font-regular leading-sung mb-3.5">
                Location
              </h2>
              <div className="rounded-[20px] bg-white p-5 sm:p-6 sm:px-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                <div>
                  <span className="font-mono uppercase text-[14px] text-[#88847C] font-regular block mb-1">
                    {data.location.label}
                  </span>
                  <p className="font-sans text-[14px] text-ink leading-relaxed max-w-lg font-regular">
                    {data.location.address}
                  </p>
                </div>
                <a
                  href={data.location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 lg:px-6 py-2 rounded-full border border-ink font-mono uppercase font-regular text-[10px] sm:text-[11px] lg:text-[13px] tracking-[1.5px] text-ink hover:bg-ink hover:text-white transition-colors duration-200 whitespace-nowrap cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  OPEN IN GOOGLE MAPS
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Booking Card */}
          <div className="hidden lg:block">
            <div className="lg:sticky lg:top-28 rounded-[20px] border border-ink/10 bg-white p-6 sm:p-7 max-w-[80%] ml-auto">
              {/* Price Header */}
              <span className="font-mono uppercase text-[10px] sm:text-[14px] text-[#77736B] font-regular block">
                STARTS FROM
              </span>
              <div className="mt-1 flex items-baseline">
                <span className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
                  {data.pricing.startsFrom}
                </span>
                <span className="ml-1 text-xs text-[#77736B] font-normal">
                  {data.pricing.period}
                </span>
              </div>

              {/* Room Options & Inclusions List */}
              <div className="divide-y divide-ink/10 border-y border-ink/10 my-6 py-0.5">
                {data.pricing.roomOptions.map((opt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 lg:py-3 font-sans  text-xs sm:text-[14px] text-ink font-regular"
                  >
                    <span className="text-[#77736B]">{opt.type}</span>
                    <span className="text-ink">{opt.status}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full rounded-full bg-ink py-3.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-white hover:bg-ink/85 transition text-center block cursor-pointer shadow-xs"
                >
                  {data.pricing.scheduleVisitText}
                </button>

                <a
                  href={`https://wa.me/${data.pricing.whatsappNumber}?text=${encodeURIComponent(
                    `Hello! I'm interested in visiting ${data.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full border border-ink/30 py-2.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-ink hover:border-ink hover:bg-ink/5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  {data.pricing.whatsappText}
                </a>

                <a
                  href={`tel:${data.pricing.callNumber}`}
                  className="w-full rounded-full border border-ink/30 py-2.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-ink hover:border-ink hover:bg-ink/5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneIcon className="w-4 h-4 text-ink" />
                  {data.pricing.callText}
                </a>
              </div>

              {/* Disclaimer */}
              <p className="font-sans text-[10px] sm:text-[11px] text-[#88847C] leading-relaxed text-center mt-5 font-light">
                {data.pricing.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Schedule a Visit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-[24px] bg-[#FAF8F4] p-6 sm:p-8 shadow-2xl border border-ink/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-ink/60 hover:text-ink cursor-pointer p-1"
              aria-label="Close modal"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 stroke-current"
                fill="none"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-light text-ink">
                  Visit Request Received
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Our residence manager will reach out within 2 hours to confirm
                  your slot.
                </p>
              </div>
            ) : (
              <div>
                <span className="font-mono uppercase text-[10px] tracking-[2px] text-[#88847C] block mb-1">
                  TOUR AURUS
                </span>
                <h3 className="text-2xl font-light text-ink mb-2">
                  Schedule a Visit
                </h3>
                <p className="text-xs text-muted mb-6">
                  Experience {data.title} in person. Choose a date and our
                  concierge team will guide you.
                </p>

                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block font-mono text-[10px] uppercase tracking-[1.5px] text-[#88847C] mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-xs text-ink outline-none focus:border-ink transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-mono text-[10px] uppercase tracking-[1.5px] text-[#88847C] mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-xs text-ink outline-none focus:border-ink transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="visitDate"
                        className="block font-mono text-[10px] uppercase tracking-[1.5px] text-[#88847C] mb-1"
                      >
                        Preferred Date
                      </label>
                      <input
                        id="visitDate"
                        type="date"
                        required
                        className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-xs text-ink outline-none focus:border-ink transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="visitTime"
                        className="block font-mono text-[10px] uppercase tracking-[1.5px] text-[#88847C] mb-1"
                      >
                        Time Slot
                      </label>
                      <select
                        id="visitTime"
                        className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-xs text-ink outline-none focus:border-ink transition-colors"
                      >
                        <option>Morning (10 AM - 1 PM)</option>
                        <option>Afternoon (1 PM - 4 PM)</option>
                        <option>Evening (4 PM - 7 PM)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[2px] font-medium text-white hover:bg-ink/85 transition cursor-pointer"
                  >
                    Confirm Visit Slot
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ResidenceDetail;
