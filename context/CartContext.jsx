"use client";
import { createContext, useContext, useState, useEffect } from "react";
const CartContext = createContext(void 0);
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const freeShippingThreshold = 3e3;
  const freeGiftThreshold = 4e3;
  useEffect(() => {
    const savedCart = localStorage.getItem("dg_cart");
    const savedWishlist = localStorage.getItem("dg_wishlist");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("dg_cart", JSON.stringify(newCart));
  };
  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem("dg_wishlist", JSON.stringify(newWishlist));
  };
  const addToCart = (product, variant, quantity = 1) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex((item) => item.variant.sku === variant.sku);
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, variant, quantity });
    }
    saveCart(newCart);
  };
  const removeFromCart = (sku) => {
    const newCart = cart.filter((item) => item.variant.sku !== sku);
    saveCart(newCart);
  };
  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    const newCart = cart.map(
      (item) => item.variant.sku === sku ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };
  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
  };
  const addToWishlist = (product) => {
    if (wishlist.some((item) => item._id === product._id)) return;
    const newWishlist = [...wishlist, product];
    saveWishlist(newWishlist);
  };
  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter((item) => item._id !== productId);
    saveWishlist(newWishlist);
  };
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };
  const cartSubtotal = cart.reduce((total, item) => total + item.variant.price * item.quantity, 0);
  const isEligibleForFreeShipping = cartSubtotal >= freeShippingThreshold;
  const isEligibleForFreeGift = cartSubtotal >= freeGiftThreshold;
  const applyCoupon = (code) => {
    const uppercaseCode = code.toUpperCase().trim();
    if (uppercaseCode === "SAVE10") {
      setAppliedCoupon({ code: "SAVE10", discountPercent: 10, discountFixed: 0 });
      return true;
    }
    if (uppercaseCode === "GLOW500") {
      setAppliedCoupon({ code: "GLOW500", discountPercent: 0, discountFixed: 500 });
      return true;
    }
    return false;
  };
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };
  return <CartContext.Provider
    value={{
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      cartSubtotal,
      freeShippingThreshold,
      isEligibleForFreeShipping,
      freeGiftThreshold,
      isEligibleForFreeGift,
      appliedCoupon,
      applyCoupon,
      removeCoupon
    }}
  >
      {children}
    </CartContext.Provider>;
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
