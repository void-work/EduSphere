
import React, { useState } from 'react';
import { Layers, Search, ImageIcon, Loader2, Download, ExternalLink, Sparkles, Info, ArrowRight } from 'lucide-react';
import { generateInfographic } from '../services/geminiService';

interface InfographicCreatorProps {
  onComplete?: (xp: number) => void;
}

const InfographicCreator: React.FC<InfographicCreatorProps> = ({ onComplete }) => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const url = await generateInfographic(topic, content);
      setImageUrl(url);
      if (onComplete) onComplete(300);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-4"><div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 border border-slate-100 shadow-xl"><Layers className="w-7 h-7" /></div><div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Infographic Pro</h1><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Neural Synthesis & Visual Explanation</p></div></div>
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
        <div className="space-y-4"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Concept Topic</label><div className="relative"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" /><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Supply Chain Process..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-800" /></div></div>
        <div className="space-y-4"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Data & Narrative</label><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste data for synthesis..." className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:border-slate-900 outline-none resize-none font-medium text-slate-700 leading-relaxed" /></div>
        <button onClick={handleGenerate} disabled={loading || !topic || !content} className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-30 active:scale-[0.98]">{loading ? <div className="flex items-center gap-3"><Loader2 className="w-5 h-5 animate-spin" /> Synthesizing...</div> : <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-emerald-400" /> Generate Professional Infographic</div>}</button>
      </div>
      {imageUrl && (
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[3.5rem] border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden"><div className="relative group rounded-[2.5rem] overflow-hidden aspect-[4/3] bg-slate-50 flex items-center justify-center border border-slate-100"><img src={imageUrl} alt={topic} className="w-full h-full object-contain" /></div><div className="mt-8 flex items-start gap-6 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100"><div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><Info className="w-6 h-6 text-emerald-600" /></div><div><h3 className="text-xl font-black text-slate-900 capitalize tracking-tight">{topic}</h3><p className="text-slate-500 text-xs font-bold italic">Neural synthesis complete. Verification status: Mastered.</p></div></div></div>
      )}
    </div>
  );
};

export default InfographicCreator;
