"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Scale, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Shop", icon: Package, href: "/products" },
    { label: "Compare", icon: Scale, href: "/compare" },
    { label: "Cart", icon: ShoppingCart, href: "/cart" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-[100] px-2 pt-2 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 min-w-[64px]",
                isActive ? "text-brand-primary" : "text-gray-400"
              )}
            >
              <div className={cn(
                "p-1 rounded-lg transition-colors",
                isActive ? "bg-brand-primary/10" : ""
              )}>
                <item.icon className={cn("w-6 h-6", isActive ? "fill-brand-primary/20" : "")} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
