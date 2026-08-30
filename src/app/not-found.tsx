import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl w-full text-center space-y-10">

          {/* Large editorial 404 */}
          <div className="relative select-none">
            <p className="font-editorial text-[clamp(7rem,25vw,18rem)] font-light leading-none text-[#050505] dark:text-white opacity-[0.04]">
              404
            </p>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <p className="text-[9px] uppercase tracking-[0.5em] text-[#C6A15B] font-sans font-semibold">
                Page Not Found
              </p>
              <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-[#050505] dark:text-white">
                This look does not<br />
                <span className="italic">exist yet.</span>
              </h1>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 justify-center">
            <div className="h-px w-12 bg-[#C6A15B]/40" />
            <div className="w-1 h-1 bg-[#C6A15B]" />
            <div className="h-px w-12 bg-[#C6A15B]/40" />
          </div>

          {/* Message */}
          <p className="text-sm text-[#666666] dark:text-[#888888] font-sans font-light leading-relaxed max-w-sm mx-auto">
            The page you are looking for may have moved, been renamed, or does not exist.
            Head back and keep exploring.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-[#050505] dark:bg-white text-white dark:text-[#050505] text-xs uppercase tracking-[0.25em] font-sans font-semibold hover:bg-[#C6A15B] hover:dark:bg-[#C6A15B] hover:text-white transition-colors text-center"
            >
              Back to Home
            </Link>
            <Link
              href="/the-men-forge"
              className="w-full sm:w-auto px-8 py-4 border border-[#050505] dark:border-white text-[#050505] dark:text-white text-xs uppercase tracking-[0.25em] font-sans font-semibold hover:border-[#C6A15B] hover:text-[#C6A15B] transition-colors text-center"
            >
              The Men Forge
            </Link>
            <Link
              href="/the-lady-forge"
              className="w-full sm:w-auto px-8 py-4 border border-[#C6A15B] text-[#C6A15B] text-xs uppercase tracking-[0.25em] font-sans font-semibold hover:bg-[#C6A15B] hover:text-white transition-colors text-center"
            >
              The Lady Forge
            </Link>
          </div>

          {/* Bottom label */}
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#CCCCCC] dark:text-[#333333] font-sans pt-4">
            The Forge — Dare it, Wear it!
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
