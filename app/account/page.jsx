"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/product/ProductCard";
import { User, MapPin, ClipboardList, Heart, LogOut, RefreshCw } from "lucide-react";
import Toast from "@/components/ui/Toast";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "profile";
  const { wishlist } = useCart();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [toastMsg, setToastMsg] = useState(null);
  
  // Use user from auth context, or fallback
  const [profile, setProfile] = useState({
    name: user?.name || "DreamyGlows User",
    email: user?.email || "user@example.com",
    phone: user?.phone || "03000000000"
  });

  const [address, setAddress] = useState({
    street: "Phase 5 DHA, Street 12, House 4B",
    city: "Lahore",
    province: "Punjab"
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "DreamyGlows User",
        email: user.email || "user@example.com",
        phone: user.phone || "03000000000"
      });
    }
    
    try {
      const savedAddr = localStorage.getItem("dg_user_address");
      if (savedAddr) {
        setAddress(JSON.parse(savedAddr));
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    router.push(`/account?tab=${tabName}`);
  };
  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("dg_user_profile", JSON.stringify(profile));
      setToastMsg("Profile updated and saved successfully!");
    } catch {
      setToastMsg("Error saving profile.");
    }
  };
  const handleSaveAddress = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("dg_user_address", JSON.stringify(address));
      setToastMsg("Shipping address updated and saved successfully!");
    } catch {
      setToastMsg("Error saving address.");
    }
  };
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    }
    loadOrders();
  }, []);
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {
    /* Sidebar Nav */
  }
        <aside className="w-full lg:w-72 bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-5 h-fit flex-shrink-0">
          <div className="flex items-center gap-3.5 border-b border-stone-100 pb-5">
            <div className="h-12 w-12 rounded-2xl bg-[#0d281a] text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-900">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-gray-950 text-sm">{profile.name}</h2>
              <p className="text-xs text-stone-400">{profile.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-stone-600 font-semibold">
            {[
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "Order History", icon: ClipboardList },
    { id: "address", label: "Saved Address", icon: MapPin },
    { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: Heart }
  ].map((tab) => {
    const Icon = tab.icon;
    return <button
      key={tab.id}
      onClick={() => handleTabChange(tab.id)}
      className={`flex items-center gap-3 text-left px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === tab.id ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200" : "hover:bg-stone-50 text-stone-600"}`}
    >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                </button>;
  })}
            <button
    onClick={() => {
      logout();
      setToastMsg("Logged out successfully!");
      setTimeout(() => router.push("/login"), 1000);
    }}
    className="flex items-center gap-3 text-left px-3.5 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 font-bold border-t border-stone-100 pt-3.5 mt-2 cursor-pointer transition-colors"
  >
              <LogOut className="h-4.5 w-4.5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {
    /* Content Area */
  }
        <div className="flex-1 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs min-h-[400px]">
          {
    /* Tab 1: Profile */
  }
          {activeTab === "profile" && <div className="space-y-6">
              <h2 className="text-xs font-bold text-gray-950 border-b border-stone-100 pb-3 uppercase tracking-wider">
                Personal Information
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Full Name</label>
                  <input
    type="text"
    required
    value={profile.name}
    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Email Address</label>
                  <input
    type="email"
    required
    value={profile.email}
    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Phone Number</label>
                  <input
    type="tel"
    required
    value={profile.phone}
    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
  />
                </div>
                <button
    type="submit"
    className="bg-[#1b7a4e] hover:bg-[#0d281a] text-white font-bold px-6 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-xs"
  >
                  Save Profile
                </button>
              </form>
            </div>}

          {
    /* Tab 2: Orders */
  }
          {activeTab === "orders" && <div className="space-y-6">
              <h2 className="text-xs font-bold text-gray-950 border-b border-stone-100 pb-3 uppercase tracking-wider">
                My Orders
              </h2>
              {orders.length === 0 ? <div className="text-center py-10 space-y-3 bg-stone-50/60 rounded-2xl p-6 border border-stone-100">
                  <p className="text-xs text-stone-500">No orders placed yet.</p>
                  <Link
    href="/shop"
    className="inline-block px-4 py-2 bg-[#76a713] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#5d830f] transition-colors"
  >
                    Start Shopping
                  </Link>
                </div> : <div className="divide-y divide-stone-100">
                  {orders.map((ord) => {
    const orderId = ord.orderId || ord.id;
    const orderTotal = ord.totals?.total || ord.total || 0;
    const orderDate = ord.createdAt || ord.date || "";
    const itemsDesc = Array.isArray(ord.items) ? ord.items.map((it) => `${it.title} x${it.quantity}`).join(", ") : ord.items || "Standard Order";
    return <div key={orderId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-gray-950 text-sm sm:text-base">{orderId}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${ord.status === "Delivered" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                              {ord.status || "Processing"}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-400">Placed on: {orderDate}</p>
                          <p className="text-xs text-stone-600 line-clamp-1">{itemsDesc}</p>
                        </div>
                        <div className="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto gap-2">
                          <span className="font-black text-[#0d281a] text-sm">PKR {orderTotal.toLocaleString()}</span>
                          <Link
      href={`/order-tracking?id=${orderId}`}
      className="text-xs font-bold text-[#1b7a4e] hover:underline"
    >
                            Track Status &rarr;
                          </Link>
                        </div>
                      </div>;
  })}
                </div>}
            </div>}

          {
    /* Tab 3: Address */
  }
          {activeTab === "address" && <div className="space-y-6">
              <h2 className="text-xs font-bold text-gray-950 border-b border-stone-100 pb-3 uppercase tracking-wider">
                Shipping Address
              </h2>
              <form onSubmit={handleSaveAddress} className="space-y-4 max-w-lg">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Street Address</label>
                  <input
    type="text"
    required
    value={address.street}
    onChange={(e) => setAddress({ ...address, street: e.target.value })}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">City</label>
                    <input
    type="text"
    required
    value={address.city}
    onChange={(e) => setAddress({ ...address, city: e.target.value })}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50"
  />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">Province</label>
                    <select
    value={address.province}
    onChange={(e) => setAddress({ ...address, province: e.target.value })}
    className="w-full border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-stone-50/50 font-semibold"
  >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa (KPK)">Khyber Pakhtunkhwa (KPK)</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                    </select>
                  </div>
                </div>
                <button
    type="submit"
    className="bg-[#1b7a4e] hover:bg-[#0d281a] text-white font-bold px-6 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-xs"
  >
                  Save Address
                </button>
              </form>
            </div>}

          {
    /* Tab 4: Wishlist */
  }
          {activeTab === "wishlist" && <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="text-xs font-bold text-gray-950 uppercase tracking-wider">
                  My Wishlist ({wishlist.length})
                </h2>
                <Link href="/wishlist" className="text-xs font-bold text-[#1b7a4e] hover:underline">
                  Full Page View &rarr;
                </Link>
              </div>
              {wishlist.length === 0 ? <div className="text-center py-12 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                    <Heart className="h-6 w-6" />
                  </div>
                  <p className="text-stone-500 text-xs sm:text-sm font-medium">You have not saved any items to your wishlist yet.</p>
                  <div>
                    <Link
    href="/shop"
    className="inline-block px-5 py-2.5 bg-[#1b7a4e] hover:bg-[#0d281a] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
  >
                      Browse Catalog
                    </Link>
                  </div>
                </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>}
            </div>}
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>;
}
export default function Account() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-[#1b7a4e]" />
      </div>}>
      <AccountContent />
    </Suspense>;
}
