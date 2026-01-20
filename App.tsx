
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
  User as UserIcon, 
  LogOut,
  Sparkles,
  ChevronRight,
  Network,
  Menu,
  X,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Terminal,
  Skull,
  // Added Gamepad2 to fix the 'Cannot find name' error
  Gamepad2
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

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [crashPhase, setCrashPhase] = useState(0);

  // Handle User Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('edu_user');
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, []);

  const triggerCrash = () => {
    setIsCrashed(true);
    // Simulate phases of a system failure
    setTimeout(() => setCrashPhase(1), 100);
    setTimeout(() => setCrashPhase(2), 2000);
    setTimeout(() => setCrashPhase(3), 4000);
  };

  const reboot = () => {
    setIsCrashed(false);
    setCrashPhase(0);
    setActiveTool(ToolType.DASHBOARD);
  };

  const updateStats = useCallback((xpGain: number, activityLabel: string, tool: ToolType) => {
    setUser(prev => {
      if (!prev) return null;
      const newShift: CognitiveShift = {
        label: activityLabel,
        xp: `+${xpGain} XP`,
        date: 'Just now',
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
    const fullName = `${formData.get('firstName')} ${formData.get('surname')}`.trim() || 'Alex Learner';
    const newUser: User = { 
      id: Date.now().toString(), 
      name: fullName, 
      email: formData.get('email') as string || 'alex@example.com', 
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
    setUser(null);
    localStorage.removeItem('edu_user');
    setActiveTool(ToolType.DASHBOARD);
    setIsMobileMenuOpen(false);
  };

  if (isCrashed) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center p-8 bg-black text-emerald-500 overflow-hidden relative crt-lines ${crashPhase >= 2 ? 'animate-crash-shake' : ''}`}>
        <div className="max-w-4xl w-full terminal-font z-50 space-y-8">
          <div className="flex items-center gap-4 mb-12">
            <Cpu className="w-12 h-12 animate-pulse text-red-500" />
            <h1 className="text-4xl font-bold tracking-tighter text-red-500">SYSTEM KERNEL PANIC</h1>
          </div>
          
          <div className="space-y-2 text-sm opacity-80">
            <p>[ 0.000000] Initializing EduSphere OS v2.3.chaos...</p>
            <p>[ 0.045231] CPU0: Intel(R) Core(TM) i9-AI-NODE</p>
            <p>[ 1.129842] FATAL ERROR: Cognitive recursive loop detected in MindMapNeural module.</p>
            <p>[ 1.129843] Overflow in partition: /home/learning/data/infinity</p>
            {crashPhase >= 1 && (
              <>
                <p className="text-red-500 font-bold">[ 2.551229] *** STACK TRACE BEGINS ***</p>
                <p className="pl-4">at edu.core.intelligence.NeuralNet.process(NeuralNet.ts:404)</p>
                <p className="pl-4">at edu.ui.App.triggerCrash(App.tsx:55)</p>
                <p className="pl-4">at user.input.Destruction.click(Dashboard.tsx:21)</p>
                <p className="text-red-500 font-bold">[ 2.551230] *** MEMORY CORRUPTION DETECTED ***</p>
              </>
            )}
            {crashPhase >= 2 && (
              <div className="grid grid-cols-4 gap-4 py-8 animate-glitch">
                <Skull className="w-12 h-12 text-red-500" />
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <Skull className="w-12 h-12 text-red-500" />
                <Terminal className="w-12 h-12 text-white" />
              </div>
            )}
            {crashPhase >= 3 && (
              <div className="mt-12 p-8 border-2 border-red-500 bg-red-950/20 rounded-2xl animate-pulse">
                <h2 className="text-2xl font-black mb-4">CRITICAL FAILURE</h2>
                <p className="mb-8">The AI engine has reached critical mass. Reality synthesis is failing. Please perform a manual reboot to restore the learning environment.</p>
                <button 
                  onClick={reboot}
                  className="px-12 py-5 bg-red-600 text-white rounded-xl font-black uppercase tracking-[0.3em] hover:bg-white hover:text-red-600 transition-all flex items-center justify-center gap-4 group"
                >
                  <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                  REBOOT CORE
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Background glitch debris */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-white/10" 
              style={{
                width: Math.random() * 200 + 'px',
                height: '1px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animation: `glitch ${Math.random() + 0.1}s infinite`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const renderTool = () => {
    if (!user && activeTool !== ToolType.DASHBOARD) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/40 animate-in zoom-in-95">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-200/50">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Identify Yourself</h2>
          <p className="text-slate-500 max-w-sm mb-8 font-medium">Sign in to access advanced AI tutoring features.</p>
          <button onClick={() => setIsLoginModalOpen(true)} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3">Sign In Now <ChevronRight className="w-5 h-5" /></button>
        </div>
      );
    }
    switch (activeTool) {
      case ToolType.TEXTBOOK: return <TextbookCompanion onComplete={(xp) => updateStats(xp, "Textbook Synthesis", ToolType.TEXTBOOK)} />;
      case ToolType.CAREER: return <SkillBridge />;
      case ToolType.EXAM: return <ExamSimulator onComplete={(xp, topic) => updateStats(xp, `${topic} Exam`, ToolType.EXAM)} />;
      case ToolType.TUTOR: return <VoiceTutor />;
      case ToolType.VISUAL: return <VisualConceptBuilder />;
      case ToolType.KIDS: return <KidsCoach onXpGain={(xp) => updateStats(xp, "Logic Mission", ToolType.KIDS)} />;
      case ToolType.NOTES: return <Notetaker onEnhance={(xp) => updateStats(xp, "Smart Note Enhancement", ToolType.NOTES)} />;
      case ToolType.INFOGRAPHIC: return <InfographicCreator onComplete={(xp) => updateStats(xp, "Infographic Synthesis", ToolType.INFOGRAPHIC)} />;
      case ToolType.CURATOR: return <Curator onComplete={(xp) => updateStats(xp, "Roadmap Generation", ToolType.CUR
