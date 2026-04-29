'use client';

import React, { useState, useEffect } from 'react';
import { CompareProduct, useCompare } from '@/lib/store/useCompare';
import { useCart } from '@/lib/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShoppingCart, Zap, Shield, Star, Trophy, ArrowRightLeft, Search, Plus } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface CompareTableProps {
  products: CompareProduct[];
}

const CompareTable = ({ products: initialProducts }: CompareTableProps) => {
  const { addItem } = useCart();
  const { addProduct, removeProduct, products: storeProducts } = useCompare();
  const [allProducts, setAllProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true);
      
      if (data) {
        const formatted = data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image_url: p.image_url,
          category: (p.categories as any)?.name || 'Uncategorized',
          wattage: p.wattage,
          slug: p.slug,
          blade_size: p.blade_size,
          rpm: p.rpm,
          airflow: p.airflow,
          warranty_years: p.warranty_years,
          colors_available: p.colors_available || ['Standard'],
          sizes_available: p.sizes_available || ['56"']
        }));
        setAllProducts(formatted);
      }
      setLoading(false);
    };

    fetchAllProducts();
  }, []);

  const handleAddToCart = (product: CompareProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
      category: product.category,
      wattage: product.wattage
    });
    toast.success(`${product.name} added to cart!`);
  };

  const rows = [
    { label: 'Price', key: 'price', format: (val: any) => val ? `Rs. ${Number(val).toLocaleString()}` : 'N/A', better: 'lower' },
    { label: 'Wattage', key: 'wattage', format: (val: any) => val ? `${val}W` : '30W', better: 'lower' },
    { label: 'Blade Size', key: 'blade_size', default: '56 Inches' },
    { label: 'Colors', key: 'colors_available', format: (val: any) => Array.isArray(val) ? val.join(', ') : val || 'Standard' },
    { label: 'Sizes', key: 'sizes_available', format: (val: any) => Array.isArray(val) ? val.join(', ') : val || '56"' },
    { label: 'RPM', key: 'rpm', default: '320 RPM' },
    { label: 'Airflow', key: 'airflow', default: '12,000 CFM', better: 'higher' },
    { label: 'Warranty', key: 'warranty_years', format: (val: any) => val ? `${val} Years` : '2 Years', better: 'higher' },
  ];

  // We always want to show 2 product columns
  const productColumns = [0, 1];

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !storeProducts.find(sp => sp.id === p.id)
  );

  return (
    <div className="w-full">
      <div className="bg-white border-y border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-full border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-2 md:p-8 w-[80px] md:w-1/4 bg-slate-50/50"></th>
                {productColumns.map((index) => {
                  const product = storeProducts[index];
                  return (
                    <th key={index} className="p-3 md:p-8 min-w-[150px] md:w-1/3 text-center relative">
                      {product ? (
                        <div className="relative">
                          {/* Remove Button */}
                          <button 
                            onClick={() => removeProduct(product.id)}
                            className="absolute -top-1 -right-1 md:top-2 md:right-2 z-10 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
                          >
                            <X size={14} />
                          </button>
                          
                          <div className="relative aspect-square w-20 md:w-48 mx-auto mb-2 md:mb-6 bg-slate-50 rounded-xl md:rounded-3xl p-2 md:p-6 group">
                            <Image
                              src={product.image_url || "/placeholder-fan.png"}
                              alt={product.name}
                              fill
                              className="object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <h3 className="text-[11px] md:text-xl font-black text-slate-800 mb-0.5 md:mb-2 line-clamp-2 leading-tight">
                            {product.name}
                          </h3>
                          <p className="text-[8px] md:text-sm font-bold text-blue-600 uppercase tracking-widest">
                            {product.category}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="aspect-square w-20 md:w-48 mx-auto mb-2 md:mb-6 border-2 border-dashed border-slate-200 rounded-xl md:rounded-3xl flex flex-col items-center justify-center bg-slate-50/50 p-4">
                            <Plus className="text-slate-300 mb-2" size={24} />
                            <p className="text-[10px] font-bold text-slate-400 hidden md:block">Add a model</p>
                          </div>
                          
                          {/* Inline Selection List */}
                          <div className="w-full max-w-[200px] mt-2">
                            <div className="relative mb-2">
                              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                              <input 
                                type="text" 
                                placeholder="Search..."
                                className="w-full pl-7 pr-2 py-1.5 text-[10px] md:text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            <div className="max-h-32 overflow-y-auto no-scrollbar space-y-1 text-left bg-slate-50 rounded-lg p-1 border border-slate-100">
                              {loading ? (
                                <p className="text-[10px] text-slate-400 p-2 text-center">Loading...</p>
                              ) : filteredProducts.length > 0 ? (
                                filteredProducts.map(p => (
                                  <button
                                    key={p.id}
                                    onClick={() => addProduct(p)}
                                    className="w-full text-left px-2 py-1.5 text-[10px] md:text-xs font-bold text-slate-600 hover:bg-blue-600 hover:text-white rounded-md transition-colors truncate"
                                  >
                                    {p.name}
                                  </button>
                                ))
                              ) : (
                                <p className="text-[10px] text-slate-400 p-2 text-center">No models found</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row) => {
                return (
                  <tr key={row.label} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-2 md:px-8 py-3 md:py-6 text-[9px] md:text-sm font-black text-slate-400 uppercase tracking-tight bg-slate-50/30">
                      {row.label}
                    </td>
                    {productColumns.map((index) => {
                      const product = storeProducts[index];
                      if (!product) return (
                        <td key={`empty-${index}`} className="px-2 md:px-8 py-3 md:py-6 text-center text-slate-200">
                          —
                        </td>
                      );

                      const value = product[row.key as keyof CompareProduct] || (row as any).default;
                      const displayValue = row.format ? row.format(value as any) : value;

                      return (
                        <td key={product.id} className="px-2 md:px-8 py-3 md:py-6 text-center">
                          <div className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-xs md:text-lg font-black text-slate-700">
                            {displayValue}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              
              {/* Actions Row */}
              <tr className="bg-slate-50/30">
                <td className="px-4 md:px-8 py-6 md:py-10"></td>
                {productColumns.map((index) => {
                  const product = storeProducts[index];
                  return (
                    <td key={index} className="px-2 md:px-8 py-4 md:py-10 text-center">
                      {product && (
                        <Button
                          onClick={() => handleAddToCart(product)}
                          size="sm"
                          className="w-full py-2.5 md:py-4 rounded-lg md:rounded-2xl shadow-lg shadow-blue-600/20 text-[10px] md:text-sm px-1"
                        >
                          Add to Cart
                        </Button>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareTable;
