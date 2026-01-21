
import React, { useState } from 'react';
import { Sparkles, Search, Loader2, BookOpen, Clock, CheckCircle2, Trophy, ArrowRight, Brain, Layers, Star } from 'lucide-react';
import { generateCuratedPath } from '../services/geminiService';
import { CuratedPath } from '../types';

interface CuratorProps {
  onComplete?: (xp: number) => void;
}

const Curator: React.FC<CuratorProps> = ({ onComplete }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<CuratedPath | null>(null);

  const handleCuration = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await generateCuratedPath(topic);
      setPath(result);
      if (onComplete) onComplete(200);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex items-center gap-4"><div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-50 shadow-xl"><Sparkles className="w-7 h-7" /></div><div><h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Curator</h1><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Neural Synthesis & Mastery Roadmapping</p></div></div>
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
        <div className="space-y-4"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-1">Knowledge Target</label><div className="relative"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" /><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Advanced Quantum Mechanics..." className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-amber-500 outline-none transition-all font-black text-slate-800" /></div></div>
        <button onClick={handleCuration} disabled={loading || !topic} className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-30 active:scale-[0.98]">{loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Synthesizing Curriculum...</> : <><Sparkles className="w-5 h-5 text-amber-400" /> Build Mastery Roadmap</>}</button>
      </div>
      {path && (
        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden"><div className="relative z-10 max-w-2xl space-y-4"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /><span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Curated Intelligence</span></div><h2 className="text-4xl font-black tracking-tight leading-tight">{path.topic}</h2><p className="text-slate-400 font-bold text-lg leading-relaxed">{path.description}</p></div></div>
          {path.modules.map((module, i) => (
            <div key={i} className="flex flex-col lg:flex-row gap-10 relative">
              <div className="hidden lg:flex shrink-0 w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl items-center justify-center text-slate-900 font-black text-xl z-10 shadow-sm">{i + 1}</div>
              <div className="flex-1 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl hover:border-amber-200 transition-all group">
                 <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8"><div><h3 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">{module.title}</h3><p className="text-slate-500 font-bold leading-relaxed">{module.synthesis}</p></div><div className="shrink-0 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Clock className="w-3 h-3" /> {module.duration}</div></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Curator;
