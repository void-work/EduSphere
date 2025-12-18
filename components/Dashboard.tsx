
import React, { useState, useEffect } from 'react';
import { BookOpen, Briefcase, ClipboardCheck, Mic, PenTool, Zap, Gamepad2, Sparkles, TrendingUp, Clock, RefreshCw, Star, ChevronRight, Brain, Layers, Network } from 'lucide-react';
import { ToolType } from '../types';
import { generateAdImage } from '../services/geminiService';

interface DashboardProps {
  onSelectTool: (tool: ToolType) => void;
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool, userName }) => {
  const [adImage, setAdImage] = useState<string | null>(null);
  const [adLoading, setAdLoading] = useState(false);

  const loadAd = async () => {
    setAdLoading(true);
    try {
      const url = await generateAdImage("Premium AI Tutoring & Advanced Quantum Theory Course");
      setAdImage(url);
    } catch (err) {
      console.error("Ad generation failed", err);
    } finally {
      setAdLoading(false);
    }
  };

  useEffect(() => {
    loadAd();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Hi, {userName.split(' ')[0]}
          </h1>
          <p className="text-slate-500 font-bold text-xl">Your intelligence platform is optimized.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white text-amber-600 px-6 py-4 rounded-[1.5rem] font-black border border-slate-200 shadow-xl cursor-default transition-all hover:scale-105">
            <Star className="w-6 h-6 fill-amber-500" />
            <span className="text-lg">2,450 XP</span>
          </div>
          <div className="flex items-center gap-3 bg-white text-indigo-600 px-6 py-4 rounded-[1.5rem] font-black border border-slate-200 shadow-xl cursor-default">
            <TrendingUp className="w-6 h-6" />
            <span className="text-lg">7 Day Streak</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4 px-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              Intelligence Core Launchpad
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ToolCard 
                icon={<BookOpen className="w-7 h-7" />}
                title="Textbook AI"
                desc="Deep Extraction"
                onClick={() => onSelectTool(ToolType.TEXTBOOK)}
                accentColor="bg-blue-600"
              />
              <ToolCard 
                icon={<Network className="w-7 h-7" />}
                title="MindMap"
                desc="Semantic Mapping"
                onClick={() => onSelectTool(ToolType.MINDMAP)}
                accentColor="bg-indigo-600"
              />
              <ToolCard 
                icon={<Layers className="w-7 h-7" />}
                title="Infographic Pro"
                desc="Neural Visualization"
                onClick={() => onSelectTool(ToolType.INFOGRAPHIC)}
                accentColor="bg-emerald-600"
              />
              <ToolCard 
                icon={<Mic className="w-7 h-7" />}
                title="Live Tutor"
                desc="Audio Mentoring"
                onClick={() => onSelectTool(ToolType.TUTOR)}
                accentColor="bg-orange-500"
              />
              <ToolCard 
                icon={<ClipboardCheck className="w-7 h-7" />}
                title="Exam Sim"
                desc="Atomic Testing"
                onClick={() => onSelectTool(ToolType.EXAM)}
                accentColor="bg-indigo-600"
              />
              <ToolCard 
                icon={<Briefcase className="w-7 h-7" />}
                title="Skill Bridge"
                desc="Career Mapping"
                onClick={() => onSelectTool(ToolType.CAREER)}
                accentColor="bg-emerald-500"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Brain className="w-32 h-32" />
             </div>
             <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mb-8">Recent Cognitive Shifts</h3>
             <div className="space-y-6 relative z-10">
                {[
                  { label: "Molecular Biology Quiz", xp: "+50 XP", date: "2h ago" },
                  { label: "Roman History Mind Map", xp: "+180 XP", date: "Just now" },
                  { label: "Infographic Generation", xp: "Completed", date: "1h ago" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all cursor-default group">
                    <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                      <span className="text-slate-900 font-bold text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">{item.xp}</span>
                      <span className="text-slate-400 font-bold text-[10px] uppercase">{item.date}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden relative group transition-all hover:-translate-y-2 border border-slate-100">
            <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden flex items-center justify-center">
              {adLoading ? (
                <div className="flex flex-col items-center gap-6 text-slate-300">
                  <RefreshCw className="w-12 h-12 animate-spin text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Render Active</span>
                </div>
              ) : adImage ? (
                <>
                  <img 
                    src={adImage} 
                    alt="Premium Course Promo" 
                    className="w-full h-full object-cover brightness-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10 text-slate-900">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Exclusive Access</span>
                    </div>
                    <h3 className="text-4xl font-black leading-none tracking-tighter">Premium Cognition</h3>
                  </div>
                </>
              ) : (
                <div className="text-slate-100 font-black italic tracking-tighter text-4xl uppercase">Intelligence Engine</div>
              )}
            </div>

            <div className="p-10 bg-white">
              <button 
                onClick={() => window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank')}
                className="w-full py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all hover:bg-indigo-700 flex items-center justify-center gap-4 shadow-xl shadow-indigo-100 mb-8"
              >
                Expand Your Mind <Sparkles className="w-5 h-5 text-amber-400" />
              </button>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed font-bold">
                Unlock specialized neural tracks curated for world-class industry standards.
              </p>
              <button 
                onClick={loadAd}
                className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.5em] transition-colors"
              >
                Refresh Neural Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, onClick: () => void, accentColor: string }> = ({ icon, title, desc, onClick, accentColor }) => (
  <button 
    onClick={onClick}
    className="group relative h-64 p-8 bg-white rounded-[2.5rem] border border-slate-200 hover:border-indigo-600/30 transition-all text-left flex flex-col items-start justify-between shadow-xl shadow-slate-200/50 overflow-hidden hover:-translate-y-1"
  >
    <div className={`w-16 h-16 rounded-2xl ${accentColor} text-white flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:rotate-6`}>
      {icon}
    </div>
    <div>
      <h3 className="font-black text-slate-900 text-xl tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
        {desc}
      </p>
    </div>
    <div className="absolute bottom-8 right-8">
       <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 border border-slate-200">
          <ChevronRight className="w-5 h-5 text-indigo-600" />
       </div>
    </div>
  </button>
);

export default Dashboard;
