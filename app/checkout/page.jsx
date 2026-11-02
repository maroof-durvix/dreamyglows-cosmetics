"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShieldCheck, Truck, CheckCircle2, Lock } from "lucide-react";
import Toast from "@/components/ui/Toast";
import Link from "next/link";
export default function Checkout() {
  const { cart, cartSubtotal, isEligibleForFreeShipping, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "Karachi",
    province: "Sindh",
    notes: ""
  });
  React.useEffect(() => {
    try {
      const savedProf = localStorage.getItem("dg_user_profile");
      const savedAddr = localStorage.getItem("dg_user_address");
      const prof = savedProf ? JSON.parse(savedProf) : null;
      const addr = savedAddr ? JSON.parse(savedAddr) : null;
      setFormData((prev) => ({
        ...prev,
        fullName: prof?.name || prev.fullName,
        email: prof?.email || prev.email,
        phone: prof?.phone || prev.phone,
        address: addr?.street || prev.address,
        city: addr?.city || prev.city,
        province: addr?.province || prev.province
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);
  const majorCities = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Sialkot",
    "Gujranwala",
    "Hyderabad",
    "Bahawalpur",
    "Sargodha",
    "Abbottabad",
    "Other City"
  ];
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (success) {
      setToastMsg("Coupon applied successfully! You received a discount.");
    } else {
      setToastMsg("Invalid coupon code. Try SAVE10 or GLOW500.");
    }
    setCouponCode("");
  };
  const shippingCost = isEligibleForFreeShipping ? 0 : 250;
  const discountAmount = appliedCoupon ? appliedCoupon.discountPercent > 0 ? cartSubtotal * appliedCoupon.discountPercent / 100 : appliedCoupon.discountFixed : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    const orderId = `DG-2026-${Math.floor(1e4 + Math.random() * 9e4)}`;
    const orderDetails = {
      orderId,
      customer: formData,
      items: cart.map((item) => ({
        title: item.product.title,
        variant: item.variant.title,
        price: item.variant.price,
        quantity: item.quantity
      })),
      totals: {
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingCost,
        total: grandTotal
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "Pending Verification"
    };
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails)
      });
    } catch (err) {
      console.error("Error saving order to server:", err);
    }
    sessionStorage.setItem("dg_last_order", JSON.stringify(orderDetails));
    try {
      localStorage.setItem("dg_user_profile", JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone
      }));
      localStorage.setItem("dg_user_address", JSON.stringify({
        street: formData.address,
        city: formData.city,
        province: formData.province
      }));
    } catch (e2) {
      console.error(e2);
    }
    clearCart();
    setIsSubmitting(false);
    router.push(`/order-confirmation?id=${orderId}`);
  };
  if (cart.length === 0) {
    return <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="p-4 bg-emerald-50 rounded-full text-emerald-800 w-fit mx-auto">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-950">Your checkout is empty</h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Please add clinical serums to your cart before proceeding with checkout.
        </p>
        <Link
      href="/shop"
      className="px-7 py-3 bg-[#1b7a4e] hover:bg-[#0d281a] text-white text-xs font-bold rounded-xl uppercase tracking-wider inline-block transition-all shadow-md"
    >
          Browse Catalog
        </Link>
      </div>;
  }
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {
    /* Title */
  }
      <div className="space-y-1">
        <span className="font-serif italic text-emerald-700 text-2xl block">Express Checkout</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 uppercase tracking-tight font-sans">
          Shipping &amp; Order Verification
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {
    /* Checkout Form */
  }
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-emerald-700" /> Delivery Information
            </h2>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Cash on Delivery (COD)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-600 uppercase">Full Name *</label>
              <input
    type="text"
    name="fullName"
    required
    value={formData.fullName}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
    placeholder="Aisha Khan"
  />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-600 uppercase">Phone Number (For COD call) *</label>
              <input
    type="tel"
    name="phone"
    required
    value={formData.phone}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
    placeholder="0300 1234567"
  />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 uppercase">Email Address *</label>
            <input
    type="email"
    name="email"
    required
    value={formData.email}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
    placeholder="aisha@gmail.com"
  />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 uppercase">Complete Street Address *</label>
            <input
    type="text"
    name="address"
    required
    value={formData.address}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
    placeholder="House/Apartment #, Street, Phase / Block / Sector"
  />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-600 uppercase">City *</label>
              <select
    name="city"
    value={formData.city}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50 font-semibold"
  >
                {majorCities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-600 uppercase">Province *</label>
              <select
    name="province"
    value={formData.province}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50 font-semibold"
  >
                <option value="Sindh">Sindh</option>
                <option value="Punjab">Punjab</option>
                <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                <option value="Khyber Pakhtunkhwa (KPK)">Khyber Pakhtunkhwa (KPK)</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Azad Kashmir">Azad Kashmir</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 uppercase">Order Delivery Notes (Optional)</label>
            <textarea
    name="notes"
    rows={2}
    value={formData.notes}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
    placeholder="e.g. Please deliver after 3:00 PM or ring doorbell 4B"
  />
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong>Payment Method: Cash on Delivery (COD)</strong>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Pay with cash when the courier arrives at your doorstep. Zero advance payment required.
              </p>
            </div>
          </div>

          <button
    type="submit"
    disabled={isSubmitting}
    className="w-full bg-[#1b7a4e] hover:bg-[#0d281a] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:bg-stone-300"
  >
            {isSubmitting ? <span>Confirming Your Order...</span> : <>
                <Lock className="h-4 w-4" />
                <span>Confirm Order (PKR {grandTotal.toLocaleString()})</span>
              </>}
          </button>
        </form>

        {
    /* Order Summary & Coupon Column */
  }
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider border-b border-stone-100 pb-3">
              Order Summary ({cart.length} {cart.length === 1 ? "item" : "items"})
            </h3>

            {
    /* Items list */
  }
            <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-stone-100 pr-1">
              {cart.map((item) => <div key={item.variant.sku} className="flex gap-3 pt-3 first:pt-0">
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-stone-50 border border-stone-200 flex-shrink-0">
                    <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.title}</h4>
                    <p className="text-[10px] text-stone-500">Qty: {item.quantity} • {item.variant.title}</p>
                    <p className="text-xs font-black text-[#0d281a] mt-0.5">
                      PKR {(item.variant.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>)}
            </div>

            {
    /* Coupon Code Input */
  }
            <form onSubmit={handleApplyCoupon} className="pt-2 flex gap-2">
              <input
    type="text"
    placeholder="Coupon (e.g. SAVE10)"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
    className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-600 uppercase font-semibold"
  />
              <button
    type="submit"
    className="px-4 py-2 bg-[#0d281a] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
  >
                Apply
              </button>
            </form>

            {
    /* Pricing details */
  }
            <div className="space-y-2 border-t border-stone-100 pt-4 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">PKR {cartSubtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && <div className="flex justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    Discount ({appliedCoupon.code})
                    <button onClick={removeCoupon} className="text-[10px] text-rose-600 underline ml-1 cursor-pointer">Remove</button>
                  </span>
                  <span>- PKR {discountAmount.toLocaleString()}</span>
                </div>}
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-bold text-gray-900">
                  {shippingCost === 0 ? <span className="text-emerald-700 font-black">FREE</span> : `PKR ${shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 border-t border-stone-200 pt-3">
                <span>Total Amount (COD)</span>
                <span className="text-emerald-900 text-lg font-black">PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Zero advance deposit required • Pay upon parcel delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-emerald-700" />
                <span>Tracked dispatch via Leopards &amp; TCS courier partners</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>;
}
