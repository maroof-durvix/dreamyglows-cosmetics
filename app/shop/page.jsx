"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { officialProducts } from "@/lib/products";
import { getSanityProducts } from "@/lib/sanity";
import { searchProducts } from "@/lib/search";
import ProductCard from "@/components/product/ProductCard";
import { SlidersHorizontal, ArrowUpDown, Search, X, ChevronDown, RefreshCw } from "lucide-react";
function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState(officialProducts);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedConcern, setSelectedConcern] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    async function loadProducts() {
      try {
        const liveProducts = await getSanityProducts();
        if (liveProducts && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      } catch (err) {
        console.error("Failed to sync sanity products:", err);
      }
    }
    loadProducts();
  }, []);
  useEffect(() => {
    const cat = searchParams.get("category");
    const gender = searchParams.get("gender");
    const concern = searchParams.get("concern");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search") || searchParams.get("q");
    if (cat) setSelectedCategory(cat);
    if (gender) setSelectedGender(gender);
    if (concern) setSelectedConcern(concern);
    if (sort) setSortBy(sort);
    if (search !== null) setSearchTerm(search);
  }, [searchParams]);
  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`);
  };
  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    updateParams("category", val);
  };
  const handleGenderChange = (val) => {
    setSelectedGender(val);
    updateParams("gender", val);
  };
  const handleConcernChange = (val) => {
    setSelectedConcern(val);
    updateParams("concern", val);
  };
  const handleSortChange = (val) => {
    setSortBy(val);
    updateParams("sort", val);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams("search", searchTerm.trim());
  };
  const handleClearSearch = () => {
    setSearchTerm("");
    updateParams("search", "");
  };
  const handleReset = () => {
    setSelectedCategory("All");
    setSelectedGender("All");
    setSelectedConcern("All");
    setSortBy("featured");
    setSearchTerm("");
    setIsMobileFilterOpen(false);
    router.push("/shop");
  };
  const allConcerns = Array.from(
    new Set(products.flatMap((p) => p.concern))
  );
  const searchMatchedProducts = searchTerm.trim() ? searchProducts(products, searchTerm) : null;
  const searchMatchedIds = searchMatchedProducts ? new Set(searchMatchedProducts.map((p) => p._id)) : null;
  const filteredProducts = products.filter((product) => {
    const matchCat = selectedCategory === "All" || product.category === selectedCategory;
    const matchGender = selectedGender === "All" || product.gender === selectedGender;
    const matchConcern = selectedConcern === "All" || product.concern.includes(selectedConcern);
    const matchSearch = !searchMatchedIds || searchMatchedIds.has(product._id);
    return matchCat && matchGender && matchConcern && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.variants[0].price - b.variants[0].price;
    if (sortBy === "price-high") return b.variants[0].price - a.variants[0].price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (searchMatchedProducts) {
      const indexA = searchMatchedProducts.findIndex((p) => p._id === a._id);
      const indexB = searchMatchedProducts.findIndex((p) => p._id === b._id);
      return indexA - indexB;
    }
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
  return <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {
    /* Header Banner */
  }
      <div className="bg-[#f7f6f2] rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[130px] sm:min-h-[160px] border border-gray-200/80 shadow-xs">
        <div className="relative z-10 space-y-1 sm:space-y-2">
          <span className="font-cursive text-[#76a713] text-2xl sm:text-3xl block">Clinical clean formulation</span>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase font-sans">
            {searchTerm ? `Search: "${searchTerm}"` : "Product Catalog"}
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 max-w-lg leading-relaxed">
            Targeted active serums engineered for visible results. Filter by concerns, skin care categories, and gender matches.
          </p>
        </div>
      </div>

      {
    /* Mobile Filter & Sort Bar */
  }
      <div className="lg:hidden flex items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
        <button
    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#76a713]/10 text-[#76a713] font-bold text-xs rounded-lg cursor-pointer"
  >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isMobileFilterOpen ? "rotate-180" : ""}`} />
        </button>

        <div className="flex items-center gap-1.5">
          <select
    value={sortBy}
    onChange={(e) => handleSortChange(e.target.value)}
    className="bg-stone-50 border border-gray-200 text-xs font-bold text-gray-700 rounded-lg px-2.5 py-2 outline-none focus:border-[#76a713]"
  >
            <option value="featured">Featured</option>
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {
    /* Sidebar Filters (Collapsible on Mobile, Fixed Sidebar on Desktop) */
  }
        <aside className={`w-full lg:w-64 flex-shrink-0 space-y-5 bg-white border border-gray-150 rounded-2xl p-5 h-fit shadow-xs ${isMobileFilterOpen ? "block" : "hidden lg:block"}`}>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
              <SlidersHorizontal className="h-4 w-4 text-[#76a713]" /> Filters
            </h2>
            <button
    onClick={handleReset}
    className="text-xs font-semibold text-[#76a713] hover:underline flex items-center gap-0.5 cursor-pointer"
  >
              Reset All
            </button>
          </div>

          {
    /* Quick Search in Filter */
  }
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Search Catalog</h3>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
    type="text"
    placeholder="Keywords..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-8 pr-7 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-[#76a713] focus:bg-white text-gray-900"
  />
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              {searchTerm && <button
    type="button"
    onClick={handleClearSearch}
    className="absolute right-2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
  >
                  <X className="h-3.5 w-3.5" />
                </button>}
            </form>
          </div>

          {
    /* Category */
  }
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Category</h3>
            <div className="space-y-1">
              {["All", "Skin Care", "Medicated"].map((cat) => <button
    key={cat}
    onClick={() => handleCategoryChange(cat)}
    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex justify-between items-center ${selectedCategory === cat ? "bg-[#76a713]/10 text-[#76a713] font-bold" : "text-gray-600 hover:bg-gray-50"}`}
  >
                  <span>{cat}</span>
                  {selectedCategory === cat && <span className="text-[10px]">✓</span>}
                </button>)}
            </div>
          </div>

          {
    /* Gender */
  }
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Gender</h3>
            <div className="space-y-1">
              {["All", "Unisex", "Women", "Men"].map((g) => <button
    key={g}
    onClick={() => handleGenderChange(g)}
    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex justify-between items-center ${selectedGender === g ? "bg-[#76a713]/10 text-[#76a713] font-bold" : "text-gray-600 hover:bg-gray-50"}`}
  >
                  <span>{g}</span>
                  {selectedGender === g && <span className="text-[10px]">✓</span>}
                </button>)}
            </div>
          </div>

          {
    /* Target Concern */
  }
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Skin Concern</h3>
            <div className="space-y-1">
              {["All", ...allConcerns].map((concern) => <button
    key={concern}
    onClick={() => handleConcernChange(concern)}
    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex justify-between items-center ${selectedConcern === concern ? "bg-[#76a713]/10 text-[#76a713] font-bold" : "text-gray-600 hover:bg-gray-50"}`}
  >
                  <span className="truncate">{concern}</span>
                  {selectedConcern === concern && <span className="text-[10px]">✓</span>}
                </button>)}
            </div>
          </div>
        </aside>

        {
    /* Main Products Grid: 2 columns on mobile, 3 on desktop */
  }
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="hidden lg:flex justify-between items-center bg-white border border-gray-150 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-gray-500">
              Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> products
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <ArrowUpDown className="h-3 w-3" /> Sort By:
              </span>
              <select
    value={sortBy}
    onChange={(e) => handleSortChange(e.target.value)}
    className="bg-stone-50 border border-gray-200 text-xs font-bold text-gray-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#76a713]"
  >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? <div className="bg-white border border-gray-150 rounded-2xl p-8 sm:p-12 text-center space-y-3">
              <h3 className="text-base font-bold text-gray-900">No products found</h3>
              <p className="text-xs text-gray-500">Try changing your filters or search keywords.</p>
              <button
    onClick={handleReset}
    className="px-4 py-2 bg-[#76a713] text-white text-xs font-bold rounded-lg uppercase cursor-pointer"
  >
                Reset Filters
              </button>
            </div> : <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((prod) => <ProductCard key={prod._id} product={prod} />)}
            </div>}
        </div>
      </div>
    </div>;
}
export default function ShopPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-[#76a713]" />
      </div>}>
      <ShopContent />
    </Suspense>;
}
