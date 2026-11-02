import Link from "next/link";
import {
  FlaskConical,
  Heart,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Microscope,
  Compass,
  Quote
} from "lucide-react";
export const metadata = {
  title: "About Us | DreamyGlows & Dr. AR Clinical Formulations",
  description: "Learn about DreamyGlows, our pharmaceutical partnership with Dr. AR, and our leadership team committed to clinical skincare purity in Pakistan."
};
export default function AboutUs() {
  const leadershipTeam = [
    {
      name: "Syed Hasan Rafay",
      title: "Founder",
      roleBadge: "Founder",
      initials: "SHR",
      accentColor: "from-emerald-800 to-[#071910]",
      tagColor: "bg-emerald-50 text-emerald-900 border-emerald-200/90",
      bio: "Visionary architect who conceived DreamyGlows to challenge the regional cosmetic market. Guided by a steadfast commitment to clean beauty ethics, transparent concentrations, and accessible clinical solutions.",
      quote: "We founded DreamyGlows on a single core truth: everyone deserves skincare that actually works, formulated transparently without toxic fillers or secrecy.",
      specialties: ["Brand Architecture", "Clean Formulation Ethics", "Strategic Innovation"]
    },
    {
      name: "Muhammad Usman Khalil Ansari",
      title: "Chief Executive Officer (CEO)",
      roleBadge: "Chief Executive Officer",
      initials: "MUK",
      accentColor: "from-[#0d281a] to-emerald-900",
      tagColor: "bg-stone-100 text-stone-800 border-stone-200",
      bio: "Drives DreamyGlows\u2019 corporate vision, commercial expansion, nationwide retail strategy, and clinical brand partnerships. Dedicated to institutionalizing dermatological efficacy and consumer trust across Pakistan.",
      quote: "Our commitment is uncompromising: clinical efficacy backed by pure science, delivering verifiable results without unnecessary luxury markups.",
      specialties: ["Corporate Governance", "Clinical Brand Alliances", "Strategic Growth"]
    },
    {
      name: "Muhammad Bilal Khan",
      title: "Managing Director",
      roleBadge: "Managing Director",
      initials: "MBK",
      accentColor: "from-[#1b7a4e] to-[#071910]",
      tagColor: "bg-emerald-50 text-emerald-900 border-emerald-200/90",
      bio: "Oversees end-to-end supply chain integrity, cold-chain ingredient logistics, laboratory quality compliance, and fulfillment operations to ensure precision from formulation to customer doorstep.",
      quote: "From lab batch verification to fast cash-on-delivery right at your door, every step of the DreamyGlows journey is executed with surgical precision.",
      specialties: ["Supply Chain Integrity", "Quality Compliance", "Nationwide Logistics"]
    }
  ];
  const milestones = [
    { number: "25,000+", label: "Happy Customers Across Pakistan" },
    { number: "100%", label: "Disclosed Active Concentrations" },
    { number: "0%", label: "Parabens, Sulfates & Toxic Fillers" },
    { number: "4.9 / 5.0", label: "Average Verified Customer Rating" }
  ];
  const pillars = [
    {
      icon: FlaskConical,
      title: "Clinical Bio-Potency",
      description: "We prioritize active therapeutic percentages (e.g. 5% Pure Vitamin C + 5% Vitamin E, 20% Mandelic Acid) that provide genuine clinical results rather than marketing claims."
    },
    {
      icon: Microscope,
      title: "Dermatologist Formulated",
      description: "Engineered in partnership with Dr. AR pharmaceutical labs. Each batch is stringently analyzed for physiological pH harmony, active stability, and non-irritating dermal safety."
    },
    {
      icon: Compass,
      title: "Climate-Adaptive Science",
      description: "Formulated specifically for the South Asian climate\u2014countering excessive heat, humidity, dust, and intense UV exposure without clogging pores or leaving oily films."
    },
    {
      icon: Heart,
      title: "100% Ethical & Cruelty Free",
      description: "Zero animal testing, ethically sourced botanicals, recyclable glass containers, and clean active compounds free from harsh parabens, salts, or synthetic colorants."
    }
  ];
  return <div className="space-y-14 sm:space-y-20 pb-20 animate-in fade-in duration-300">
      
      {
    /* 1. Hero Header Section - Exact match to user reference picture */
  }
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8faf7] via-white to-[#fbfcfb] py-14 sm:py-20 border-b border-stone-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <span className="font-cursive text-[#76a713] text-3xl sm:text-5xl block">Our Clinical Heritage</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight font-sans leading-tight text-gray-950">
            SCIENTIFIC PURITY.<br />
            <span className="text-[#1b7a4e]">EVIDENCE-BASED SKINCARE.</span>
          </h1>

          <div className="w-14 h-1 bg-[#76a713] mx-auto rounded-full mt-4" />

          <p className="text-xs sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed pt-3 font-normal font-sans">
            We are on a mission to democratize professional, clinical-grade skincare across Pakistan. By stripping away overpriced branding markups and toxic fillers, we provide evidence-backed active formulas that transform skin health.
          </p>
        </div>
      </section>

      {
    /* 2. Key Metrics Bar */
  }
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0d281a] rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-emerald-900">
          {milestones.map((item, idx) => <div key={idx} className="space-y-1.5">
              <div className="text-2xl sm:text-4xl font-black text-[#76a713] tracking-tight font-sans">
                {item.number}
              </div>
              <div className="text-xs sm:text-sm text-emerald-100/80 font-medium">
                {item.label}
              </div>
            </div>)}
        </div>
      </section>

      {
    /* 3. The Origin Story & Clinical Heritage */
  }
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-1">
              <span className="font-cursive text-[#76a713] text-2xl sm:text-4xl block">Why We Began</span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight font-sans leading-snug">
                CHALLENGING OVERPRICED COSMETICS WITH HONEST CLINICAL SCIENCE
              </h2>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
              For years, consumers in Pakistan were forced to choose between two unacceptable extremes: exorbitant imported serums with 400% retail markups, or dubious local creams loaded with unlisted steroids, bleaching agents, and harmful heavy metals.
            </p>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
              DreamyGlows was created to provide a superior, honest third alternative. Partnering directly with certified clinical laboratories, we manufacture pure active bio-compounds under pharmaceutical standards—bringing real dermatological efficacy within reach of everyone.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#76a713] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 font-sans uppercase">Exact Clinical Active Disclosures</h4>
                  <p className="text-xs text-stone-500 font-sans">Every bottle states the exact therapeutic percentage: 5% Vitamin C, 20% Mandelic Acid, 2% Hyaluronic Acid.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#76a713] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 font-sans uppercase">Dr. AR Pharmaceutical Heritage</h4>
                  <p className="text-xs text-stone-500 font-sans">Developed in tandem with clinical experts specialized in sensitive Asian skin biology and climatic stress resilience.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
              <img
    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&h=900&q=85"
    alt="Clinical Formulation Lab"
    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
  />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest font-sans">Purity &amp; Safety</span>
                  <h3 className="text-base sm:text-xl font-bold font-sans">100% Sterile Clean-Room Manufacturing</h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {
    /* 4. Executive Leadership / Owner Cards */
  }
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="font-cursive text-[#76a713] text-2xl sm:text-4xl block">The Minds Behind The Brand</span>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight font-sans">
            EXECUTIVE LEADERSHIP &amp; FOUNDERS
          </h2>
          <div className="w-12 h-0.5 bg-[#76a713] mx-auto" />
          <p className="text-xs sm:text-sm text-stone-500 font-sans">
            Meet the visionary leadership guiding DreamyGlows towards medical-grade excellence, ethical formulation, and nationwide reliability.
          </p>
        </div>

        {
    /* 3 Executive Owner Cards Grid */
  }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {leadershipTeam.map((leader, index) => <div
    key={index}
    className="group bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#1b7a4e]/50 transition-all duration-300 flex flex-col justify-between relative shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]"
  >
              {
    /* Executive Top Accent Stripe */
  }
              <div className="h-1.5 w-full bg-gradient-to-r from-[#1b7a4e] via-[#76a713] to-[#1b7a4e]" />

              <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
                {
    /* Executive Identity Header */
  }
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    {
    /* Prestigious Monogram Crest */
  }
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#071910] via-[#0d281a] to-[#071910] border border-[#1b7a4e]/40 shadow-sm flex items-center justify-center text-[#e8f5ec] font-serif font-black text-xl tracking-wider group-hover:border-[#76a713]/60 transition-colors">
                        {leader.initials}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1b7a4e] text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                        <ShieldCheck className="h-3 w-3" />
                      </div>
                    </div>

                    {
    /* Role Tag Pill */
  }
                    <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full border ${leader.tagColor} font-sans`}>
                      {leader.roleBadge}
                    </span>
                  </div>

                  {
    /* Name & Title */
  }
                  <div className="space-y-1 pt-1">
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-[#1b7a4e] transition-colors font-sans tracking-tight">
                      {leader.name}
                    </h3>
                    <div className="text-xs font-bold text-[#76a713] uppercase tracking-wider font-sans">
                      {leader.title}
                    </div>
                  </div>

                  {
    /* Bio */
  }
                  <p className="text-xs text-stone-600 leading-relaxed font-sans pt-1">
                    {leader.bio}
                  </p>
                </div>

                {
    /* Editorial Quote Block */
  }
                <div className="bg-[#f8faf8] border-l-2 border-[#1b7a4e] p-3.5 rounded-r-xl space-y-1.5 mt-4">
                  <div className="flex items-center gap-1.5 text-[#1b7a4e]">
                    <Quote className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest font-sans">Executive Perspective</span>
                  </div>
                  <p className="text-xs italic text-stone-700 leading-relaxed font-serif">
                    &ldquo;{leader.quote}&rdquo;
                  </p>
                </div>

                {
    /* Core Focus Tags */
  }
                <div className="pt-4 border-t border-stone-100 space-y-2">
                  <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-widest block font-sans">
                    Strategic Focus
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {leader.specialties.map((spec, sIdx) => <span
    key={sIdx}
    className="px-2.5 py-1 bg-stone-50 border border-stone-200/80 text-stone-700 text-[10px] font-semibold rounded-md font-sans"
  >
                        {spec}
                      </span>)}
                  </div>
                </div>
              </div>

              {
    /* Bottom Card Strip */
  }
              <div className="px-6 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-sans">
                <span className="font-semibold text-stone-600">DreamyGlows Executive Board</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#76a713]" /> Verified Leadership
                </span>
              </div>
            </div>)}
        </div>
      </section>

      {
    /* 5. Four Pillars of Formulation */
  }
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="font-cursive text-[#76a713] text-2xl sm:text-4xl block">Our Guarantee</span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight font-sans">
            THE 4 FORMULATION PILLARS
          </h2>
          <div className="w-12 h-0.5 bg-[#76a713] mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
    const Icon = pillar.icon;
    return <div
      key={idx}
      className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all space-y-3 group hover:border-[#1b7a4e]/40"
    >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1b7a4e] flex items-center justify-center group-hover:bg-[#1b7a4e] group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase font-sans">
                  {pillar.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  {pillar.description}
                </p>
              </div>;
  })}
        </div>
      </section>

      {
    /* 6. Direct Call To Action - Exact match to user reference picture */
  }
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#0d281a] via-[#072417] to-emerald-950 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden border border-emerald-900">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#76a713]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <span className="font-cursive text-[#76a713] text-3xl sm:text-5xl block">Experience The Difference</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight text-white font-sans">
              READY TO UPGRADE YOUR DAILY SKINCARE REGIMEN?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-sans">
              Discover our bestselling Vitamin C, Mandelic Acid, and Rosemary Scalp Serums. Fast Cash on Delivery across Pakistan.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
    href="/shop"
    className="px-8 py-3.5 bg-[#76a713] hover:bg-[#5d830f] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer font-sans"
  >
                <span>Shop All Formulas</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
    href="/contact"
    className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20 inline-flex items-center justify-center cursor-pointer font-sans"
  >
                <span>Contact Our Specialists</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>;
}
