import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewProductPage() {
  const supabase = await createClient();

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
          <h1 className="text-3xl font-black text-slate-800">Add New Product</h1>
          <p className="text-slate-500 font-medium">Create a new item for your storefront</p>
        </div>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  );
}
