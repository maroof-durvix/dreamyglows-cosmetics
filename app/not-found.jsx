"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Home, ShoppingBag, Sparkles } from "lucide-react";
export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  return <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in duration-300">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-[#76a713]" />
            <span>404 • Page Not Found</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight font-sans">
            Formulation Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            The link you clicked may be broken, or the product or clinical formulation page has been relocated.
          </p>
        </div>

        {
    /* Quick Search */
  }
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search products, serums, actives..."
    className="w-full pl-9 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-xs sm:text-sm outline-none focus:border-[#76a713] text-gray-900 shadow-xs"
  />
            <Search className="h-4 w-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
    type="submit"
    className="px-5 py-3 bg-[#76a713] hover:bg-[#5d830f] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
  >
            Search
          </button>
        </form>

        {
    /* Action Links */
  }
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
    href="/"
    className="inline-flex items-center gap-2 px-5 py-3 bg-[#0d281a] hover:bg-[#1b3c2b] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
  >
            <Home className="h-3.5 w-3.5" />
            <span>Homepage</span>
          </Link>
          <Link
    href="/shop"
    className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-stone-200 hover:border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
  >
            <ShoppingBag className="h-3.5 w-3.5 text-[#76a713]" />
            <span>Browse Catalog</span>
          </Link>
          <Link
    href="/order-tracking"
    className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-bold text-emerald-800 hover:underline"
  >
            <span>Track An Order &rarr;</span>
          </Link>
        </div>
      </div>
    </div>;
}
