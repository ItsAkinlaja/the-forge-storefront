"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  Scissors,
  CheckCircle,
  MessageSquare,
  Ruler,
  Package,
  UploadCloud,
  X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Gender = "men" | "women" | "";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  garmentType: string;
  description: string;
  occasion: string;
  preferredColours: string;
  budget: string;
  otherGarmentType: string;
  sampleImages: File[];
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  garmentType?: string;
  description?: string;
  budget?: string;
  images?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const WP_BASE = "https://central.theforgebrand.shop";

const GARMENT_OPTIONS: Record<"men" | "women", string[]> = {
  men: [
    "Jalabiya",
    "Danshiki",
    "2-Piece Outfit",
    "Shirt",
    "Cargo Pants",
    "Jacket",
    "Palazzo Pant",
    "Cap",
    "Other",
  ],
  women: [
    "Corporate Dress",
    "Blazer",
    "2-Piece Outfit",
    "Dinner Dress",
    "Birthday Dress",
    "Other",
  ],
};

const BUDGET_OPTIONS = [
  "Under NGN 30,000",
  "NGN 30,000 - 60,000",
  "NGN 60,000 - 100,000",
  "NGN 100,000 - 200,000",
  "Above NGN 200,000",
];

const HOW_IT_WORKS = [
  {
    icon: MessageSquare,
    title: "Describe Your Style",
    desc: "Tell us what you have in mind — the occasion, the vibe, colours, and any reference images you have.",
  },
  {
    icon: Ruler,
    title: "We Get to Work",
    desc: "Our team reviews your request, reaches out to confirm details, and gets your piece in production.",
  },
  {
    icon: Package,
    title: "Receive Your Order",
    desc: "Your custom piece is made, quality checked, and delivered to you.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const inputClass =
  "w-full bg-[#F9F9F9] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] p-3.5 text-xs text-[#050505] dark:text-white focus:outline-none focus:border-[#050505] dark:focus:border-white placeholder:text-[#AAAAAA] rounded-none";

const labelClass =
  "block text-[11px] uppercase tracking-[0.18em] text-[#888888] dark:text-[#555555] mb-2 font-sans";

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  if (!form.gender) errors.gender = "Please select Men or Women.";
  if (!form.garmentType) errors.garmentType = "Please select a garment type.";
  if (!form.description.trim()) errors.description = "Please describe what you want.";
  if (!form.budget) errors.budget = "Please select a budget range.";
  return errors;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CustomDressingPage() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    garmentType: "",
    description: "",
    occasion: "",
    preferredColours: "",
    budget: "",
    otherGarmentType: "",
    sampleImages: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Field helpers ──────────────────────────────────────────────────────────

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof FormErrors];
        return next;
      });
    }
  }

  function setGender(g: "men" | "women") {
    setForm((prev) => ({ ...prev, gender: g, garmentType: "", otherGarmentType: "" }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.gender;
      delete next.garmentType;
      return next;
    });
  }

  // ── Image handling ─────────────────────────────────────────────────────────

  const addImages = useCallback(
    (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const current = form.sampleImages;
      const remaining = 3 - current.length;
      if (remaining <= 0) return;

      const valid: File[] = [];
      for (const file of fileArr.slice(0, remaining)) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            images: "Only JPG, PNG, and WebP files are allowed.",
          }));
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            images: `${file.name} exceeds the 5MB size limit.`,
          }));
          return;
        }
        valid.push(file);
      }

      setErrors((prev) => {
        const next = { ...prev };
        delete next.images;
        return next;
      });
      setForm((prev) => ({
        ...prev,
        sampleImages: [...prev.sampleImages, ...valid],
      }));
    },
    [form.sampleImages]
  );

  function removeImage(idx: number) {
    setForm((prev) => ({
      ...prev,
      sampleImages: prev.sampleImages.filter((_, i) => i !== idx),
    }));
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addImages(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addImages(e.dataTransfer.files);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const data = new FormData();
      data.append("fullName", form.fullName.trim());
      data.append("email", form.email.trim());
      data.append("phone", form.phone.trim());
      data.append("gender", form.gender);
      data.append("garmentType", form.garmentType === "Other" && form.otherGarmentType.trim() ? form.otherGarmentType.trim() : form.garmentType);
      data.append("description", form.description.trim());
      data.append("occasion", form.occasion.trim());
      data.append("preferredColours", form.preferredColours.trim());
      data.append("budget", form.budget);
      form.sampleImages.forEach((file) => {
        data.append("sampleImages[]", file);
      });

      const res = await fetch(`${WP_BASE}/wp-json/forge/v1/custom-requests`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { message?: string }).message || "Something went wrong. Please try again."
        );
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Reset ──────────────────────────────────────────────────────────────────

  function resetForm() {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      gender: "",
      garmentType: "",
      description: "",
      occasion: "",
      preferredColours: "",
      budget: "",
      otherGarmentType: "",
      sampleImages: [],
    });
    setErrors({});
    setSubmitError("");
    setSubmitted(false);
  }

  const firstName = form.fullName.split(" ")[0] || form.fullName;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="relative h-[45vh] min-h-[360px] w-full flex items-end justify-start overflow-hidden border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
          <Image
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1800&q=85"
            alt="Custom clothing at The Forge"
            fill
            priority
            className="object-cover object-top brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
          <div className="relative z-10 px-8 sm:px-16 pb-12 space-y-3 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C6A15B] font-semibold flex items-center gap-2">
              <Scissors className="w-3.5 h-3.5" />
              Custom Order Request
            </p>
            <h1 className="font-editorial text-5xl sm:text-6xl text-white font-light leading-tight">
              Tell Us What You Want. We Make It.
            </h1>
            <p className="text-xs text-[#B0B0B0] font-light leading-relaxed max-w-md">
              Submit your custom request and our team will reach out within 24 hours.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-white dark:bg-[#050505]">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

              {/* ── Left: How It Works ── */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold font-sans">
                    How It Works
                  </p>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#050505] dark:text-white font-light leading-tight">
                    Tell Us What You Want. We Make It.
                  </h2>
                </div>

                <div className="space-y-4">
                  {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, idx) => (
                    <div
                      key={title}
                      className="flex gap-4 p-5 bg-[#F9F9F9] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#1C1C1C]"
                    >
                      <div className="flex-shrink-0 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-[#C6A15B] font-sans">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <Icon className="w-5 h-5 text-[#C6A15B]" />
                      </div>
                      <div>
                        <h4 className="font-editorial text-lg text-[#050505] dark:text-white leading-snug">
                          {title}
                        </h4>
                        <p className="text-xs text-[#666666] dark:text-[#8E8E93] mt-1 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-[#888888] dark:text-[#555555] leading-relaxed border-l-2 border-[#C6A15B] pl-4 font-sans">
                  We accept custom requests for both Men and Women. Turnaround is typically 7 to 14
                  working days depending on complexity.
                </p>
              </div>

              {/* ── Right: Form ── */}
              <div className="lg:col-span-7 border border-[#E5E5E5] dark:border-[#262626] p-8 sm:p-12">
                {submitted ? (
                  /* ── Success state ── */
                  <div className="py-16 text-center space-y-6">
                    <CheckCircle className="w-14 h-14 text-[#C6A15B] mx-auto stroke-[1]" />
                    <h3 className="font-editorial text-3xl text-[#050505] dark:text-white font-light">
                      Request Received
                    </h3>
                    <p className="text-xs text-[#666666] dark:text-[#8E8E93] max-w-md mx-auto leading-relaxed">
                      Thanks{" "}
                      <span className="text-[#050505] dark:text-white font-semibold">
                        {firstName}
                      </span>
                      . We have received your custom request and will reach out to you at{" "}
                      <span className="text-[#C6A15B]">{form.email}</span> within 24 hours.
                    </p>
                    <Button variant="outline" size="md" onClick={resetForm}>
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  /* ── Form ── */
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-5">
                      <h3 className="font-editorial text-2xl text-[#050505] dark:text-white font-light">
                        Custom Order Request
                      </h3>
                      <p className="text-xs text-[#888888] dark:text-[#555555] mt-1 font-sans">
                        Fill in the form below. Our team reviews every request and will reach out
                        within 24 hours.
                      </p>
                    </div>

                    {/* Row 1: Full Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>
                          Full Name <span className="text-[#C6A15B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={form.fullName}
                          onChange={(e) => set("fullName", e.target.value)}
                          className={`${inputClass} ${errors.fullName ? "border-red-500" : ""}`} style={{ fontSize: "16px" }}
                        />
                        {errors.fullName && (
                          <p className="text-[11px] text-red-500 mt-1 font-sans">
                            {errors.fullName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>
                          Email Address <span className="text-[#C6A15B]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          className={`${inputClass} ${errors.email ? "border-red-500" : ""}`} style={{ fontSize: "16px" }}
                        />
                        {errors.email && (
                          <p className="text-[11px] text-red-500 mt-1 font-sans">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Phone */}
                    <div>
                      <label className={labelClass}>
                        Phone / WhatsApp <span className="text-[#C6A15B]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 800 000 0000"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className={`${inputClass} ${errors.phone ? "border-red-500" : ""}`} style={{ fontSize: "16px" }}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-500 mt-1 font-sans">{errors.phone}</p>
                      )}
                    </div>

                    {/* Row 3: Gender toggle */}
                    <div>
                      <label className={labelClass}>
                        Gender <span className="text-[#C6A15B]">*</span>
                      </label>
                      <div className="flex">
                        {(["men", "women"] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`flex-1 py-3.5 text-xs uppercase tracking-[0.18em] font-sans font-semibold border transition-all duration-200 ${
                              form.gender === g
                                ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] border-[#050505] dark:border-white"
                                : "bg-[#F9F9F9] dark:bg-[#121212] text-[#888888] dark:text-[#555555] border-[#E5E5E5] dark:border-[#262626] hover:border-[#050505] dark:hover:border-white hover:text-[#050505] dark:hover:text-white"
                            } ${g === "men" ? "border-r-0" : ""}`}
                          >
                            For {g === "men" ? "Men" : "Women"}
                          </button>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="text-[11px] text-red-500 mt-1 font-sans">{errors.gender}</p>
                      )}
                    </div>

                    {/* Row 4: Garment Type */}
                    <div>
                      <label className={labelClass}>
                        Garment Type <span className="text-[#C6A15B]">*</span>
                      </label>
                      <select
                        value={form.garmentType}
                        onChange={(e) => set("garmentType", e.target.value)}
                        disabled={!form.gender}
                        className={`${inputClass} ${errors.garmentType ? "border-red-500" : ""} disabled:opacity-50 disabled:cursor-not-allowed`} style={{ fontSize: "16px" }}
                      >
                        <option value="">
                          {form.gender ? "Select garment type" : "Select gender first"}
                        </option>
                        {form.gender &&
                          GARMENT_OPTIONS[form.gender].map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                      </select>
                      {errors.garmentType && (
                        <p className="text-[11px] text-red-500 mt-1 font-sans">
                          {errors.garmentType}
                        </p>
                      )}
                      {/* Show free-text input when Other is selected */}
                      {form.garmentType === "Other" && (
                        <div className="mt-3">
                          <label className={labelClass}>
                            Describe the garment <span className="text-[#C6A15B]">*</span>
                          </label>
                          <input
                            type="text"
                            autoFocus
                            placeholder="e.g. Agbada, Shorts, Hoodie, Skirt..."
                            value={form.otherGarmentType ?? ""}
                            onChange={(e) => set("otherGarmentType" as keyof FormState, e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      )}
                    </div>

                    {/* Row 5: Description */}
                    <div>
                      <label className={labelClass}>
                        Describe What You Want <span className="text-[#C6A15B]">*</span>
                      </label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Describe the style, cut, fit, details you want. The more specific the better."
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        className={`${inputClass} resize-none ${errors.description ? "border-red-500" : ""}`} style={{ fontSize: "16px" }}
                      />
                      {errors.description && (
                        <p className="text-[11px] text-red-500 mt-1 font-sans">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Row 6: Occasion + Colours */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Occasion</label>
                        <input
                          type="text"
                          placeholder="e.g. Wedding, Birthday, Work, Night out, Everyday wear"
                          value={form.occasion}
                          onChange={(e) => set("occasion", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Preferred Colours</label>
                        <input
                          type="text"
                          placeholder="e.g. Black, Gold, Burgundy, White and Navy"
                          value={form.preferredColours}
                          onChange={(e) => set("preferredColours", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Row 7: Budget */}
                    <div>
                      <label className={labelClass}>
                        Budget Range <span className="text-[#C6A15B]">*</span>
                      </label>
                      <select
                        value={form.budget}
                        onChange={(e) => set("budget", e.target.value)}
                        className={`${inputClass} ${errors.budget ? "border-red-500" : ""}`} style={{ fontSize: "16px" }}
                      >
                        <option value="">Select budget range</option>
                        {BUDGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.budget && (
                        <p className="text-[11px] text-red-500 mt-1 font-sans">{errors.budget}</p>
                      )}
                    </div>

                    {/* Row 8: Image upload */}
                    <div>
                      <label className={labelClass}>
                        Upload Sample / Reference Images{" "}
                        <span className="normal-case tracking-normal text-[#AAAAAA]">
                          (optional)
                        </span>
                      </label>
                      <p className="text-[11px] text-[#888888] dark:text-[#555555] mb-3 font-sans">
                        Upload up to 3 reference photos. JPG, PNG, or WebP. Max 5MB each.
                      </p>

                      {/* Drop zone */}
                      {form.sampleImages.length < 3 && (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                            dragOver
                              ? "border-[#C6A15B] bg-[#C6A15B]/5"
                              : "border-[#E5E5E5] dark:border-[#262626] hover:border-[#050505] dark:hover:border-white"
                          }`}
                        >
                          <UploadCloud className="w-8 h-8 text-[#C6A15B]" />
                          <div className="text-center">
                            <p className="text-xs text-[#050505] dark:text-white font-sans">
                              Drag and drop images here, or{" "}
                              <span className="text-[#C6A15B] underline underline-offset-2">
                                browse
                              </span>
                            </p>
                            <p className="text-[11px] text-[#AAAAAA] mt-1 font-sans">
                              {3 - form.sampleImages.length} slot
                              {3 - form.sampleImages.length !== 1 ? "s" : ""} remaining
                            </p>
                          </div>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                      />

                      {/* Previews */}
                      {form.sampleImages.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {form.sampleImages.map((file, idx) => (
                            <div
                              key={`${file.name}-${idx}`}
                              className="flex items-center gap-3 border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#F9F9F9] dark:bg-[#0A0A0A]"
                            >
                              <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden border border-[#E5E5E5] dark:border-[#262626]">
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#050505] dark:text-white font-sans truncate">
                                  {file.name}
                                </p>
                                <p className="text-[10px] text-[#888888] dark:text-[#555555] font-sans">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-[#E5E5E5] dark:border-[#262626] text-[#888888] hover:text-[#050505] dark:hover:text-white hover:border-[#050505] dark:hover:border-white transition-all"
                                aria-label="Remove image"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {errors.images && (
                        <p className="text-[11px] text-red-500 mt-2 font-sans">{errors.images}</p>
                      )}
                    </div>

                    {/* Submit error */}
                    {submitError && (
                      <div className="border border-red-500/30 bg-red-500/5 p-4">
                        <p className="text-xs text-red-500 font-sans">{submitError}</p>
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      disabled={submitting}
                      className="w-full py-4"
                    >
                      {submitting ? "Sending..." : "Send Custom Request"}
                    </Button>
                  </form>
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
