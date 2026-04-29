'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  Ticket,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Categories', icon: Layers, href: '/admin/categories' },
  { name: 'Reviews', icon: Star, href: '/admin/reviews' },
  { name: 'Coupons', icon: Ticket, href: '/admin/coupons' },
  { name: 'Banners', icon: ImageIcon, href: '/admin/banners' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col bg-slate-900 text-white transition-all duration-300 border-r border-slate-800",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && <span className="text-xl font-bold tracking-tight text-white">Taimoor <span className="text-blue-500">Admin</span></span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(
                "shrink-0",
                isActive ? "text-white" : "text-slate-400 group-hover:text-white"
              )} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all w-full",
          isCollapsed && "justify-center"
        )}>
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
