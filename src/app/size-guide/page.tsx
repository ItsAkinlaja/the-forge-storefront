"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
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
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-[#050505]" : "bg-[#F9F9F9] dark:bg-[#0A0A0A]"}>
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 border border-[#E5E5E5] dark:border-[#1C1C1C] text-[#050505] dark:text-white ${j === 0 ? "font-bold" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
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

export default function SizeGuidePage() {
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
                All measurements are in inches. When between sizes, size up for a relaxed fit or size down for a fitted look.
              </p>
            </div>
          </Container>
        </section>

        {/* Charts */}
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
                <Table headers={["Size","Head Circumference (in)"]} rows={[["S","21 - 21.5"],["M","22 - 22.5"],["L","23 - 23.5"],["XL","24 - 24.5"]]} />

                <SectionLabel title="Agbada Body" />
                <Table headers={["Size","Width (in)","Length (in)"]} rows={[["M","38 - 40","41 - 43"],["L","41 - 43","44 - 46"],["XL","44 - 46","47 - 48"],["XXL","47 - 49","49 - 53"],["3XL","50 - 53","54 - 60"]]} />

                <SectionLabel title="Trouser" />
                <Table headers={["Size","Waist (in)","Hip (in)","Thigh (in)","Length (in)"]} rows={[["M","30 - 32","38 - 40","22 - 24","39 - 41"],["L","33 - 35","41 - 43","24 - 26","40 - 42"],["XL","36 - 38","44 - 46","26 - 28","41 - 43"],["XXL","39 - 42","47 - 50","28 - 30","42 - 44"],["3XL","43 - 46","51 - 54","30 - 32","43 - 45"]]} />

                <SectionLabel title="Top — Shirt / Kaftan / Agbada Inner" />
                <Table headers={["Size","Chest (in)","Shoulder (in)","Sleeve (in)","Length (in)"]} rows={[["M","38 - 40","17.5 - 18","24 - 25","32 - 34"],["L","41 - 43","18 - 18.5","25 - 26","34 - 36"],["XL","44 - 46","19 - 19.5","25 - 26","36 - 38"],["XXL","47 - 49","20 - 20.5","26 - 27","38 - 40"],["3XL","50 - 53","21 - 21.5","26 - 27","40 - 42"]]} />
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

                <Table headers={["Size (UK)","Bust (in)","Waist (in)","Hip (in)"]} rows={[["6","34","27","37"],["8","36","29","39"],["10","38","31","41"],["12","40","33","43"],["14","43","36","46"],["16","46","39","49"],["18","49","42","52"],["20","51","44","54"]]} />

                <p className="text-[11px] text-[#666666] dark:text-[#8E8E93] font-sans mt-6 leading-relaxed italic">
                  We would appreciate it if you could send a current picture of yourself with your size.
                </p>
              </div>

              {/* CTA */}
              <div className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-[#E5E5E5] dark:border-[#262626] p-6 space-y-3">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold font-sans">Not sure of your size?</p>
                    <p className="font-editorial text-xl text-[#050505] dark:text-white font-light">Try the Size Calculator</p>
                    <p className="text-[11px] text-[#666666] dark:text-[#8E8E93] font-sans leading-relaxed">Enter your height and weight for a quick size estimate.</p>
                    <Link href="/size-estimator" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#050505] dark:text-white border-b border-[#050505] dark:border-white hover:text-[#C6A15B] hover:border-[#C6A15B] transition-colors pb-0.5">
                      Open Calculator
                    </Link>
                  </div>
                  <div className="border border-[#E5E5E5] dark:border-[#262626] p-6 space-y-3">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold font-sans">Want a perfect fit?</p>
                    <p className="font-editorial text-xl text-[#050505] dark:text-white font-light">Book a Custom Fitting</p>
                    <p className="text-[11px] text-[#666666] dark:text-[#8E8E93] font-sans leading-relaxed">Send your measurements and we will make it to your exact size.</p>
                    <Link href="/custom-dressing" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#050505] dark:text-white border-b border-[#050505] dark:border-white hover:text-[#C6A15B] hover:border-[#C6A15B] transition-colors pb-0.5">
                      Book a Fitting
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
