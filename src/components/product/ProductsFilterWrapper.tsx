"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, Package } from "lucide-react";
import ProductGrid from "./ProductGrid";

interface Product {
  id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  category: string;
  is_new: boolean;
  is_bestseller: boolean;
  wattage: number;
}

interface ProductsFilterWrapperProps {
  initialProducts: Product[];
  categories: string[];
}

export default function ProductsFilterWrapper({
  initialProducts,
  categories,
}: ProductsFilterWrapperProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    switch (sortOrder) {
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        // Already sorted by newest from server
        break;
    }

    return result;
  }, [initialProducts, searchQuery, selectedCategory, sortOrder]);

  return (
    <div>
      {/* Search & Filter Bar */}
      <section className="bg-slate-900 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Package size={14} />
              Full Catalog
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Collection</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              From energy-saving DC models to designer ceiling fans, find the perfect match for your space.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-16 px-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] flex flex-col md:flex-row items-center gap-2 shadow-2xl relative z-20">
            <div className="relative flex-1 w-full">
              <Search
                size={20}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by model, color, or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white pl-14 pr-6 py-4 focus:outline-none placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-full flex items-center justify-center gap-2 px-8 py-4 pr-12 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/5 cursor-pointer focus:outline-none"
                >
                  <option value="All" className="text-slate-900">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="text-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
                <Filter size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
              </div>
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none w-full flex items-center justify-center gap-2 px-8 py-4 pr-12 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer focus:outline-none"
                >
                  <option value="newest" className="text-slate-900">Newest</option>
                  <option value="price_low" className="text-slate-900">Price: Low to High</option>
                  <option value="price_high" className="text-slate-900">Price: High to Low</option>
                </select>
                <SlidersHorizontal size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48 z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -ml-48 -mb-48 z-0 pointer-events-none" />
      </section>

      <div className="pt-12">
        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            title=""
            subtitle="Available Models"
          />
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-black text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination / Load More */}
      <div className="max-w-7xl mx-auto px-6 mt-8 mb-16 text-center">
        <p className="text-slate-400 text-sm font-bold mb-6">
          Showing {filteredProducts.length} of {initialProducts.length} products
        </p>
        <div className="w-full h-px bg-slate-200 mb-12" />
        <div className="flex items-center justify-center gap-12 opacity-40 grayscale">
          <span className="text-xl font-black tracking-tighter">PREMIUM QUALITY</span>
          <span className="text-xl font-black tracking-tighter">ENERGY SAVER</span>
          <span className="text-xl font-black tracking-tighter">SILENT DRIVE</span>
        </div>
      </div>
    </div>
  );
}
