"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Scissors, CheckCircle, Clock, Calendar, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Clock,
    title: "1. Initial Fitting Consultation",
    desc: "Meet our atelier consultants in Lagos, Abuja, London, Paris, or via virtual studio to review fabric swatches and silhouette references.",
  },
  {
    icon: Scissors,
    title: "2. Individual Pattern Drafting",
    desc: "A unique master pattern is cut to account for your shoulders, posture, stance, and drape preferences.",
  },
  {
    icon: ShieldCheck,
    title: "3. Final Presentation and Delivery",
    desc: "Hand-stitching, 24K gold embroidery, and final fitting validation before delivery in our mahogany garment trunk.",
  },
];

export default function CustomDressingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "",
    garmentType: "jalamia-kaftans",
    preferredDate: "",
    location: "Lagos Atelier (Ikoyi)",
    notes: "",
  });

  const inputClass = "w-full bg-[#F9F9F9] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] p-3.5 text-xs text-[#050505] dark:text-white focus:outline-none focus:border-[#050505] dark:focus:border-white placeholder:text-[#AAAAAA]";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="relative h-[45vh] min-h-[360px] w-full flex items-end justify-start overflow-hidden border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
          <Image
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1800&q=85"
            alt="Bespoke Custom Tailoring Atelier"
            fill
            priority
            className="object-cover object-top brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
          <div className="relative z-10 px-8 sm:px-16 pb-12 space-y-3 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C6A15B] font-semibold flex items-center gap-2">
              <Scissors className="w-3.5 h-3.5" />
              Private Atelier Consultation
            </p>
            <h1 className="font-editorial text-5xl sm:text-6xl text-white font-light leading-tight">
              Handmade Custom Dressing
            </h1>
            <p className="text-xs text-[#B0B0B0] font-light leading-relaxed max-w-md">
              Book a private fitting session with our master tailoring team in Lagos, Abuja, London, or Paris.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-white dark:bg-[#050505]">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Process */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold">The Bespoke Experience</p>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#050505] dark:text-white font-light">Crafted Exclusively For Your Persona</h2>
                </div>
                <div className="space-y-3">
                  {steps.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-4 p-5 bg-[#F9F9F9] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#1C1C1C]">
                      <Icon className="w-5 h-5 text-[#C6A15B] flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-editorial text-lg text-[#050505] dark:text-white">{title}</h4>
                        <p className="text-xs text-[#666666] dark:text-[#8E8E93] mt-1 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-7 border border-[#E5E5E5] dark:border-[#262626] p-8 sm:p-12">
                {!submitted ? (
                  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                    <div className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-5">
                      <h3 className="font-editorial text-2xl text-[#050505] dark:text-white font-light">Request Private Atelier Consultation</h3>
                      <p className="text-xs text-[#888888] dark:text-[#555555] mt-1">Our director will review your request within 24 hours.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888888] dark:text-[#555555] mb-2">Full Name *</label>
                        <input type="text" required placeholder="Chief / Dr / Mr Alexander" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888888] dark:text-[#555555] mb-2">Email Address *</label>
                        <input type="email" required placeholder="your.name@domain.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888888] dark:text-[#555555] mb-2">Phone / WhatsApp *</label>
                        <input type="tel" required placeholder="+234 800 000 0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888888] dark:text-[#555555] mb-2">Preferred Location *</label>
                        <select value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className={inputClass}>
                          <option>Lagos Atelier (Ikoyi)</option>
                          <option>Abuja Atelier (Maitama)</option>
                          <option>London Studio (Mayfair)</option>
                          <option>Paris Atelier</option>
                          <option>Virtual Consultation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888888] dark:text-[#555555] mb-2">Garment Type *</label>
                        <select value={formData.garmentType} onChange={e => setFormData({ ...formData, garmentType: e.target.value })} className={inputClass}>
                          <option value="jalamia-kaftans">Royal Jalamia and Kaftan</option>
                          <option value="suits-blazers">Bespoke Suit or Tuxedo</option>
                          <option value="wedding-dresses">Wedding Dress and Bridal</option>
                          <option value="couture-gowns">Gala Evening Gown</option>
                          <option value="luxury-coats">Luxury Cashmere Overcoat</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888888] dark:text-[#555555] mb-2">Preferred Date</label>
                        <input type="date" value={formData.preferredDate} onChange={e => setFormData({ ...formData, preferredDate: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#888888] dark:text-[#555555] mb-2">Styling and Fabric Notes</label>
                      <textarea rows={4} placeholder="Describe your vision, event, fabric preferences (Velvet, Silk, Aso-Oke, Brocade), embroidery ideas..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className={`${inputClass} resize-none`} />
                    </div>
                    <Button variant="gold" size="lg" className="w-full py-4 flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Submit Atelier Consultation Request
                    </Button>
                  </form>
                ) : (
                  <div className="py-16 text-center space-y-6">
                    <CheckCircle className="w-14 h-14 text-[#C6A15B] mx-auto stroke-[1]" />
                    <h3 className="font-editorial text-3xl text-[#050505] dark:text-white font-light">Consultation Request Received</h3>
                    <p className="text-xs text-[#666666] dark:text-[#8E8E93] max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="text-[#050505] dark:text-white font-semibold">{formData.fullName}</span>. Our Senior Director will reach out to you at <span className="text-[#C6A15B]">{formData.email}</span> to confirm your private session in {formData.location}.
                    </p>
                    <Button variant="outline" size="md" onClick={() => setSubmitted(false)}>Submit Another Request</Button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}