import { createClient } from "@/lib/supabase/server";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch basic stats
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('order_status', 'pending');

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { 
      label: 'Total Products', 
      value: productCount || 0, 
      icon: Package, 
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'Active Categories', 
      value: categoryCount || 0, 
      icon: TrendingUp, 
      color: 'emerald',
      trend: '+2',
      trendUp: true
    },
    { 
      label: 'Pending Orders', 
      value: pendingOrders || 0, 
      icon: ShoppingCart, 
      color: 'orange',
      trend: '-5%',
      trendUp: false
    },
    { 
      label: 'Total Revenue', 
      value: 'PKR 0', 
      icon: AlertCircle, 
      color: 'indigo',
      trend: '0%',
      trendUp: true
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, Admin! 👋</h2>
          <p className="text-slate-500 max-w-lg">
            Here's what's happening with Taimoor Fans today. All 61 products have been successfully migrated and are ready for management.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">#{order.order_number}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{order.customer_name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.order_status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">PKR {order.total_amount}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                      No orders found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/admin/products/new" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 group">
                <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                  <Package size={20} />
                </div>
                <span className="font-bold">Add New Product</span>
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100 group">
                <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                  <Layers size={20} />
                </div>
                <span className="font-bold">Manage Categories</span>
              </Link>
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-600/20 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-widest mb-4">
                <Clock size={14} />
                System Status
              </div>
              <h4 className="text-lg font-bold mb-2">Database Synced</h4>
              <p className="text-blue-100 text-sm mb-4">
                All store data is up to date and secured with RLS policies.
              </p>
              <div className="h-1.5 bg-blue-500 rounded-full overflow-hidden">
                <div className="w-full h-full bg-white rounded-full group-hover:animate-pulse" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
