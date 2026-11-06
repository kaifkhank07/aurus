"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { Play, Pause, Shuffle, CirclePlus, MoreHorizontal, Check } from "lucide-react";
import { playlistData } from "@/data/home/playlistData";

export default function AurusPlaylist() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleSave = () => {
    setIsSaved((prev) => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffled((prev) => !prev);
  };


  const getSpotifyEmbedUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname !== "open.spotify.com") return null;

      const match = parsedUrl.pathname.match(
        /^\/playlist\/([a-zA-Z0-9]+)\/?$/
      );

      if (!match) return null;

      return `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator`;
    } catch {
      return null;
    }
  };

  const spotifyEmbedUrl = getSpotifyEmbedUrl(
    playlistData.playlist.spotifyUrl
  );

  if (!spotifyEmbedUrl) return null;


  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        <ViewReveal duration={800}>
          {/* Eyebrow Header */}
          <div className="w-fit mx-auto">
            <Eyebrow rule={false}>
              {playlistData.eyebrow}
            </Eyebrow>
          </div>

          {/* Section Heading */}
          <div className="flex justify-center mt-3 sm:mt-4">
            <Heading
              title1={playlistData.titleTop}
              title2={playlistData.titleAccent}
              className="uppercase"
            />
          </div>

          {/* Real Spotify Player Card */}
          {/* <div className="mt-8 sm:mt-10 lg:mt-12 mx-auto w-full max-w-[960px]">
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Aurus Spotify Playlist"
              className="block w-full rounded-[20px] sm:rounded-[24px]"
            />
          </div> */}

          {/* Spotify Player Card */}
          <div className="mt-8 sm:mt-10 lg:mt-12 mx-auto w-full max-w-[960px]">
            <div className="group relative rounded-[20px] sm:rounded-[24px] bg-[#1e1e1e] bg-gradient-to-b from-[#282828] to-[#181818] p-4 sm:p-6 lg:p-7 text-white shadow-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,128,255,0.22)]">
              {/* Top Row: Cover Art + Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 lg:gap-7">
                {/* Album Cover Art */}
                <a
                  href={playlistData.playlist.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 shrink-0 rounded-lg sm:rounded-xl bg-white p-3 sm:p-4 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                  title="Open playlist on Spotify"
                >
                  <div className="w-full h-full border border-black/30 rounded-sm flex flex-col items-center justify-center p-2 text-center">
                    <div className="relative w-24 sm:w-28 h-8 sm:h-10">
                      <Image
                        src="/images/logo.png"
                        alt={playlistData.playlist.coverAlt}
                        fill
                        className="object-contain"
                        sizes="180px"
                      />
                    </div>
                  </div>
                </a>

                {/* Playlist Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col justify-between">
                  <div>
                    {/* Category */}
                    <span className="font-sans text-[11px] sm:text-xs font-semibold text-[#a7a7a7] uppercase tracking-wider">
                      {playlistData.playlist.category}
                    </span>

                    {/* Main Title */}
                    <a
                      href={playlistData.playlist.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-1 sm:mt-1.5 transition-colors hover:text-white/90"
                    >
                      <h3 className="font-sans font-black text-2xl sm:text-3xl lg:text-[42px] leading-tight text-white tracking-tight">
                        {playlistData.playlist.title}
                      </h3>
                    </a>

                    {/* Description */}
                    <p className="mt-2 sm:mt-2.5 font-sans text-xs sm:text-[13px] lg:text-[14px] text-[#b3b3b3] font-normal leading-relaxed line-clamp-3 sm:line-clamp-none max-w-2xl">
                      {playlistData.playlist.description}
                    </p>
                  </div>

                  {/* Metadata line: Creator & Stats */}
                  <div className="mt-3 sm:mt-4 flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs text-[#b3b3b3] flex-wrap">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0 border border-white/20">
                      <Image
                        src="/images/logo.png"
                        alt="Aurus Avatar"
                        width={14}
                        height={14}
                        className="object-contain invert"
                      />
                    </div>
                    <span className="font-semibold text-white">
                      {playlistData.playlist.creator}
                    </span>
                    <span>•</span>
                    <span>{isSaved ? "96 saves" : "95 saves"}</span>
                    <span>•</span>
                    <span>90 songs, about 5 hr 20 min</span>
                  </div>
                </div>
              </div>

              {/* Bottom Controls Bar */}
              <div className="mt-5 sm:mt-6 pt-3 border-t border-white/10 flex items-center justify-between">
                {/* Left Controls: Play, Shuffle, Save, More */}
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Play / Pause Button */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause playlist" : "Play playlist"}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] active:scale-95 text-black flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Shuffle Button */}
                  <button
                    type="button"
                    onClick={toggleShuffle}
                    aria-label="Shuffle playlist"
                    className={`p-1.5 transition-colors cursor-pointer ${isShuffled ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"
                      }`}
                  >
                    <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Add / Save to Library Button */}
                  <button
                    type="button"
                    onClick={toggleSave}
                    aria-label="Save to your library"
                    className={`p-1.5 transition-colors cursor-pointer ${isSaved ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"
                      }`}
                  >
                    {isSaved ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <CirclePlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  {/* More Options Button */}
                  <button
                    type="button"
                    aria-label="More options"
                    className="p-1.5 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Animated Sound Wave Equalizer (visible when playing) */}
                  {isPlaying && (
                    <div className="hidden sm:flex items-end gap-1 ml-2 h-4">
                      <span className="w-1 h-3 bg-[#1ed760] rounded-full animate-pulse" />
                      <span className="w-1 h-4 bg-[#1ed760] rounded-full animate-bounce" />
                      <span className="w-1 h-2 bg-[#1ed760] rounded-full animate-pulse" />
                      <span className="w-1 h-3.5 bg-[#1ed760] rounded-full animate-bounce" />
                    </div>
                  )}
                </div>

                {/* Right Side: Queue Icon & Spotify Logo */}
                <div className="flex items-center gap-3">
                  {/* Playlist queue lines icon */}
                  <button
                    type="button"
                    aria-label="Playlist queue"
                    className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer hidden xs:block"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M15 15H1v-1.5h14V15zm0-4H1V9.5h14V11zm0-4H1V5.5h14V7zM1 2h14v1.5H1V2z" />
                    </svg>
                  </button>

                  {/* Spotify Logo Link */}
                  <a
                    href={playlistData.playlist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-[#b3b3b3] hover:text-[#1ed760] transition-colors flex items-center gap-1.5"
                    title="Listen on Spotify"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

