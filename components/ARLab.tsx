import React, { useState, useEffect } from 'react';
import { Box, Search, Loader2, Maximize, Sparkles, Info, ArrowRight, Download, Camera, Brain } from 'lucide-react';
import { generate3DConceptView } from '../services/geminiService';

interface ARLabProps {
  onComplete?: (xp: number) => void;
}

const ARLab: React.FC<ARLabProps> = ({ onComplete }) => {
  const [concept, setConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [apiKeyReady, setApiKeyReady] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const ready = await window.aistudio.hasSelectedApiKey();
        setApiKeyReady(ready);
      } else {
        setApiKeyReady(true); // Assume environment key is present if not in Studio wrapper
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setApiKeyReady(true);
    }
  };

  const handleVisualize = async () => {
    if (!concept.trim()) return;
    setLoading(true);
    try {
      const url = await generate3DConceptView(concept);
      setImageUrl(url);
      if (onComplete) onComplete(250);
    } catch (err: any) {
      if (err.message?.includes("entity was not found")) {
        setApiKeyReady(false);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
            <Box className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">AR Visual Lab</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Photorealistic Spatial Synthesis</p>
          </div>
        </div>
        {!apiKeyReady && (
          <button 
            onClick={handleOpenKeyDialog}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all"
          >
            Connect High-Quality AI Engine
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-1">Spatial Concept</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                <input 
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="e.g. Mitochondria Structure..."
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-800 text-sm"
                />
              </div>
            </div>

            <button 
              onClick={handleVisualize}
              disabled={loading || !concept}
              className="w-full py-5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-30"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
              {loading ? 'Synthesizing Space...' : 'Render 3D Visualization'}
            </button>
          </div>

          <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
            <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-indigo-900 leading-relaxed italic">
              "The AR Lab uses Spatial Synthesis to create photorealistic models for deep conceptual understanding."
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 min-h-[500px] flex items-center justify-center relative overflow-hidden shadow-inner group">
            {imageUrl ? (
              <div className="w-full h-full relative animate-in zoom-in-95 duration-700">
                <img src={imageUrl} alt={concept} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                  <button onClick={() => window.open(imageUrl, '_blank')} className="p-4 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform"><Maximize className="w-6 h-6 text-slate-900" /></button>
                  <a href={imageUrl} download={`${concept}_3D.png`} className="p-4 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform"><Download className="w-6 h-6 text-slate-900" /></a>
                </div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                   <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[10px] font-black uppercase tracking-widest text-white">Spatial Analysis Complete</span></div>
                   <h3 className="text-xl font-black text-white capitalize">{concept}</h3>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 opacity-30 select-none">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-50">
                  <Camera className="w-8 h-8 text-slate-200" />
                </div>
                <div>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Awaiting Spatial Coordinates</p>
                  <p className="text-slate-300 font-bold text-[9px] mt-2">Render high-quality 3D views of any scientific concept</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARLab;