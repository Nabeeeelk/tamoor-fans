import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch category details
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    notFound();
  }

  // Fetch products for this category
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const formattedProducts = (products || []).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    compare_at_price: p.original_price,
    image_url: p.image_url,
    category: p.categories?.name || category.name,
    is_new: p.is_new_arrival,
    is_bestseller: p.price < 10000,
    wattage: p.wattage
  }));

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-6">
            <ArrowLeft size={16} />
            Back to All Products
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                {category.name}
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl">
                {category.description || `Browse our exclusive collection of ${category.name}. Engineered for maximum air delivery and energy efficiency.`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-400">
                {products?.length || 0} Products Found
              </span>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={18} />
                Sort & Filter
              </button>
            </div>
          </div>
        </div>

        {formattedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {formattedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter size={32} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No products in this category</h3>
            <p className="text-slate-500 mb-8">We're currently updating our inventory. Please check back soon!</p>
            <Link href="/products" className="inline-flex px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform active:scale-95">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
