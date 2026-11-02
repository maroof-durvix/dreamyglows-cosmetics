"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Image as ImageIcon,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  LogOut,
  Search,
  DollarSign,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Printer,
  X,
  AlertCircle,
  UploadCloud,
  Mail,
  MessageSquare,
  Download,
  Menu
} from "lucide-react";
import Toast from "@/components/ui/Toast";
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [inquirySearch, setInquirySearch] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    onConfirm: () => {
    }
  });
  const [productForm, setProductForm] = useState({
    _id: "",
    title: "",
    slug: "",
    category: "Skin Care",
    gender: "Unisex",
    concern: "Pigmentation & Dark Spots",
    description: "",
    price: 2450,
    compareAtPrice: 2850,
    imageUrl: "/hero-oliv-c.png",
    inStock: true,
    featured: true,
    ingredients: "",
    benefits: "",
    howToUse: ""
  });
  const [bannerForm, setBannerForm] = useState({
    _id: "",
    title: "",
    imageUrl: "",
    link: "/shop",
    order: 1
  });
  const handleFileUpload = async (file, target) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (target === "product") {
          setProductForm((prev) => ({ ...prev, imageUrl: data.url }));
        } else {
          setBannerForm((prev) => ({ ...prev, imageUrl: data.url }));
        }
        setToastMsg("Image uploaded successfully to Sanity CDN");
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error uploading image: " + err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("dg_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, bannerRes, subRes, inqRes] = await Promise.all([
        fetch("/api/products").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/orders").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/banners").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/newsletter").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/contact").then((r) => r.json()).catch(() => ({ success: false }))
      ]);
      if (prodRes.success && Array.isArray(prodRes.products)) setProducts(prodRes.products);
      if (orderRes.success && Array.isArray(orderRes.orders)) setOrders(orderRes.orders);
      if (bannerRes.success && Array.isArray(bannerRes.banners)) setBanners(bannerRes.banners);
      if (subRes.success && Array.isArray(subRes.subscribers)) setSubscribers(subRes.subscribers);
      if (inqRes.success && Array.isArray(inqRes.inquiries)) setInquiries(inqRes.inquiries);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };
  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      setToastMsg("No subscribers to export.");
      return;
    }
    const header = "Email,Subscribed Date,Source,Status\n";
    const rows = subscribers.map((s) => `"${s.email}","${s.subscribedAt || ""}","${s.source || ""}","${s.status || "active"}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `dreamyglows-subscribers-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMsg("Subscribers list exported as CSV");
  };
  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(`Inquiry marked as ${newStatus}`);
        setInquiries(inquiries.map((inq) => inq.id === id ? { ...inq, status: newStatus } : inq));
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === "DreamyGlows@2026") {
      setIsAuthenticated(true);
      sessionStorage.setItem("dg_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Invalid Admin Passcode. Please try again.");
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("dg_admin_auth");
    setPasscode("");
  };
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      _id: "",
      title: "",
      slug: "",
      category: "Skin Care",
      gender: "Unisex",
      concern: "Pigmentation & Dark Spots",
      description: "",
      price: 2450,
      compareAtPrice: 2850,
      imageUrl: "/hero-oliv-c.png",
      inStock: true,
      featured: true,
      ingredients: "Vitamin C, Hyaluronic Acid, Vitamin E",
      benefits: "Visibly brightens dull skin\nFades dark spots\nNon-greasy rapid absorption",
      howToUse: "Cleanse face thoroughly\nApply 3-4 drops evenly\nFollow with moisturizer"
    });
    setIsProductModalOpen(true);
  };
  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      _id: prod._id,
      title: prod.title,
      slug: prod.slug,
      category: prod.category,
      gender: prod.gender,
      concern: prod.concern.join(", "),
      description: prod.description,
      price: prod.variants[0]?.price || 2450,
      compareAtPrice: prod.variants[0]?.compareAtPrice || 0,
      imageUrl: prod.images[0] || "/hero-oliv-c.png",
      inStock: prod.variants[0]?.inStock !== false,
      featured: prod.featured || false,
      ingredients: prod.ingredients.join(", "),
      benefits: prod.benefits.join("\n"),
      howToUse: prod.howToUse.join("\n")
    });
    setIsProductModalOpen(true);
  };
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm)
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(editingProduct ? "Product updated in Sanity!" : "New product published to Sanity!");
        setIsProductModalOpen(false);
        fetchData();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to save product: " + err.message);
    }
  };
  const promptDeleteProduct = (id, title) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Product",
      description: `Are you sure you want to permanently delete "${title}" from Sanity CMS and the store catalog? This action cannot be reversed.`,
      confirmText: "Delete Product",
      onConfirm: async () => {
        try {
          setProducts((prev) => prev.filter((p) => p._id !== id));
          const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (data.success) {
            setToastMsg("Product deleted from Sanity CMS");
          }
          fetchData();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(`Order ${orderId} updated to ${newStatus}`);
        setOrders(orders.map((o) => o.orderId === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerForm)
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg("Hero banner updated in Sanity CMS");
        setIsBannerModalOpen(false);
        fetchData();
      } else {
        alert("Error saving banner: " + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const promptDeleteBanner = (id, title) => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Hero Banner",
      description: `Are you sure you want to remove ${title ? `"${title}"` : "this banner"} from the homepage slider?`,
      confirmText: "Remove Banner",
      onConfirm: async () => {
        try {
          setBanners((prev) => prev.filter((b) => b._id !== id));
          const res = await fetch(`/api/banners?id=${encodeURIComponent(id)}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (data.success) {
            setToastMsg("Banner removed from homepage");
          }
          fetchData();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };
  const openEditBannerModal = (b) => {
    setBannerForm({
      _id: b._id,
      title: b.title,
      imageUrl: b.imageUrl,
      link: b.link || "/shop",
      order: b.order || 1
    });
    setIsBannerModalOpen(true);
  };
  const restoreDefaultBanners = async () => {
    try {
      const defaultBanners = [
        {
          _id: "banner-dr-ar-oliv-e-c",
          title: "Dr. AR OLIV-E-C Whitening Active Concentrate",
          imageUrl: "/banners/banner-oliv-e-c.jpg",
          link: "/product/dr-ar-oliv-e-c-whitening-serum",
          order: 1
        },
        {
          _id: "banner-dr-ar-mak",
          title: "Dr. AR Mak Mandelic Acid Serum",
          imageUrl: "/banners/banner-mak.jpg",
          link: "/product/dr-ar-mak-mandelic-acid-serum",
          order: 2
        },
        {
          _id: "banner-dr-ar-eye-s",
          title: "Dr. AR EYE-S Eye Protect Shampoo",
          imageUrl: "/banners/banner-eye-s.jpg",
          link: "/product/dr-ar-eye-s-eye-protect-shampoo",
          order: 3
        }
      ];
      for (const b of defaultBanners) {
        await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(b)
        });
      }
      setToastMsg("Official 3 hero banners restored");
      fetchData();
    } catch (e) {
      alert("Error restoring banners: " + e.message);
    }
  };
  const promptDeleteOrder = (orderId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Order Record",
      description: `Are you sure you want to permanently remove order "${orderId}"? This cannot be undone.`,
      confirmText: "Delete Order",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (data.success) {
            setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
            if (selectedOrderDetails?.orderId === orderId) {
              setSelectedOrderDetails(null);
            }
            setToastMsg(`Order ${orderId} removed`);
          } else {
            alert("Failed to delete order: " + data.error);
          }
        } catch (err) {
          alert("Error deleting order: " + err.message);
        }
      }
    });
  };
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totals?.total || 0), 0);
  const totalItemsSold = orders.reduce((sum, ord) => sum + (ord.items?.length || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  const filteredProducts = products.filter(
    (p) => p.title.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase())
  );
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === "All") return true;
    return o.status === orderStatusFilter;
  });
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6 text-center border border-stone-200">
          <div className="flex justify-center">
            <img src="/logo.jpg" alt="DreamyGlows Logo" className="h-16 w-auto object-contain rounded-2xl shadow-sm" />
          </div>
          <div>
            <span className="font-cursive text-brand-green text-3xl block leading-none">Management Portal</span>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-1">DreamyGlows Admin</h1>
            <p className="text-xs text-gray-500 mt-1">Enter your master passcode to access the store admin panel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Passcode</label>
              <input
      type="password"
      required
      placeholder="Enter passcode (e.g. admin123)"
      value={passcode}
      onChange={(e) => setPasscode(e.target.value)}
      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-brand-green font-bold text-gray-900"
      autoFocus
    />
            </div>

            {authError && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>}

            <button
      type="submit"
      className="w-full py-3.5 bg-brand-green hover:bg-dark-green text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
    >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="text-[11px] text-stone-400 border-t border-stone-100 pt-4 font-medium flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
            <span>DreamyGlows Authorized Administrator Access Only</span>
          </div>
        </div>
      </div>;
  }
  const navTabs = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: `Products (${products.length})`, icon: Package },
    { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
    { id: "banners", label: `Hero Banners (${banners.length})`, icon: ImageIcon },
    { id: "subscribers", label: `Subscribers (${subscribers.length})`, icon: Mail },
    { id: "inquiries", label: `Inquiries (${inquiries.filter((i) => i.status === "Unread").length ? `${inquiries.filter((i) => i.status === "Unread").length} new` : inquiries.length})`, icon: MessageSquare },
    { id: "settings", label: "Store Settings", icon: Settings }
  ];
  return <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {
    /* 1. Mobile Top Navigation Header (Screens < md) */
  }
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="DreamyGlows" className="h-7 w-auto object-contain max-w-[130px]" />
          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-brand-green/10 text-brand-green rounded border border-brand-green/20">
            Admin
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
    onClick={fetchData}
    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs transition-colors cursor-pointer"
    title="Refresh"
  >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
    className="p-2 bg-brand-green text-white rounded-xl cursor-pointer hover:bg-dark-green transition-colors"
    aria-label="Toggle Navigation"
  >
            {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {
    /* Mobile Drawer (Collapsible on Mobile) */
  }
      {isMobileNavOpen && <div className="md:hidden sticky top-[53px] z-30 bg-white border-b border-stone-200 p-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
            {navTabs.map((tab) => {
    const Icon = tab.icon;
    return <button
      key={tab.id}
      onClick={() => {
        setActiveTab(tab.id);
        setIsMobileNavOpen(false);
      }}
      className={`flex items-center gap-2 p-2.5 rounded-xl transition-all text-left ${activeTab === tab.id ? "bg-brand-green text-white shadow-sm font-extrabold" : "bg-stone-50 text-stone-700 hover:bg-stone-100 font-semibold"}`}
    >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-[11px]">{tab.label}</span>
                </button>;
  })}
          </div>
          <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
            <Link href="/" target="_blank" className="text-stone-600 hover:text-brand-green flex items-center gap-1.5">
              <span>Visit Storefront</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
    onClick={handleLogout}
    className="text-red-600 hover:text-red-700 flex items-center gap-1.5"
  >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>}

      {
    /* 2. White Modern Desktop Sidebar (Screens >= md) */
  }
      <aside className="hidden md:flex flex-col justify-between w-64 min-h-screen bg-white border-r border-stone-200 text-stone-900 p-5 sticky top-0 h-screen overflow-y-auto flex-shrink-0 shadow-xs">
        <div className="space-y-6">
          {
    /* Brand Logo - Fixed No-Overlap Header */
  }
          <div className="border-b border-stone-100 pb-4">
            <Link href="/" className="flex flex-col gap-1.5 group">
              <div className="flex items-center justify-between">
                <img src="/logo.png" alt="DreamyGlows" className="h-9 w-auto object-contain max-w-[145px]" />
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-brand-green/10 text-brand-green rounded-md border border-brand-green/20">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest pl-0.5">
                Control Panel
              </span>
            </Link>
          </div>

          {
    /* Nav Links */
  }
          <nav className="space-y-1.5 text-xs font-bold uppercase tracking-wider">
            {navTabs.map((tab) => {
    const Icon = tab.icon;
    return <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${activeTab === tab.id ? "bg-brand-green text-white shadow-md font-extrabold" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-semibold"}`}
    >
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>;
  })}
          </nav>
        </div>

        {
    /* Sidebar Footer */
  }
        <div className="border-t border-stone-100 pt-4 space-y-2">
          <Link
    href="/"
    target="_blank"
    className="flex items-center justify-between text-stone-600 hover:text-brand-green text-xs font-bold px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors"
  >
            <span>View Live Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
    onClick={handleLogout}
    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
  >
            <LogOut className="h-4 w-4" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {
    /* Main Content Area */
  }
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {
    /* Top bar header */
  }
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
              {activeTab === "overview" && "Store Performance Overview"}
              {activeTab === "products" && "Sanity CMS Products Manager"}
              {activeTab === "orders" && "Customer COD Orders Manager"}
              {activeTab === "banners" && "Hero Slider Banners"}
              {activeTab === "subscribers" && "Newsletter Subscribers List"}
              {activeTab === "inquiries" && "Customer Inquiries & Messages"}
              {activeTab === "settings" && "Store Configuration"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Connected to Sanity CMS dataset: <span className="font-bold text-brand-green">production</span></p>
          </div>

          <div className="flex items-center gap-3">
            <button
    onClick={fetchData}
    className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
    title="Refresh Data"
  >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {activeTab === "subscribers" && <button
    onClick={exportSubscribersCSV}
    className="px-4 py-2.5 bg-brand-green hover:bg-dark-green text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
  >
                <Download className="h-4 w-4" /> Export CSV
              </button>}

            {activeTab === "products" && <button
    onClick={openNewProductModal}
    className="px-4 py-2.5 bg-brand-green hover:bg-dark-green text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
  >
                <Plus className="h-4 w-4" /> Add New Product
              </button>}

            {activeTab === "banners" && <button
    onClick={() => {
      setBannerForm({ _id: "", title: "", imageUrl: "", link: "/shop", order: banners.length + 1 });
      setIsBannerModalOpen(true);
    }}
    className="px-4 py-2.5 bg-brand-green hover:bg-dark-green text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
  >
                <Plus className="h-4 w-4" /> Add Hero Banner
              </button>}
          </div>
        </div>

        {
    /* TAB 1: OVERVIEW */
  }
        {activeTab === "overview" && <div className="space-y-8">
            {
    /* KPI Cards */
  }
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <span>Total Gross Sales</span>
                  <DollarSign className="h-5 w-5 text-brand-green" />
                </div>
                <div className="text-2xl font-black text-gray-900">PKR {totalRevenue.toLocaleString()}</div>
                <div className="text-[10px] text-brand-green font-bold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Live COD Orders Total
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <span>Total Orders</span>
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">{orders.length}</div>
                <div className="text-[10px] text-amber-600 font-bold">
                  {pendingOrdersCount} pending • {totalItemsSold} units ordered
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <span>Sanity Products</span>
                  <Package className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">{products.length}</div>
                <div className="text-[10px] text-gray-400 font-semibold">Active in Storefront</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <span>Hero Banners</span>
                  <ImageIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-gray-900">{banners.length}</div>
                <div className="text-[10px] text-brand-green font-bold">Auto-rotating slider</div>
              </div>
            </div>

            {
    /* Recent Orders Preview */
  }
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Recent Orders</h3>
                <button
    onClick={() => setActiveTab("orders")}
    className="text-xs font-bold text-brand-green hover:underline cursor-pointer"
  >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {orders.slice(0, 5).map((ord) => <div key={ord.orderId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">{ord.orderId}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${ord.status === "Delivered" ? "bg-emerald-100 text-emerald-800" : ord.status === "Shipped" ? "bg-blue-100 text-blue-800" : ord.status === "Confirmed" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800"}`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{ord.customer?.fullName} • {ord.customer?.city}, {ord.customer?.province}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-900">PKR {ord.totals?.total?.toLocaleString()}</span>
                      <button
    onClick={() => setSelectedOrderDetails(ord)}
    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
  >
                        Inspect
                      </button>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>}

        {
    /* TAB 2: PRODUCTS (SANITY CMS) */
  }
        {activeTab === "products" && <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-stone-100 pb-4">
              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
    type="text"
    placeholder="Search products..."
    value={productSearch}
    onChange={(e) => setProductSearch(e.target.value)}
    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-brand-green"
  />
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> live Sanity products
              </div>
            </div>

            {
    /* Products Table */
  }
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price (PKR)</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-gray-700">
                  {filteredProducts.map((p) => <tr key={p._id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <img src={p.images[0] || "/hero-oliv-c.png"} alt="" className="h-10 w-10 object-cover rounded-lg bg-stone-100 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-900">{p.title}</p>
                          <p className="text-[10px] text-gray-400">{p.slug}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green font-bold rounded text-[10px] uppercase">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-gray-900">
                        PKR {p.variants[0]?.price?.toLocaleString()}
                        {p.variants[0]?.compareAtPrice && <span className="line-through text-gray-400 text-[10px] ml-1.5">
                            PKR {p.variants[0].compareAtPrice.toLocaleString()}
                          </span>}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.variants[0]?.inStock !== false ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                          {p.variants[0]?.inStock !== false ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
    onClick={() => openEditProductModal(p)}
    className="p-1.5 bg-stone-100 hover:bg-stone-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
    title="Edit Product"
  >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
    onClick={() => promptDeleteProduct(p._id, p.title)}
    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
    title="Delete Product"
  >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>}

        {
    /* TAB 3: ORDERS */
  }
        {activeTab === "orders" && <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
            {
    /* Filter Bar */
  }
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="flex gap-2">
                {["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => <button
    key={st}
    onClick={() => setOrderStatusFilter(st)}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${orderStatusFilter === st ? "bg-brand-green text-white" : "bg-stone-100 text-gray-600 hover:bg-stone-200"}`}
  >
                    {st}
                  </button>)}
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                Total Orders: <span className="font-bold text-gray-900">{filteredOrders.length}</span>
              </div>
            </div>

            {
    /* Orders Table or Empty State */
  }
            {filteredOrders.length === 0 ? <div className="text-center py-16 space-y-3 bg-stone-50/50 rounded-2xl border border-stone-100 p-6">
                <ShoppingBag className="h-10 w-10 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">No Orders in Database</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Database is clean with 0 demo orders. As soon as customers checkout with Cash on Delivery on the storefront, their orders will appear here automatically.
                </p>
              </div> : <div className="overflow-x-auto border border-stone-100 rounded-2xl">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead>
                    <tr className="border-b border-stone-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider bg-stone-50/50">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">City / Province</th>
                      <th className="p-3">Total (COD)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-gray-700">
                    {filteredOrders.map((ord) => <tr key={ord.orderId} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-3 font-bold text-gray-900">{ord.orderId}</td>
                        <td className="p-3">
                          <p className="font-bold text-gray-900">{ord.customer?.fullName}</p>
                          <p className="text-[10px] text-gray-400">{ord.customer?.phone}</p>
                        </td>
                        <td className="p-3">{ord.customer?.city}, {ord.customer?.province}</td>
                        <td className="p-3 font-bold text-brand-green">PKR {ord.totals?.total?.toLocaleString()}</td>
                        <td className="p-3">
                          <select
    value={ord.status || "Pending"}
    onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value)}
    className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold outline-none cursor-pointer"
  >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
    type="button"
    onClick={() => setSelectedOrderDetails(ord)}
    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
  >
                              Details
                            </button>
                            <button
    type="button"
    onClick={() => promptDeleteOrder(ord.orderId)}
    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
    title="Delete Order"
  >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>}
          </div>}

        {
    /* TAB 4: BANNERS */
  }
        {activeTab === "banners" && <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 uppercase tracking-wider">Homepage Slider Banners</h3>
                <p className="text-xs text-gray-500 mt-0.5">High-resolution banner graphics displayed in the main hero slider. Recommended: 1920x710 px (21:9 Ultra-wide).</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button
    type="button"
    onClick={restoreDefaultBanners}
    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
  >
                  Reset Defaults
                </button>
                <button
    type="button"
    onClick={() => {
      setBannerForm({ _id: "", title: "", imageUrl: "/banners/banner-oliv-e-c.jpg", link: "/shop", order: banners.length + 1 });
      setIsBannerModalOpen(true);
    }}
    className="px-4 py-2 bg-brand-green hover:bg-dark-green text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
  >
                  <Plus className="h-4 w-4" /> Add Banner
                </button>
              </div>
            </div>

            {banners.length === 0 ? <div className="text-center py-16 space-y-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300 p-6">
                <ImageIcon className="h-10 w-10 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">No Banners Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Hero slider currently has no banners configured. You can load the official Dr. AR clinic banners below.
                </p>
                <button
    onClick={restoreDefaultBanners}
    className="px-4 py-2 bg-brand-green text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-sm hover:bg-dark-green transition-colors cursor-pointer"
  >
                  Load 3 Official Banners
                </button>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {banners.map((b) => <div key={b._id} className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs bg-stone-50 hover:shadow-md transition-all space-y-3 p-3 sm:p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-stone-900 border border-stone-200 group">
                        <img
    src={b.imageUrl || "/banners/banner-oliv-e-c.jpg"}
    alt={b.title}
    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    onError={(e) => {
      e.currentTarget.src = "/banners/banner-oliv-e-c.jpg";
    }}
  />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white text-[10px] font-extrabold tracking-wider">
                          Slide #{b.order || 1}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{b.title}</h4>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">Target: <span className="text-brand-green font-semibold">{b.link}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-stone-200">
                      <button
    type="button"
    onClick={() => openEditBannerModal(b)}
    className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
  >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
    type="button"
    onClick={() => promptDeleteBanner(b._id, b.title)}
    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
    title="Delete Banner"
  >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>)}
              </div>}
          </div>}

        {
    /* TAB 5: SUBSCRIBERS */
  }
        {activeTab === "subscribers" && <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
    type="text"
    placeholder="Search subscriber email..."
    value={subscriberSearch}
    onChange={(e) => setSubscriberSearch(e.target.value)}
    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-brand-green focus:bg-white text-gray-900"
  />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs text-gray-500 font-semibold">
                  Total Active: <strong className="text-gray-900">{subscribers.length}</strong>
                </span>
                <button
    onClick={exportSubscribersCSV}
    className="px-4 py-2 bg-brand-green hover:bg-dark-green text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
  >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {subscribers.length === 0 ? <div className="text-center py-16 space-y-3 bg-stone-50/50 rounded-2xl border border-stone-100">
                <Mail className="h-10 w-10 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">No Subscribers Yet</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  When visitors subscribe via the homepage or footer newsletter club form, their emails will appear here automatically.
                </p>
              </div> : <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50/90 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Subscribed At</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-gray-700">
                      {subscribers.filter((s) => s.email.toLowerCase().includes(subscriberSearch.toLowerCase())).map((s, idx) => <tr key={s.id || idx} className="hover:bg-stone-50/70 transition-colors">
                            <td className="p-4 font-bold text-gray-900">
                              {s.email}
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                                {s.source || "homepage_newsletter"}
                              </span>
                            </td>
                            <td className="p-4 text-stone-500">
                              {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString("en-GB") : "Recent"}
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {s.status || "Active"}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <a
    href={`mailto:${s.email}?subject=DreamyGlows VIP Offer`}
    className="text-xs font-bold text-brand-green hover:underline"
  >
                                Send Email &rarr;
                              </a>
                            </td>
                          </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>}
          </div>}

        {
    /* TAB 6: INQUIRIES */
  }
        {activeTab === "inquiries" && <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
    type="text"
    placeholder="Search inquiries or sender..."
    value={inquirySearch}
    onChange={(e) => setInquirySearch(e.target.value)}
    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-brand-green focus:bg-white text-gray-900"
  />
              </div>

              <div className="text-xs text-gray-500 font-semibold">
                Total Messages: <strong className="text-gray-900">{inquiries.length}</strong>
              </div>
            </div>

            {inquiries.length === 0 ? <div className="text-center py-16 space-y-3 bg-stone-50/50 rounded-2xl border border-stone-100">
                <MessageSquare className="h-10 w-10 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">No Inquiries Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Messages submitted by customers on the Contact page will appear here for review and follow-up.
                </p>
              </div> : <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                {inquiries.filter(
    (inq) => inq.name?.toLowerCase().includes(inquirySearch.toLowerCase()) || inq.email?.toLowerCase().includes(inquirySearch.toLowerCase()) || inq.message?.toLowerCase().includes(inquirySearch.toLowerCase()) || inq.subject?.toLowerCase().includes(inquirySearch.toLowerCase())
  ).map((inq) => <div key={inq.id} className="p-5 hover:bg-stone-50/60 transition-colors space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-sm text-gray-900">{inq.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inq.status === "Responded" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
                              {inq.status || "Unread"}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">
                            {inq.email} • {inq.createdAt ? new Date(inq.createdAt).toLocaleString("en-GB") : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
    onClick={() => handleUpdateInquiryStatus(inq.id, inq.status === "Responded" ? "Unread" : "Responded")}
    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
  >
                            {inq.status === "Responded" ? "Mark as Unread" : "Mark as Responded"}
                          </button>
                          <a
    href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || "DreamyGlows Inquiry")}`}
    className="px-3 py-1.5 bg-brand-green hover:bg-dark-green text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
  >
                            Reply via Email
                          </a>
                        </div>
                      </div>

                      <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 text-xs space-y-1">
                        <strong className="text-stone-800 block">{inq.subject || "General Inquiry"}</strong>
                        <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{inq.message}</p>
                      </div>
                    </div>)}
              </div>}
          </div>}

        {
    /* TAB 7: SETTINGS */
  }
        {activeTab === "settings" && <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6 max-w-2xl">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-stone-100 pb-3">
              Store Logistics & Contact Settings
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-700 uppercase">Brand Name</label>
                <input type="text" readOnly value="DreamyGlows" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-gray-800" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-700 uppercase">Sanity Project ID</label>
                <input type="text" readOnly value="o9db6b0a (production)" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-gray-800" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-700 uppercase">WhatsApp Customer Care Phone</label>
                <input type="text" defaultValue="03161941733" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-gray-800" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase">Free Shipping Threshold</label>
                  <input type="number" defaultValue={3e3} className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-gray-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase">Default COD Shipping Rate</label>
                  <input type="number" defaultValue={250} className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-gray-800" />
                </div>
              </div>

              <button
    type="button"
    onClick={() => setToastMsg("Settings saved!")}
    className="px-6 py-3 bg-brand-green hover:bg-dark-green text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md transition-colors"
  >
                Save Store Configuration
              </button>
            </div>
          </div>}
      </main>

      {
    /* 1. PROFESSIONAL PRODUCT MODAL (Add / Edit) */
  }
      {isProductModalOpen && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {
    /* Modal Header */
  }
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50/70 flex-shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                    {editingProduct ? "Edit Product in Sanity" : "Add New Product to Sanity"}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-brand-green/10 text-brand-green font-bold rounded-full text-[10px] uppercase tracking-wider">
                    {editingProduct ? "Live CMS" : "New Listing"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Provide product formulations, pricing, and ingredients for the storefront.</p>
              </div>
              <button
    onClick={() => setIsProductModalOpen(false)}
    className="p-2 hover:bg-stone-200 text-gray-500 rounded-full transition-colors cursor-pointer"
    aria-label="Close"
  >
                <X className="h-5 w-5" />
              </button>
            </div>

            {
    /* Modal Form Scrollable Area */
  }
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {
    /* Section 1: General Info */
  }
              <div className="space-y-4">
                <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider pb-1 border-b border-stone-100">
                  1. General Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8 space-y-1.5">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Product Title</label>
                    <input
    type="text"
    required
    placeholder="e.g. Dr. AR Niacinamide Clarifying Serum"
    value={productForm.title}
    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white transition-all font-medium text-gray-900"
  />
                  </div>

                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Category</label>
                    <select
    value={productForm.category}
    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white transition-all font-bold text-gray-900 cursor-pointer"
  >
                      <option value="Skin Care">Skin Care</option>
                      <option value="Hair Care">Hair Care</option>
                      <option value="Medicated">Medicated</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Gender Target</label>
                    <select
    value={productForm.gender}
    onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white font-bold text-gray-900 cursor-pointer"
  >
                      <option value="Unisex">Unisex</option>
                      <option value="Women">Women</option>
                      <option value="Men">Men</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Primary Skin Concern</label>
                    <input
    type="text"
    placeholder="e.g. Pigmentation, Acne, Hair Fall"
    value={productForm.concern}
    onChange={(e) => setProductForm({ ...productForm, concern: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white font-medium text-gray-900"
  />
                  </div>
                </div>
              </div>

              {
    /* Section 2: Pricing & Inventory */
  }
              <div className="space-y-4">
                <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider pb-1 border-b border-stone-100">
                  2. Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Selling Price (PKR)</label>
                    <input
    type="number"
    required
    value={productForm.price}
    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white font-bold text-brand-green"
  />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Original Price (PKR)</label>
                    <input
    type="number"
    placeholder="Optional crossed price"
    value={productForm.compareAtPrice || ""}
    onChange={(e) => setProductForm({ ...productForm, compareAtPrice: Number(e.target.value) })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white font-medium text-gray-900"
  />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Inventory Status</label>
                    <select
    value={productForm.inStock ? "true" : "false"}
    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value === "true" })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white font-bold text-gray-900 cursor-pointer"
  >
                      <option value="true">In Stock (Available)</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>

              {
    /* Section 3: Media & Upload */
  }
              <div className="space-y-4">
                <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider pb-1 border-b border-stone-100">
                  3. Product Image
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">
                      Upload Product Photo
                    </label>
                    {productForm.imageUrl && <span className="text-[10px] text-brand-green font-bold flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Image Uploaded & Ready
                      </span>}
                  </div>

                  {productForm.imageUrl ? <div className="flex items-center gap-4 p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                      <div className="h-20 w-20 rounded-xl overflow-hidden bg-white border border-stone-200 flex-shrink-0 shadow-xs">
                        <img src={productForm.imageUrl} alt="Uploaded" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{productForm.imageUrl}</p>
                        <p className="text-[10px] text-gray-400">Hosted on Sanity Global CDN</p>
                        <div className="flex gap-2 pt-1.5">
                          <label className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-bold text-gray-700 cursor-pointer transition-colors shadow-xs">
                            Upload New Image
                            <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "product");
    }}
  />
                          </label>
                          <button
    type="button"
    onClick={() => setProductForm((prev) => ({ ...prev, imageUrl: "" }))}
    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
  >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div> : <label className={`border-2 border-dashed border-stone-300 hover:border-brand-green rounded-2xl p-7 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition-all bg-stone-50/50 hover:bg-white group ${isUploadingImage ? "opacity-50 pointer-events-none" : ""}`}>
                      <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "product");
    }}
  />
                      {isUploadingImage ? <div className="py-4 flex flex-col items-center gap-2">
                          <RefreshCw className="h-7 w-7 text-brand-green animate-spin" />
                          <span className="text-xs font-bold text-gray-700">Uploading to Sanity CDN...</span>
                        </div> : <>
                          <div className="p-3 bg-brand-green/10 text-brand-green rounded-2xl group-hover:scale-110 transition-transform shadow-xs">
                            <UploadCloud className="h-6 w-6" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-gray-800">
                              <span className="text-brand-green hover:underline">Click to browse file</span> or drag and drop image
                            </p>
                            <p className="text-[10px] text-gray-400">Supports PNG, JPG, JPEG, WEBP (Max 10MB)</p>
                          </div>
                        </>}
                    </label>}
                </div>
              </div>

              {
    /* Section 4: Clinical Formula Details */
  }
              <div className="space-y-4">
                <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider pb-1 border-b border-stone-100">
                  4. Clinical Details & Benefits
                </h3>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Product Description</label>
                  <textarea
    rows={3}
    required
    placeholder="Short medical-grade description of this formulation..."
    value={productForm.description}
    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white font-medium text-gray-900 leading-relaxed"
  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Key Benefits (One per line)</label>
                    <textarea
    rows={3}
    placeholder="Visibly brightens skin&#10;Fades hyperpigmentation&#10;Fast absorbing"
    value={productForm.benefits}
    onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white font-medium text-gray-900"
  />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Active Ingredients (Comma separated)</label>
                    <textarea
    rows={3}
    placeholder="Vitamin C, Vitamin E, Hyaluronic Acid, Glycerin"
    value={productForm.ingredients}
    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white font-medium text-gray-900"
  />
                  </div>
                </div>
              </div>

              {
    /* Modal Sticky Footer */
  }
              <div className="flex justify-end gap-3 pt-5 border-t border-stone-100 flex-shrink-0">
                <button
    type="button"
    onClick={() => setIsProductModalOpen(false)}
    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors cursor-pointer uppercase tracking-wider text-xs"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="px-6 py-2.5 bg-brand-green hover:bg-dark-green text-white font-bold rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider text-xs"
  >
                  {editingProduct ? "Save Changes to Sanity" : "Publish Product to Sanity"}
                </button>
              </div>

            </form>
          </div>
        </div>}

      {
    /* 2. PROFESSIONAL BANNER MODAL (Add / Edit) */
  }
      {isBannerModalOpen && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            
            {
    /* Header */
  }
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Add Hero Slider Banner</h2>
                <p className="text-xs text-gray-500">Add a high-resolution promotional graphic to the homepage carousel.</p>
              </div>
              <button onClick={() => setIsBannerModalOpen(false)} className="p-1.5 hover:bg-stone-100 rounded-full text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs font-semibold">
              {
    /* Banner Graphic Upload Area */
  }
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">
                    Upload Banner Graphic
                  </label>
                  {bannerForm.imageUrl && <span className="text-[10px] text-brand-green font-bold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Ready on CDN
                    </span>}
                </div>

                {bannerForm.imageUrl ? <div className="space-y-3 p-3 bg-stone-50 border border-stone-200 rounded-2xl">
                    <div className="w-full aspect-[21/9] rounded-xl overflow-hidden bg-stone-900 shadow-xs border border-stone-200">
                      <img src={bannerForm.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <span className="text-[10px] text-gray-400 truncate max-w-[200px]">{bannerForm.imageUrl}</span>
                      <div className="flex gap-2">
                        <label className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-bold text-gray-700 cursor-pointer transition-colors shadow-xs">
                          Change Graphic
                          <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "banner");
    }}
  />
                        </label>
                        <button
    type="button"
    onClick={() => setBannerForm((prev) => ({ ...prev, imageUrl: "" }))}
    className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
  >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div> : <label className={`border-2 border-dashed border-stone-300 hover:border-brand-green rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all bg-stone-50/50 hover:bg-white group ${isUploadingImage ? "opacity-50 pointer-events-none" : ""}`}>
                    <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "banner");
    }}
  />
                    {isUploadingImage ? <div className="py-3 flex flex-col items-center gap-2">
                        <RefreshCw className="h-6 w-6 text-brand-green animate-spin" />
                        <span className="text-xs font-bold text-gray-700">Uploading to Sanity CDN...</span>
                      </div> : <>
                        <div className="p-3 bg-brand-green/10 text-brand-green rounded-2xl group-hover:scale-110 transition-transform shadow-xs">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-gray-800">
                            <span className="text-brand-green hover:underline">Click to upload banner</span> or drag and drop
                          </p>
                          <p className="text-[10px] text-gray-400">High-res 1920x710 px or 1024x465 px (21:9 Ultra-wide) banner graphic (Max 10MB)</p>
                        </div>
                      </>}
                  </label>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Target Page Link</label>
                  <input
    type="text"
    placeholder="/shop or /shop?category=Medicated"
    value={bannerForm.link}
    onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white text-gray-900"
  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Slider Display Priority</label>
                  <input
    type="number"
    min={1}
    value={bannerForm.order}
    onChange={(e) => setBannerForm({ ...bannerForm, order: Number(e.target.value) })}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-brand-green focus:bg-white text-gray-900"
  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
    type="button"
    onClick={() => setIsBannerModalOpen(false)}
    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold uppercase tracking-wider text-xs"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="px-6 py-2.5 bg-brand-green hover:bg-dark-green text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-md transition-all"
  >
                  Save Banner
                </button>
              </div>
            </form>

          </div>
        </div>}

      {
    /* 3. PROFESSIONAL ORDER INSPECT & PACKING SLIP MODAL */
  }
      {selectedOrderDetails && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            
            {
    /* Modal Header */
  }
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">{selectedOrderDetails.orderId}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${selectedOrderDetails.status === "Delivered" ? "bg-emerald-100 text-emerald-800" : selectedOrderDetails.status === "Shipped" ? "bg-blue-100 text-blue-800" : selectedOrderDetails.status === "Confirmed" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800"}`}>
                    {selectedOrderDetails.status || "Pending"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Order Placed: <span className="font-semibold text-gray-700">{selectedOrderDetails.createdAt}</span></p>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="p-1.5 hover:bg-stone-100 rounded-full text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            {
    /* Customer & Shipping Card */
  }
            <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/80 space-y-3 text-xs">
              <span className="font-extrabold text-gray-400 uppercase text-[10px] tracking-wider block">Customer & Delivery Information</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Customer Name</span>
                  <span className="font-bold text-gray-900">{selectedOrderDetails.customer?.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Phone (WhatsApp)</span>
                  <a href={`tel:${selectedOrderDetails.customer?.phone}`} className="font-bold text-brand-green hover:underline">
                    {selectedOrderDetails.customer?.phone}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Delivery Address</span>
                <span className="font-medium text-gray-900 leading-relaxed block">
                  {selectedOrderDetails.customer?.address}, {selectedOrderDetails.customer?.city}, {selectedOrderDetails.customer?.province}
                </span>
              </div>

              {selectedOrderDetails.customer?.notes && <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-800 text-xs">
                  <span className="font-bold block text-[10px] uppercase">Special Delivery Notes:</span>
                  <span>{selectedOrderDetails.customer.notes}</span>
                </div>}
            </div>

            {
    /* Itemized Order Table */
  }
            <div className="space-y-2 text-xs">
              <span className="font-extrabold text-gray-400 uppercase text-[10px] tracking-wider block">Ordered Products</span>
              <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl overflow-hidden bg-stone-50/40">
                {selectedOrderDetails.items?.map((it, i) => <div key={i} className="p-3.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900">{it.title}</p>
                      <p className="text-[11px] text-gray-400">{it.variant} • Quantity: <span className="font-bold text-gray-800">{it.quantity}</span></p>
                    </div>
                    <span className="font-extrabold text-gray-900">PKR {(it.price * it.quantity).toLocaleString()}</span>
                  </div>)}
              </div>
            </div>

            {
    /* Financial Summary */
  }
            <div className="p-4 bg-stone-50 rounded-2xl space-y-2 text-xs border border-stone-200/60">
              <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>PKR {selectedOrderDetails.totals?.subtotal?.toLocaleString()}</span></div>
              {selectedOrderDetails.totals?.discount > 0 && <div className="flex justify-between text-brand-green font-bold">
                  <span>Coupon Discount:</span>
                  <span>- PKR {selectedOrderDetails.totals.discount.toLocaleString()}</span>
                </div>}
              <div className="flex justify-between text-gray-600"><span>Shipping (COD):</span><span>PKR {selectedOrderDetails.totals?.shipping?.toLocaleString()}</span></div>
              <div className="flex justify-between font-black text-sm text-brand-green border-t border-stone-200/80 pt-2">
                <span>Grand Total (Pay on Delivery):</span>
                <span>PKR {selectedOrderDetails.totals?.total?.toLocaleString()}</span>
              </div>
            </div>

            {
    /* Modal Actions */
  }
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Change Status:</span>
                <select
    value={selectedOrderDetails.status || "Pending"}
    onChange={(e) => {
      handleUpdateOrderStatus(selectedOrderDetails.orderId, e.target.value);
      setSelectedOrderDetails({ ...selectedOrderDetails, status: e.target.value });
    }}
    className="px-2.5 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
  >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
    onClick={() => window.print()}
    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
  >
                  <Printer className="h-4 w-4" /> Print Slip
                </button>
                <button
    onClick={() => setSelectedOrderDetails(null)}
    className="px-5 py-2.5 bg-brand-green hover:bg-dark-green text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
  >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>}

      {
    /* PROFESSIONAL CONFIRMATION MODAL (CLEAN LUXURY DESIGN, NO EMOJIS) */
  }
      {confirmModal.isOpen && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-snug">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {confirmModal.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
    type="button"
    onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
  >
                Cancel
              </button>
              <button
    type="button"
    onClick={() => {
      confirmModal.onConfirm();
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }}
    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
  >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>;
}
