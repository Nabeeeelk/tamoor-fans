'use client';

import React, { useState } from 'react';
import { useCart, CartItem } from '../../../lib/store/useCart';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Lock, 
  ChevronRight, 
  Package,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    const supabase = createClient();
    setIsSubmitting(true);
    setError('');

    try {
      const orderNumber = `TF-${Math.floor(10000 + Math.random() * 90000)}`;
      const totalAmount = getTotalPrice();

      // 1. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_city: formData.city,
          customer_province: 'Punjab', // Default for now
          payment_method: formData.paymentMethod,
          subtotal: totalAmount,
          total_amount: totalAmount,
          order_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        selected_color: item.selected_color,
        selected_size: item.selected_size
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success
      clearCart();
      router.push(`/order-confirmation?id=${order.id}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
              {[
                { n: 1, l: 'Shipping' },
                { n: 2, l: 'Payment' },
                { n: 3, l: 'Review' }
              ].map((s: { n: number, l: string }) => (
                <div key={s.n} className="flex items-center gap-3 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= s.n ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-200 text-slate-400'}`}>
                    {s.n}
                  </div>
                  <span className={`text-sm font-bold uppercase tracking-wider ${step >= s.n ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.l}
                  </span>
                  {s.n < 3 && <div className="w-12 h-px bg-slate-200" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-10">
              {/* Shipping Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Truck size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">First Name</label>
                    <input 
                      type="text" required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-medium"
                      placeholder="Taimoor"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                    <input 
                      type="text" required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-medium"
                      placeholder="Ahmed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-medium"
                      placeholder="ahmed@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-medium"
                      placeholder="0321 1234567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Street Address</label>
                  <input 
                    type="text" required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-medium"
                    placeholder="House #, Street name, Area"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">City</label>
                    <input 
                      type="text" required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-medium"
                      placeholder="Gujrat"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Zip Code (Optional)</label>
                    <input 
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-medium"
                      placeholder="50700"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${formData.paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-blue-600' : 'border-slate-300'}`}>
                        {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Cash on Delivery</p>
                        <p className="text-xs text-slate-400 font-medium">Pay when you receive</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setFormData({...formData, paymentMethod: 'bank_transfer'})}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${formData.paymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'bank_transfer' ? 'border-blue-600' : 'border-slate-300'}`}>
                        {formData.paymentMethod === 'bank_transfer' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Direct Bank Transfer</p>
                        <p className="text-xs text-slate-400 font-medium">Transfer via Banking App/ATM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 flex items-center gap-3 text-sm font-bold border border-red-100">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <div className="p-1.5 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform">
                      <Lock size={18} />
                    </div>
                    <span className="text-lg tracking-tight">Confirm & Place Order</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <p className="mt-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                SSL Encrypted Security
              </p>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] sticky top-32 shadow-2xl shadow-slate-900/30 overflow-hidden">
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Package size={24} />
                  </div>
                  <h2 className="text-2xl font-black">Order Summary</h2>
                </div>

                {/* Items List */}
                <div className="space-y-6 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                  {items.map((item: CartItem) => (
                    <div key={`${item.id}-${item.selected_color}-${item.selected_size}`} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-white/5 rounded-xl border border-white/10 shrink-0">
                        <Image 
                          src={item.image_url || "/placeholder-fan.png"} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-2"
                        />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-slate-900">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.selected_color && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-white/60">
                              {item.selected_color}
                            </span>
                          )}
                          {item.selected_size && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-white/60">
                              {item.selected_size}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 font-medium mt-1">Rs. {item.price.toLocaleString()} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-white/40 text-center font-bold">No items in your cart.</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-4 pt-8 border-t border-white/10">
                  <div className="flex justify-between items-center text-white/60 font-bold">
                    <span>Subtotal</span>
                    <span>Rs. {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/60 font-bold">
                    <span>Shipping</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-white/60 font-bold">
                    <span>Processing Fee</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 text-2xl font-black">
                    <span>Total</span>
                    <span className="text-blue-400 tracking-tight">Rs. {getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex gap-4">
                  <div className="text-amber-400">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Important Notice</p>
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                      Orders placed before 3 PM will be dispatched on the same business day. Delivery time is 2-4 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
