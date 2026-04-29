"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Eye, Zap, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/store/useCart";
import { useCompare } from "@/lib/store/useCompare";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";

interface ProductCardProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    price: number;
    compare_at_price?: number;
    image_url: string;
    category: string;
    is_new?: boolean;
    is_bestseller?: boolean;
    wattage?: number;
    colors_available?: string[];
    product_images?: { image_url: string; color?: string }[];
  };
}

const COLOR_MAP: Record<string, string> = {
  "White": "#FFFFFF",
  "Off White": "#FAF9F6",
  "Black": "#000000",
  "Matte Black": "#28282B",
  "Smoke Grey": "#708090",
  "Grey": "#808080",
  "Dark Grey": "#A9A9A9",
  "Silver": "#C0C0C0",
  "Gold": "#FFD700",
  "Copper": "#B87333",
  "Brown": "#8B4513",
  "Wood": "#DEB887",
  "Walnut": "#69443C",
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { addProduct, isInCompare, removeProduct } = useCompare();
  const [currentImage, setCurrentImage] = React.useState(product.image_url);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  
  const productSlug = product.slug || product.id;
  const inCompare = isInCompare(product.id);
  
  const discount = product.compare_at_price 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) 
    : 0;

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeProduct(product.id);
      toast.error(`Removed from comparison`);
    } else {
      addProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: currentImage,
        category: product.category,
        wattage: product.wattage,
        slug: productSlug,
        selected_color: selectedColor || undefined
      });
      toast.success(`Added to comparison`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: currentImage,
      quantity: 1,
      category: product.category,
      wattage: product.wattage,
      selected_color: selectedColor || undefined
    });
    toast.success(`${product.name} added to cart!`, {
      style: {
        borderRadius: '16px',
        background: '#0D1F3C',
        color: '#fff',
        fontWeight: 'bold'
      },
    });
  };

  return (
    <div
      className="group bg-white rounded-[2rem] border border-slate-100/60 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-slate-50/80 to-white">
        <Link href={`/products/${productSlug}`} className="block w-full h-full">
          <div className="relative w-full h-full">
            <Image
              src={currentImage || "/placeholder-fan.png"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-4 md:p-8 group-hover:scale-105 transition-all duration-700 ease-out drop-shadow-sm"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-md shadow-blue-600/20">
              New
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-md shadow-orange-500/20">
              Bestseller
            </span>
          )}
          {discount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-md shadow-rose-500/20">
              Save {discount}%
            </span>
          )}
        </div>
        
        {/* Floating Actions - Compact & Tucked */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 pointer-events-auto">
          <button 
            onClick={handleCompare}
            className={`flex items-center justify-center p-2.5 rounded-xl shadow-lg transition-all active:scale-90 border border-slate-100/50 ${
              inCompare 
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/20' 
                : 'bg-white/90 backdrop-blur-md text-slate-500 hover:text-blue-600 shadow-slate-900/5'
            }`}
            title="Compare"
          >
            <ArrowRightLeft size={16} strokeWidth={2.5} />
          </button>
          <Link 
            href={`/products/${productSlug}`} 
            className="flex items-center justify-center bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-lg text-slate-500 hover:text-blue-600 transition-all active:scale-90 border border-slate-100/50 shadow-slate-900/5"
            title="View Details"
          >
            <Eye size={16} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Clickable Image Area */}
        <Link 
          href={`/products/${productSlug}`} 
          className="absolute inset-0 z-10 block w-full h-full"
          aria-label={product.name}
        />

        {/* Energy Saving Tag */}
        {product.wattage && (
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 shadow-xl">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {product.wattage}W Energy Saver
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-2">
          {product.category}
        </div>
        <Link href={`/products/${productSlug}`} className="group-hover:text-blue-600 transition-colors">
          <h3 className="text-base font-black leading-snug mb-2 line-clamp-2 text-slate-800 tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Color Swatches */}
        {product.colors_available && product.colors_available.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 mt-1">
            {product.colors_available.map((color) => {
              const hex = COLOR_MAP[color] || "#CBD5E1";
              return (
                <button
                  key={color}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(color);
                    const colorImage = product.product_images?.find(img => img.color === color);
                    if (colorImage) setCurrentImage(colorImage.image_url);
                  }}
                  className={`w-4 h-4 rounded-full border border-slate-200 transition-all hover:scale-125 ${
                    selectedColor === color ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: hex }}
                  title={color}
                />
              );
            })}
          </div>
        )}
        
        <div className="mt-auto pt-5 flex items-end justify-between border-t border-slate-50">
          <div className="flex flex-col gap-0.5">
            {product.compare_at_price && (
              <span className="text-xs text-slate-400 line-through font-semibold">
                Rs. {product.compare_at_price.toLocaleString()}
              </span>
            )}
            <span className="text-lg font-black text-blue-600">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="rounded-xl px-4 py-2.5 bg-slate-900 hover:bg-blue-600 shadow-lg shadow-slate-900/10 hover:shadow-blue-600/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
