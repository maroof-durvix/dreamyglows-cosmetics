"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Toast from "@/components/ui/Toast";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError("Please fill out all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Simulate Auth Success
    const userData = {
      name: isLogin ? "DreamyGlows User" : formData.name,
      email: formData.email,
      phone: "03000000000" // Mock phone
    };

    login(userData);
    
    // Save to profile as well for account page compatibility
    localStorage.setItem("dg_user_profile", JSON.stringify(userData));

    setToastMsg(isLogin ? "Welcome back!" : "Account created successfully!");
    
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-stone-200">
        
        {/* Left Side - Image/Branding */}
        <div className="w-full md:w-1/2 bg-[#072417] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden hidden sm:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#76a713]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <Link href="/">
              <img src="/logo-white.png" alt="DreamyGlows" className="h-10 w-auto object-contain mb-8" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight mb-4">
              Unlock Your <br />
              <span className="text-[#76a713]">Purest Glow</span>
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed max-w-sm">
              Experience professional medical-grade skincare and scalp treatments. Join the DreamyGlows club for exclusive formulations.
            </p>
          </div>

          <div className="relative z-10 space-y-3 mt-8">
            <div className="flex items-center gap-3 text-sm font-medium text-emerald-50">
              <CheckCircle className="h-5 w-5 text-[#76a713]" />
              <span>Dermatologist Verified Actives</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-emerald-50">
              <CheckCircle className="h-5 w-5 text-[#76a713]" />
              <span>Cash on Delivery Nationwide</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-emerald-50">
              <CheckCircle className="h-5 w-5 text-[#76a713]" />
              <span>100% Organic & Paraben Free</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12">
          {/* Mobile Logo */}
          <div className="sm:hidden mb-8 text-center flex justify-center">
            <img src="/logo.jpg" alt="DreamyGlows" className="h-12 w-auto object-contain rounded-xl shadow-sm" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isLogin ? "Sign in to access your orders and wishlist." : "Join us to start your skincare journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-[#76a713] transition-colors text-gray-900"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-[#76a713] transition-colors text-gray-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-[#76a713] transition-colors text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#76a713] hover:bg-[#5d830f] text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 group mt-2"
            >
              <span>{isLogin ? "Sign In" : "Sign Up"}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[#76a713] hover:underline font-bold"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
