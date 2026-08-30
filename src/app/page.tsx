import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CinematicHero } from "@/components/editorial/CinematicHero";
import { MainCategoryGateways } from "@/components/editorial/MainCategoryGateways";
import { FeaturedSelection } from "@/components/editorial/FeaturedSelection";
import { AtelierPhilosophy } from "@/components/editorial/AtelierPhilosophy";
import { wpClient } from "@/lib/wordpress/client";

export const revalidate = 60;

export default async function HomePage() {
  const featuredProducts = await wpClient.getProducts({ featured: true });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white">

      {/*
        Hero section wraps the navbar so the video fills the full
        viewport from the very top edge -- navbar floats over it.
      */}
      <div className="relative">
        <Navbar overlay />
        <CinematicHero />
      </div>

      <main className="flex-1">
        <MainCategoryGateways />
        <FeaturedSelection products={featuredProducts} />
        <AtelierPhilosophy />
      </main>

      <Footer />
    </div>
  );
}
