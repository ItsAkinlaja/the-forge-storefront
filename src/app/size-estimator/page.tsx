"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "lucide-react";

function estimateMen(h: number, w: number) {
  const chest = Math.round(0.45 * w + 0.1 * h - 4);
  const waist = Math.round(0.4  * w + 0.05 * h + 2);
  const top     = chest <= 40 ? "M" : chest <= 43 ? "L" : chest <= 46 ? "XL" : chest <= 49 ? "XXL" : "3XL";
  const trouser = waist <= 32 ? "M" : waist <= 35 ? "L" : waist <= 38 ? "XL" : waist <= 42 ? "XXL" : "3XL";
  const agbada  = chest <= 40 ? "M" : chest <= 43 ? "L" : chest <= 46 ? "XL" : chest <= 49 ? "XXL" : "3XL";
  const bmi = w / ((h / 100) ** 2);
  return { top, trouser, agbada, confidence: bmi >= 18 && bmi <= 30 ? "High" : "Medium" };
}

function estimateWomen(h: number, w: number) {
  const bust  = Math.round(0.45 * w + 0.08 * h - 2);
  const waist = Math.round(0.35 * w + 0.05 * h + 1);
  const hip   = Math.round(0.48 * w + 0.08 * h - 1);
  const ukSize = bust <= 34 ? "6" : bust <= 36 ? "8" : bust <= 38 ? "10" : bust <= 40 ? "12" : bust <= 43 ? "14" : bust <= 46 ? "16" : bust <= 49 ? "18" : "20";
  const bmi = w / ((h / 100) ** 2);
  return { ukSize, bust: String(bust), waist: String(waist), hip: String(hip), confidence: bmi >= 17 && bmi <= 32 ? "High" : "Medium" };
}

const inputClass = "w-full bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] px-4 py-3.5 text-[#050505] dark:text-white focus:outline-none focus:border-[#050505] dark:focus:border-white placeholder:text-[#BBBBBB] dark:placeholder:text-[#444444] rounded-none";

export default function SizeEstimatorPage() {
  const [gender, setGender] = useState<"men" | "women">("men");
  const [unit,   setUnit]   = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<ReturnType<typeof estimateMen> | ReturnType<typeof estimateWomen> | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const formRef   = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let h = parseFloat(height);
    let w = parseFloat(weight);
    if (!h || !w) return;
    if (unit === "imperial") { h = h * 2.54; w = w * 0.453592; }
    setResult(gender === "men" ? estimateMen(h, w) : estimateWomen(h, w));
    // Scroll to result after a brief render tick
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function reset() {
    setHeight("");
    setWeight("");
    setResult(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  const mensResult   = result && gender === "men"   ? result as ReturnType<typeof estimateMen>   : null;
  const womensResult = result && gender === "women" ? result as ReturnType<typeof estimateWomen> : null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1">

        {/* Header */}
        <section className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] py-16">
          <Container size="default">
            <div className="max-w-xl mx-auto text-center space-y-3">
              <p className="text-[9px] uppercase tracking-[0.5em] text-[#C6A15B] font-semibold font-sans">Style Tools</p>
              <h1 className="font-editorial text-5xl sm:text-6xl text-[#050505] dark:text-white font-light">Size Calculator</h1>
              <p className="text-xs text-[#666666] dark:text-[#8E8E93] font-sans leading-relaxed">
                Enter your height and weight for a quick size suggestion.
              </p>
            </div>
          </Container>
        </section>

        {/* Tool */}
        <section className="py-16">
          <Container size="default">
            <div className="max-w-lg mx-auto space-y-10">

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                {/* Gender */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] mb-3 font-sans">I am shopping for</label>
                  <div className="flex">
                    {(["men", "women"] as const).map((g) => (
                      <button key={g} type="button" onClick={() => { setGender(g); reset(); }}
                        className={`flex-1 py-3.5 text-[11px] uppercase tracking-[0.2em] font-sans font-semibold border transition-all ${
                          gender === g
                            ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] border-[#050505] dark:border-white"
                            : "bg-white dark:bg-[#121212] text-[#888888] dark:text-[#555555] border-[#E5E5E5] dark:border-[#262626] hover:border-[#050505] dark:hover:border-white hover:text-[#050505] dark:hover:text-white"
                        } ${g === "men" ? "border-r-0" : ""}`}
                      >
                        {g === "men" ? "Men" : "Women"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] mb-3 font-sans">Units</label>
                  <div className="flex gap-2">
                    {(["metric", "imperial"] as const).map((u) => (
                      <button key={u} type="button" onClick={() => { setUnit(u); reset(); }}
                        className={`px-5 py-2.5 border text-[10px] uppercase tracking-[0.15em] font-sans transition-all ${
                          unit === u
                            ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] border-[#050505] dark:border-white"
                            : "border-[#E5E5E5] dark:border-[#262626] text-[#888888] hover:border-[#888888] dark:hover:border-white hover:text-[#050505] dark:hover:text-white"
                        }`}
                      >
                        {u === "metric" ? "cm / kg" : "inches / lbs"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Height + Weight */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] mb-2 font-sans">
                      {unit === "metric" ? "Height (cm)" : "Height (in)"}
                    </label>
                    <input type="number" required min="1" step="0.1"
                      placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
                      value={height} onChange={e => { setHeight(e.target.value); setResult(null); }}
                      style={{ fontSize: "16px" }} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] mb-2 font-sans">
                      {unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}
                    </label>
                    <input type="number" required min="1" step="0.1"
                      placeholder={unit === "metric" ? "e.g. 75" : "e.g. 165"}
                      value={weight} onChange={e => { setWeight(e.target.value); setResult(null); }}
                      style={{ fontSize: "16px" }} className={inputClass} />
                  </div>
                </div>

                <button type="submit"
                  className="w-full bg-[#050505] dark:bg-white text-white dark:text-[#050505] py-4 text-[11px] uppercase tracking-[0.3em] font-sans font-semibold hover:bg-[#C6A15B] dark:hover:bg-[#C6A15B] dark:hover:text-white transition-colors">
                  Get My Size
                </button>
              </form>

              {/* Men result */}
              {mensResult && (
                <div ref={resultRef} className="space-y-5 border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-10">
                  <div className="flex items-center justify-between">
                    <h2 className="font-editorial text-2xl text-[#050505] dark:text-white font-light">Estimated Sizes</h2>
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-sans px-2.5 py-1 ${mensResult.confidence === "High" ? "bg-[#C6A15B]/15 text-[#C6A15B]" : "bg-[#F5F5F5] dark:bg-[#1C1C1C] text-[#888888]"}`}>
                      {mensResult.confidence} confidence
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Top / Shirt",  value: mensResult.top },
                      { label: "Trouser",       value: mensResult.trouser },
                      { label: "Agbada",        value: mensResult.agbada },
                    ].map(({ label, value }) => (
                      <div key={label} className="border border-[#E5E5E5] dark:border-[#262626] py-6 text-center">
                        <p className="font-editorial text-4xl text-[#C6A15B] font-light leading-none">{value}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] font-sans mt-2">{label}</p>
                      </div>
                    ))}
                  </div>
                  <DisclaimerNote />
                  <ActionButtons onReset={reset} />
                </div>
              )}

              {/* Women result */}
              {womensResult && (
                <div ref={resultRef} className="space-y-5 border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-10">
                  <div className="flex items-center justify-between">
                    <h2 className="font-editorial text-2xl text-[#050505] dark:text-white font-light">Estimated Size</h2>
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-sans px-2.5 py-1 ${womensResult.confidence === "High" ? "bg-[#C6A15B]/15 text-[#C6A15B]" : "bg-[#F5F5F5] dark:bg-[#1C1C1C] text-[#888888]"}`}>
                      {womensResult.confidence} confidence
                    </span>
                  </div>
                  <div className="border border-[#C6A15B]/40 py-8 text-center">
                    <p className="font-editorial text-6xl text-[#C6A15B] font-light leading-none">UK {womensResult.ukSize}</p>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#888888] dark:text-[#555555] font-sans mt-3">Recommended Size</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Est. Bust",  value: womensResult.bust + " in" },
                      { label: "Est. Waist", value: womensResult.waist + " in" },
                      { label: "Est. Hip",   value: womensResult.hip + " in" },
                    ].map(({ label, value }) => (
                      <div key={label} className="border border-[#E5E5E5] dark:border-[#262626] py-5 text-center">
                        <p className="font-editorial text-2xl text-[#050505] dark:text-white font-light">{value}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] font-sans mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                  <DisclaimerNote />
                  <ActionButtons onReset={reset} />
                </div>
              )}

            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function DisclaimerNote() {
  return (
    <div className="border-l-2 border-[#C6A15B]/50 pl-4 py-1 space-y-1">
      <p className="text-[11px] text-[#888888] dark:text-[#555555] font-sans leading-relaxed">
        <span className="text-[#050505] dark:text-white font-semibold">Note:</span>{" "}
        This estimate is based on average body proportions and may not be accurate for your exact body shape.
        For your true size, refer to the{" "}
        <Link href="/size-guide" className="text-[#C6A15B] underline underline-offset-2 hover:text-[#B5904B] transition-colors">
          full size chart
        </Link>{" "}
        or{" "}
        <Link href="/custom-dressing" className="text-[#C6A15B] underline underline-offset-2 hover:text-[#B5904B] transition-colors">
          contact us
        </Link>{" "}
        for a tailor consultation.
      </p>
    </div>
  );
}

function ActionButtons({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Link href="/size-guide"
        className="flex-1 flex items-center justify-center gap-2 border border-[#050505] dark:border-white text-[#050505] dark:text-white py-3.5 text-[10px] uppercase tracking-[0.25em] font-sans font-semibold hover:border-[#C6A15B] hover:text-[#C6A15B] transition-colors">
        View Full Size Chart <ArrowRight className="w-3.5 h-3.5" />
      </Link>
      <button onClick={onReset}
        className="flex-1 text-[10px] uppercase tracking-[0.25em] text-[#888888] border border-[#E5E5E5] dark:border-[#262626] py-3.5 hover:border-[#888888] transition-colors font-sans">
        Try Again
      </button>
    </div>
  );
}
