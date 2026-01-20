
import React from 'react';
import { 
  BookOpen, 
  Briefcase, 
  ClipboardCheck, 
  Mic, 
  PenTool, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  Star, 
  ChevronRight, 
  Brain, 
  Layers, 
  Gamepad2, 
  Network,
  Skull,
  AlertTriangle
} from 'lucide-react';
import { ToolType, User } from '../types';

interface DashboardProps {
  onSelectTool: (tool: ToolType) => void;
  user: User | null;
  onCrash?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool, user, onCrash }) => {
  const userName = user?.name || 'Explorer';
  const xp = user?.xp || 0;
  const streak = user?.streak || 0;
  const history = user?.cognitiveShifts || [];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Hi, {userName.split(' ')[0]}
          </h1>
          <p className="text-slate-500 font-bold text-lg md:text-xl">Your intelligence platform is optimized.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white text-amber-600 px-6 py-4 rounded-[1.5rem] font-black border border-slate-200 shadow-xl">
            <Star className="w-6 h-6 fill-amber-500" />
            <span className="text-lg">{xp} XP</span>
          </div>
          <div className="flex items-center gap-3 bg-white text-indigo-600 px-6 py-4 rounded-[1.5rem] font-black border border-slate-200 shadow-xl">
            <TrendingUp className="w-6 h-6" />
            <span className="text-lg">{streak} Day Streak</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <div>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4 px-2">
            <Zap className="w-4 h-4 text-indigo-600" />
            Intelligence Core Launchpad
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard icon={<BookOpen className="w-7 h-7" />} title="Textbook AI" desc="Deep Extraction" onClick={() => onSelectTool(ToolType.TEXTBOOK)} accentColor="bg-blue-600" />
            <ToolCard icon={<Mic className="w-7 h-7" />} title="Live Tutor" desc="Audio Mentoring" onClick={() => onSelectTool(ToolType.TUTOR)} accentColor="bg-orange-500" />
            <ToolCard icon={<Network className="w-7 h-7" />} title="MindMap Neural" desc="Semantic Maps" onClick={() => onSelectTool(ToolType.MINDMAP)} accentColor="bg-indigo-500" />
            <ToolCard icon={<Gamepad2 className="w-7 h-7" />} title="Kids Logic" desc="Neural Growth" onClick={() => onSelectTool(ToolType.KIDS)} accentColor="bg-pink-600" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white rounded-[3rem] border border-slate-200 shadow-xl p-10">
             <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mb-8">Recent Activity</h3>
             <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="py-12 text-center opacity-30 italic font-medium">No recent cognitive shifts recorded.</div>
                ) : (
                  history.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">{getIcon(item.type)}</div>
                        <div>
                          <span className="text-slate-900 font-bold text-sm block">{item.label}</span>
                          <span className="text-slate-400 font-bold text-[10px] uppercase">{item.date}</span>
                        </div>
                      </div>
                      <span className="text-indigo-600 font-black text-[10px] uppercase">{item.xp}</span>
                    </div>
                  ))
                )}
             </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] shadow-xl space-y-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-red-900 mb-2">Emergency Core</h4>
                <p className="text-red-700 text-xs font-bold">WARNING: This operation simulates a total system failure and kernel panic.</p>
              </div>
              <button 
                onClick={onCrash}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-red-200"
              >
                <Skull className="w-5 h-5" /> CRASH SYSTEM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getIcon = (type: ToolType) => {
  switch (type) {
    case ToolType.TEXTBOOK: return <BookOpen className="w-4 h-4" />;
    case ToolType.KIDS: return <Gamepad2 className="w-4 h-4" />;
    case ToolType.MINDMAP: return <Network className="w-4 h-4" />;
    default: return <Brain className="w-4 h-4" />;
  }
}

const ToolCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, onClick: () => void, accentColor: string }> = ({ icon, title, desc, onClick, accentColor }) => (
  <button onClick={onClick} className="group p-8 bg-white rounded-[2.5rem] border border-slate-200 hover:border-indigo-600/30 transition-all text-left flex flex-col justify-between h-64 shadow-xl shadow-slate-200/50 hover:-translate-y-1 active:scale-[0.98]">
    <div className={`w-16 h-16 rounded-2xl ${accentColor} text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-lg group-hover:rotate-6`}>{icon}</div>
    <div>
      <h3 className="font-black text-slate-900 text-xl tracking-tight mb-1">{title}</h3>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{desc}</p>
    </div>
  </button>
);

export default Dashboard;
