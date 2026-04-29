'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from "@/lib/supabase/client";
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Loader2,
  Info,
  Type,
  Tag,
  Box
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category_id: z.string().uuid('Please select a category'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  original_price: z.coerce.number().optional().nullable(),
  short_description: z.string().optional().nullable(),
  full_description: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock_quantity: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  wattage: z.coerce.number().optional().nullable(),
  blade_size: z.string().optional().nullable(),
  rpm: z.string().optional().nullable(),
  airflow: z.string().optional().nullable(),
  noise_level: z.string().optional().nullable(),
  warranty_years: z.coerce.number().default(2),
  colors_available: z.array(z.string()).default([]),
  sizes_available: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  categories: any[];
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>(initialData?.product_images || []);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      category_id: initialData?.category_id || '',
      price: initialData?.price || 0,
      original_price: initialData?.original_price || 0,
      short_description: initialData?.short_description || '',
      full_description: initialData?.full_description || '',
      sku: initialData?.sku || '',
      stock_quantity: initialData?.stock_quantity || 0,
      is_active: initialData?.is_active ?? true,
      is_featured: initialData?.is_featured || false,
      is_new_arrival: initialData?.is_new_arrival || false,
      wattage: initialData?.wattage || 30,
      blade_size: initialData?.blade_size || '',
      rpm: initialData?.rpm || '',
      airflow: initialData?.airflow || '',
      noise_level: initialData?.noise_level || '',
      warranty_years: initialData?.warranty_years || 2,
      colors_available: initialData?.colors_available || [],
      sizes_available: initialData?.sizes_available || [],
    }
  });

  const colors = watch('colors_available') || [];
  const sizes = watch('sizes_available') || [];

  const addColor = () => {
    if (newColor && colors && !colors.includes(newColor)) {
      setValue('colors_available', [...colors, newColor]);
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    if (colors) {
      setValue('colors_available', colors.filter(c => c !== color));
    }
  };

  const addSize = () => {
    if (newSize && sizes && !sizes.includes(newSize)) {
      setValue('sizes_available', [...sizes, newSize]);
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    if (sizes) {
      setValue('sizes_available', sizes.filter(s => s !== size));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // This would normally upload to Supabase storage
    // For now, let's just add a placeholder URL or prompt for one
    const url = prompt('Enter Image URL:');
    if (url) {
      setImages([...images, { image_url: url, is_primary: images.length === 0, color: null }]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImageColor = (index: number, color: string | null) => {
    const newImages = [...images];
    newImages[index].color = color === 'none' ? null : color;
    setImages(newImages);
  };

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    try {
      let productId = initialData?.id;

      const productData = {
        ...values,
        updated_at: new Date().toISOString(),
        image_url: images.find(img => img.is_primary)?.image_url || images[0]?.image_url || ''
      };

      if (productId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
        if (error) throw error;
        productId = data.id;
      }

      // Sync Images
      // First delete old images if editing
      if (initialData?.id) {
        await supabase.from('product_images').delete().eq('product_id', productId);
      }

      const imagesToInsert = images.map((img, i) => ({
        product_id: productId,
        image_url: img.image_url,
        is_primary: img.is_primary,
        display_order: i,
        color: img.color
      }));

      if (imagesToInsert.length > 0) {
        const { error: imgError } = await supabase.from('product_images').insert(imagesToInsert);
        if (imgError) throw imgError;
      }

      toast.success(initialData ? 'Product updated!' : 'Product created!');
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Type className="text-blue-500" size={20} />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Product Name</label>
                <input 
                  {...register('name')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                  placeholder="e.g. Royal Deluxe Ceiling Fan"
                />
                {errors.name && <p className="text-rose-500 text-[10px] font-bold">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Slug (URL)</label>
                <input 
                  {...register('slug')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                  placeholder="royal-deluxe-ceiling-fan"
                />
                {errors.slug && <p className="text-rose-500 text-[10px] font-bold">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Short Description</label>
              <textarea 
                {...register('short_description')}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                placeholder="A brief overview of the product..."
              />
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Tag className="text-blue-500" size={20} />
              Variants & Selection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colors */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Available Colors</label>
                <div className="flex gap-2">
                  <input 
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="Add color (e.g. White)"
                  />
                  <button 
                    type="button"
                    onClick={addColor}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <span key={color} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                      {color}
                      <button onClick={() => removeColor(color)} type="button" className="hover:text-rose-500">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Available Sizes</label>
                <div className="flex gap-2">
                  <input 
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder='Add size (e.g. 56")'
                  />
                  <button 
                    type="button"
                    onClick={addSize}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <span key={size} className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                      {size}
                      <button onClick={() => removeSize(size)} type="button" className="hover:text-rose-500">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <ImageIcon className="text-blue-500" size={20} />
              Product Media
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
                  <Image src={img.image_url} alt="Product" fill className="object-contain p-4" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <button 
                      type="button" 
                      onClick={() => removeImage(i)}
                      className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <select 
                      value={img.color || 'none'}
                      onChange={(e) => updateImageColor(i, e.target.value)}
                      className="w-full text-[10px] font-black uppercase bg-white rounded-md px-1 py-1"
                    >
                      <option value="none">No Color Tag</option>
                      {colors.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {img.is_primary && <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Primary</span>}
                  </div>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => handleImageUpload(null as any)}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
              >
                <Plus size={24} />
                <span className="text-xs font-bold">Add Image</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Box className="text-blue-500" size={20} />
              Pricing & Status
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Regular Price (PKR)</label>
                <input 
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-lg font-black text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Original Price (Discounted From)</label>
                <input 
                  type="number"
                  {...register('original_price', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
                <select 
                  {...register('category_id')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-rose-500 text-[10px] font-bold">{errors.category_id.message}</p>}
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('is_active')} className="w-5 h-5 rounded-lg accent-blue-600" />
                  <span className="text-sm font-black text-slate-700 uppercase tracking-widest">Active Status</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('is_featured')} className="w-5 h-5 rounded-lg accent-blue-600" />
                  <span className="text-sm font-black text-slate-700 uppercase tracking-widest">Featured Product</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('is_new_arrival')} className="w-5 h-5 rounded-lg accent-blue-600" />
                  <span className="text-sm font-black text-slate-700 uppercase tracking-widest">New Arrival</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky top-6 space-y-3">
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {initialData ? 'Update Product' : 'Create Product'}
            </button>
            <button 
              type="button"
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              <X size={20} />
              Cancel Changes
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
