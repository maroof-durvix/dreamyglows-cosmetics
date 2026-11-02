"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Star, ShieldCheck, Heart, ShoppingBag, RefreshCw, ZoomIn, Truck, RotateCcw, CheckCircle2, Leaf } from "lucide-react";
import { officialProducts } from "@/lib/products";
import { getSanityProductBySlug, getSanityProducts } from "@/lib/sanity";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/product/ProductCard";
import Toast from "@/components/ui/Toast";
export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const initialProd = officialProducts.find((p) => p.slug === slug || p._id === slug) || null;
  const [product, setProduct] = useState(initialProd);
  const [allProducts, setAllProducts] = useState(officialProducts);
  const [selectedVariant, setSelectedVariant] = useState(initialProd?.variants[0] || null);
  const [selectedImage, setSelectedImage] = useState(initialProd?.images[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("benefits");
  const [reviewsList, setReviewsList] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const [toastMsg, setToastMsg] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const [foundProduct, all] = await Promise.all([
          getSanityProductBySlug(slug),
          getSanityProducts()
        ]);
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedVariant(foundProduct.variants[0]);
          setSelectedImage(foundProduct.images[0] || "/products/dr-ar-oliv-e-c.jpg");
          setReviewsList(foundProduct.reviews || []);
        }
        if (all && all.length > 0) {
          setAllProducts(all);
        }
      } catch (err) {
        console.error("Error loading product details from Sanity:", err);
      }
    }
    loadData();
  }, [slug]);
  if (!product || !selectedVariant) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <RefreshCw className="h-8 w-8 animate-spin text-[#76a713]" />
      </div>;
  }
  const hasDiscount = !!selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price;
  const discountPercent = hasDiscount ? Math.round((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice * 100) : 0;
  const handleImageHover = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.7)"
    });
  };
  const handleImageLeave = () => {
    setZoomStyle({});
  };
  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setToastMsg(`${product.title} (${selectedVariant.title}) added to cart!`);
  };
  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    router.push("/checkout");
  };
  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      setToastMsg("Removed from wishlist");
    } else {
      addToWishlist(product);
      setToastMsg("Added to wishlist");
    }
  };
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;
    const newRevItem = {
      id: `review-${Date.now()}`,
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      verified: true
    };
    const updated = [newRevItem, ...reviewsList];
    setReviewsList(updated);
    setNewReview({ name: "", rating: 5, comment: "" });
    setToastMsg("Review submitted successfully!");
  };
  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p._id !== product._id
  );
  return <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 sm:space-y-16 pb-24 sm:pb-16">
      {
    /* Breadcrumbs */
  }
      <nav className="text-[11px] sm:text-xs font-bold text-gray-500 flex items-center gap-1.5 uppercase tracking-wider overflow-hidden">
        <Link href="/" className="hover:text-[#76a713] transition-colors flex-shrink-0">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#76a713] transition-colors flex-shrink-0">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#76a713] transition-colors flex-shrink-0">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 font-extrabold truncate">{product.title}</span>
      </nav>

      {
    /* Main product presentation */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start">
        {
    /* Gallery */
  }
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div
    className="aspect-square bg-[#fbfaf8] border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-zoom-in group shadow-xs flex items-center justify-center p-3 sm:p-4"
    onMouseMove={handleImageHover}
    onMouseLeave={handleImageLeave}
  >
            <img
    src={selectedImage}
    alt={product.title}
    style={zoomStyle}
    className="w-full h-full object-contain transition-transform duration-200 ease-out"
  />
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 pointer-events-none">
              {product.bestseller && <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#76a713] text-white text-[9px] sm:text-[10px] font-bold uppercase rounded-full tracking-wider shadow-xs">
                  Bestseller
                </span>}
              {hasDiscount && <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-rose-600 text-white text-[9px] sm:text-[10px] font-black uppercase rounded-full tracking-wider shadow-xs">
                  -{discountPercent}%
                </span>}
            </div>
            <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-black/40 backdrop-blur-md text-white text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 pointer-events-none">
              <ZoomIn className="h-3 w-3" /> Hover to Zoom
            </div>
          </div>

          {
    /* Thumbnails */
  }
          {product.images.length > 1 && <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => <button
    key={idx}
    onClick={() => setSelectedImage(img)}
    className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer bg-[#fbfaf8] flex items-center justify-center p-1 ${selectedImage === img ? "border-[#76a713] ring-2 ring-lime-100" : "border-stone-200 hover:border-stone-300"}`}
  >
                  <img src={img} alt="" className="h-full w-full object-contain" />
                </button>)}
            </div>}
        </div>

        {
    /* Product Meta & Actions */
  }
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2 border-b border-gray-200 pb-4 sm:pb-5">
            <span className="text-[11px] sm:text-xs font-bold text-[#76a713] uppercase tracking-widest block">
              {product.category} • {product.gender}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight font-sans leading-tight">
              {product.title}
            </h1>
            <p className="font-cursive text-[#76a713] text-xl sm:text-2xl pt-0.5">
              Clinical Active Formulation
            </p>

            {
    /* Ratings Summary */
  }
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-stone-200"}`} />)}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-800">
                {product.rating} ({reviewsList.length} Reviews)
              </span>
            </div>
          </div>

          {
    /* Price Tag */
  }
          <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-[#76a713]">
              PKR {selectedVariant.price.toLocaleString()}
            </span>
            {hasDiscount && <span className="text-sm sm:text-base font-semibold text-gray-400 line-through">
                PKR {selectedVariant.compareAtPrice?.toLocaleString()}
              </span>}
            {hasDiscount && <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] sm:text-xs font-bold rounded-md border border-rose-100">
                Save PKR {((selectedVariant.compareAtPrice || 0) - selectedVariant.price).toLocaleString()}
              </span>}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {
    /* Variant Selector */
  }
          {product.variants.length > 1 && <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Select Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => <button
    key={v.sku}
    onClick={() => setSelectedVariant(v)}
    className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedVariant.sku === v.sku ? "bg-[#76a713] text-white shadow-sm border border-[#76a713]" : "bg-white border border-stone-200 text-stone-700 hover:border-[#76a713]"}`}
  >
                    <span>{v.title}</span>
                    <span className="ml-1.5 opacity-90">PKR {v.price.toLocaleString()}</span>
                  </button>)}
              </div>
            </div>}

          {
    /* Quantity & CTA Buttons */
  }
          <div className="space-y-2.5 sm:space-y-3 pt-2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex items-center border border-gray-300 rounded-xl sm:rounded-2xl bg-white p-0.5 sm:p-1 shadow-xs">
                <button
    onClick={() => setQuantity(Math.max(1, quantity - 1))}
    className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base font-bold cursor-pointer"
  >
                  -
                </button>
                <span className="px-2 sm:px-3 text-xs sm:text-sm font-black text-gray-900 min-w-[24px] sm:min-w-[28px] text-center">{quantity}</span>
                <button
    onClick={() => setQuantity(quantity + 1)}
    className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base font-bold cursor-pointer"
  >
                  +
                </button>
              </div>

              <button
    onClick={handleAddToCart}
    className="flex-1 bg-[#76a713] hover:bg-[#5d830f] text-white py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
  >
                <ShoppingBag className="h-4 w-4" />
                <span>Add To Cart</span>
              </button>

              <button
    onClick={handleWishlistToggle}
    className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${isInWishlist(product._id) ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-white border-stone-300 text-stone-400 hover:text-rose-600 hover:border-rose-200"}`}
    title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
  >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist(product._id) ? "fill-rose-500" : ""}`} />
              </button>
            </div>

            <button
    onClick={handleBuyNow}
    className="w-full bg-[#1b3c35] hover:bg-[#0d281a] text-white py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
  >
              Order with Cash on Delivery &rarr;
            </button>
          </div>

          {
    /* Reassurance Grid */
  }
          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 text-[10px] sm:text-[11px] text-gray-600 font-medium">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#76a713] flex-shrink-0" />
              <span>Nationwide 2-4 Days Shipping</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#76a713] flex-shrink-0" />
              <span>Cash on Delivery Verified</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#76a713] flex-shrink-0" />
              <span>7-Day Return Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#76a713] flex-shrink-0" />
              <span>100% Organic Active Formula</span>
            </div>
          </div>
        </div>
      </div>

      {
    /* Product Details Tabs (Benefits, Ingredients, How to Use, Specs) */
  }
      <div className="bg-white border border-gray-150 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-xs space-y-4 sm:space-y-6">
        <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-gray-200 pb-2.5">
          {[
    { id: "benefits", label: "Key Benefits" },
    { id: "ingredients", label: "Active Ingredients" },
    { id: "howToUse", label: "How to Apply" },
    { id: "specs", label: "Specifications" }
  ].map((tab) => <button
    key={tab.id}
    onClick={() => setActiveTab(tab.id)}
    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? "bg-[#76a713]/10 text-[#76a713] border border-[#76a713]/30 font-black" : "text-gray-500 hover:text-gray-900"}`}
  >
              {tab.label}
            </button>)}
        </div>

        <div className="pt-1 sm:pt-2">
          {activeTab === "benefits" && <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-gray-700">
              {product.benefits?.map((ben, idx) => <li key={idx} className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#76a713] flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{ben}</span>
                </li>)}
            </ul>}

          {activeTab === "ingredients" && <div className="space-y-3 sm:space-y-4">
              <p className="text-[11px] sm:text-xs text-gray-500">
                Every ingredient is 100% disclosed. Formulated without parabens, sulfates, or drying alcohols.
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.ingredients?.map((ing, idx) => <span key={idx} className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#f7f6f2] text-gray-800 rounded-lg sm:rounded-xl text-xs font-semibold border border-gray-200">
                    {ing}
                  </span>)}
              </div>
            </div>}

          {activeTab === "howToUse" && <ol className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-gray-700 list-decimal list-inside leading-relaxed">
              {product.howToUse?.map((step, idx) => <li key={idx} className="pl-1">
                  <span className="font-semibold text-gray-900">{step}</span>
                </li>)}
            </ol>}

          {activeTab === "specs" && <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 text-xs sm:text-sm">
              {product.specs?.map((spec, idx) => <div key={idx} className="p-3 sm:p-3.5 bg-stone-50 rounded-xl flex justify-between border border-stone-100">
                  <span className="font-bold text-gray-500 uppercase text-[10px]">{spec.key}</span>
                  <span className="font-bold text-gray-900">{spec.value}</span>
                </div>)}
            </div>}
        </div>
      </div>

      {
    /* Customer Reviews & Submission */
  }
      <div className="bg-white border border-gray-150 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-xs space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 border-b border-gray-200 pb-4 sm:pb-5">
          <div>
            <h3 className="text-base sm:text-xl font-black text-gray-950 uppercase tracking-tight font-sans">
              Customer Reviews ({reviewsList.length})
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Real feedback from verified purchasers</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />)}
            </div>
            <span className="text-xs sm:text-sm font-black text-gray-900">{product.rating} / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {
    /* Reviews List */
  }
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {reviewsList.length === 0 ? <p className="text-xs text-gray-500 py-4">No reviews yet for this product. Be the first to share your experience!</p> : reviewsList.map((rev) => <div key={rev.id} className="p-3.5 sm:p-4 bg-[#f7f6f2] border border-gray-100 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{rev.name}</span>
                      {rev.verified && <span className="text-[9px] sm:text-[10px] bg-[#76a713]/10 text-[#76a713] px-2 py-0.5 rounded-full font-bold">
                          Verified Buyer
                        </span>}
                    </div>
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "fill-current" : "text-gray-200"}`} />)}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-serif italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>)}
          </div>

          {
    /* Submit Review Form */
  }
          <form onSubmit={handleReviewSubmit} className="lg:col-span-5 bg-[#f7f6f2] border border-gray-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Leave a Review</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Your Name</label>
              <input
    type="text"
    required
    value={newReview.name}
    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
    placeholder="e.g. Aisha Khan"
    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs outline-none focus:border-[#76a713]"
  />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => <button
    type="button"
    key={num}
    onClick={() => setNewReview({ ...newReview, rating: num })}
    className="cursor-pointer"
  >
                    <Star className={`h-4.5 w-4.5 ${num <= newReview.rating ? "text-amber-400 fill-current" : "text-gray-300"}`} />
                  </button>)}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Your Experience</label>
              <textarea
    required
    rows={3}
    value={newReview.comment}
    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
    placeholder="Tell others how this product worked for your skin..."
    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs outline-none focus:border-[#76a713]"
  />
            </div>

            <button
    type="submit"
    className="w-full bg-[#76a713] hover:bg-[#5d830f] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
  >
              Submit Review
            </button>
          </form>
        </div>
      </div>

      {
    /* Related Products: 2-column mobile grid */
  }
      {relatedProducts.length > 0 && <div className="space-y-4 sm:space-y-6">
          <div className="text-center space-y-1">
            <span className="font-cursive text-[#76a713] text-2xl block">Complete The Regimen</span>
            <h3 className="text-lg sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
              Related Formulations
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>}

      {
    /* Mobile Sticky Bottom Floating Action Bar */
  }
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[9px] text-gray-400 font-bold uppercase block">Total Price</span>
          <span className="text-sm font-black text-[#76a713]">
            PKR {(selectedVariant.price * quantity).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
    onClick={handleAddToCart}
    className="px-4 py-2.5 bg-[#76a713] hover:bg-[#5d830f] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
  >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>
          <button
    onClick={handleBuyNow}
    className="px-3.5 py-2.5 bg-[#1b3c35] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
  >
            Buy Now
          </button>
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>;
}
