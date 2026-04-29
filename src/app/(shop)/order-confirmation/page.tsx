'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  ArrowRight,
  ShoppingBag,
  Download,
  Building2,
  Clock,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (orderId) {
      const fetchOrder = async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .single();
        
        if (data) setOrder(data);
        setLoading(false);
      };
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-3xl font-black text-slate-900 mb-4">Order Not Found</h1>
        <Link href="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-12 text-center relative overflow-hidden">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h1 className="text-4xl font-black mb-2 relative z-10">Order Confirmed!</h1>
            <p className="text-white/60 font-bold relative z-10">Order #{order.order_number}</p>
            
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />
          </div>

          {/* Content */}
          <div className="p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="text-blue-600" size={24} />
                  Shipping Details
                </h3>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                  <p className="font-black text-slate-900">{order.customer_name}</p>
                  <p className="text-slate-600 font-medium">{order.customer_address}</p>
                  <p className="text-slate-600 font-medium">{order.customer_city}, {order.customer_province}</p>
                  <p className="text-slate-600 font-medium">{order.customer_phone}</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Package className="text-blue-600" size={24} />
                  Order Summary
                </h3>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  {order.order_items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-start text-sm">
                      <div className="space-y-1">
                        <span className="text-slate-900 font-bold block">{item.quantity}x {item.product_name}</span>
                        <div className="flex flex-wrap gap-2">
                          {item.selected_color && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded text-slate-500">
                              {item.selected_color}
                            </span>
                          )}
                          {item.selected_size && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded text-slate-500">
                              {item.selected_size}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-black text-slate-900 whitespace-nowrap ml-4">Rs. {item.total_price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-lg">Total</span>
                    <span className="font-black text-blue-600 text-2xl">Rs. {order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Instructions */}
            {order.payment_method === 'bank_transfer' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-50 border-2 border-blue-100 rounded-[2.5rem] p-8 md:p-10 space-y-8 relative overflow-hidden"
              >
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className="p-4 bg-white rounded-2xl shadow-sm">
                    <Building2 className="text-blue-600" size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Bank Transfer Instructions</h3>
                    <p className="text-slate-600 font-medium max-w-xl">
                      To complete your order, please transfer the total amount to the bank account below.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Name</p>
                      <p className="font-black text-slate-900">Bank Alfalah</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Title</p>
                      <p className="font-black text-slate-900">Tamoor Fans</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
                      <p className="font-black text-blue-600 text-lg">1234 5678 9101</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 mb-1 text-emerald-600">Step 1: Send Screenshot</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Send a screenshot of the payment receipt to our WhatsApp: <span className="font-black text-slate-900">0321 1234567</span> along with your <span className="font-black text-slate-900">Order ID: #{order.order_number}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 mb-1 text-amber-600">Step 2: 24h Deadline</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Orders not paid within 24 hours will be cancelled automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative background icon */}
                <Building2 className="absolute -right-8 -bottom-8 text-blue-600/5 rotate-12" size={200} />
              </motion.div>
            )}

            <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-100">
              <Link href="/products" className="flex-grow">
                <Button variant="secondary" className="w-full py-5 rounded-2xl font-black">
                  <ShoppingBag size={20} className="mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href={`/track-order?id=${order.order_number}&email=${order.customer_email}`} className="flex-grow">
                <Button variant="primary" className="w-full py-5 rounded-2xl font-black">
                  Track Order
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <button className="text-slate-400 hover:text-slate-900 text-sm font-bold transition-colors inline-flex items-center gap-2">
                <Download size={16} />
                Download Invoice (PDF)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
