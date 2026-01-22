import React, { useState } from 'react';
import { ScanSearch, Loader2, ShieldCheck, AlertTriangle, Sparkles, FileText, Info } from 'lucide-react';
import { analyzeTextIntegrity, IntegrityReport } from '../services/geminiService';

interface AIDetectorProps {
  onComplete?: (xp: number) => void;
}

const AIDetector: React.FC<AIDetectorProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<IntegrityReport | null>(null);

  const handleScan = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeTextIntegrity(text);
      setReport(result);
      if (onComplete) onComplete(50);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl border border-indigo-50">
          <ScanSearch className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Integrity Scan</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Linguistic Analysis & Style Verification</p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-8">
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Content for Analysis</label>
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text or essay for style and integrity verification..." 
            className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:border-indigo-500 outline-none resize-none font-medium text-slate-700 leading-relaxed transition-all"
          />
        </div>
        <button 
          onClick={handleScan}
          disabled={loading || !text}
          className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-30"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-indigo-400" />}
          {loading ? 'Performing Linguistic Deep Scan...' : 'Verify Academic Integrity'}
        </button>
      </div>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="md:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 ${report.aiScore > 70 ? 'border-red-100 text-red-500' : report.aiScore > 30 ? 'border-amber-100 text-amber-500' : 'border-emerald-100 text-emerald-500'}`}>
              <span className="text-3xl font-black">{report.aiScore}%</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">AI Probability</p>
            <h3 className="text-lg font-black text-slate-900">
              {report.aiScore > 70 ? 'High AI Content' : report.aiScore > 30 ? 'Moderate Mix' : 'Likely Human'}
            </h3>
          </div>

          <div className="md:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Style Breakdown</h4>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{report.explanation}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.detectedPatterns.map((pattern, i) => (
                <div key={i} className="px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">{pattern}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDetector;