import { createClient } from "@/lib/supabase/server";
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  ExternalLink,
  Pencil,
  Eye
} from 'lucide-react';
import Image from 'next/image';

export default async function AdminBannersPage() {
  const supabase = await createClient();

  const { data: banners, error } = await supabase
    .from('banners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-rose-500 font-bold">Error loading banners: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Banners</h1>
          <p className="text-slate-500 font-medium">Manage homepage carousel and promotional banners ({banners?.length || 0} banners)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]">
            <Plus size={18} />
            Add New Banner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners && banners.length > 0 ? (
          banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative aspect-[21/9] bg-slate-100">
                <Image 
                  src={banner.image_url} 
                  alt={banner.title || 'Banner'} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                    banner.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                  }`}>
                    {banner.is_active ? 'Live' : 'Hidden'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 mb-1">{banner.title || 'Untitled Banner'}</h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-1">{banner.subtitle || 'No subtitle'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all border border-transparent hover:border-slate-200">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-all border border-transparent hover:border-slate-200">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <ExternalLink size={14} />
                    {banner.link_url || 'No link'}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    Added {new Date(banner.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
              <ImageIcon size={48} />
              <p className="text-lg font-black">No banners created yet</p>
              <button className="text-blue-600 font-bold hover:underline">Click to create your first banner</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
