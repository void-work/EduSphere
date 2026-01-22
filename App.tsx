import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Briefcase, 
  ClipboardCheck, 
  Mic, 
  PenTool, 
  Zap, 
  Brain, 
  Layers, 
  LogOut,
  Sparkles,
  Network,
  Menu,
  X,
  User as UserIcon,
  Gamepad2,
  ScanSearch,
  Box
} from 'lucide-react';
import { ToolType, User, CognitiveShift } from './types';
import TextbookCompanion from './components/TextbookCompanion';
import SkillBridge from './components/SkillBridge';
import ExamSimulator from './components/ExamSimulator';
import VoiceTutor from './components/VoiceTutor';
import VisualConceptBuilder from './components/VisualConceptBuilder';
import KidsCoach from './components/KidsCoach';
import Notetaker from './components/Notetaker';
import Dashboard from './components/Dashboard';
import InfographicCreator from './components/InfographicCreator';
import Curator from './components/Curator';
import MindMapCreator from './components/MindMapCreator';
import AIDetector from './components/AIDetector';
import ARLab from './components/ARLab';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('edu_user');
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      if (parsedUser.isLoggedIn) {
        setUser(parsedUser);
      }
    }
  }, []);

  const updateStats = useCallback((xpGain: number, activityLabel: string, tool: ToolType) => {
    setUser(prev => {
      if (!prev) return null;
      
      const newShift: CognitiveShift = {
        label: activityLabel,
        xp: `+${xpGain} XP`,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: tool
      };
      
      const updatedUser = {
        ...prev,
        xp: prev.xp + xpGain,
        cognitiveShifts: [newShift, ...prev.cognitiveShifts].slice(0, 10)
      };
      
      localStorage.setItem('edu_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const surname = formData.get('surname') as string;
    const email = formData.get('email') as string;
    
    const fullName = `${firstName} ${surname}`.trim() || 'Alex Learner';
    
    const newUser: User = { 
      id: Date.now().toString(), 
      name: fullName, 
      email: email || 'user@edusphere.ai', 
      isLoggedIn: true,
      xp: 0,
      streak: 1,
      lastActive: new Date().toISOString(),
      cognitiveShifts: []
    };
    
    setUser(newUser);
    localStorage.setItem('edu_user', JSON.stringify(newUser));
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    if (user) {
      const loggedOutUser = { ...user, isLoggedIn: false };
      localStorage.setItem('edu_user', JSON.stringify(loggedOutUser));
    }
    setUser(null);
    setActiveTool(ToolType.DASHBOARD);
    setIsMobileMenuOpen(false);
  };

  const selectTool = (tool: ToolType) => {
    setActiveTool(tool);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTool = () => {
    if (!user && activeTool !== ToolType.DASHBOARD) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-200">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-slate-900">Identification Required</h2>
          <p className="text-slate-500 max-w-xs mb-8 font-bold leading-relaxed">Please sign in to access your personalized AI tutoring environment.</p>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl"
          >
            Sign In Now
          </button>
        </div>
      );
    }

    switch (activeTool) {
      case ToolType.TEXTBOOK: return <TextbookCompanion onComplete={(xp) => updateStats(xp, "Textbook Synthesis", ToolType.TEXTBOOK)} />;
      case ToolType.CAREER: return <SkillBridge />;
      case ToolType.EXAM: return <ExamSimulator onComplete={(xp, topic) => updateStats(xp, `${topic} Assessment`, ToolType.EXAM)} />;
      case ToolType.TUTOR: return <VoiceTutor />;
      case ToolType.VISUAL: return <VisualConceptBuilder />;
      case ToolType.KIDS: return <KidsCoach onXpGain={(xp) => updateStats(xp, "Logic Mission", ToolType.KIDS)} />;
      case ToolType.NOTES: return <Notetaker onEnhance={(xp) => updateStats(xp, "Note Enhancement", ToolType.NOTES)} />;
      case ToolType.INFOGRAPHIC: return <InfographicCreator onComplete={(xp) => updateStats(xp, "Infographic Generation", ToolType.INFOGRAPHIC)} />;
      case ToolType.CURATOR: return <Curator onComplete={(xp) => updateStats(xp, "Curriculum Mapping", ToolType.CURATOR)} />;
      case ToolType.MINDMAP: return <MindMapCreator />;
      case ToolType.DETECTOR: return <AIDetector onComplete={(xp) => updateStats(xp, "Integrity Scan", ToolType.DETECTOR)} />;
      case ToolType.AR_LAB: return <ARLab onComplete={(xp) => updateStats(xp, "Spatial Visualization", ToolType.AR_LAB)} />;
      default: return <Dashboard onSelectTool={selectTool} user={user} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-900 bg-transparent">
      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between p-5 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-3" onClick={() => setActiveTool(ToolType.DASHBOARD)}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Brain className="w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tighter">EduSphere</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 glass border-r border-slate-200 p-8 flex flex-col z-50 transition-transform duration-300
        md:translate-x-0 md:static md:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl text-white">
            <Brain className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black tracking-tighter">EduSphere</span>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
          <NavItem icon={<Sparkles className="w-4 h-4" />} label="Dashboard" active={activeTool === ToolType.DASHBOARD} onClick={() => selectTool(ToolType.DASHBOARD)} />
          <div className="mt-8 mb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Core Modules</div>
          <NavItem icon={<BookOpen className="w-4 h-4" />} label="Textbook AI" active={activeTool === ToolType.TEXTBOOK} onClick={() => selectTool(ToolType.TEXTBOOK)} />
          <NavItem icon={<Sparkles className="w-4 h-4" />} label="AI Curator" active={activeTool === ToolType.CURATOR} onClick={() => selectTool(ToolType.CURATOR)} />
          <NavItem icon={<Network className="w-4 h-4" />} label="Neural Map" active={activeTool === ToolType.MINDMAP} onClick={() => selectTool(ToolType.MINDMAP)} />
          <NavItem icon={<ScanSearch className="w-4 h-4" />} label="AI Detector" active={activeTool === ToolType.DETECTOR} onClick={() => selectTool(ToolType.DETECTOR)} />
          <div className="mt-8 mb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Visualization</div>
          <NavItem icon={<Layers className="w-4 h-4" />} label="Infographic Pro" active={activeTool === ToolType.INFOGRAPHIC} onClick={() => selectTool(ToolType.INFOGRAPHIC)} />
          <NavItem icon={<Box className="w-4 h-4" />} label="AR Lab" active={activeTool === ToolType.AR_LAB} onClick={() => selectTool(ToolType.AR_LAB)} />
          <NavItem icon={<Zap className="w-4 h-4" />} label="Visual Concepts" active={activeTool === ToolType.VISUAL} onClick={() => selectTool(ToolType.VISUAL)} />
          <div className="mt-8 mb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Assessment</div>
          <NavItem icon={<ClipboardCheck className="w-4 h-4" />} label="Exam Sim" active={activeTool === ToolType.EXAM} onClick={() => selectTool(ToolType.EXAM)} />
          <NavItem icon={<PenTool className="w-4 h-4" />} label="Smart Notes" active={activeTool === ToolType.NOTES} onClick={() => selectTool(ToolType.NOTES)} />
          <div className="mt-8 mb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Learning Hub</div>
          <NavItem icon={<Mic className="w-4 h-4" />} label="Live Tutor" active={activeTool === ToolType.TUTOR} onClick={() => selectTool(ToolType.TUTOR)} />
          <NavItem icon={<Gamepad2 className="w-4 h-4" />} label="Kids Logic" active={activeTool === ToolType.KIDS} onClick={() => selectTool(ToolType.KIDS)} />
          <NavItem icon={<Briefcase className="w-4 h-4" />} label="Skill Bridge" active={activeTool === ToolType.CAREER} onClick={() => selectTool(ToolType.CAREER)} />
        </nav>

        <div className="mt-8">
          {user ? (
            <div className="p-4 bg-slate-100 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black shrink-0 text-xs">{user.name.charAt(0)}</div>
                <div className="min-w-0">
                  <p className="text-xs font-black truncate">{user.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{user.xp} XP</p>
                </div>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl">
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar h-screen">
        <div className="max-w-6xl mx-auto">
          {renderTool()}
        </div>
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black mb-2 text-slate-900">Welcome</h2>
            <p className="text-slate-500 mb-8 font-bold">Access your unified learning workspace.</p>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" required placeholder="First Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-bold" />
                <input name="surname" required placeholder="Surname" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-bold" />
              </div>
              <input name="email" type="email" required placeholder="Email Address" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-bold" />
              <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl">
                Enter EduSphere
              </button>
              <button type="button" onClick={() => setIsLoginModalOpen(false)} className="w-full text-slate-400 font-black text-xs uppercase tracking-widest">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${
      active ? 'bg-white shadow-lg text-indigo-600 border border-slate-100' : 'text-slate-400 hover:bg-white/50 hover:text-slate-900'
    }`}
  >
    <span className={active ? 'text-indigo-600' : 'text-slate-300'}>{icon}</span>
    <span className="text-xs font-black tracking-tight">{label}</span>
  </button>
);

export default App;