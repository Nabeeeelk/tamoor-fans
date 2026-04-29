import { createClient } from "@/lib/supabase/server";
import { 
  Search, 
  Mail, 
  Trash2, 
  MessageSquare,
  MoreHorizontal,
  Reply,
  Calendar
} from 'lucide-react';

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-rose-500 font-bold">Error loading messages: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Inquiry Messages</h1>
          <p className="text-slate-500 font-medium">Direct inquiries from the contact form ({messages?.length || 0} messages)</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-5">Sender</th>
                <th className="px-6 py-5">Subject</th>
                <th className="px-6 py-5">Message Snippet</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages && messages.length > 0 ? (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">{msg.name}</span>
                        <span className="text-xs text-slate-400 font-medium">{msg.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">{msg.subject || 'No Subject'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500 line-clamp-1 max-w-xs">{msg.message}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-blue-600 transition-all">
                          <Reply size={18} />
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
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Mail size={32} />
                      <p className="font-bold">No messages yet</p>
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
