"use client";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/product/ProductCard";
export default function WishlistPage() {
  const { wishlist } = useCart();
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 min-h-[70vh]">
      
      {
    /* Header Banner */
  }
      <div className="bg-[#0d281a] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-center border border-emerald-900/60 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="font-cursive text-[#76a713] text-3xl sm:text-4xl">Saved Formulations</span>
            <span className="px-2.5 py-0.5 bg-[#76a713]/20 text-[#76a713] font-bold rounded-full text-xs border border-[#76a713]/40">
              {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase font-sans">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Keep track of your favorite clinical botanical serums. Easily add them to your cart whenever you are ready to order.
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
    /* Empty State */
    <div className="flex flex-col items-center justify-center text-center space-y-5 border border-dashed border-stone-300 rounded-3xl bg-white p-12 sm:p-16 shadow-xs max-w-2xl mx-auto my-8">
          <div className="h-16 w-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 shadow-xs">
            <Heart className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-extrabold text-gray-950 tracking-tight">Your Wishlist is Empty</h2>
            <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
              Explore our clinical serums and click the heart icon on any formulation to save it here for later.
            </p>
          </div>
          <div className="pt-2">
            <Link
      href="/shop"
      className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1b7a4e] hover:bg-[#0d281a] text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer group"
    >
              <span>Explore Formulations</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
  ) : (
    /* Product Grid */
    <div className="space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Showing {wishlist.length} saved {wishlist.length === 1 ? "item" : "items"}
            </span>
            <Link
      href="/shop"
      className="text-xs font-bold text-[#1b7a4e] hover:underline flex items-center gap-1"
    >
              Continue Shopping &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </div>
  )}

    </div>;
}
