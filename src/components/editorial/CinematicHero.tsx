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
    /*
      100dvh = exact mobile viewport height, no overflow.
      The navbar is absolutely positioned over this section
      so the video truly starts at the top of the screen.
    */
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

      {/* Dark gradient -- heavier at bottom so text is always legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/85" />

      {/* Content -- pinned bottom left */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-12 sm:pb-20">
        <div className="max-w-xl space-y-5">

          <p className="text-[9px] uppercase tracking-[0.5em] text-[#C6A15B] font-sans font-semibold">
            Haute Couture and Handmade Custom Tailoring
          </p>

          <h1 className="font-editorial text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light leading-[0.93] tracking-tight text-white">
            Forged<br />
            in Gold.<br />
            <span className="italic font-normal gold-gradient-text">Worn by Few.</span>
          </h1>

          <p className="text-sm text-white/70 max-w-sm font-sans font-light leading-relaxed">
            Hand-crafted bespoke suits, royal silk Jalamias, couture bridal gowns, and velvet evening pieces by master artisans.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/the-men-forge">
              <Button variant="gold" size="lg">The Men Forge</Button>
            </Link>
            <Link href="/the-lady-forge">
              <Button variant="outline" size="lg" className="border-white/50 text-white hover:border-[#C6A15B] hover:text-[#C6A15B]">
                The Lady Forge
              </Button>
            </Link>
            <Link
              href="/editorial"
              className="self-center flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-[#C6A15B] font-semibold transition-colors font-sans"
            >
              View Lookbook <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            {[
              { value: "18+",  label: "Years"    },
              { value: "4",    label: "Ateliers" },
              { value: "100%", label: "Handmade" },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-px h-5 bg-white/10" />}
                <div>
                  <p className="font-editorial text-lg text-white font-light">{s.value}</p>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
