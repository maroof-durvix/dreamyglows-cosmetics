"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Truck, Package, ShieldAlert, ArrowRight, Printer } from "lucide-react";
function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);
  useEffect(() => {
    async function resolveOrder() {
      if (!orderId) return;
      const savedOrder = sessionStorage.getItem("dg_last_order");
      if (savedOrder) {
        try {
          const parsed = JSON.parse(savedOrder);
          if (parsed.orderId === orderId) {
            setOrder(parsed);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            const found = data.orders.find(
              (o) => (o.orderId || o.id || "").toUpperCase() === orderId.toUpperCase()
            );
            if (found) {
              setOrder(found);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching order confirmation:", err);
      }
    }
    resolveOrder();
  }, [orderId]);
  if (!orderId) {
    return <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Missing Order Reference</h2>
        <p className="text-xs sm:text-sm text-stone-500">
          We could not locate an active order session for this request.
        </p>
        <Link href="/" className="px-6 py-2.5 bg-[#1b7a4e] text-white text-xs font-bold rounded-xl inline-block uppercase tracking-wider">
          Return to Home
        </Link>
      </div>;
  }
  return <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
      {
    /* Confirmed banner */
  }
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-xs">
        <div className="h-16 w-16 bg-emerald-50 text-[#1b7a4e] rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle className="h-9 w-9" />
        </div>
        <div className="space-y-1">
          <span className="font-serif italic text-emerald-700 text-2xl sm:text-3xl block">Thank you for your order</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight uppercase font-sans">
            Order Confirmed!
          </h1>
        </div>
        <div className="inline-block bg-[#f4f7f5] border border-emerald-200/80 rounded-2xl px-6 py-3">
          <span className="text-[10px] font-bold text-emerald-900 block uppercase tracking-wider">Your Tracking Reference ID</span>
          <span className="text-xl font-black text-[#0d281a] tracking-wider uppercase mt-0.5 block">{orderId}</span>
        </div>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          Your order has been recorded. Our team will verify your address and dispatch your package via express courier.
        </p>
      </div>

      {
    /* Invoice */
  }
      {order && <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-[#fbfbf9]">
            <h2 className="text-xs sm:text-sm font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="h-4 w-4 text-emerald-700" /> Order Invoice Summary
            </h2>
            <button
    onClick={() => window.print()}
    className="text-xs font-bold text-[#1b7a4e] hover:underline flex items-center gap-1 cursor-pointer"
  >
              <Printer className="h-3.5 w-3.5" /> Print Invoice
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm border-b border-stone-100 pb-5">
              <div className="space-y-1">
                <h4 className="font-bold uppercase text-[10px] tracking-wider text-stone-400">Recipient Information</h4>
                <p className="font-bold text-gray-900">{order.customer.fullName}</p>
                <p className="text-stone-600 leading-relaxed">
                  {order.customer.address}, {order.customer.city}, {order.customer.province}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold uppercase text-[10px] tracking-wider text-stone-400">Payment &amp; Delivery</h4>
                <p className="text-stone-600">Phone: {order.customer.phone}</p>
                <p className="text-stone-600">Email: {order.customer.email}</p>
                <p className="text-stone-700">Payment: <strong className="text-emerald-800">Cash on Delivery (COD)</strong></p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold uppercase text-[10px] tracking-wider text-stone-400">Ordered Items</h4>
              <div className="divide-y divide-stone-100">
                {order.items.map((item, idx) => <div key={idx} className="flex justify-between py-3 first:pt-0 last:pb-0 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-gray-900">{item.title}</span>
                      <span className="text-stone-500 text-xs ml-2">({item.variant}) x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-[#0d281a]">PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>)}
              </div>
            </div>

            <div className="border-t border-stone-100 pt-5 space-y-2 text-xs sm:text-sm text-stone-600 max-w-sm ml-auto">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {order.totals.subtotal.toLocaleString()}</span>
              </div>
              {order.totals.discount > 0 && <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>- PKR {order.totals.discount.toLocaleString()}</span>
                </div>}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.totals.shipping === 0 ? "FREE" : `PKR ${order.totals.shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 border-t border-stone-200 pt-3">
                <span>Total Amount (COD)</span>
                <span className="text-emerald-900 font-black">PKR {order.totals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Action links */
  }
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link
    href={`/order-tracking?id=${orderId}`}
    className="px-7 py-3.5 bg-[#1b7a4e] hover:bg-[#0d281a] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md w-full sm:w-auto text-center justify-center"
  >
          <Truck className="h-4 w-4" /> Track Package Status
        </Link>
        <Link
    href="/shop"
    className="px-7 py-3.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all w-full sm:w-auto text-center justify-center"
  >
          <span>Continue Shopping</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>;
}
export default function OrderConfirmation() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <Package className="h-8 w-8 animate-spin text-[#1b7a4e]" />
      </div>}>
      <OrderConfirmationContent />
    </Suspense>;
}
