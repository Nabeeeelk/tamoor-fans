"use client";

import React from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, Zap, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/store/useCart";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[120] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-brand-primary p-2 rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-brand-secondary">My Cart</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{getTotalItems()} Items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-gray-200" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Your cart is empty</h4>
                    <p className="text-gray-400 max-w-[200px] mx-auto mt-2">Looks like you haven't added anything to your cart yet.</p>
                  </div>
                  <Button onClick={onClose} className="px-8">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.selected_color}-${item.selected_size}`} className="flex gap-4 group">
                    <div className="relative w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image_url || "/placeholder-fan.png"}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-brand-secondary line-clamp-1">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id, item.selected_color, item.selected_size)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 py-1">
                        {item.selected_color && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                            {item.selected_color}
                          </span>
                        )}
                        {item.selected_size && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                            {item.selected_size}
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-black text-brand-secondary pt-1">
                        Rs. {item.price.toLocaleString()}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selected_color, item.selected_size)}
                            className="p-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selected_color, item.selected_size)}
                            className="p-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs font-bold text-gray-400">
                          Total: Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t bg-gray-50 rounded-t-[2rem]">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">Rs. {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="font-medium">Shipping</span>
                    <span className="text-brand-primary font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xl font-black text-brand-secondary">Total</span>
                    <span className="text-2xl font-black text-brand-primary">Rs. {getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = '/checkout'}
                  className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-brand-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                  <div className="p-1.5 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-lg tracking-tight">Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
