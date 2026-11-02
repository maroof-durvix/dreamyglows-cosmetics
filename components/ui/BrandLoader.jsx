"use client";
import { useState, useEffect } from "react";
export default function BrandLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 950);
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1550);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);
  if (!isVisible) return null;
  return <div
    className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#071a10] select-none transition-all duration-700 ease-out ${isFading ? "opacity-0 pointer-events-none scale-[1.02]" : "opacity-100"}`}
    aria-hidden={!isVisible}
  >
      {
    /* Ambient luxury radial glow */
  }
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#76a713]/15 blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        {
    /* Shimmering Badge Container */
  }
        <div className="relative mb-5 sm:mb-6">
          {
    /* Outer glowing ring */
  }
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#76a713]/40 bg-[#0d281a]/90 backdrop-blur-md flex items-center justify-center shadow-2xl relative overflow-hidden">
            
            {
    /* Shimmer sweep effect */
  }
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-luxury-shine pointer-events-none" />

            {
    /* DG Monogram / Logo */
  }
            <img
    src="/logo-white.png"
    alt="DreamyGlows DG"
    className="w-20 sm:w-24 h-auto object-contain drop-shadow-[0_4px_12px_rgba(118,167,19,0.35)]"
  />
          </div>

          {
    /* Micro-sparkle dot */
  }
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#76a713] ring-4 ring-[#071a10] shadow-[0_0_8px_#76a713]" />
        </div>

        {
    /* Brand Name with tracked luxury typography & shimmer */
  }
        <div className="relative overflow-hidden inline-block mb-1.5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-[0.28em] text-white font-sans drop-shadow-sm">
            DREAMY<span className="text-[#76a713]">GLOWS</span>
          </h1>
          {
    /* Text light sweep */
  }
          <div className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-luxury-shine pointer-events-none" />
        </div>

        {
    /* Tagline */
  }
        <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#a8d1ba]/80 uppercase mb-5">
          Clinical Formulations • Radiance Refined
        </p>

        {
    /* Minimalist Golden-Emerald Progress Line */
  }
        <div className="w-28 sm:w-36 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#76a713] via-[#b6e44b] to-[#76a713] rounded-full animate-[shimmer_1.4s_ease-in-out_infinite]" />
        </div>

      </div>
    </div>;
}
