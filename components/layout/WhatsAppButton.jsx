"use client";
import { usePathname } from "next/navigation";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function WhatsAppButton() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const whatsappNumber = "923161941733";
  const defaultMessage = encodeURIComponent("Hello DreamyGlows! I would like to inquire about your clinical skincare products.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center"
        aria-label="Open customer support on WhatsApp"
        title="Click to chat on WhatsApp"
      >
        {/* Tooltip on Hover (Desktop only) */}
        <div className="hidden sm:block absolute right-[115%] bg-gray-900/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none border border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Chat on WhatsApp</span>
          </div>
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-l-4 border-r-0 border-y-transparent border-l-gray-900/95" />
        </div>

        {/* WhatsApp Icon */}
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-200 border-2 border-white/90">
          <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white transition-transform duration-200 group-hover:scale-110" />
        </div>
      </a>
    </div>
  );
}
