'use client';

import React from 'react';
import { useCart, CartItem } from '@/lib/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ChevronLeft,
  Truck,
  ShieldCheck,
  Package
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
            <ShoppingBag size={48} className="text-slate-300" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900">Your cart is empty</h1>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Explore our latest models and start saving energy.
            </p>
          </div>
          <Link href="/products">
            <Button variant="primary" size="lg" className="rounded-2xl px-10 py-6 text-lg font-bold">
              Start Shopping
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 flex-grow space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/products" className="p-2 hover:bg-white rounded-xl transition-colors">
                  <ChevronLeft size={24} />
                </Link>
                <h1 className="text-3xl font-black text-slate-900">Shopping Cart</h1>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest">
                {getTotalItems()} Items
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 group"
                  >
                    <div className="relative w-32 h-32 bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden shrink-0">
                      <Image 
                        src={item.image_url || "/placeholder-fan.png"} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-slate-400 font-medium mb-4">{item.category || 'Fan Model'}</p>
                      <div className="text-2xl font-black text-blue-600">
                        Rs. {item.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96 shrink-0">
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] sticky top-32 shadow-2xl shadow-slate-900/30 space-y-10 overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Package size={24} />
                  </div>
                  <h2 className="text-2xl font-black">Summary</h2>
                </div>

                <div className="space-y-4 font-bold text-lg">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span>Rs. {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Shipping</span>
                    <span className="text-emerald-400">FREE</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between text-3xl font-black">
                    <span>Total</span>
                    <span className="text-blue-400">Rs. {getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link href="/checkout">
                    <Button variant="primary" className="w-full py-6 rounded-2xl text-lg font-black shadow-xl shadow-blue-600/20">
                      Checkout
                      <ArrowRight size={20} className="ml-2" />
                    </Button>
                  </Link>
                  <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Secure Transaction
                  </p>
                </div>

                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex gap-4">
                  <div className="text-blue-400">
                    <Truck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Shipping Info</p>
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                      Free delivery on all orders above Rs. 10,000. Delivered in 2-4 business days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
