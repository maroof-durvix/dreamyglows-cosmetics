"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Instagram, Facebook, ShieldCheck } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
export default function Footer() {
  const pathname = usePathname();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  const links = {
    shop: [
      { name: "Shop All", href: "/shop" },
      { name: "Skin Care", href: "/shop?category=Skin Care" },
      { name: "Hair Care", href: "/shop?category=Hair Care" },
      { name: "Medicated Solutions", href: "/shop?category=Medicated" }
    ],
    info: [
      { name: "About Us", href: "/about" },
      { name: "Contact Support", href: "/contact" },
      { name: "Track Order", href: "/order-tracking" }
    ],
    policies: [
      { name: "Privacy Policy", href: "/policies/privacy" },
      { name: "Terms of Service", href: "/policies/terms" },
      { name: "Shipping & Delivery", href: "/policies/shipping" },
      { name: "Returns & Refunds", href: "/policies/returns" }
    ]
  };
  return <footer className="bg-emerald-950 text-gray-300 border-t border-emerald-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {
          /* Brand Info */
        }
        <div className="space-y-4">
          <img src="/logo-white.png" alt="DreamyGlows" className="h-12 w-auto object-contain" />
          <p className="text-sm text-gray-400 leading-relaxed">
            Premium clinical-grade serums and scalp formulas designed to enhance your natural beauty. Scientific ingredients, visible results.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-emerald-900 hover:bg-emerald-800 rounded-full transition-colors text-white">
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a href="#" className="p-2 bg-emerald-900 hover:bg-emerald-800 rounded-full transition-colors text-white">
              <Facebook className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {
          /* Quick Links */
        }
        <div>
          <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-5">Shop Catalog</h4>
          <ul className="space-y-3 text-sm">
            {links.shop.map((link) => <li key={link.name}>
              <Link href={link.href} className="hover:text-white transition-colors">
                {link.name}
              </Link>
            </li>)}
          </ul>
        </div>

        {
          /* Customer Service */
        }
        <div>
          <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-5">Information</h4>
          <ul className="space-y-3 text-sm">
            {links.info.map((link) => <li key={link.name}>
              {link.name === "Contact Support" ? <a
                href="https://wa.me/923161941733"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-300 hover:text-white transition-colors group font-semibold"
              >
                <span>Contact Support</span>
                <WhatsAppIcon className="h-4 w-4 text-[#25D366] transition-transform duration-200 group-hover:scale-110" />
              </a> : <Link href={link.href} className="hover:text-white transition-colors">
                {link.name}
              </Link>}
            </li>)}
          </ul>
        </div>

        {
          /* Contact Details */
        }
        <div>
          <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-5">Get in Touch</h4>
          <ul className="space-y-4.5 text-sm">
            <li className="flex items-start gap-3">
              <a
                href="https://wa.me/923161941733"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 text-[#25D366] mt-0.5 flex-shrink-0" />
                <span>WhatsApp: 0316 1941733</span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-4.5 w-4.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>+92 316 1941733 </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="h-4.5 w-4.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="break-all">support@dreamyglows.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="h-4.5 w-4.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Karachi, Pakistan</span>
            </li>
          </ul>
        </div>
      </div>

      {
        /* Bottom copyright */
      }
      <div className="border-t border-emerald-900 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>© {currentYear} DreamyGlows Pakistan. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {links.policies.map((link) => <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
            {link.name}
          </Link>)}
        </div>
      </div>
    </div>
  </footer>;
}
