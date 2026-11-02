"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, ShieldCheck, ArrowRight, Leaf, Sparkles, ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import { officialProducts } from "@/lib/products";
import { getSanityProducts } from "@/lib/sanity";
import ProductCard from "@/components/product/ProductCard";
export default function Home() {
  const [products, setProducts] = useState(officialProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedTab, setSelectedTab] = useState("All");
  const tabs = ["All", "Skin Care", "Medicated"];
  const productSlides = [
    {
      id: "slide-1",
      title: "Dr. AR OLIV-E-C Whitening Active Concentrate",
      tagline: "5% Pure Vitamin C + 5% Vitamin E Duo \u2022 Dynamic Brightening & Anti-Aging",
      price: "PKR 2,450",
      image: "/banners/banner-oliv-e-c.jpg",
      link: "/product/dr-ar-oliv-e-c-whitening-serum",
      badge: "5% Vitamin C & E Duo",
      isGraphicBanner: true
    },
    {
      id: "slide-2",
      title: "Dr. AR Mak Mandelic Acid Serum",
      tagline: "20% Mandelic Acid & 2% Hyaluronic Acid \u2022 Renew. Smooth. Reveal.",
      price: "PKR 2,650",
      image: "/banners/banner-mak.jpg",
      link: "/product/dr-ar-mak-mandelic-acid-serum",
      badge: "20% Mandelic + 2% HA",
      isGraphicBanner: true
    },
    {
      id: "slide-3",
      title: "Dr. AR EYE-S Eye Protect Shampoo",
      tagline: "With Vitamin A, E & C \u2022 100% Paraben & Salt Free Ocular Cleanser",
      price: "PKR 1,850",
      image: "/banners/banner-eye-s.jpg",
      link: "/product/dr-ar-eye-s-eye-protect-shampoo",
      badge: "Gentle Ocular Hygiene",
      isGraphicBanner: true
    }
  ];
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }
    setNewsletterStatus("loading");
    setNewsletterMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail, source: "homepage_newsletter" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewsletterStatus("success");
        setNewsletterMessage(data.message || "Thank you for subscribing! Welcome to the DreamyGlows Club.");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        setNewsletterMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setNewsletterStatus("error");
      setNewsletterMessage("Network error. Please try again later.");
    }
  };
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 45;
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % productSlides.length);
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + productSlides.length) % productSlides.length);
    }
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [productSlides.length]);
  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + productSlides.length) % productSlides.length);
  };
  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % productSlides.length);
  };
  useEffect(() => {
    async function loadSanity() {
      try {
        const liveProducts = await getSanityProducts();
        if (liveProducts && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      } catch (e) {
        console.error("Error fetching data from Sanity:", e);
      }
    }
    loadSanity();
  }, []);
  const filteredTabProducts = products.filter((product) => {
    return selectedTab === "All" || product.category === selectedTab;
  });
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };
  const faqs = [
    {
      q: "Are DreamyGlows & Dr. AR products suitable for sensitive skin?",
      a: "Yes, our clinical formulations are developed under strict pharmaceutical guidance, free from synthetic fragrances, harsh drying alcohols, and sulfates. We always recommend performing a small patch test on your inner arm prior to full facial application."
    },
    {
      q: "How long does shipping take in Pakistan?",
      a: "For major metropolitan hubs (Karachi, Lahore, Islamabad, Rawalpindi), orders arrive within 2-3 business days. For other regional districts and towns, delivery takes 3-5 business days. Cash on Delivery is supported nationwide."
    },
    {
      q: "What is your return & exchange policy?",
      a: "We offer a 7-day hassle-free return guarantee for unopened and sealed items in their original packaging. Please contact our support team at support@dreamyglows.com with your Order ID to initiate a return."
    }
  ];
  return <div className="space-y-8 sm:space-y-16 pb-16">
      
      {
    /* 1. Main Automatic Product Carousel with Official Dr. AR Product Banners */
  }
      <section className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-1 sm:pt-4">
        <div
    className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-lg bg-[#071610] group border border-stone-200/80"
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
          
          {
    /* Active Product Banner Slide - 100% Zero-Cutoff on All Devices */
  }
          <div className="relative w-full aspect-[2.1/1] sm:aspect-[2.4/1] md:aspect-[2.67/1] sm:max-h-[420px] bg-[#082115] overflow-hidden flex items-center justify-center">
            <Link
    href={productSlides[currentSlide].link}
    className="block relative w-full h-full cursor-pointer"
  >
              {
    /* Subtle ambient blur background for perfect seamless edges */
  }
              <img
    src={productSlides[currentSlide].image}
    alt=""
    aria-hidden="true"
    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
  />

              {
    /* Main Banner Graphic - object-contain ensures 100% of image, text, and Shop Now are visible with ZERO cut-off */
  }
              <img
    src={productSlides[currentSlide].image}
    alt={productSlides[currentSlide].title}
    className="relative z-10 w-full h-full object-contain object-center transition-all duration-500 ease-out group-hover:scale-[1.01]"
  />

              {
    /* Dynamic overlay for non-graphic banners */
  }
              {!productSlides[currentSlide].isGraphicBanner && <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-4 sm:px-12 md:px-16">
                  <div className="max-w-xl text-white space-y-2 sm:space-y-3.5 animate-in fade-in slide-in-from-left duration-500">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#76a713] text-white text-[9px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                      <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>{productSlides[currentSlide].badge}</span>
                    </div>

                    <h2 className="text-lg sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight font-sans">
                      {productSlides[currentSlide].title}
                    </h2>

                    <p className="text-[11px] sm:text-sm text-stone-200 line-clamp-2 max-w-md font-medium leading-relaxed">
                      {productSlides[currentSlide].tagline}
                    </p>

                    <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                      <span className="text-base sm:text-2xl font-black text-[#76a713]">
                        {productSlides[currentSlide].price}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-6 sm:py-2.5 bg-[#76a713] hover:bg-[#5d830f] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md">
                        <span>Order Now</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </span>
                    </div>
                  </div>
                </div>}
            </Link>

            {
    /* Desktop Left Arrow Button */
  }
            <button
    onClick={handlePrev}
    className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/85 text-white p-2 sm:p-3 rounded-full backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 items-center justify-center cursor-pointer shadow-lg"
    aria-label="Previous Product Banner"
  >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {
    /* Desktop Right Arrow Button */
  }
            <button
    onClick={handleNext}
    className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/85 text-white p-2 sm:p-3 rounded-full backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 items-center justify-center cursor-pointer shadow-lg"
    aria-label="Next Product Banner"
  >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {
    /* Pill Progress Pagination Indicators */
  }
            <div className="absolute bottom-1.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2 bg-black/50 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full border border-white/10">
              {productSlides.map((slide, idx) => <button
    key={slide.id}
    onClick={(e) => {
      e.preventDefault();
      setCurrentSlide(idx);
    }}
    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? "w-4 sm:w-6 bg-[#76a713]" : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"}`}
    aria-label={`Go to slide ${idx + 1}`}
  />)}
            </div>
          </div>

          {
    /* Mobile Quick-Purchase & Product Info Bar for High Usability */
  }
          <div className="sm:hidden bg-[#0a2317] border-t border-[#18422d] px-3.5 py-2.5 flex items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#76a713] bg-[#76a713]/15 px-1.5 py-0.5 rounded">
                  {productSlides[currentSlide].badge}
                </span>
                <span className="text-xs font-black text-white">
                  {productSlides[currentSlide].price}
                </span>
              </div>
              <p className="text-[11px] font-bold text-stone-200 truncate mt-0.5">
                {productSlides[currentSlide].title}
              </p>
            </div>
            <Link
    href={productSlides[currentSlide].link}
    className="flex-shrink-0 px-3 py-1.5 bg-[#76a713] hover:bg-[#5d830f] active:scale-95 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg inline-flex items-center gap-1 shadow-sm transition-all"
  >
              <span>Shop Now</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>

        </div>
      </section>

      {
    /* 2. Value Propositions (Responsive 1-col on mobile, 3-col on desktop) */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-8 border-b border-gray-150 pb-8 sm:pb-12">
          
          <div className="text-center space-y-2 sm:space-y-3 p-4 sm:p-5 bg-[#f7f6f2]/70 rounded-2xl border border-gray-100 hover:border-[#76a713]/30 transition-all">
            <div className="p-2.5 sm:p-3.5 bg-white text-[#76a713] rounded-full w-fit mx-auto shadow-sm border border-gray-50">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm tracking-wide uppercase">100% Organic Active Formula</h3>
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Free from drying alcohols, silicones, sulfates, and toxic parabens. Clean botanical active ingredients.
            </p>
          </div>

          <div className="text-center space-y-2 sm:space-y-3 p-4 sm:p-5 bg-[#f7f6f2]/70 rounded-2xl border border-gray-100 hover:border-[#76a713]/30 transition-all">
            <div className="p-2.5 sm:p-3.5 bg-white text-[#76a713] rounded-full w-fit mx-auto shadow-sm border border-gray-50">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm tracking-wide uppercase">Fast Cash on Delivery</h3>
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              We dispatch packages nationwide in Pakistan. Pay easily with cash directly at your doorstep.
            </p>
          </div>

          <div className="text-center space-y-2 sm:space-y-3 p-4 sm:p-5 bg-[#f7f6f2]/70 rounded-2xl border border-gray-100 hover:border-[#76a713]/30 transition-all">
            <div className="p-2.5 sm:p-3.5 bg-white text-[#76a713] rounded-full w-fit mx-auto shadow-sm border border-gray-50">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm tracking-wide uppercase">Dermatologist Verified</h3>
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Formulated under professional pharmaceutical supervision. Tested extensively to assure balanced pH scales.
            </p>
          </div>

        </div>
      </section>

      {
    /* 3. Our Products Section (2-Column Grid on Mobile, 4-Column on Desktop) */
  }
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="text-center space-y-1">
          <span className="font-cursive text-[#76a713] text-3xl sm:text-5xl block">
            Highly concentrated remedies
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight font-sans">
            Our <span className="text-[#76a713]">Products</span>
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-[#76a713] mx-auto mt-2" />
        </div>

        {
    /* Categories Tab Selector with Mobile Horizontal Scroll */
  }
        <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-4 pb-1 justify-start sm:justify-center border-b border-gray-150 px-1">
          {tabs.map((tab) => <button
    key={tab}
    onClick={() => setSelectedTab(tab)}
    className={`pb-2 sm:pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all outline-none cursor-pointer whitespace-nowrap px-2.5 sm:px-0 ${selectedTab === tab ? "border-[#76a713] text-[#76a713] font-black" : "border-transparent text-gray-500 hover:text-gray-900"}`}
  >
              {tab}
            </button>)}
        </div>

        {
    /* Dynamic products list grid: 2 columns on mobile, 4 on desktop */
  }
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredTabProducts.map((prod, idx) => <ProductCard key={`${prod._id}-${prod.slug || idx}`} product={prod} />)}
        </div>
      </section>

      {
    /* 4. Clinical Active Highlight Promo Banner Section */
  }
      <section className="relative bg-gradient-to-br from-emerald-950 via-[#072417] to-emerald-900 text-white overflow-hidden py-10 sm:py-20 px-4 sm:px-6 rounded-2xl sm:rounded-3xl max-w-7xl mx-auto shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#76a713]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5 relative z-10">
          <span className="font-cursive text-[#76a713] text-2xl sm:text-4xl block">Clinical Clean Purity</span>
          <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tight leading-tight font-sans">
            Targeted active serums engineered for <br className="hidden sm:inline" />
            visible results without pricing markup
          </h2>
          <p className="text-[11px] sm:text-sm text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
            Our Dr. AR formulations are designed specifically to perform under local Pakistani weather conditions. Disclosed active concentrations, paraben-free certification.
          </p>
          <div className="pt-2 sm:pt-3">
            <Link
    href="/shop"
    className="px-6 py-3 sm:px-8 sm:py-3.5 bg-[#76a713] hover:bg-[#5d830f] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
  >
              <span>Explore All Formulas</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </section>

      {
    /* 5. FAQs Block */
  }
      <section className="max-w-3xl mx-auto px-3 sm:px-6 space-y-6 sm:space-y-8">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <span className="font-cursive text-[#76a713] text-2xl sm:text-3xl block">Clear answers &amp; support</span>
          <h2 className="text-xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight font-sans">Frequently Asked Questions</h2>
          <div className="w-10 sm:w-12 h-0.5 bg-[#76a713] mx-auto" />
        </div>
        <div className="border border-stone-200/90 rounded-2xl overflow-hidden bg-white shadow-xs divide-y divide-stone-100">
          {faqs.map((faq, idx) => <div key={idx} className="transition-colors">
              <button
    onClick={() => toggleFaq(idx)}
    className="w-full px-4 sm:px-6 py-3.5 sm:py-4.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-gray-900 hover:bg-stone-50/70 transition-colors cursor-pointer group"
  >
                <span className="group-hover:text-[#76a713] transition-colors pr-2 sm:pr-4">{faq.q}</span>
                <div className={`p-1 sm:p-1.5 rounded-full transition-all duration-300 flex-shrink-0 ${activeFaq === idx ? "bg-[#76a713]/10 text-[#76a713]" : "bg-stone-100 text-gray-500"}`}>
                  <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 ${activeFaq === idx ? "rotate-180" : ""}`} />
                </div>
              </button>
              {activeFaq === idx && <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-[11px] sm:text-sm text-gray-600 leading-relaxed bg-stone-50/30 animate-in fade-in slide-in-from-top-1 duration-200">
                  {faq.a}
                </div>}
            </div>)}
        </div>
      </section>

      {
    /* 6. Subscribe Newsletter */
  }
      <section className="max-w-4xl mx-auto px-3 sm:px-6">
        <div className="bg-[#f7f6f2] border border-gray-200 rounded-2xl p-6 sm:p-12 text-center space-y-4 sm:space-y-6 shadow-sm">
          <div className="max-w-lg mx-auto space-y-2 sm:space-y-3">
            <span className="font-cursive text-[#76a713] text-2xl sm:text-3xl">Glow Newsletter Club</span>
            <h3 className="text-lg sm:text-xl font-bold uppercase text-gray-900 tracking-wider font-sans">Subscribe For Updates</h3>
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
              Get active coupon codes, new product launch alerts, and clinical skin-care guidance dispatches.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4" onSubmit={handleSubscribe}>
              <input
    type="email"
    value={newsletterEmail}
    onChange={(e) => setNewsletterEmail(e.target.value)}
    placeholder="Enter email address"
    required
    disabled={newsletterStatus === "loading"}
    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#76a713] disabled:opacity-60"
  />
              <button
    type="submit"
    disabled={newsletterStatus === "loading"}
    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#76a713] hover:bg-[#5d830f] text-white font-bold rounded-xl transition-colors text-xs sm:text-sm uppercase tracking-wider cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60"
  >
                {newsletterStatus === "loading" ? <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Subscribing...</span>
                  </> : <span>Subscribe</span>}
              </button>
            </form>

            {newsletterStatus === "success" && <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 py-2.5 px-4 rounded-xl animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>{newsletterMessage}</span>
              </div>}

            {newsletterStatus === "error" && <div className="text-xs sm:text-sm text-rose-600 bg-rose-50 border border-rose-200 py-2 px-4 rounded-xl animate-in fade-in">
                {newsletterMessage}
              </div>}
          </div>
        </div>
      </section>

    </div>;
}
