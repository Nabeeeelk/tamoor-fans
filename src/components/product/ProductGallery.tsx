'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
  images: { url: string; alt: string }[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Maximize Button */}
        <button className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white">
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                activeIndex === i ? 'border-blue-600 shadow-lg shadow-blue-500/10' : 'border-transparent bg-white hover:border-slate-200'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
