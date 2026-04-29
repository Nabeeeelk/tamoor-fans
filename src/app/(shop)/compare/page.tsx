'use client';

import React from 'react';
import { useCompare } from '@/lib/store/useCompare';
import CompareTable from '@/components/compare/CompareTable';
import { ArrowLeft, ArrowRightLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ComparePage() {
  const { products, clearCompare } = useCompare();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Show empty state while store is rehydrating
  const safeProducts = mounted ? products : [];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-24">
      <div className="w-full">
        {/* Header Section - Centered in container */}
        <div className="container-custom mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-4 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Products
              </Link>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 flex items-center gap-4">
                Compare Models
                <Sparkles className="text-blue-500" size={32} />
              </h1>
              <p className="text-slate-500 font-medium max-w-lg">
                Side-by-side comparison to help you choose the perfect fan. 
                <span className="block mt-1 text-blue-600 font-bold">Select 2 models for the best experience.</span>
              </p>
            </div>

            {safeProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                Clear Comparison
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        {safeProducts.length === 0 ? (
          <div className="container-custom">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] border border-slate-100 p-16 text-center shadow-xl shadow-slate-200/50"
            >
              <div className="w-24 h-24 rounded-[2rem] bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-8">
                <ArrowRightLeft size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-4">Your comparison is empty</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">
                Add products from our shop to see a detailed side-by-side comparison.
              </p>
              <Link 
                href="/products"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-blue-600 text-white font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/30"
              >
                Browse Products
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="w-full">
            <CompareTable products={safeProducts} />
            
            <div className="container-custom mt-12">
              <div className="flex justify-center">
                <p className="text-slate-400 text-sm font-medium flex items-center gap-2 text-center">
                  <Sparkles size={14} className="text-blue-400" />
                  Technical specifications are verified for accuracy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
