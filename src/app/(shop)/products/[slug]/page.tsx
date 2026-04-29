'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import { 
  Star, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from "@/lib/store/useCart";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

export default function ProductPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    // Create client inside effect — safe for SSR/mobile
    const supabase = createClient();
    // Safety timeout so the spinner never hangs forever on mobile
    const timeout = setTimeout(() => setLoading(false), 15000);

    async function fetchProduct() {
      setLoading(true);
      setProduct(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (name, slug),
            product_images (image_url, is_primary, color)
          `)
          .eq('slug', params.slug)
          .single();

        if (error) throw error;
        if (data) {
          setProduct(data);
          if (data.colors_available?.length > 0) setSelectedColor(data.colors_available[0]);
          if (data.sizes_available?.length > 0) setSelectedSize(data.sizes_available[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    }
    fetchProduct();
    return () => clearTimeout(timeout);
  }, [params.slug]);

  if (loading) return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-bold text-slate-400">Loading product details...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="p-4 bg-rose-50 text-rose-600 rounded-full mb-4">
        <Zap size={32} />
      </div>
      <h2 className="text-2xl font-black text-slate-900">Product Not Found</h2>
      <p className="text-slate-500 max-w-xs">We couldn't find the product you're looking for. It might have been moved or renamed.</p>
      <Link href="/products">
        <Button className="mt-4 bg-slate-900 text-white">Back to Shop</Button>
      </Link>
    </div>
  );

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: quantity,
      category: product.categories?.name,
      wattage: product.wattage,
      selected_color: selectedColor || undefined,
      selected_size: selectedSize || undefined
    });
    toast.success(`${product.name} added to cart!`);
  };

  // Build gallery images: start with main image, then add product_images
  const allImages = [
    { url: product.image_url, alt: product.name, color: null },
    ...(product.product_images || [])
  ];

  // Filter by color and remove duplicates
  const seenUrls = new Set();
  const finalImages = allImages
    .filter((img: any) => {
      // Keep if it matches color OR has no color
      const matchesColor = !img.color || img.color === selectedColor;
      if (!matchesColor) return false;
      
      // Prevent duplicates
      if (seenUrls.has(img.url)) return false;
      seenUrls.add(img.url);
      return true;
    })
    .map((img: any) => ({
      url: img.url || img.image_url, // Handle both structures
      alt: product.name
    }));

  const specs = [
    { label: "Wattage", value: product.wattage ? `${product.wattage}W` : null },
    { label: "Voltage", value: "220V" }, // Usually standard in PK
    { label: "Blade Size", value: product.blade_size },
    { label: "Speed (RPM)", value: product.rpm },
    { label: "Airflow (CMM)", value: product.airflow },
    { label: "Noise Level", value: product.noise_level },
    { label: "Warranty", value: product.warranty_years ? `${product.warranty_years} Years` : null },
  ].filter(s => s.value !== null && s.value !== undefined);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-100 py-4 px-6 pt-20">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ArrowRight size={12} />
          <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <ArrowRight size={12} />
          <span className="text-slate-800">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Gallery */}
          <ProductGallery images={finalImages} />

          {/* Right: Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  {product.categories?.name}
                </span>
                {product.is_new_arrival && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                    New Arrival
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                </div>
                <span className="text-sm font-bold text-slate-400">(48 Reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4 border-b border-slate-100 pb-8">
              <span className="text-4xl font-black text-slate-900">PKR {product.price.toLocaleString()}</span>
              {product.original_price && (
                <span className="text-xl text-slate-400 line-through">PKR {product.original_price.toLocaleString()}</span>
              )}
              {product.original_price && (
                <span className="text-emerald-500 font-black text-sm">
                  SAVE {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </span>
              )}
            </div>

            <div className="text-lg text-slate-500 leading-relaxed">
              {product.short_description ? (
                product.short_description.split('\n').map((para: string, i: number) => (
                  <p key={i} className="mb-2">{para}</p>
                ))
              ) : (
                <p>Experience superior cooling with our premium fan. Designed for maximum efficiency and whisper-quiet operation.</p>
              )}
            </div>

            {/* Color Selection */}
            {product.colors_available?.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Select Color</h3>
                  <span className="text-xs font-bold text-blue-600">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors_available.map((color: string) => {
                    // Simple color mapping for preview
                    const colorMap: Record<string, string> = {
                      'Off White': '#F5F5F0',
                      'Matte Black': '#1A1A1A',
                      'Royal Gold': '#D4AF37',
                      'Walnut Wood': '#5D4037',
                      'Antique Bronze': '#804A00',
                      'Mahogany': '#4E2C2C',
                      'Cloud White': '#FDFDFD',
                      'Sleek Silver': '#C0C0C0',
                      'Classic White': '#FFFFFF',
                      'Industrial Gray': '#4B4B4B',
                      'Midnight Black': '#000000',
                      'White': '#FFFFFF'
                    };
                    const hex = colorMap[color] || '#CCCCCC';

                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                          selectedColor === color 
                            ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10' 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div 
                          className="w-5 h-5 rounded-full border border-slate-200 shadow-sm transition-transform group-hover:scale-110" 
                          style={{ backgroundColor: hex }} 
                        />
                        <span className={`text-sm font-bold ${selectedColor === color ? 'text-blue-700' : 'text-slate-600'}`}>
                          {color}
                        </span>
                        {selectedColor === color && (
                          <motion.div 
                            layoutId="color-check"
                            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white"
                          >
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes_available?.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Select Size</h3>
                  <span className="text-xs font-bold text-blue-600">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes_available.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative min-w-[80px] px-6 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-300 ${
                        selectedSize === size 
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center bg-slate-100 rounded-2xl p-1 shrink-0">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Truck size={20} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 uppercase">Fast Delivery</h5>
                  <p className="text-[10px] text-slate-400 font-bold">2-4 Business Days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 uppercase">2yr Warranty</h5>
                  <p className="text-[10px] text-slate-400 font-bold">Nationwide Support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 uppercase">Easy Return</h5>
                  <p className="text-[10px] text-slate-400 font-bold">7 Days Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Description & Specs */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-16 border-t border-slate-100 pt-16">
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-black text-slate-900">Product Description</h3>
            <div className="prose prose-slate max-w-none text-slate-500 leading-relaxed">
              {product.full_description ? (
                product.full_description.split('\n').map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <>
                  <p>
                    Taimoor Fans introduces the next generation of cooling technology. Our fans are designed to redefine your comfort while providing excellent airflow.
                  </p>
                  <p>
                    Built with high quality materials, these fans offer unparalleled durability and performance.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 h-fit">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Info size={20} className="text-blue-500" />
              Technical Specs
            </h3>
            <div className="space-y-4">
              {specs.length > 0 ? (
                specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{spec.label}</span>
                    <span className="text-sm font-black text-slate-800">{spec.value}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-sm italic">Detailed specifications are not available for this product yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
