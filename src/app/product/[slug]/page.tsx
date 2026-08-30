import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { wpClient } from "@/lib/wordpress/client";
import { ProductDetailClient } from "@/app/product/[slug]/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await wpClient.getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | THE FORGE" };
  return {
    title: `${product.name} | THE FORGE`,
    description: product.description,
    openGraph: {
      title: `${product.name} | THE FORGE`,
      description: product.description,
      images: [{ url: product.images[0]?.src || "" }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await wpClient.getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await wpClient.getProducts({ mainCategory: product.mainCategory });

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1 py-12">
        <Container size="wide">
          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts.filter(p => p.id !== product.id)}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
}