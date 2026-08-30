"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scissors, CheckCircle, Info } from "lucide-react";
import { Product, BespokeMeasurementData } from "@/types";
import { useCart } from "@/components/cart/CartContext";
import { Button } from "@/components/ui/Button";

interface CustomFitDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomFitDrawer({ product, isOpen, onClose }: CustomFitDrawerProps) {
  const { addToCart } = useCart();
  const [step, setStep] = useState<"form" | "success">("form");

  const [formData, setFormData] = useState<BespokeMeasurementData>({
    chestOrBust: "",
    waist: "",
    hips: "",
    shoulderWidth: "",
    sleeveLength: "",
    height: "",
    fabricPreference: product?.bespokeOptions?.availableFabrics[0]?.name || "Default Luxury Fabric",
    customNotes: ""
  });

  if (!product) return null;

  const handleInputChange = (field: keyof BespokeMeasurementData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToCart(product, "Bespoke Custom Fit", formData);
    setStep("success");
  };

  const handleResetAndClose = () => {
    setStep("form");
    onClose();
  };

  const inputClass = "w-full bg-white dark:bg-[#121212] border border-[#E2DFD7] dark:border-[#262626] px-3.5 py-2.5 text-xs text-[#050505] dark:text-white focus:outline-none focus:border-[#B58A38] dark:focus:border-[#C6A15B]";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[540px] bg-[#F9F8F6] dark:bg-[#0A0A0A] text-[#050505] dark:text-white border-l border-[#E2DFD7] dark:border-[#262626] z-[101] flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E2DFD7] dark:border-[#262626] flex items-center justify-between sticky top-0 bg-[#F9F8F6] dark:bg-[#0A0A0A] z-10">
              <div className="flex items-center gap-3">
                <Scissors className="w-5 h-5 text-[#B58A38] dark:text-[#C6A15B]" />
                <div>
                  <h2 className="font-editorial text-xl text-[#050505] dark:text-white tracking-wider uppercase">
                    Custom Fitting
                  </h2>
                  <p className="text-[10px] text-[#B58A38] dark:text-[#C6A15B] uppercase tracking-[0.2em]">
                    {product.name}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-[#646469] dark:text-[#8E8E93] hover:text-[#050505] dark:hover:text-white transition-colors p-2" aria-label="Close Custom Fit Drawer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 space-y-6">
              {step === "form" ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white dark:bg-[#121212] border border-[#E2DFD7] dark:border-[#262626] p-4 flex gap-3 text-xs text-[#555555] dark:text-[#A0A0A0]">
                    <Info className="w-5 h-5 text-[#B58A38] dark:text-[#C6A15B] flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Our master atelier creates an individualized paper pattern for your garment. Enter your measurements below (in inches or cm) or leave fields blank to consult with our master tailor post-checkout.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-[#B58A38] dark:text-[#C6A15B] font-semibold border-b border-[#E2DFD7] dark:border-[#1C1C1C] pb-2">
                      Key Measurements
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { field: "chestOrBust" as const, label: product.mainCategory === "the-men-forge" ? "Chest (in/cm)" : "Bust / Underbust", placeholder: "e.g. 40 in / 102 cm" },
                        { field: "waist" as const, label: "Waist (in/cm)", placeholder: "e.g. 32 in / 81 cm" },
                        { field: "hips" as const, label: "Hips (in/cm)", placeholder: "e.g. 38 in / 96 cm" },
                        { field: "shoulderWidth" as const, label: "Shoulder Width", placeholder: "e.g. 18 in / 45 cm" },
                        { field: "sleeveLength" as const, label: "Sleeve / Arm Length", placeholder: "e.g. 25 in / 63 cm" },
                        { field: "height" as const, label: "Total Height", placeholder: "e.g. 6 ft 1 in / 185 cm" },
                      ].map(({ field, label, placeholder }) => (
                        <div key={field}>
                          <label className="block text-[11px] uppercase tracking-wider text-[#646469] dark:text-[#8E8E93] mb-1.5">{label}</label>
                          <input type="text" placeholder={placeholder} value={formData[field]} onChange={e => handleInputChange(field, e.target.value)} className={inputClass} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {product.bespokeOptions?.availableFabrics && (
                    <div className="space-y-3">
                      <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-[#B58A38] dark:text-[#C6A15B] font-semibold border-b border-[#E2DFD7] dark:border-[#1C1C1C] pb-2">
                        Select Custom Fabric / Colorway
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {product.bespokeOptions.availableFabrics.map(fab => (
                          <label
                            key={fab.id}
                            className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${
                              formData.fabricPreference === fab.name
                                ? "bg-white dark:bg-[#1A1813] border-[#B58A38] dark:border-[#C6A15B]"
                                : "bg-white dark:bg-[#121212] border-[#E2DFD7] dark:border-[#262626] hover:border-[#888888]"
                            }`}
                          >
                            <input type="radio" name="fabric" checked={formData.fabricPreference === fab.name} onChange={() => handleInputChange("fabricPreference", fab.name)} className="accent-[#B58A38] dark:accent-[#C6A15B]" />
                            <span className="w-4 h-4 rounded-full border border-[#888888] flex-shrink-0" style={{ backgroundColor: fab.colorHex }} />
                            <span className="text-xs text-[#050505] dark:text-white font-medium">{fab.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#646469] dark:text-[#8E8E93]">Personal Fit Requests / Atelier Notes</label>
                    <textarea rows={3} placeholder="e.g. Prefer athletic drop, extra room at shoulders, specific embroidery placement..." value={formData.customNotes} onChange={e => handleInputChange("customNotes", e.target.value)} className={`${inputClass} resize-none`} />
                  </div>

                  <Button variant="gold" size="lg" className="w-full py-4 flex items-center justify-center gap-2">
                    <Scissors className="w-4 h-4" />
                    <span>Attach Custom Fit &amp; Add To Bag</span>
                  </Button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-6">
                  <CheckCircle className="w-16 h-16 text-[#B58A38] dark:text-[#C6A15B] mx-auto stroke-[1]" />
                  <h3 className="font-editorial text-3xl text-[#050505] dark:text-white">Custom Fitting Attached</h3>
                  <p className="text-xs text-[#555555] dark:text-[#A0A0A0] max-w-sm mx-auto leading-relaxed">
                    Your custom measurements and fabric selection for <span className="text-[#050505] dark:text-white font-semibold">{product.name}</span> have been attached to your shopping bag selection.
                  </p>
                  <Button variant="gold" size="md" onClick={handleResetAndClose}>View Shopping Bag</Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
