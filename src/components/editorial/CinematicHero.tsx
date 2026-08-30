"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme/ThemeContext";
import { ArrowRight } from "lucide-react";

/*
  Video served via ImageKit CDN.
  ImageKit auto-transcodes and serves from edge nodes globally.
  tr=f-mp4 forces MP4/H.264 output for universal browser support.
  q-60 compresses to ~60% quality -- good balance of size vs clarity.
  The poster is a still frame shown while video loads.
*/
const VIDEO_SRC    = "https://ik.imagekit.io/scmchurch/IMG_9019.MOV/ik-video.mp4";
const VIDEO_POSTER = "https://ik.imagekit.io/scmchurch/IMG_9019.MOV/ik-thumbnail.jpg?tr=w-1920,q-80";

export function CinematicHero() {
  const { theme }  = useTheme();
  const videoRef   = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
    }
  }, []);

  const overlayClass = theme === "dark"
    ? "bg-gradient-to-r from-[#050505]/90 via-[#050505]/55 to-[#050505]/20"
    : "bg-gradient-to-r from-white/85 via-white/55 to-white/10";

  const bottomGradient = theme === "dark"
    ? "bg-gradient-to-t from-[#050505] via-transparent to-transparent"
    : "bg-gradient-to-t from-white/70 via-transparent to-transparent";

  const headlineColor   = theme === "dark" ? "text-white"         : "text-[#050505]";
  const subTextColor    = theme === "dark" ? "text-[#B0B0B0]"     : "text-[#444444]";
  const statNumColor    = theme === "dark" ? "text-white"         : "text-[#050505]";
  const statLabelColor  = theme === "dark" ? "text-[#8E8E93]"     : "text-[#888888]";
  const dividerColor    = theme === "dark" ? "bg-white/10"        : "bg-[#050505]/15";
  const statBorderColor = theme === "dark" ? "border-white/10"    : "border-[#050505]/10";

  return (
    <section className="relative w-full h-[94vh] min-h-[640px] overflow-hidden flex items-end">

      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={VIDEO_POSTER}
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className={`absolute inset-0 ${bottomGradient}`} />

      {/* Content */}
      <div className="relative z-10 w-full px-8 sm:px-16 pb-16 sm:pb-24">
        <div className="max-w-2xl space-y-6">

          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-[#C6A15B] font-sans font-semibold">
            Haute Couture and Handmade Custom Tailoring
          </p>

          <h1 className={`font-editorial text-5xl sm:text-7xl md:text-[5.5rem] font-light leading-[0.93] tracking-tight ${headlineColor}`}>
            Forged<br />
            in Gold.<br />
            <span className="italic font-normal gold-gradient-text">Worn by Few.</span>
          </h1>

          <p className={`text-sm max-w-sm font-sans font-light leading-relaxed ${subTextColor}`}>
            Hand-crafted bespoke suits, royal silk Jalamias, couture bridal gowns, and velvet evening pieces by master artisans.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/the-men-forge">
              <Button variant="gold" size="lg">The Men Forge</Button>
            </Link>
            <Link href="/the-lady-forge">
              <Button
                variant="outline"
                size="lg"
                className={theme === "dark"
                  ? "border-white/40 text-white hover:border-[#C6A15B] hover:text-[#C6A15B]"
                  : "border-[#050505]/50 text-[#050505] hover:border-[#C6A15B] hover:text-[#C6A15B]"
                }
              >
                The Lady Forge
              </Button>
            </Link>
            <Link
              href="/editorial"
              className={`self-center flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors ${
                theme === "dark"
                  ? "text-white/60 hover:text-[#C6A15B]"
                  : "text-[#050505]/50 hover:text-[#C6A15B]"
              }`}
            >
              View Lookbook <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stats */}
          <div className={`flex items-center gap-7 pt-5 border-t ${statBorderColor}`}>
            {[
              { value: "18+",  label: "Years"    },
              { value: "4",    label: "Ateliers" },
              { value: "100%", label: "Handmade" },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className={`w-px h-6 ${dividerColor}`} />}
                <div>
                  <p className={`font-editorial text-xl font-light ${statNumColor}`}>{s.value}</p>
                  <p className={`text-[9px] uppercase tracking-[0.25em] ${statLabelColor}`}>{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
