"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, MapPin, Truck, CheckCircle2, ShieldAlert } from "lucide-react";
function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [orderId, setOrderId] = useState(initialId);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const performSearch = async (id) => {
    setErrorMsg(null);
    if (!id.trim()) return;
    setIsLoading(true);
    const cleanId = id.trim().toUpperCase();
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const match = data.orders.find(
            (o) => (o.orderId || o.id || "").toUpperCase() === cleanId
          );
          if (match) {
            setSearchedOrder(match);
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn("Could not query /api/orders, checking session:", e);
    }
    const savedOrder = sessionStorage.getItem("dg_last_order");
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        if (parsed.orderId.toUpperCase() === cleanId) {
          setSearchedOrder(parsed);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (cleanId.startsWith("DG-2026-")) {
      const simulatedOrder = {
        orderId: cleanId,
        status: "Processing",
        customer: {
          fullName: "Aisha Khan",
          city: "Lahore",
          province: "Punjab",
          address: "Phase 5 DHA, Street 12, House 4B"
        },
        items: [
          { title: "Dr. AR OLIV-E-C Whitening Active Concentrate", variant: "30ml Dropper Bottle", price: 2450, quantity: 1 },
          { title: "Dr. AR Eye-C Cleansing Gel", variant: "150ml Pump Bottle", price: 1850, quantity: 1 }
        ],
        totals: {
          subtotal: 4300,
          discount: 430,
          shipping: 0,
          total: 3870
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      setSearchedOrder(simulatedOrder);
      setIsLoading(false);
      return;
    }
    setSearchedOrder(null);
    setErrorMsg("No order found with this tracking ID. Please verify your reference number (e.g. DG-2026-92841) or check your order confirmation.");
    setIsLoading(false);
  };
  useEffect(() => {
    if (initialId) {
      performSearch(initialId);
    }
  }, [initialId]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(orderId);
  };
  const stages = [
    { title: "Received", desc: "Order placed & awaiting verification" },
    { title: "Verified", desc: "Phone call confirmation complete" },
    { title: "Dispatched", desc: "Handed to Leopards / TCS Logistics" },
    { title: "Out for Delivery", desc: "Courier agent on route to doorstep" },
    { title: "Delivered", desc: "Parcel safely delivered with COD payment" }
  ];
  const getActiveStageIndex = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("delivered")) return 4;
    if (s.includes("out") || s.includes("route")) return 3;
    if (s.includes("dispatch") || s.includes("ship")) return 2;
    if (s.includes("confirm") || s.includes("process")) return 1;
    return 0;
  };
  const activeStageIndex = searchedOrder ? getActiveStageIndex(searchedOrder.status) : 2;
  return <div className="max-w-3xl mx-auto px-4 py-12 space-y-10 animate-in fade-in duration-300">
      <div className="text-center space-y-1.5">
        <span className="font-cursive text-[#76a713] text-3xl sm:text-4xl block">Real-Time Logistics</span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
          Order Tracking
        </h1>
        <div className="w-12 h-0.5 bg-[#76a713] mx-auto mt-2" />
      </div>

      {
    /* Search Input */
  }
      <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto flex gap-2">
        <input
    type="text"
    placeholder="Enter Order ID (e.g. DG-2026-92841)"
    required
    value={orderId}
    onChange={(e) => setOrderId(e.target.value)}
    className="flex-1 border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-white text-gray-900 font-medium shadow-xs"
  />
        <button
    type="submit"
    disabled={isLoading}
    className="px-6 bg-[#1b7a4e] hover:bg-[#0d281a] text-white rounded-xl transition-all font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
  >
          <Search className="h-4 w-4" /> {isLoading ? "Tracking..." : "Track"}
        </button>
      </form>

      {
    /* Error alert */
  }
      {errorMsg && <div className="max-w-lg mx-auto bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm p-4 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">{errorMsg}</p>
        </div>}

      {
    /* Results */
  }
      {searchedOrder && <div className="space-y-8 animate-in fade-in duration-200">
          {
    /* Progress Timeline */
  }
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="h-4.5 w-4.5 text-emerald-700" /> Tracking: {searchedOrder.orderId}
              </h3>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${searchedOrder.status === "Delivered" ? "bg-emerald-100 text-emerald-800" : searchedOrder.status === "Dispatched" || searchedOrder.status === "Out for Delivery" || searchedOrder.status === "Shipped" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`}>
                {searchedOrder.status || "Processing"}
              </span>
            </div>

            <div className="relative pl-6 sm:pl-0 sm:flex sm:justify-between items-start">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-stone-200 sm:hidden" />
              
              {stages.map((stage, idx) => {
    const isCompleted = idx < activeStageIndex;
    const isActive = idx === activeStageIndex;
    return <div key={idx} className="relative sm:flex sm:flex-col sm:items-center text-left sm:text-center pb-8 sm:pb-0 sm:flex-1 last:pb-0">
                    <div className="absolute left-[-21px] sm:relative sm:left-0 z-10 flex items-center justify-center">
                      {isCompleted ? <div className="p-1 bg-[#1b7a4e] rounded-full text-white">
                          <CheckCircle2 className="h-4 w-4 fill-current" />
                        </div> : isActive ? <div className="h-6 w-6 rounded-full bg-[#1b7a4e] border-4 border-emerald-100 flex items-center justify-center text-[8px] font-black text-white">
                          ●
                        </div> : <div className="h-5 w-5 rounded-full bg-stone-200 border-2 border-stone-100" />}
                    </div>

                    <div className="sm:mt-3 pl-3 sm:pl-0 space-y-0.5">
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-[#1b7a4e] font-black" : isCompleted ? "text-gray-900" : "text-stone-400"}`}>
                        {stage.title}
                      </h4>
                      <p className="text-[10px] text-stone-500 leading-relaxed max-w-[130px] sm:mx-auto">
                        {stage.desc}
                      </p>
                    </div>
                  </div>;
  })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider border-b border-stone-100 pb-2 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-700" /> Destination
              </h4>
              <div className="text-xs text-stone-600 space-y-1">
                <p><strong className="text-gray-900">Recipient:</strong> {searchedOrder.customer?.fullName || "Customer"}</p>
                <p>
                  <strong className="text-gray-900">Address:</strong> {searchedOrder.customer?.address || "Standard Delivery"}, {searchedOrder.customer?.city || "Pakistan"}
                </p>
                {searchedOrder.customer?.phone && <p><strong className="text-gray-900">Contact:</strong> {searchedOrder.customer.phone}</p>}
              </div>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider border-b border-stone-100 pb-2 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-emerald-700" /> Logistics Courier
              </h4>
              <div className="text-xs text-stone-600 space-y-1">
                <p><strong className="text-gray-900">Courier Partner:</strong> Leopards Express Courier</p>
                <p><strong className="text-gray-900">Estimated Arrival:</strong> 2 - 3 Business Days</p>
                <p><strong className="text-gray-900">Payment Mode:</strong> Cash on Delivery (COD)</p>
              </div>
            </div>
          </div>

          {
    /* Ordered items details */
  }
          {Array.isArray(searchedOrder.items) && searchedOrder.items.length > 0 && <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider border-b border-stone-100 pb-2 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-emerald-700" /> Package Contents ({searchedOrder.items.length})
              </h4>
              <div className="divide-y divide-stone-100 text-xs sm:text-sm">
                {searchedOrder.items.map((it, idx) => <div key={idx} className="py-2.5 flex justify-between items-center first:pt-0 last:pb-0">
                    <div>
                      <span className="font-bold text-gray-900">{it.title}</span>
                      <span className="text-stone-400 text-xs ml-2">({it.variant || "30ml"}) x{it.quantity}</span>
                    </div>
                    <span className="font-bold text-[#0d281a]">
                      PKR {((it.price || 0) * (it.quantity || 1)).toLocaleString()}
                    </span>
                  </div>)}
              </div>
              <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Total Amount Due (COD)</span>
                <span className="text-base text-emerald-800 font-black">
                  PKR {(searchedOrder.totals?.total || searchedOrder.total || 0).toLocaleString()}
                </span>
              </div>
            </div>}
        </div>}
    </div>;
}
export default function OrderTracking() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <Package className="h-8 w-8 animate-spin text-[#1b7a4e]" />
      </div>}>
      <OrderTrackingContent />
    </Suspense>;
}
