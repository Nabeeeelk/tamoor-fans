import HeroSection from "@/components/home/HeroSection";
import ProductGrid from "@/components/product/ProductGrid";
import { createClient } from "@/lib/supabase/server";
import SavingsCalculator from "@/components/calculator/SavingsCalculator";
import { Zap, Shield, Award, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import FeaturedSeries from "@/components/home/FeaturedSeries";

export default async function Home() {
  const supabase = await createClient();
  
  const { data: featuredProducts, error } = await supabase
    .from('products')
    .select('*, categories(name), product_images(image_url, color)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(4);

  // Map to match ProductCard props
  const formattedProducts = (featuredProducts || []).map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compare_at_price: p.original_price,
    image_url: p.image_url,
    category: (p.categories as any)?.name || 'Uncategorized',
    is_new: p.is_new_arrival,
    is_bestseller: p.price < 10000,
    wattage: p.wattage,
    colors_available: p.colors_available,
    product_images: p.product_images
  }));

  const features = [
    { title: "Pure Copper", desc: "99.9% Electrical Grade Copper for maximum durability.", icon: Shield, color: "blue" },
    { title: "BLDC Tech", desc: "Brushless DC motors that use only 30W of power.", icon: Zap, color: "amber" },
    { title: "Silent Drive", desc: "Engineered for whisper-quiet high-speed performance.", icon: Clock, color: "emerald" },
    { title: "2 Year Warranty", desc: "Complete peace of mind with nationwide support.", icon: Award, color: "indigo" },
  ];

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      
      {/* Trust & Features Section */}
      <section className="py-16 px-6 bg-white overflow-hidden border-b border-slate-100">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Built for Excellence.</h2>
            <p className="text-lg text-slate-500">Every Tamoor Fan is a masterpiece of engineering, designed to provide comfort while respecting your budget.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-${feature.color}-500 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedSeries products={formattedProducts} />

      {/* Savings Calculator Interactive Section */}
      <section id="savings-calculator" className="py-16 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="container-custom relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">
              <Zap size={18} fill="currentColor" />
              Smart Savings Calculator
            </div>
            <h2 className="!text-white text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[1.1]">Stop wasting money on old fans.</h2>
            <p className="text-white/50 text-lg md:text-2xl leading-relaxed max-w-2xl">
              Traditional fans consume 75-100W. Our fans consume only 30W. 
              Adjust the sliders below to see your potential monthly and annual savings.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <SavingsCalculator />
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-white/40 font-bold flex items-center justify-center gap-2">
              <Star className="text-amber-500 fill-amber-500" size={18} />
              Trusted by 50,000+ households across Pakistan
            </p>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -ml-64 -mb-64" />
      </section>

      {/* Social Proof / Trust Banner */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {/* These would be logos if I had them, using text placeholders for now */}
            <span className="text-2xl font-black tracking-tighter">PSQCA APPROVED</span>
            <span className="text-2xl font-black tracking-tighter">ISO 9001</span>
            <span className="text-2xl font-black tracking-tighter">ENERGY STAR</span>
            <span className="text-2xl font-black tracking-tighter">PCSIR TESTED</span>
          </div>
        </div>
      </section>
    </div>
  );
}
