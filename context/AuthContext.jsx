"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import BrandLoader from "@/components/ui/BrandLoader";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for an existing session on load
    try {
      const storedUser = localStorage.getItem("dg_user_session");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to read user session:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("dg_user_session", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dg_user_session");
    // We also remove dg_user_profile for full logout
    localStorage.removeItem("dg_user_profile");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Exclude paths that shouldn't be protected by customer auth
      if (pathname !== "/login" && !pathname.startsWith("/api") && !pathname.startsWith("/admin")) {
        router.push("/login");
      }
    }
  }, [user, loading, pathname, router]);

  // Show loading while checking auth
  if (loading) return <BrandLoader />;
  
  // If not authenticated and not on an allowed path, wait for redirect
  if (!user && pathname !== "/login" && !pathname.startsWith("/api") && !pathname.startsWith("/admin")) {
    return <BrandLoader />;
  }

  return children;
}
