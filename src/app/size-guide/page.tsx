"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ChevronDown, Ruler, Sparkles } from "lucide-react";

// ── Size estimation logic ─────────────────────────────────────────────────────

function estimateMensSize(heightCm: number, weightKg: number): {
  top: string; trouser: string; agbada: string; confidence: string;
} {
  const bmi = weightKg / ((heightCm / 100) ** 2);

  let top: string;
  let trouser: string;
  let agbada: string;

  // Top / shirt sizing based on chest estimate from height + weight
  const chest = Math.round(0.45 * weightKg + 0.1 * heightCm - 4);

  if (chest <= 40)      { top = "M";   }
  else if (chest <= 43) { top = "L";   }
  else if (chest <= 46) { top = "XL";  }
  else if (chest <= 49) { top = "XXL"; }
  else                  { top = "3XL"; }

  // Trouser based on waist estimate
  const waist = Math.round(0.4 * weightKg + 0.05 * heightCm + 2);
  if (waist <= 32)      { trouser = "M";   }
  else if (waist <= 35) { trouser = "L";   }
  else if (waist <= 38) { trouser = "XL";  }
  else if (waist <= 42) { trouser = "XXL"; }
  else                  { trouser = "3XL"; }

  // Agbada uses the broader of chest/waist reading
  agbada = chest <= 40 ? "M" : chest <= 43 ? "L" : chest <= 46 ? "XL" : chest <= 49 ? "XXL" : "3XL";

  // Confidence — taller lean builds are more predictable
  const confidence = bmi >= 18 && bmi <= 30 ? "High" : "Medium";

  return { top, trouser, agbada, confidence };
}

function estimateWomensSize(heightCm: number, weightKg: number): {
  ukSize: string; bust: string; waist: string; hip: string; confidence: string;
} {
  const bmi = weightKg / ((heightCm / 100) ** 2);

  const bust  = Math.round(0.45 * weightKg + 0.08 * heightCm - 2);
  const waist = Math.round(0.35 * weightKg + 0.05 * heightCm + 1);
  const hip   = Math.round(0.48 * weightKg + 0.08 * heightCm - 1);

  let ukSize: string;
  if (bust <= 34)      ukSize = "6";
  else if (bust <= 36) ukSize = "8";
  else if (bust <= 38) ukSize = "10";
  else if (bust <= 40) ukSize = "12";
  else if (bust <= 43) ukSize = "14";
  else if (bust <= 46) ukSize = "16";
  else if (bust <= 49) ukSize = "18";
  else                 ukSize = "20";

  const confidence = bmi >= 17 && bmi <= 32 ? "High" : "Medium";

  return {
    ukSize,
    bust: String(bust),
    waist: String(waist),
    hip: String(hip),
    confidence,
  };
}

// ── Table component ───────────────────────────────────────────────────────────

function Table({ headers, rows, highlight }: { headers: string[]; rows: string[][]; highlight?: string }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full min-w-[360px] border-collapse text-xs font-sans">
        <thead>
          <tr className="bg-[#050505] dark:bg-white">
            {headers.map((h) => (
              <th key={h} className="text-white dark:text-[#050505] px-4 py-3 text-left uppercase tracking-[0.2em] font-semibold border border-[#1C1C1C] dark:border-[#E5E5E5] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isHighlighted = highlight && row[0] === highlight;
            return (
              <tr
                key={i}
                className={
                  isHighlighted
                    ? "bg-[#C6A15B]/15 dark:bg-[#C6A15B]/20 ring-2 ring-[#C6A15B] ring-inset"
                    : i % 2 === 0
                    ? "bg-white dark:bg-[#050505]"
                    : "bg-[#F9F9F9] dark:bg-[#0A0A0A]"
                }
              >
                {row.map((cell, j) => (
                  <td key={j} className={`px-4 py-3 border border-[#E5E5E5] dark:border-[#1C1C1C] text-[#050505] dark:text-white ${j === 0 ? "font-bold" : ""} ${isHighlighted && j === 0 ? "text-[#C6A15B]" : ""}`}>
                    {cell}
                    {isHighlighted && j === 0 && <span className="ml-2 text-[9px] text-[#C6A15B] uppercase tracking-widest">Your size</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold font-sans pt-8 pb-3 border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
      {title}
    </h3>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SizeGuidePage() {
  const [gender, setGender]   = useState<"men" | "women">("men");
  const [height, setHeight]   = useState("");
  const [weight, setWeight]   = useState("");
  const [unit, setUnit]       = useState<"metric" | "imperial">("metric");
  const [result, setResult]   = useState<null | ReturnType<typeof estimateMensSize> | ReturnType<typeof estimateWomensSize>>(null);
  const [estimated, setEstimated] = useState(false);

  function handleEstimate(e: React.FormEvent) {
    e.preventDefault();
    let h = parseFloat(height);
    let w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;

    if (unit === "imperial") {
      h = h * 2.54;    // inches to cm
      w = w * 0.453592; // lbs to kg
    }

    if (gender === "men") {
      setResult(estimateMensSize(h, w));
    } else {
      setResult(estimateWomensSize(h, w));
    }
    setEstimated(true);
  }

  function reset() {
    setHeight("");
    setWeight("");
    setResult(null);
    setEstimated(false);
  }

  const heightLabel = unit === "metric" ? "Height (cm)" : "Height (inches)";
  const weightLabel = unit === "metric" ? "Weight (kg)" : "Weight (lbs)";
  const heightPlaceholder = unit === "metric" ? "e.g. 175" : "e.g. 69";
  const weightPlaceholder = unit === "metric" ? "e.g. 75" : "e.g. 165";

  const mensResult   = estimated && gender === "men"   ? result as ReturnType<typeof estimateMensSize>   : null;
  const womensResult = estimated && gender === "women" ? result as ReturnType<typeof estimateWomensSize> : null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">

        {/* Header */}
        <section className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] py-16">
          <Container size="default">
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <p className="text-[9px] uppercase tracking-[0.5em] text-[#C6A15B] font-semibold font-sans">Dare it, Wear it.</p>
              <h1 className="font-editorial text-5xl sm:text-6xl text-[#050505] dark:text-white font-light">Size Guide</h1>
              <p className="text-xs text-[#666666] dark:text-[#8E8E93] font-sans leading-relaxed">
                All measurements in inches. Use our size estimator below or browse the full charts.
              </p>
            </div>
          </Container>
        </section>

        {/* Size Estimator Tool */}
        <section className="py-14 border-b border-[#E5E5E5] dark:border-[#1C1C1C] bg-[#F9F9F9] dark:bg-[#0A0A0A]">
          <Container size="default">
            <div className="max-w-xl mx-auto">

              <div className="flex items-center gap-3 mb-6">
                <Ruler className="w-5 h-5 text-[#C6A15B]" />
                <div>
                  <h2 className="font-editorial text-2xl text-[#050505] dark:text-white font-light">Find Your Size</h2>
                  <p className="text-[11px] text-[#888888] dark:text-[#555555] font-sans">Enter your height and weight for an instant estimate.</p>
                </div>
              </div>

              <form onSubmit={handleEstimate} className="space-y-5">

                {/* Gender toggle */}
                <div className="flex">
                  {(["men", "women"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => { setGender(g); reset(); }}
                      className={`flex-1 py-3 text-[11px] uppercase tracking-[0.2em] font-sans font-semibold border transition-all ${
                        gender === g
                          ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] border-[#050505] dark:border-white"
                          : "bg-white dark:bg-[#121212] text-[#888888] dark:text-[#555555] border-[#E5E5E5] dark:border-[#262626] hover:border-[#050505] dark:hover:border-white"
                      } ${g === "men" ? "border-r-0" : ""}`}
                    >
                      {g === "men" ? "For Men" : "For Women"}
                    </button>
                  ))}
                </div>

                {/* Unit toggle */}
                <div className="flex items-center gap-2 text-[11px] font-sans text-[#888888] dark:text-[#555555]">
                  <span>Units:</span>
                  {(["metric", "imperial"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => { setUnit(u); reset(); }}
                      className={`px-3 py-1 border text-[10px] uppercase tracking-[0.15em] transition-all ${
                        unit === u
                          ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] border-[#050505] dark:border-white"
                          : "border-[#E5E5E5] dark:border-[#262626] hover:border-[#888888]"
                      }`}
                    >
                      {u === "metric" ? "cm / kg" : "in / lbs"}
                    </button>
                  ))}
                </div>

                {/* Height + Weight */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] mb-2 font-sans">{heightLabel}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.1"
                      placeholder={heightPlaceholder}
                      value={height}
                      onChange={e => { setHeight(e.target.value); setEstimated(false); }}
                      style={{ fontSize: "16px" }}
                      className="w-full bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] px-4 py-3 text-[#050505] dark:text-white focus:outline-none focus:border-[#050505] dark:focus:border-white placeholder:text-[#BBBBBB] rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] mb-2 font-sans">{weightLabel}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.1"
                      placeholder={weightPlaceholder}
                      value={weight}
                      onChange={e => { setWeight(e.target.value); setEstimated(false); }}
                      style={{ fontSize: "16px" }}
                      className="w-full bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] px-4 py-3 text-[#050505] dark:text-white focus:outline-none focus:border-[#050505] dark:focus:border-white placeholder:text-[#BBBBBB] rounded-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C6A15B] hover:bg-[#B5904B] text-white py-4 text-[11px] uppercase tracking-[0.3em] font-sans font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Estimate My Size
                </button>
              </form>

              {/* Result */}
              {estimated && mensResult && (
                <div className="mt-6 border border-[#C6A15B]/40 bg-white dark:bg-[#050505] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-xl text-[#050505] dark:text-white font-light">Your Estimated Sizes</h3>
                    <span className={`text-[9px] uppercase tracking-widest font-sans px-2 py-1 ${mensResult.confidence === "High" ? "bg-[#C6A15B]/20 text-[#C6A15B]" : "bg-[#F5F5F5] dark:bg-[#1C1C1C] text-[#888888]"}`}>
                      {mensResult.confidence} confidence
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Top / Shirt",  value: mensResult.top },
                      { label: "Trouser",       value: mensResult.trouser },
                      { label: "Agbada / Body", value: mensResult.agbada },
                    ].map(({ label, value }) => (
                      <div key={label} className="border border-[#E5E5E5] dark:border-[#262626] p-4 text-center">
                        <p className="font-editorial text-3xl text-[#C6A15B] font-light">{value}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] font-sans mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#888888] dark:text-[#555555] font-sans leading-relaxed">
                    This is an estimate based on typical body proportions. For the best fit, scroll down and cross-check with the full size chart below.
                  </p>
                  <button onClick={reset} className="text-[10px] uppercase tracking-[0.2em] text-[#888888] underline hover:text-[#050505] dark:hover:text-white transition-colors font-sans">
                    Reset
                  </button>
                </div>
              )}

              {estimated && womensResult && (
                <div className="mt-6 border border-[#C6A15B]/40 bg-white dark:bg-[#050505] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-xl text-[#050505] dark:text-white font-light">Your Estimated Sizes</h3>
                    <span className={`text-[9px] uppercase tracking-widest font-sans px-2 py-1 ${womensResult.confidence === "High" ? "bg-[#C6A15B]/20 text-[#C6A15B]" : "bg-[#F5F5F5] dark:bg-[#1C1C1C] text-[#888888]"}`}>
                      {womensResult.confidence} confidence
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-[#E5E5E5] dark:border-[#262626] p-4 text-center col-span-2">
                      <p className="font-editorial text-4xl text-[#C6A15B] font-light">UK {womensResult.ukSize}</p>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] font-sans mt-1">Recommended Size</p>
                    </div>
                    {[
                      { label: "Est. Bust",  value: womensResult.bust + " in" },
                      { label: "Est. Waist", value: womensResult.waist + " in" },
                      { label: "Est. Hip",   value: womensResult.hip + " in" },
                    ].map(({ label, value }) => (
                      <div key={label} className="border border-[#E5E5E5] dark:border-[#262626] p-3 text-center">
                        <p className="font-editorial text-xl text-[#050505] dark:text-white font-light">{value}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] font-sans mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#888888] dark:text-[#555555] font-sans leading-relaxed">
                    This is an estimate. Cross-check with the full chart below for best accuracy.
                  </p>
                  <button onClick={reset} className="text-[10px] uppercase tracking-[0.2em] text-[#888888] underline hover:text-[#050505] dark:hover:text-white transition-colors font-sans">
                    Reset
                  </button>
                </div>
              )}

            </div>
          </Container>
        </section>

        {/* Full size charts */}
        <section className="py-16">
          <Container size="default">
            <div className="max-w-3xl mx-auto space-y-16">

              {/* Men */}
              <div>
                <div className="border-b-2 border-[#050505] dark:border-white pb-4 mb-8 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold font-sans mb-1">The Men Forge</p>
                    <h2 className="font-editorial text-4xl text-[#050505] dark:text-white font-light">Men Size Chart</h2>
                  </div>
                  <span className="text-[10px] text-[#888888] dark:text-[#555555] font-sans uppercase tracking-wider">In Inches</span>
                </div>

                <SectionLabel title="Cap Size (Fila)" />
                <Table headers={["Size", "Head Circumference (in)"]} rows={[["S","21 - 21.5"],["M","22 - 22.5"],["L","23 - 23.5"],["XL","24 - 24.5"]]} highlight={mensResult?.top} />

                <SectionLabel title="Agbada Body" />
                <Table headers={["Size","Width (in)","Length (in)"]} rows={[["M","38 - 40","41 - 43"],["L","41 - 43","44 - 46"],["XL","44 - 46","47 - 48"],["XXL","47 - 49","49 - 53"],["3XL","50 - 53","54 - 60"]]} highlight={mensResult?.agbada} />

                <SectionLabel title="Trouser" />
                <Table headers={["Size","Waist (in)","Hip (in)","Thigh (in)","Length (in)"]} rows={[["M","30 - 32","38 - 40","22 - 24","39 - 41"],["L","33 - 35","41 - 43","24 - 26","40 - 42"],["XL","36 - 38","44 - 46","26 - 28","41 - 43"],["XXL","39 - 42","47 - 50","28 - 30","42 - 44"],["3XL","43 - 46","51 - 54","30 - 32","43 - 45"]]} highlight={mensResult?.trouser} />

                <SectionLabel title="Top — Shirt / Kaftan / Agbada Inner" />
                <Table headers={["Size","Chest (in)","Shoulder (in)","Sleeve (in)","Length (in)"]} rows={[["M","38 - 40","17.5 - 18","24 - 25","32 - 34"],["L","41 - 43","18 - 18.5","25 - 26","34 - 36"],["XL","44 - 46","19 - 19.5","25 - 26","36 - 38"],["XXL","47 - 49","20 - 20.5","26 - 27","38 - 40"],["3XL","50 - 53","21 - 21.5","26 - 27","40 - 42"]]} highlight={mensResult?.top} />
              </div>

              {/* Women */}
              <div>
                <div className="border-b-2 border-[#050505] dark:border-white pb-4 mb-8 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold font-sans mb-1">The Lady Forge</p>
                    <h2 className="font-editorial text-4xl text-[#050505] dark:text-white font-light">Women Size Chart</h2>
                  </div>
                  <span className="text-[10px] text-[#888888] dark:text-[#555555] font-sans uppercase tracking-wider">In Inches</span>
                </div>

                <Table headers={["Size (UK)","Bust (in)","Waist (in)","Hip (in)"]} rows={[["6","34","27","37"],["8","36","29","39"],["10","38","31","41"],["12","40","33","43"],["14","43","36","46"],["16","46","39","49"],["18","49","42","52"],["20","51","44","54"]]} highlight={womensResult ? `${womensResult.ukSize}` : undefined} />

                <p className="text-[11px] text-[#666666] dark:text-[#8E8E93] font-sans mt-6 leading-relaxed italic">
                  We would appreciate it if you could send a current picture of yourself with your size.
                </p>
              </div>

              {/* CTA */}
              <div className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-10 text-center space-y-3">
                <p className="text-xs text-[#666666] dark:text-[#8E8E93] font-sans">Still not sure? We will sort you out.</p>
                <Link href="/custom-dressing" className="inline-block px-8 py-3.5 bg-[#C6A15B] text-white text-[10px] uppercase tracking-[0.25em] font-sans font-semibold hover:bg-[#B5904B] transition-colors">
                  Book a Custom Fitting
                </Link>
              </div>

            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
