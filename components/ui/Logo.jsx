"use client";
import Link from "next/link";
export default function Logo({
  variant = "dark",
  size = "md",
  showSubtitle = true,
  className = ""
}) {
  const isDark = variant === "dark";
  const sizeClasses = {
    sm: { icon: "w-6 h-6", title: "text-base tracking-[0.16em]", sub: "text-[8px] tracking-[0.22em]" },
    md: { icon: "w-8 h-8", title: "text-lg sm:text-xl tracking-[0.18em]", sub: "text-[9px] tracking-[0.25em]" },
    lg: { icon: "w-10 h-10", title: "text-2xl sm:text-3xl tracking-[0.2em]", sub: "text-[11px] tracking-[0.28em]" }
  }[size];
  return <Link href="/" className={`group flex items-center gap-2.5 sm:gap-3 select-none transition-transform duration-200 hover:scale-[1.01] ${className}`}>
      {
    /* Botanical Drop Emblem */
  }
      <div className={`relative flex-shrink-0 ${sizeClasses.icon} flex items-center justify-center`}>
        <svg
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:rotate-3"
  >
          {
    /* Outer Glow Circle / Halo */
  }
          <circle
    cx="22"
    cy="22"
    r="20"
    stroke={isDark ? "#1b7a4e" : "#1b7a4e"}
    strokeWidth="1.5"
    strokeDasharray="2 3"
    opacity={isDark ? "0.4" : "0.3"}
  />

          {
    /* Golden/Emerald Botanical Leaf Silhouette */
  }
          <path
    d="M22 6C22 6 34 16 34 26C34 32.6274 28.6274 38 22 38C15.3726 38 10 32.6274 10 26C10 16 22 6 22 6Z"
    fill="url(#botanicalGradient)"
  />

          {
    /* Inner Botanical Leaf Spine & Vein */
  }
          <path
    d="M22 13V34M22 20L27 16M22 25L28 21M22 23L16 19M22 28L17 24"
    stroke={isDark ? "#0d281a" : "#ffffff"}
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity="0.9"
  />

          {
    /* Gradients */
  }
          <defs>
            <linearGradient id="botanicalGradient" x1="10" y1="6" x2="34" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {
    /* Brand Wordmark */
  }
      <div className="flex flex-col leading-none">
        <span
    className={`font-black font-sans uppercase transition-colors ${sizeClasses.title} ${isDark ? "text-white group-hover:text-emerald-300" : "text-[#0d281a] group-hover:text-[#1b7a4e]"}`}
    style={{ letterSpacing: "0.12em" }}
  >
          DREAMY<span className="text-emerald-400 font-extrabold">GLOWS</span>
        </span>
        {showSubtitle && <span
    className={`font-semibold uppercase mt-0.5 font-sans ${sizeClasses.sub} ${isDark ? "text-emerald-200/70" : "text-emerald-800/70"}`}
  >
            Clinical Botanicals
          </span>}
      </div>
    </Link>;
}
