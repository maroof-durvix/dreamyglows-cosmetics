"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Toast from "@/components/ui/Toast";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [toastMsg, setToastMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToastMsg("Message sent successfully! Our customer care team will respond within 24 business hours.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setToastMsg(data.error || "Failed to submit message. Please try again.");
      }
    } catch {
      setToastMsg("Network error. Please try reaching us directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-300">
      {
    /* Intro */
  }
      <div className="text-center space-y-1.5">
        <span className="font-cursive text-[#76a713] text-3xl sm:text-4xl block">We Are Here To Assist You</span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
          Contact Customer Support
        </h1>
        <div className="w-12 h-0.5 bg-[#76a713] mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {
    /* Info Column */
  }
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-stone-100 pb-3">
              Direct Contact Details
            </h3>
            
            <ul className="space-y-5 text-xs sm:text-sm text-stone-600">
              <li className="flex items-start gap-3.5">
                <div className="p-2.5 bg-emerald-50 text-[#1b7a4e] rounded-xl flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">WhatsApp &amp; Phone Inquiries</h4>
                  <p className="text-xs text-stone-600 mt-0.5 font-bold">+92 316 1941733 (0316 1941733)</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Mon - Sat (9:00 AM - 6:00 PM PKT)</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="p-2.5 bg-emerald-50 text-[#1b7a4e] rounded-xl flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Official Email</h4>
                  <p className="text-xs text-stone-600 mt-0.5 break-all">support@dreamyglows.com</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Response within 24 hours</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="p-2.5 bg-emerald-50 text-[#1b7a4e] rounded-xl flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Headquarters</h4>
                  <p className="text-xs text-stone-600 mt-0.5">DHA Phase 6, Karachi, Pakistan</p>
                </div>
              </li>
            </ul>

            <div className="pt-2 border-t border-stone-100">
              <a
    href="https://wa.me/923161941733"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 rounded-2xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-xs"
  >
                <WhatsAppIcon className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {
    /* Form Column */
  }
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-stone-100 pb-3">
            Send Inquiry Message
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-600 uppercase">Your Name *</label>
              <input
    type="text"
    name="name"
    required
    value={formData.name}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
    placeholder="Aisha Khan"
  />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-600 uppercase">Your Email *</label>
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
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 uppercase">Subject</label>
            <input
    type="text"
    name="subject"
    required
    value={formData.subject}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
    placeholder="e.g. Order Tracking Query / Product Guidance"
  />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 uppercase">Your Message *</label>
            <textarea
    name="message"
    required
    rows={4}
    value={formData.message}
    onChange={handleInputChange}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
    placeholder="Write your message or inquiry here..."
  />
          </div>

          <button
    type="submit"
    disabled={isSubmitting}
    className="w-full bg-[#1b7a4e] hover:bg-[#0d281a] text-white font-bold py-3.5 rounded-2xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-60"
  >
            {isSubmitting ? <span>Sending Message...</span> : <>
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </>}
          </button>
        </form>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>;
}
