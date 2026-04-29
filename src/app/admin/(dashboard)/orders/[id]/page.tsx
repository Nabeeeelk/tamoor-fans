import { createClient } from "@/lib/supabase/server";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Box,
  CreditCard,
  History,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from "next/navigation";

export default async function OrderDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', params.id)
    .single();

  if (!order || error) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-600 border-rose-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/orders"
          className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-800 transition-all shadow-none hover:shadow-sm"
        >
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-800">Order Detail</h1>
          <p className="text-slate-500 font-medium">#{order.order_number} • Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status Banner */}
          <div className={`p-8 rounded-[2rem] border flex items-center justify-between ${getStatusColor(order.order_status)}`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/50 rounded-2xl">
                <Box size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Current Status</p>
                <p className="text-xl font-black uppercase tracking-wider">{order.order_status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* Status Update Actions */}
              <button className="px-4 py-2 bg-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Update Status</button>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Package className="text-blue-500" size={20} />
              Ordered Items
            </h2>
            
            <div className="divide-y divide-slate-100">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="py-6 flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 shrink-0 flex items-center justify-center text-slate-300 font-black italic">
                      PIC
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800">{item.product_name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.selected_color && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                            Color: {item.selected_color}
                          </span>
                        )}
                        {item.selected_size && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                            Size: {item.selected_size}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-bold mt-2">Rs. {item.unit_price.toLocaleString()} x {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900">Rs. {item.total_price.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Shipping</span>
                <span>Rs. {order.shipping_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 text-2xl font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-blue-600">Rs. {order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Customer Info */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <MapPin className="text-blue-500" size={20} />
              Customer
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Package size={16} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Name</p>
                  <p className="text-sm font-bold text-slate-700">{order.customer_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-bold text-slate-700">{order.customer_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm font-bold text-slate-700">{order.customer_phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Shipping Address</p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    {order.customer_address}<br />
                    {order.customer_city}, {order.customer_province}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <CreditCard className="text-blue-500" size={20} />
              Payment
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Method</p>
                <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
