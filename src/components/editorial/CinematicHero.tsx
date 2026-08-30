"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const VIDEO_SRC    = "https://ik.imagekit.io/scmchurch/IMG_9019.MOV/ik-video.mp4";
const VIDEO_POSTER = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80";

export function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
    }
  }, []);

  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden flex flex-col">

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

      {/* Base dark tint -- ensures video never overpowers text */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Bottom gradient -- extra depth behind the text block */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Left vignette -- pulls focus to the text */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-12 sm:pb-20">
        <div className="max-w-xl space-y-5">

          <p className="text-[9px] uppercase tracking-[0.5em] text-[#C6A15B] font-sans font-semibold drop-shadow-sm">
            Dare it, Wear it!
          </p>

          <h1 className="font-editorial text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light leading-[0.93] tracking-tight text-white drop-shadow-md">
            Forged<br />
            in Gold.<br />
            <span className="italic font-normal gold-gradient-text">Worn by Few.</span>
          </h1>

          <p className="text-sm text-white/85 max-w-sm font-sans font-light leading-relaxed drop-shadow-sm">
            Premium shirts, street looks, jalabias, dinner dresses and more — made for the Nigerian who dresses with purpose.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/the-men-forge">
              <Button variant="gold" size="lg">The Men Forge</Button>
            </Link>
            <Link href="/the-lady-forge">
              <Button variant="outline" size="lg" className="border-white/60 text-white hover:border-[#C6A15B] hover:text-[#C6A15B]">
                The Lady Forge
              </Button>
            </Link>
            <Link
              href="/editorial"
              className="self-center flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-[#C6A15B] font-semibold transition-colors font-sans"
            >
              View Lookbook <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/15">
            {[
              { value: "18+",  label: "Years"    },
              { value: "4",    label: "Ateliers" },
              { value: "100%", label: "Handmade" },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-px h-5 bg-white/15" />}
                <div>
                  <p className="font-editorial text-lg text-white font-light">{s.value}</p>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/60">{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
