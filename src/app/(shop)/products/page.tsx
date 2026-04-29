import React from "react";
import { createClient } from "@/lib/supabase/server";
import ProductsFilterWrapper from "@/components/product/ProductsFilterWrapper";

export const metadata = {
  title: "Products | Taimoor Fans",
  description: "Browse our complete collection of high-quality ceiling, pedestal, and exhaust fans.",
};

export default async function ProductsPage() {
  const supabase = await createClient();
  
  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name), product_images(image_url, color)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Fetch unique categories for the filter
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('name')
    .order('name');

  const formattedProducts = (products || []).map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compare_at_price: p.original_price,
    image_url: p.image_url,
    category: p.categories?.name || 'Uncategorized',
    is_new: p.is_new_arrival,
    is_bestseller: p.price < 10000,
    wattage: p.wattage,
    colors_available: p.colors_available,
    product_images: p.product_images
  }));

  const categories = categoriesData ? categoriesData.map(c => c.name) : [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <ProductsFilterWrapper 
        initialProducts={formattedProducts} 
        categories={categories} 
      />
    </div>
  );
}
