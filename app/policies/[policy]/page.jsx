"use client";
import { useParams } from "next/navigation";
import { ShieldCheck, Truck, RotateCcw, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
export default function Policies() {
  const { policy } = useParams();
  const policyData = {
    privacy: {
      title: "Privacy Policy",
      icon: ShieldCheck,
      content: [
        "Your privacy and trust are paramount at DreamyGlows. This Privacy Policy describes how DreamyGlows collects, protects, and uses your personal details when you interact with or make a purchase from our store.",
        "When you place an order, we collect essential fulfillment information: your name, contact phone number, shipping address, and email for dispatch tracking and Cash on Delivery verification.",
        "We never sell, rent, or trade your personal data to third parties. Information is shared strictly with our courier logistics partners (Leopards / TCS) solely for completing your parcel delivery.",
        "If you have questions regarding your stored details or wish to request data removal, please contact our privacy compliance team at support@dreamyglows.com."
      ]
    },
    terms: {
      title: "Terms of Service",
      icon: FileText,
      content: [
        "Welcome to DreamyGlows. By visiting our online store and purchasing from us, you agree to be bound by the following standard terms and conditions.",
        "All product descriptions, pricing, and formulation specifications are published in good faith and subject to change without prior notice as part of ongoing laboratory improvements.",
        "Prices are quoted in Pakistani Rupees (PKR) and inclusive of all applicable taxes. We reserve the right to decline or cancel orders with inaccurate contact or shipping information.",
        "All website content, botanical illustrations, formulas, and branding assets are intellectual property of DreamyGlows Laboratories Pakistan."
      ]
    },
    shipping: {
      title: "Shipping & Delivery Policy",
      icon: Truck,
      content: [
        "We deliver parcels nationwide across all cities, towns, and districts in Pakistan using verified courier logistics partners.",
        "Standard delivery duration is 2 to 3 business days for major metropolitan hubs (Karachi, Lahore, Islamabad, Rawalpindi) and 3 to 5 business days for other regional areas.",
        "A standard flat shipping fee of PKR 250 applies. We provide FREE nationwide shipping on all orders valued at PKR 3,000 or above.",
        "Our courier partner will contact you via phone or SMS prior to attempting doorstep delivery for Cash on Delivery collection."
      ]
    },
    returns: {
      title: "Returns & Refund Policy",
      icon: RotateCcw,
      content: [
        "We stand behind the clinical quality of our formulations and offer a 7-day hassle-free return window on unopened and sealed items in their original packaging.",
        "Due to hygiene and pharmaceutical safety standards, opened bottles or products with broken protective seals cannot be accepted for return.",
        "To initiate a return or replacement for a damaged shipment, please send your Order ID and parcel photographs to support@dreamyglows.com within 7 days of delivery.",
        "Refunds are disbursed via direct Bank Transfer, Easypaisa, or JazzCash within 3 to 5 business days following physical inspection at our Karachi fulfillment hub."
      ]
    }
  };
  const currentPolicy = policyData[policy];
  if (!currentPolicy) {
    return <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Policy Not Found</h2>
        <p className="text-xs text-stone-500">The requested legal policy route does not exist.</p>
        <Link href="/" className="px-5 py-2.5 bg-[#1b7a4e] text-white text-xs font-bold rounded-xl inline-block">
          Return Home
        </Link>
      </div>;
  }
  const Icon = currentPolicy.icon;
  return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-3.5 border-b border-stone-200 pb-5">
        <div className="p-3 bg-emerald-50 text-[#1b7a4e] rounded-2xl border border-emerald-100">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Legal &amp; Policy Guidelines</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight font-sans">
            {currentPolicy.title}
          </h1>
        </div>
      </div>

      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-stone-600 leading-relaxed">
        {currentPolicy.content.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)}
      </div>
    </div>;
}
