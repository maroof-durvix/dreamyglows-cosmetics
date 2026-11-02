"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Toast from "@/components/ui/Toast";
export default function ProductCard({ product }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [toastMessage, setToastMessage] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const defaultVariant = product.variants[0];
  const hasDiscount = !!defaultVariant?.compareAtPrice && defaultVariant.compareAtPrice > defaultVariant.price;
  const discountPercent = hasDiscount ? Math.round((defaultVariant.compareAtPrice - defaultVariant.price) / defaultVariant.compareAtPrice * 100) : 0;
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      setToastMessage("Removed from wishlist");
    } else {
      addToWishlist(product);
      setToastMessage("Added to wishlist");
    }
  };
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await new Promise((res) => setTimeout(res, 250));
    addToCart(product, defaultVariant, 1);
    setIsAdding(false);
    setToastMessage(`${product.title} added to cart!`);
  };
  return <>
      {
    /* Luxury Responsive Product Card */
  }
      <div className="group relative bg-white border border-stone-200/90 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full text-center pb-3 sm:pb-4 hover:border-[#76a713]/40">
        
        {
    /* Wishlist Icon */
  }
        <button
    onClick={handleWishlistToggle}
    className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-xs transition-all duration-300 cursor-pointer ${isInWishlist(product._id) ? "bg-rose-50 text-rose-600 scale-105 border border-rose-100" : "bg-white/90 text-stone-400 hover:text-rose-600 hover:bg-white hover:scale-105"}`}
    title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
    aria-label="Wishlist toggle"
  >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-300 ${isInWishlist(product._id) ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {
    /* Badges */
  }
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 items-start">
          {product.bestseller && <span className="px-1.5 sm:px-2.5 py-0.5 bg-[#76a713] text-white text-[8px] sm:text-[9px] font-black uppercase rounded-full tracking-wider shadow-xs">
              Bestseller
            </span>}
          {hasDiscount && <span className="px-1.5 sm:px-2.5 py-0.5 bg-rose-600 text-white text-[8px] sm:text-[9px] font-black uppercase rounded-full tracking-wider shadow-xs">
              -{discountPercent}%
            </span>}
        </div>

        {
    /* Product Media */
  }
        <Link href={`/product/${product.slug}`} className="block relative h-40 sm:h-64 bg-[#fbfaf8] overflow-hidden border-b border-stone-100 flex items-center justify-center p-2 sm:p-3">
          <img
    src={product.images[0]}
    alt={product.title}
    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
  />
          {product.images[1] && <img
    src={product.images[1]}
    alt={product.title}
    className="absolute inset-0 w-full h-full object-contain p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block"
  />}
        </Link>

        {
    /* Product Details Content */
  }
        <div className="px-2.5 sm:px-4 pt-2.5 sm:pt-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-[9px] sm:text-[10px] font-extrabold text-[#76a713] uppercase tracking-wider block truncate">
              {product.category}
            </span>
            <Link href={`/product/${product.slug}`} className="block">
              <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 hover:text-[#76a713] transition-colors line-clamp-2 leading-tight">
                {product.title}
              </h4>
            </Link>
            <span className="font-cursive text-[#76a713] text-sm sm:text-base hidden sm:block">Clinical Active Formulation</span>
          </div>

          <div className="space-y-1.5 sm:space-y-2.5 pt-1.5 sm:pt-2 border-t border-stone-100">
            {
    /* Rating */
  }
            <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-gray-500">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <Star
    key={i}
    className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-200"}`}
  />)}
              </div>
              <span className="font-bold text-gray-700 text-[10px] sm:text-[11px]">({product.reviewCount || 12})</span>
            </div>

            {
    /* Price & Add to Cart button */
  }
            <div className="flex items-center justify-between mt-1">
              <div className="text-left">
                <div className="text-[9px] sm:text-[11px] text-gray-400 line-through leading-none h-2.5 sm:h-3 font-semibold">
                  {hasDiscount && `PKR ${defaultVariant?.compareAtPrice?.toLocaleString()}`}
                </div>
                <div className="text-xs sm:text-sm font-black text-[#76a713] leading-none mt-0.5">
                  PKR {defaultVariant?.price?.toLocaleString()}
                </div>
              </div>

              <button
    onClick={handleQuickAdd}
    disabled={isAdding}
    className="bg-[#76a713] hover:bg-[#1b3c35] text-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all flex items-center justify-center disabled:bg-stone-300 shadow-xs cursor-pointer hover:shadow-md"
    title="Add to Cart"
    aria-label="Add to cart"
  >
                {isAdding ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              </button>
            </div>
          </div>
        </div>

        {
    /* Hover subtle line indicator */
  }
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#76a713] transition-all duration-300 group-hover:w-24" />
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </>;
}
