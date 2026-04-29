import { createClient } from "@/lib/supabase/server";
import { 
  Search, 
  Star, 
  Trash2, 
  MessageSquare,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      *,
      products (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-rose-500 font-bold">Error loading reviews: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Reviews</h1>
          <p className="text-slate-500 font-medium">Customer feedback & testimonials ({reviews?.length || 0} reviews)</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search reviews..." 
            className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-5">Product</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Rating</th>
                <th className="px-6 py-5">Review</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-800">{review.products?.name || 'Unknown Product'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{review.customer_name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{review.comment}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        review.is_approved ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {review.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-emerald-600 transition-all">
                          <CheckCircle2 size={18} />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-rose-600 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <MessageSquare size={32} />
                      <p className="font-bold">No reviews found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
