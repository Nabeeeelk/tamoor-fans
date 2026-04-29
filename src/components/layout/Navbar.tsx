"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Search, Heart, Zap, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/lib/store/useCart";
import CartDrawer from "@/components/cart/CartDrawer";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  
  const { getTotalItems } = useCart();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-4 md:px-8",
          isScrolled
            ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-b border-gray-100"
            : "bg-white py-4"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-brand-primary p-1.5 rounded-lg rotate-0 group-hover:rotate-12 transition-transform duration-300">
              <Zap className="text-white w-5 h-5 fill-white" />
            </div>
            <span className={cn(
              "text-xl font-bold tracking-tight",
              "text-gray-900"
            )}>
              TAMOOR<span className="text-brand-primary">FANS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: 'Products', href: '/products' },
              { name: 'Savings Calculator', href: '/#savings-calculator' },
              { name: 'Compare', href: '/compare' },
              { name: 'About', href: '/about' },
              { name: 'Track Order', href: '/order-tracking' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-bold transition-all duration-300 relative py-2 group",
                  "text-gray-600 hover:text-brand-primary"
                )}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <button className={cn(
              "p-2 rounded-full transition-colors hover:bg-gray-100 flex items-center justify-center",
              "text-gray-600"
            )}>
              <Search className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className={cn(
                "p-2 rounded-full transition-colors hover:bg-gray-100 relative group flex items-center justify-center",
                "text-gray-600"
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                "md:hidden p-2 rounded-full flex items-center justify-center transition-colors",
                "text-brand-secondary"
              )}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

      </header>
      
      {/* Mobile Menu Overlay - Outside Header for better stacking */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[120] shadow-2xl md:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <span className="text-xl font-black text-brand-secondary">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="flex-grow py-8 px-6 flex flex-col gap-3">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Products', href: '/products' },
                  { name: 'Savings Calculator', href: '/#savings-calculator' },
                  { name: 'Compare', href: '/compare' },
                  { name: 'About', href: '/about' },
                  { name: 'Track Order', href: '/order-tracking' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-6 py-4 text-lg font-bold rounded-2xl hover:bg-brand-primary/10 hover:text-brand-primary transition-all flex items-center justify-between group text-slate-700"
                  >
                    {item.name}
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </nav>

              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-black py-4 rounded-2xl shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 group"
                >
                  Shop Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
