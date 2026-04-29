"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, ChevronRight, ChevronLeft, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  short_description: string;
  image_url: string;
  wattage: number | null;
  warranty_years: number;
  slug: string;
  is_featured: boolean;
}

const HeroSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create client inside effect so it only runs client-side
    const supabase = createClient();

    // Safety timeout — never spin forever on mobile
    const timeout = setTimeout(() => setLoading(false), 10000);

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, short_description, image_url, wattage, warranty_years, slug, is_featured")
          .eq("is_active", true)
          .order("is_featured", { ascending: false })
          .limit(5);

        if (error) throw error;
        if (data) setProducts(data);
      } catch (err) {
        console.error("Error fetching hero products:", err);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchProducts();
    return () => clearTimeout(timeout);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Auto-next slide
  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [products.length, nextSlide]);

  if (loading) {
    return (
      <section className="min-h-[90vh] bg-[#0D1F3C] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  // If no products, show a default hero instead of spinning forever
  if (products.length === 0) {
    return (
      <section className="min-h-[90vh] bg-[#0D1F3C] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white text-4xl font-black mb-4">Premium Cooling Solutions</h1>
        <p className="text-white/60 mb-8 max-w-md text-lg">Pakistan's most energy-efficient fans with 30W BLDC technology.</p>
        <Link href="/products">
          <Button className="bg-brand-primary text-white px-8 py-4 rounded-xl">Browse All Fans</Button>
        </Link>
      </section>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-center overflow-hidden bg-[#0D1F3C]">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#0D1F3C] to-[#0a1628]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-4 pb-20 md:pt-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-center lg:text-left space-y-3 md:space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
                <Zap className="w-4 h-4 text-[var(--accent-yellow)] fill-[var(--accent-yellow)]" />
                <span className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">
                  {currentProduct.is_featured ? "Featured Model" : "Premium Series"}
                </span>
              </div>

              <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-2xl">
                <span className="block mb-2 text-white">
                  {currentProduct.name}
                </span>
                <span className="text-brand-primary drop-shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.4)]">
                  Precision Engineering.
                </span>
              </h1>

              <p className="text-white/80 text-sm md:text-lg max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-lg line-clamp-2 md:line-clamp-3">
                {currentProduct.short_description}
              </p>

              {/* Specs for Desktop - Left Aligned */}
              <div className="hidden lg:flex flex-wrap gap-4 pt-4">
                {currentProduct.wattage && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/20 rounded-lg">
                      <Zap className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-bold text-sm">{currentProduct.wattage} Watts</div>
                      <div className="text-white/50 text-[10px]">Eco-Saving</div>
                    </div>
                  </div>
                )}
                {currentProduct.warranty_years && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-blue-400/20 rounded-lg">
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-bold text-sm">{currentProduct.warranty_years} Years</div>
                      <div className="text-white/50 text-[10px]">Warranty</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Product Image Section */}
          <div className="relative flex flex-col items-center mt-2 lg:mt-0">
            <div className="relative h-[200px] md:h-[400px] w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct.id}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-brand-primary/15 blur-[100px] rounded-full scale-75 animate-pulse" />
                  
                  <Link href={`/product/${currentProduct.slug}`} className="block w-[80%] h-[80%] group">
                    <div className="relative w-full h-full">
                      <Image
                        src={currentProduct.image_url || "/placeholder-fan.png"}
                        alt={currentProduct.name}
                        fill
                        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 40vw"
                        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-1000 group-hover:scale-105"
                        priority
                      />
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-0 z-20 pointer-events-none">
                <button 
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white transition-all pointer-events-auto shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white transition-all pointer-events-auto shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Buttons Centered Below Image */}
            <div className="mt-4 md:mt-8 flex flex-row items-center gap-3 md:gap-4">
              <Link href={`/product/${currentProduct.slug}`}>
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 md:px-8 py-4 md:py-6 rounded-2xl shadow-xl shadow-brand-primary/20 transition-all hover:-translate-y-1 text-sm md:text-base"
                >
                  View Details
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/20 hover:bg-white/10 backdrop-blur-md px-6 md:px-8 py-4 md:py-6 rounded-2xl transition-all hover:-translate-y-1 text-sm md:text-base"
                >
                  All Products
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Specs - Centered below buttons */}
        <div className="lg:hidden flex flex-wrap justify-center gap-3 mt-2 scale-90">
          {currentProduct.wattage && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2 rounded-xl flex items-center gap-2">
              <div className="p-1.5 bg-brand-primary/20 rounded-lg">
                <Zap className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-xs">{currentProduct.wattage} Watts</div>
                <div className="text-white/50 text-[10px]">Eco-Saving</div>
              </div>
            </div>
          )}
          {currentProduct.warranty_years && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2 rounded-xl flex items-center gap-2">
              <div className="p-1.5 bg-blue-400/20 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-xs">{currentProduct.warranty_years} Years</div>
                <div className="text-white/50 text-[10px]">Warranty</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Floating Button - Match Screenshot */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </div>

      {/* Slider Indicators - More Visible */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full min-w-0 min-h-0 ${
              index === currentIndex 
                ? "w-10 h-2 bg-brand-primary shadow-lg shadow-brand-primary/40" 
                : "w-2 h-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

