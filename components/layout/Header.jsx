"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Heart, Search, User, Menu, X, ArrowRight, ChevronDown, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { officialProducts } from "@/lib/products";
import { getSanityProducts } from "@/lib/sanity";
import { searchProducts } from "@/lib/search";
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsPool, setProductsPool] = useState(officialProducts);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef(null);
  const shopDropdownTimeoutRef = useRef(null);
  useEffect(() => {
    async function loadProducts() {
      try {
        const live = await getSanityProducts();
        if (live && live.length > 0) {
          setProductsPool(live);
        }
      } catch (e) {
        console.error("Error loading search products:", e);
      }
    }
    loadProducts();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const filtered = searchProducts(productsPool, val);
      setSearchSuggestions(filtered);
      setHasSearched(true);
    } else {
      setSearchSuggestions([]);
      setHasSearched(false);
    }
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsShopDropdownOpen(false);
  }, [pathname]);
  const handleShopMouseEnter = () => {
    if (shopDropdownTimeoutRef.current) {
      clearTimeout(shopDropdownTimeoutRef.current);
    }
    setIsShopDropdownOpen(true);
  };
  const handleShopMouseLeave = () => {
    shopDropdownTimeoutRef.current = setTimeout(() => {
      setIsShopDropdownOpen(false);
    }, 150);
  };
  const shopCategories = [
    {
      name: "All Products",
      href: "/shop",
      desc: "Browse our complete active clinical formulas catalog"
    },
    {
      name: "Skin Care",
      href: "/shop?category=Skin%20Care",
      desc: "Dr. AR OLIV-E-C (Vitamin C 5%) & Dr. AR Mak Mandelic Acid 20%"
    },
    {
      name: "Medicated Cleansers",
      href: "/shop?category=Medicated",
      desc: "Dr. AR EYE-S ocular cleanse & pharmaceutical formulas"
    }
  ];
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);
  return <>
      <header className={`sticky top-0 left-0 right-0 z-40 bg-[#0d281a] border-b border-[#18422d] transition-all duration-300 ${isScrolled ? "shadow-xl bg-[#0d281a]/95 backdrop-blur-md" : "shadow-md"}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {
    /* Full DreamyGlows Logo with Monogram + Wordmark */
  }
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group focus:outline-none">
                <img
    src="/logo-navbar-plum.png"
    alt="DreamyGlows"
    className="h-9 sm:h-12 w-auto max-w-[160px] sm:max-w-[240px] object-contain transition-transform duration-200 group-hover:scale-[1.02] drop-shadow-sm"
  />
              </Link>
            </div>

            {
    /* Navigation Links */
  }
            <nav className="hidden md:flex items-center space-x-7 lg:space-x-8">
              {
    /* Home */
  }
              <Link
    href="/"
    className={`text-[13px] tracking-wide transition-all duration-200 relative py-1 ${pathname === "/" ? 'text-white font-semibold after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#76a713] after:rounded-full' : "text-[#d2e8db]/90 hover:text-white font-normal"}`}
  >
                Home
              </Link>

              {
    /* Shop with Professional Dropdown */
  }
              <div
    className="relative py-2"
    onMouseEnter={handleShopMouseEnter}
    onMouseLeave={handleShopMouseLeave}
  >
                <Link
    href="/shop"
    className={`inline-flex items-center gap-1 text-[13px] tracking-wide transition-all duration-200 relative py-1 ${pathname.startsWith("/shop") ? 'text-white font-semibold after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#76a713] after:rounded-full' : "text-[#d2e8db]/90 hover:text-white font-normal"}`}
  >
                  <span>Shop</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isShopDropdownOpen ? "rotate-180 text-[#76a713]" : ""}`} />
                </Link>

                {
    /* Professional Shop Dropdown Menu */
  }
                {isShopDropdownOpen && <div className="absolute top-full left-0 w-80 bg-[#103322] border border-[#1f4f34] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-[#18422d] flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#76a713]">Shop Formulations</span>
                      <Link
    href="/shop"
    onClick={() => setIsShopDropdownOpen(false)}
    className="text-[11px] text-[#a8d1ba] hover:text-white hover:underline"
  >
                        View All &rarr;
                      </Link>
                    </div>

                    <div className="p-1 space-y-1">
                      {shopCategories.map((cat) => <Link
    key={cat.name}
    href={cat.href}
    onClick={() => setIsShopDropdownOpen(false)}
    className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group"
  >
                          <div className="text-xs font-bold text-white group-hover:text-[#76a713] transition-colors flex items-center justify-between">
                            <span>{cat.name}</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#76a713]" />
                          </div>
                          <p className="text-[10px] text-[#a8d1ba]/70 mt-0.5 line-clamp-1">{cat.desc}</p>
                        </Link>)}
                    </div>
                  </div>}
              </div>

              {
    /* About Us */
  }
              <Link
    href="/about"
    className={`text-[13px] tracking-wide transition-all duration-200 relative py-1 ${pathname === "/about" ? 'text-white font-semibold after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#76a713] after:rounded-full' : "text-[#d2e8db]/90 hover:text-white font-normal"}`}
  >
                About Us
              </Link>

              {
    /* Contact Us */
  }
              <Link
    href="/contact"
    className={`text-[13px] tracking-wide transition-all duration-200 relative py-1 ${pathname === "/contact" ? 'text-white font-semibold after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#76a713] after:rounded-full' : "text-[#d2e8db]/90 hover:text-white font-normal"}`}
  >
                Contact Us
              </Link>

              {
    /* Track Order */
  }
              <Link
    href="/order-tracking"
    className={`text-[13px] tracking-wide transition-all duration-200 relative py-1 ${pathname === "/order-tracking" ? 'text-white font-semibold after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#76a713] after:rounded-full' : "text-[#d2e8db]/90 hover:text-white font-normal"}`}
  >
                Track Order
              </Link>
            </nav>

            {
    /* Controls / Icons */
  }
            <div className="flex items-center space-x-1 sm:space-x-2.5">
              
              {
    /* Search Trigger */
  }
              <button
    onClick={() => setIsSearchOpen(!isSearchOpen)}
    className="p-2 sm:p-2.5 text-[#d2e8db] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
    aria-label="Search products"
  >
                <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </button>

              {
    /* Wishlist Link */
  }
              <Link
    href="/wishlist"
    className="p-2 sm:p-2.5 text-[#d2e8db] hover:text-white hover:bg-white/10 rounded-full relative transition-colors group"
    aria-label="Wishlist"
  >
                <Heart className={`h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110 ${wishlist.length > 0 ? "fill-[#76a713] text-[#76a713]" : ""}`} />
                {wishlist.length > 0 && <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-[#76a713] text-white text-[9px] sm:text-[10px] font-black w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center animate-in zoom-in-75 shadow-xs">
                    {wishlist.length}
                  </span>}
              </Link>

              {
    /* Account Link */
  }
              <Link
    href="/account"
    className="p-2 sm:p-2.5 text-[#d2e8db] hover:text-white hover:bg-white/10 rounded-full transition-colors"
    aria-label="My Account"
  >
                <User className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </Link>

              {
    /* Cart Drawer Trigger */
  }
              <button
    onClick={() => setIsCartOpen(true)}
    className="p-2 sm:p-2.5 text-[#d2e8db] hover:text-white hover:bg-white/10 rounded-full relative flex items-center cursor-pointer group"
    aria-label="Shopping Cart"
  >
                <ShoppingBag className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110" />
                {totalCartCount > 0 && <span className="bg-[#76a713] text-white text-[9px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full min-w-[15px] sm:min-w-[18px] text-center ml-0.5 sm:ml-1 shadow-xs">
                    {totalCartCount}
                  </span>}
              </button>

              {
    /* Mobile Menu Trigger */
  }
              <button
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="md:hidden p-2 text-[#d2e8db] hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
    aria-label="Toggle navigation menu"
  >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

            </div>

          </div>
        </div>

        {
    /* Global Instant Search Bar Dropdown */
  }
        {isSearchOpen && <div className="border-t border-[#18422d] bg-[#0d281a]/98 backdrop-blur-md px-4 py-5 shadow-2xl absolute w-full left-0 right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto space-y-3">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-[#a8d1ba]/60" />
                <input
    ref={searchInputRef}
    type="text"
    placeholder="Search products by formulation, concern (Acne, Glow), or ingredients..."
    value={searchQuery}
    onChange={handleSearchChange}
    className="w-full pl-12 pr-28 py-3.5 bg-[#143825] border border-[#1f4f34] rounded-2xl text-sm outline-none focus:border-[#76a713] focus:bg-[#18422d] text-white placeholder:text-[#a8d1ba]/50 transition-all font-medium"
  />
                <div className="absolute right-2.5 flex items-center gap-1.5">
                  {searchQuery && <button
    type="button"
    onClick={() => {
      setSearchQuery("");
      setSearchSuggestions([]);
      setHasSearched(false);
    }}
    className="p-1.5 text-[#a8d1ba] hover:text-white rounded-full hover:bg-white/10 transition-colors"
  >
                      <X className="h-4 w-4" />
                    </button>}
                  <button
    type="submit"
    className="px-4 py-2 bg-[#76a713] hover:bg-[#628c0e] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer uppercase tracking-wider"
  >
                    Search
                  </button>
                </div>
              </form>

              {
    /* Live Search Suggestions dropdown */
  }
              {searchSuggestions.length > 0 ? <div className="bg-[#143825] rounded-2xl shadow-xl border border-[#1f4f34] overflow-hidden divide-y divide-[#18422d]">
                  <div className="px-4 py-2 bg-[#0d281a]/80 flex items-center justify-between text-[11px] font-bold text-[#a8d1ba] uppercase tracking-wider">
                    <span>Products Found ({searchSuggestions.length})</span>
                    <span>Press Enter to View All</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#18422d]">
                    {searchSuggestions.slice(0, 5).map((prod) => <Link
    key={prod._id}
    href={`/product/${prod.slug}`}
    onClick={() => setIsSearchOpen(false)}
    className="flex items-center space-x-3.5 p-3 hover:bg-white/10 transition-colors group"
  >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0d281a] border border-[#18422d] flex-shrink-0">
                          <img
    src={prod.images[0]}
    alt={prod.title}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
  />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate group-hover:text-[#76a713] transition-colors">{prod.title}</p>
                          <p className="text-[11px] text-[#a8d1ba]">{prod.category} • <span className="font-extrabold text-[#76a713]">PKR {prod.variants[0]?.price?.toLocaleString()}</span></p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#a8d1ba]/60 group-hover:text-[#76a713] group-hover:translate-x-0.5 transition-all" />
                      </Link>)}
                  </div>
                  <div className="p-2.5 bg-[#0d281a]/80 text-center">
                    <button
    onClick={handleSearchSubmit}
    className="text-xs font-bold text-[#76a713] hover:underline cursor-pointer"
  >
                      View all {searchSuggestions.length} search results &rarr;
                    </button>
                  </div>
                </div> : hasSearched && searchQuery.trim() ? <div className="bg-[#143825] rounded-2xl p-6 text-center border border-[#1f4f34] shadow-md space-y-2">
                  <p className="text-sm font-bold text-white">No products found for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-xs text-[#a8d1ba]">Try searching for keywords like &ldquo;Vitamin C&rdquo;, &ldquo;Niacinamide&rdquo;, &ldquo;Rosemary&rdquo;, or &ldquo;Skin Care&rdquo;.</p>
                  <div className="pt-2">
                    <Link
    href="/shop"
    onClick={() => setIsSearchOpen(false)}
    className="inline-block px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-colors"
  >
                      Browse Complete Catalog
                    </Link>
                  </div>
                </div> : null}
            </div>
          </div>}

        {
    /* Mobile Navigation Slide-In Side Drawer */
  }
        {isMobileMenuOpen && <div className="md:hidden fixed inset-0 z-50 flex justify-end">
            {
    /* Dark Backdrop Overlay */
  }
            <div
    className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
    onClick={() => setIsMobileMenuOpen(false)}
    aria-hidden="true"
  />

            {
    /* Slide-In Side Panel */
  }
            <div className="relative w-[85%] max-w-[340px] h-full bg-[#092216] border-l border-[#1b4832] flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300">
              
              {
    /* Drawer Top Header */
  }
              <div className="px-5 py-4 border-b border-[#18422d] flex items-center justify-between bg-[#071a10]/95">
                <Link
    href="/"
    onClick={() => setIsMobileMenuOpen(false)}
    className="flex items-center focus:outline-none"
  >
                  <img
    src="/logo-navbar-plum.png"
    alt="DreamyGlows"
    className="h-8 w-auto object-contain"
  />
                </Link>
                <button
    onClick={() => setIsMobileMenuOpen(false)}
    className="p-2 text-[#d2e8db] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
    aria-label="Close menu drawer"
  >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {
    /* Drawer Scrollable Content */
  }
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                
                {
    /* Mobile Search Form inside Drawer */
  }
                <div className="space-y-2">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-[#a8d1ba]/60" />
                    <input
    type="text"
    placeholder="Search formulas, concerns..."
    value={searchQuery}
    onChange={handleSearchChange}
    className="w-full pl-10 pr-10 py-2.5 bg-[#143825] border border-[#1f4f34] rounded-xl text-xs outline-none focus:border-[#76a713] text-white placeholder:text-[#a8d1ba]/50 font-medium"
  />
                    {searchQuery && <button
    type="submit"
    className="absolute right-2 px-2.5 py-1 bg-[#76a713] hover:bg-[#5d830f] text-white text-[10px] font-bold rounded-lg uppercase cursor-pointer"
  >
                        Go
                      </button>}
                  </form>

                  {
    /* Drawer Live Search Suggestions */
  }
                  {hasSearched && searchQuery.trim() && <div className="bg-[#143825] rounded-xl border border-[#1f4f34] overflow-hidden divide-y divide-[#18422d] shadow-lg">
                      {searchSuggestions.length > 0 ? <>
                          {searchSuggestions.slice(0, 4).map((prod) => <Link
    key={prod._id}
    href={`/product/${prod.slug}`}
    onClick={() => {
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }}
    className="flex items-center gap-3 p-2.5 hover:bg-white/10 transition-colors"
  >
                              <img
    src={prod.images[0]}
    alt={prod.title}
    className="w-9 h-9 rounded-lg object-cover bg-[#0d281a] border border-[#18422d]"
  />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{prod.title}</p>
                                <p className="text-[10px] text-[#76a713] font-bold">
                                  PKR {prod.variants[0]?.price?.toLocaleString()}
                                </p>
                              </div>
                            </Link>)}
                          <button
    onClick={handleSearchSubmit}
    className="w-full py-2 text-center text-[11px] font-bold text-[#76a713] bg-[#0d281a]/60 hover:underline cursor-pointer"
  >
                            View all results ({searchSuggestions.length}) &rarr;
                          </button>
                        </> : <div className="p-3 text-center text-xs text-[#a8d1ba]/70">
                          No products found for &ldquo;{searchQuery}&rdquo;
                        </div>}
                    </div>}
                </div>

                {
    /* Primary Navigation Links */
  }
                <div className="space-y-1.5 pt-1">
                  
                  {
    /* Home */
  }
                  <Link
    href="/"
    onClick={() => setIsMobileMenuOpen(false)}
    className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${pathname === "/" ? "bg-[#76a713]/25 text-white font-bold border-l-3 border-[#76a713]" : "text-[#d2e8db] hover:bg-white/10 hover:text-white"}`}
  >
                    <span>Home</span>
                    {pathname === "/" && <span className="w-1.5 h-1.5 rounded-full bg-[#76a713]" />}
                  </Link>

                  {
    /* Shop Catalog with Accordion */
  }
                  <div className="rounded-xl overflow-hidden">
                    <div className={`flex items-center justify-between transition-colors ${pathname.startsWith("/shop") ? "bg-[#76a713]/15" : "hover:bg-white/10"}`}>
                      <Link
    href="/shop"
    onClick={() => setIsMobileMenuOpen(false)}
    className={`flex-1 py-2.5 px-3.5 text-xs font-semibold tracking-wide ${pathname.startsWith("/shop") ? "text-white font-bold" : "text-[#d2e8db]"}`}
  >
                        Shop Catalog
                      </Link>
                      <button
    onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
    className="p-2.5 text-[#a8d1ba] hover:text-white cursor-pointer"
    aria-label="Toggle shop categories"
  >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileShopOpen ? "rotate-180 text-[#76a713]" : ""}`} />
                      </button>
                    </div>

                    {
    /* Expandable Category Links */
  }
                    {isMobileShopOpen && <div className="pl-4 pr-2 py-1.5 space-y-1 bg-black/15 border-l-2 border-[#76a713]/40 ml-3.5 my-1 rounded-r-xl animate-in fade-in duration-150">
                        {shopCategories.map((cat) => <Link
    key={cat.name}
    href={cat.href}
    onClick={() => setIsMobileMenuOpen(false)}
    className="block py-1.5 px-2.5 rounded-lg text-[11px] font-medium text-[#d2e8db] hover:text-[#76a713] hover:bg-white/5 transition-colors"
  >
                            {cat.name}
                          </Link>)}
                      </div>}
                  </div>

                  {
    /* About Us */
  }
                  <Link
    href="/about"
    onClick={() => setIsMobileMenuOpen(false)}
    className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${pathname === "/about" ? "bg-[#76a713]/25 text-white font-bold border-l-3 border-[#76a713]" : "text-[#d2e8db] hover:bg-white/10 hover:text-white"}`}
  >
                    <span>About Us</span>
                    {pathname === "/about" && <span className="w-1.5 h-1.5 rounded-full bg-[#76a713]" />}
                  </Link>

                  {
    /* Contact Us */
  }
                  <Link
    href="/contact"
    onClick={() => setIsMobileMenuOpen(false)}
    className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${pathname === "/contact" ? "bg-[#76a713]/25 text-white font-bold border-l-3 border-[#76a713]" : "text-[#d2e8db] hover:bg-white/10 hover:text-white"}`}
  >
                    <span>Contact Us</span>
                    {pathname === "/contact" && <span className="w-1.5 h-1.5 rounded-full bg-[#76a713]" />}
                  </Link>

                  {
    /* Track Order */
  }
                  <Link
    href="/order-tracking"
    onClick={() => setIsMobileMenuOpen(false)}
    className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${pathname === "/order-tracking" ? "bg-[#76a713]/25 text-white font-bold border-l-3 border-[#76a713]" : "text-[#d2e8db] hover:bg-white/10 hover:text-white"}`}
  >
                    <span className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-[#76a713]" />
                      <span>Track Order</span>
                    </span>
                    {pathname === "/order-tracking" && <span className="w-1.5 h-1.5 rounded-full bg-[#76a713]" />}
                  </Link>
                </div>

                {
    /* Direct WhatsApp Support Button in Drawer */
  }
                <div className="pt-2">
                  <a
    href="https://wa.me/923161941733"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full py-2.5 px-3.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 rounded-xl flex items-center justify-center gap-2 text-white text-xs font-bold transition-all"
  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    <span>WhatsApp Support</span>
                  </a>
                </div>

              </div>

              {
    /* Drawer Bottom Action Bar */
  }
              <div className="p-4 border-t border-[#18422d] bg-[#071a10]/95 flex items-center justify-around text-xs font-medium text-[#d2e8db]">
                <Link
    href="/wishlist"
    onClick={() => setIsMobileMenuOpen(false)}
    className="flex items-center gap-1.5 hover:text-white py-1 px-2 rounded-lg hover:bg-white/5 transition-colors"
  >
                  <Heart className={`h-4 w-4 ${wishlist.length > 0 ? "fill-[#76a713] text-[#76a713]" : "text-[#76a713]"}`} />
                  <span>Wishlist ({wishlist.length})</span>
                </Link>
                <div className="w-px h-4 bg-[#18422d]" />
                <Link
    href="/account"
    onClick={() => setIsMobileMenuOpen(false)}
    className="flex items-center gap-1.5 hover:text-white py-1 px-2 rounded-lg hover:bg-white/5 transition-colors"
  >
                  <User className="h-4 w-4 text-[#76a713]" />
                  <span>Account</span>
                </Link>
              </div>

            </div>
          </div>}
      </header>

      {
    /* Slide-over Cart Drawer Component */
  }
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>;
}
