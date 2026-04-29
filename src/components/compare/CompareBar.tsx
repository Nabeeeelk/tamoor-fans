'use client';

import React from 'react';
import { useCompare } from '@/lib/store/useCompare';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, Trash2, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const CompareBar = () => {
  const pathname = usePathname();
  const { products, removeProduct, clearCompare } = useCompare();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || products.length === 0 || pathname === '/compare') return null;

  return (
    <AnimatePresence>
      {/* 
        Centering is done with CSS (left-1/2 -translate-x-1/2) instead of
        Framer Motion x transforms, because Framer x values are pixels, not %.
      */}
      <motion.div
        key="compare-bar"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="fixed bottom-[88px] md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
      >
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-3 md:p-5 flex items-center gap-3 md:gap-6">
          {/* Header */}
          <div className="flex items-center gap-2 md:border-r border-white/10 md:pr-6 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <ArrowRightLeft size={16} />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-black text-xs">Compare</p>
              <p className="text-slate-400 text-[10px] font-bold">{products.length}/2</p>
            </div>
          </div>

          {/* Product Items */}
          <div className="flex flex-1 items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar py-1">
            {products.map((product) => (
              <div key={product.id} className="relative shrink-0">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 pr-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg overflow-hidden relative p-0.5 shrink-0">
                    <Image
                      src={product.image_url || '/placeholder-fan.png'}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white max-w-[55px] md:max-w-[100px] truncate">
                    {product.name}
                  </span>
                  {/* Larger tap target for mobile remove button */}
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors"
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {products.length < 2 && (
              <div className="hidden sm:flex flex-1 items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-2 text-slate-500 text-[10px] font-bold whitespace-nowrap">
                + Add one more
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-white/10 shrink-0">
            <button
              onClick={clearCompare}
              className="flex p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors"
              title="Clear All"
              aria-label="Clear comparison"
            >
              <Trash2 size={18} />
            </button>
            <Link
              href="/compare"
              className={`
                flex items-center justify-center gap-1.5 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-black text-xs md:text-sm transition-all whitespace-nowrap
                ${products.length >= 2
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none'}
              `}
            >
              Compare
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareBar;
