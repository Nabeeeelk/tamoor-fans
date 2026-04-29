import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from "next/navigation";
import { use } from "react";

export default async function EditProductPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const supabase = await createClient();

  // Fetch product data with images and category
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (*)
    `)
    .eq('id', params.id)
    .single();

  if (!product || error) {
    // If not found by ID, try by slug just in case
    const { data: bySlug } = await supabase
      .from('products')
      .select(`
        *,
        product_images (*)
      `)
      .eq('slug', params.id)
      .single();
    
    if (!bySlug) notFound();
    return <EditProductPageContent product={bySlug} supabase={supabase} />;
  }

  return <EditProductPageContent product={product} supabase={supabase} />;
}

async function EditProductPageContent({ product, supabase }: { product: any, supabase: any }) {
  // Fetch categories for the form dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products"
          className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-800 transition-all shadow-none hover:shadow-sm"
        >
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-800">Edit Product</h1>
          <p className="text-slate-500 font-medium">Updating details for {product.name}</p>
        </div>
      </div>

      <ProductForm initialData={product} categories={categories || []} />
    </div>
  );
}
