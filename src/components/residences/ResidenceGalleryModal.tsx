"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export interface ResidenceGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export function ResidenceGalleryModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  title = "Residence Gallery",
}: ResidenceGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const thumbnailRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sync current index when modal opens or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      const validIndex =
        initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0;
      setCurrentIndex(validIndex);
    }
  }, [isOpen, initialIndex, images.length]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Next / Previous slide actions with wrapping
  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch gesture support (swipe left / right)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!isOpen || !thumbnailRef.current) return;
    const activeThumb = thumbnailRef.current.children[currentIndex] as
      | HTMLElement
      | undefined;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex, isOpen]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const totalImages = images.length;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-white/5 backdrop-blur-md transition-all duration-300 select-none"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Photo Gallery"
    >
      {/* Top Bar Header */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4.5 border-b border-black/10 bg-white/75 backdrop-blur-md shrink-0 z-20">
        {/* Title */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[2px] text-ink font-semibold truncate max-w-[200px] sm:max-w-md">
            {title}
          </span>
        </div>

        {/* Counter Badge */}
        {totalImages > 0 && (
          <div className="bg-white/85 border border-black/10 px-3.5 py-1 rounded-full text-ink font-mono text-[11px] sm:text-xs uppercase tracking-[2px] shadow-xs backdrop-blur-sm font-medium">
            {currentIndex + 1} / {totalImages}
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="text-ink/75 hover:text-ink p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white border border-black/10 hover:border-black/25 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
          aria-label="Close gallery"
        >
          <X className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>

      {/* Main Slide Viewing Area */}
      <div
        className="relative flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Navigation Arrow: Previous */}
        {totalImages > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/85 hover:bg-white text-ink flex items-center justify-center border border-black/10 hover:border-black/25 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.8] text-ink" />
          </button>
        )}

        {/* Active Image */}
        <div className="relative flex w-full max-w-5xl items-center justify-center">
          {currentImage ? (
            <div className="relative aspect-[4/3] w-full max-h-[60vh] sm:max-h-[68vh] overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                key={currentImage + currentIndex}
                src={currentImage}
                alt={`${title} view ${currentIndex + 1}`}
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-ink/40">
              <ImageIcon className="w-12 h-12 mb-2 stroke-1 text-ink/40" />
              <p className="font-mono text-xs uppercase tracking-[2px] text-ink/60">
                No image available
              </p>
            </div>
          )}
        </div>

        {/* Navigation Arrow: Next */}
        {totalImages > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/85 hover:bg-white text-ink flex items-center justify-center border border-black/10 hover:border-black/25 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6 stroke-[1.8] text-ink" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnails Strip */}
      {totalImages > 1 && (
        <div className="w-full border-t border-black/10 py-3 px-4 bg-white/75 backdrop-blur-md shrink-0 z-20">
          <div
            ref={thumbnailRef}
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden justify-start sm:justify-center no-scrollbar px-3 py-2 max-w-5xl mx-auto"
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${idx === currentIndex
                  ? "z-10 ring-2 ring-ink ring-offset-2 ring-offset-[#FAF8F4] opacity-100 shadow-md"
                  : "opacity-60 hover:opacity-100 ring-1 ring-black/10 hover:ring-black/25"
                  }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidenceGalleryModal;
