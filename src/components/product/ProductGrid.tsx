"use client";

import React from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

const ProductGrid = ({ products, title, subtitle, viewAllLink }: ProductGridProps) => {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        {(title || subtitle) && (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              {subtitle && (
                <span className="text-brand-primary font-bold tracking-widest uppercase text-sm">
                  {subtitle}
                </span>
              )}
              {title && <h2>{title}</h2>}
            </div>
            {viewAllLink && (
              <a
                href={viewAllLink}
                className="text-brand-primary font-bold flex items-center gap-2 group transition-all"
              >
                View All Collection
                <div className="w-8 h-[2px] bg-brand-primary scale-x-50 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-medium">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
