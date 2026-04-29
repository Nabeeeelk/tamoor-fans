"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', orderNumber.trim())
        .eq('customer_email', email.trim())
        .single();

      if (error) throw error;
      if (!data) {
        setError('Order not found. Please check your order number and email.');
      } else {
        setOrder(data);
      }
    } catch (err: any) {
      console.error('Tracking error:', err);
      setError('Order not found. Please check your order number and email.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Track Your <span className="text-emerald-500">Order</span></h1>
          <p className="text-slate-500 text-lg">Enter your order details to see the real-time status of your delivery.</p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-slate-100 mb-10">
          <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Order Number</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="TF-12345" 
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Email Address</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="ahmed@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button 
                type="submit"
                variant="primary" 
                className="w-full py-4 rounded-2xl font-bold"
                isLoading={loading}
              >
                Track Order
              </Button>
            </div>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-2xl bg-red-50 text-red-600 flex items-center gap-3 text-sm font-medium"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </div>

        {/* Tracking Results */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-8"
            >
              {/* Status Stepper */}
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Order #{order.order_number}</h3>
                    <p className="text-slate-500 text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    {order.order_status}
                  </div>
                </div>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-5 right-5 h-1 bg-slate-100 z-0">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((getStatusStep(order.order_status) - 1) / 3) * 100}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>

                  <div className="relative z-10 flex justify-between">
                    {[
                      { icon: Clock, label: 'Pending' },
                      { icon: Package, label: 'Processing' },
                      { icon: Truck, label: 'Shipped' },
                      { icon: CheckCircle2, label: 'Delivered' }
                    ].map((step, i) => {
                      const isActive = i + 1 <= getStatusStep(order.order_status);
                      const Icon = step.icon;
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                            <Icon size={20} />
                          </div>
                          <span className={`mt-3 text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[32px] p-8 shadow-lg border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-emerald-500" />
                    Shipping Address
                  </h4>
                  <div className="text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">{order.customer_name}</p>
                    <p>{order.customer_address}</p>
                    <p>{order.customer_city}, {order.customer_province}</p>
                    <p>{order.customer_phone}</p>
                  </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 shadow-lg border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Package size={20} className="text-emerald-500" />
                    Order Summary
                  </h4>
                  <div className="space-y-4">
                    {order.order_items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.quantity}x {item.product_name}</span>
                        <span className="font-bold text-slate-900">Rs. {item.total_price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-100 flex justify-between font-black text-slate-900">
                      <span>Total</span>
                      <span>Rs. {order.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
