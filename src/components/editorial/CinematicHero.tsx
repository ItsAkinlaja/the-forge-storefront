"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const VIDEO_SRC    = "https://ik.imagekit.io/scmchurch/IMG_9019.MOV/ik-video.mp4";
const VIDEO_POSTER = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80";

const STATS = [
  { end: 18,   suffix: "+",  label: "Years"     },
  { end: 5000, suffix: "+",  label: "Customers" },
  { end: 100,  suffix: "%",  label: "Handmade"  },
];

function useCountUp(end: number, duration = 1800, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, started]);

  return count;
}

function StatItem({ end, suffix, label, started }: { end: number; suffix: string; label: string; started: boolean }) {
  const count = useCountUp(end, end >= 1000 ? 2000 : 1400, started);
  return (
    <div>
      <p className="font-editorial text-xl sm:text-2xl text-white font-light tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-[9px] uppercase tracking-[0.25em] text-white/60">{label}</p>
    </div>
  );
}

export function CinematicHero() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.9;
  }, []);

  // Start count-up when stats row enters viewport
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden flex flex-col">

      <video
        ref={videoRef}
        autoPlay muted loop playsInline preload="metadata"
        poster={VIDEO_POSTER}
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

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
              Forge Gallery <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stats with count-up */}
          <div ref={statsRef} className="flex items-center gap-6 pt-4 border-t border-white/15">
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-px h-5 bg-white/15" />}
                <StatItem end={s.end} suffix={s.suffix} label={s.label} started={started} />
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
