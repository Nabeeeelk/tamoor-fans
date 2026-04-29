"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../product/ProductCard";
import Image from "next/image";

interface FeaturedSeriesProps {
  products: any[];
}

const FeaturedSeries = ({ products }: FeaturedSeriesProps) => {
  const [activeSeries, setActiveSeries] = useState<"ecosmart" | "acdc">("ecosmart");

  const filteredProducts = products.filter((product) => {
    const name = product.name.toLowerCase();
    if (activeSeries === "ecosmart") {
      return name.includes("eco smart") || name.includes("ecosmart");
    } else {
      return name.includes("ac/dc") || name.includes("acdc") || name.includes("inverter");
    }
  });

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container-custom">
        <div className="flex flex-col items-center mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-slate-500 text-lg">
              Explore our premium range of high-efficiency fans
            </p>
          </div>

          {/* Toggle Button */}
          <div className="relative flex p-1 bg-slate-200/50 rounded-2xl mb-12 w-full max-w-[400px]">
            <motion.div
              className="absolute inset-y-1 bg-white rounded-xl shadow-md z-0"
              initial={false}
              animate={{
                left: activeSeries === "ecosmart" ? "4px" : "50%",
                width: "calc(50% - 4px)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button
              onClick={() => setActiveSeries("ecosmart")}
              className={`flex-1 py-3 px-6 rounded-xl relative z-10 font-bold transition-colors ${
                activeSeries === "ecosmart" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Eco Smart Series
            </button>
            <button
              onClick={() => setActiveSeries("acdc")}
              className={`flex-1 py-3 px-6 rounded-xl relative z-10 font-bold transition-colors ${
                activeSeries === "acdc" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              AC/DC Series
            </button>
          </div>

          {/* Series Features Image */}
          <div className="w-full max-w-5xl mb-16 overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm p-2 md:p-4 shadow-sm border border-slate-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSeries}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center items-center"
              >
                <img
                  src={activeSeries === "ecosmart" ? "/images/features/ecosmart-features.jpg" : "/images/features/acdc-features.jpg"}
                  alt={`${activeSeries} features`}
                  className="max-w-full h-auto max-h-[120px] object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <p className="text-slate-400 font-medium">No products found in this series.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSeries;
