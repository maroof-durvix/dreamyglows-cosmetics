"use client";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, X, Plus, Minus, Trash2, ShieldCheck, Gift } from "lucide-react";
import Link from "next/link";
export default function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    freeShippingThreshold,
    isEligibleForFreeShipping,
    freeGiftThreshold,
    isEligibleForFreeGift,
    appliedCoupon,
    removeCoupon
  } = useCart();
  if (!isOpen) return null;
  const shippingCost = isEligibleForFreeShipping ? 0 : 250;
  const discountAmount = appliedCoupon ? appliedCoupon.discountPercent > 0 ? cartSubtotal * appliedCoupon.discountPercent / 100 : appliedCoupon.discountFixed : 0;
  const grandTotal = cartSubtotal - discountAmount + shippingCost;
  const shippingProgress = Math.min(cartSubtotal / freeShippingThreshold * 100, 100);
  const giftProgress = Math.min(cartSubtotal / freeGiftThreshold * 100, 100);
  return <div className="fixed inset-0 z-50 overflow-hidden">
      {
    /* Backdrop */
  }
      <div
    className="absolute inset-0 bg-black/55 transition-opacity"
    onClick={onClose}
  />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {
    /* Header */
  }
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="h-5 w-5 text-[#76a713]" />
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Shopping Cart ({cart.length})</h2>
            </div>
            <button
    onClick={onClose}
    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
  >
              <X className="h-6 w-6" />
            </button>
          </div>

          {
    /* Content */
  }
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="p-4 bg-stone-50 rounded-full text-gray-400">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-950">Your cart is empty</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">Add premium serums &amp; scalp treatments to start your organic glow journey.</p>
                </div>
                <button
    onClick={onClose}
    className="px-6 py-2.5 bg-[#76a713] hover:bg-[#1b3c35] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer uppercase tracking-wider"
  >
                  Shop Best Sellers
                </button>
              </div> : <>
                {
    /* Progress alerts */
  }
                <div className="bg-[#f7f6f2] border border-stone-200/80 rounded-2xl p-4 space-y-3">
                  {
    /* Shipping */
  }
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-800 mb-1">
                      <span>Free Shipping Progress</span>
                      <span className="text-[#76a713] font-extrabold">{isEligibleForFreeShipping ? "Unlocked" : `PKR ${(freeShippingThreshold - cartSubtotal).toLocaleString()} away`}</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div
    className="h-full bg-[#76a713] transition-all duration-500"
    style={{ width: `${shippingProgress}%` }}
  />
                    </div>
                  </div>

                  {
    /* Gift */
  }
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-800 mb-1">
                      <span className="flex items-center gap-1">
                        <Gift className="h-3.5 w-3.5 text-[#76a713]" /> Free Serum Gift
                      </span>
                      <span className="text-[#76a713] font-extrabold">{isEligibleForFreeGift ? "Qualified!" : `PKR ${(freeGiftThreshold - cartSubtotal).toLocaleString()} away`}</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div
    className="h-full bg-[#76a713] transition-all duration-500"
    style={{ width: `${giftProgress}%` }}
  />
                    </div>
                  </div>
                </div>

                {
    /* Items */
  }
                <div className="space-y-3">
                  {cart.map((item) => <div key={item.variant.sku} className="flex gap-4 p-3 border border-stone-200/80 rounded-2xl hover:border-[#76a713]/30 transition-all bg-white shadow-xs">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#f7f6f2] border border-stone-100">
                        <img
    src={item.product.images[0]}
    alt=""
    className="h-full w-full object-cover object-center"
  />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between text-sm font-bold text-gray-900">
                            <h4 className="line-clamp-1">{item.product.title}</h4>
                            <span className="ml-2 font-extrabold text-[#76a713]">PKR {(item.variant.price * item.quantity).toLocaleString()}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5">Variant: {item.variant.title}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50/60">
                            <button
    onClick={() => updateQuantity(item.variant.sku, item.quantity - 1)}
    className="p-1.5 hover:bg-stone-100 text-gray-600 rounded-l-xl cursor-pointer"
  >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-gray-800">{item.quantity}</span>
                            <button
    onClick={() => updateQuantity(item.variant.sku, item.quantity + 1)}
    className="p-1.5 hover:bg-stone-100 text-gray-600 rounded-r-xl cursor-pointer"
  >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
    onClick={() => removeFromCart(item.variant.sku)}
    className="text-gray-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
  >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>)}
                </div>
              </>}
          </div>

          {
    /* Checkout calculations and actions */
  }
          {cart.length > 0 && <div className="border-t border-stone-100 bg-[#f7f6f2]/60 px-6 py-5 space-y-4">
              <div className="space-y-2 text-xs sm:text-sm text-gray-650">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">PKR {cartSubtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && <div className="flex justify-between text-[#76a713]">
                    <span className="flex items-center gap-1 font-bold">
                      Discount ({appliedCoupon.code})
                      <button onClick={removeCoupon} className="text-xs underline text-rose-600 hover:text-rose-700 ml-1 cursor-pointer">Remove</button>
                    </span>
                    <span>- PKR {discountAmount.toLocaleString()}</span>
                  </div>}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">
                    {shippingCost === 0 ? <span className="text-[#76a713] font-bold">FREE</span> : `PKR ${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-stone-200 pt-3">
                  <span>Grand Total</span>
                  <span className="text-[#76a713] text-lg font-black">PKR {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
    href="/checkout"
    onClick={onClose}
    className="w-full bg-[#76a713] hover:bg-[#1b3c35] text-white py-3.5 rounded-2xl font-bold text-center block transition-all shadow-md hover:shadow-lg text-xs sm:text-sm uppercase tracking-wider"
  >
                  Proceed to Checkout
                </Link>
                <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#76a713]" />
                  <span>Secure Cash on Delivery verified nationwide</span>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}
