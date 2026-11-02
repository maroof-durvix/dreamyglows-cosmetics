"use client";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import { Sparkles, Truck } from "lucide-react";
export default function AnnouncementBar() {
  const pathname = usePathname();
  const { cartSubtotal, freeShippingThreshold, isEligibleForFreeShipping } = useCart();
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  const remaining = freeShippingThreshold - cartSubtotal;
  return <div className="bg-[#071910] text-[#e2f0e8] py-2 px-4 text-center text-[11px] sm:text-xs font-medium tracking-wide border-b border-[#133e2b] relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 font-semibold">
          <Truck className="h-3.5 w-3.5 text-emerald-400" />
          {cartSubtotal === 0 ? <span>
              Free nationwide delivery on orders above <span className="text-emerald-300 font-bold">PKR {freeShippingThreshold.toLocaleString()}</span>
            </span> : isEligibleForFreeShipping ? <span className="text-emerald-300 font-bold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Unlocked! You qualify for FREE Delivery</span>
            </span> : <span>
              Add <span className="text-emerald-300 font-bold">PKR {remaining.toLocaleString()}</span> more for <span className="underline decoration-emerald-400">FREE Delivery</span>
            </span>}
        </div>

        <span className="hidden md:inline text-emerald-800">•</span>

        <div className="hidden sm:flex items-center gap-1.5 text-emerald-200/90 text-[11px]">
          <Sparkles className="h-3 w-3 text-amber-300" />
          <span>
            Use code <span className="bg-emerald-900/90 px-1.5 py-0.5 rounded text-white font-bold border border-emerald-700 tracking-wider">SAVE10</span> for 10% OFF
          </span>
        </div>
      </div>
    </div>;
}
