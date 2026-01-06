
import React, { useState, useEffect } from 'react';
import { Gamepad2, Stars, Trophy, Brain, ArrowRight, Lightbulb, CheckCircle2, XCircle, RefreshCw, Loader2, Sparkles, Zap, Rocket, Sprout, Medal, AlertCircle } from 'lucide-react';
import { generateLogicPuzzle, LogicPuzzle } from '../services/geminiService';

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'genius' | 'olympiad';

interface KidsCoachProps {
  onXpGain?: (xp: number) => void;
}

const KidsCoach: React.FC<KidsCoachProps> = ({ onXpGain }) => {
  const [gameState, setGameState] = useState<'selecting' | 'playing'>('selecting');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<LogicPuzzle | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const getDifficultyLevel = (diff: Difficulty) => {
    switch (diff) {
      case 'beginner': return 1;
      case 'intermediate': return 4;
      case 'advanced': return 7;
      case 'genius': return 10;
      case 'olympiad': return 12;
      default: return 1;
    }
  };

  const fetchNewPuzzle = async (diff: Difficulty) => {
    setLoading(true);
    setFeedback(null);
    setSelectedOption(null);
    setShowHint(false);
    try {
      const numericLevel = getDifficultyLevel(diff);
      const puzzle = await generateLogicPuzzle(numericLevel);
      setCurrentPuzzle(puzzle);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleStartMission = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameState('playing');
    fetchNewPuzzle(diff);
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentPuzzle) return;
    
    // Normalize strings for comparison (trim and lowercase)
    const normalizedSelected = selectedOption.trim().toLowerCase();
    const normalizedAnswer = currentPuzzle.answer.trim().toLowerCase();

    if (normalizedSelected === normalizedAnswer) {
      setFeedback('correct');
      let baseReward = 50;
      if (difficulty === 'olympiad') baseReward = 200;
      else if (difficulty === 'genius') baseReward = 100;
      else if (difficulty === 'advanced') baseReward = 75;
      
      const newXp = xp + baseReward;
      setXp(newXp);
      if (onXpGain) onXpGain(baseReward);
      
      // Level up every 500 XP
      if (newXp >= level * 500) {
        setLevel(l => l + 1);
      }
    } else {
      setFeedback('incorrect');
    }
  };

  const handleOptionClick = (opt: string) => {
    if (feedback === 'correct') return;
    setSelectedOption(opt);
    // If they already tried and failed, clear the incorrect status when they pick a new one
    if (feedback === 'incorrect') {
      setFeedback(null);
    }
  };

  const handleReset = () => { 
    setGameState('selecting'); 
    setCurrentPuzzle(null); 
    setFeedback(null);
    setSelectedOption(null);
  };

  if (gameState === 'selecting') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 pb-12 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-pink-100 rounded-[2.5rem] flex items-center justify-center text-pink-600 mx-auto mb-6 shadow-xl shadow-pink-100/50"><Gamepad2 className="w-10 h-10" /></div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kid Logic Coach</h1>
          <p className="text-slate-500 font-bold text-lg max-w-md mx-auto">Choose your mission difficulty and power up your neural networks!</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DifficultyCard title="Beginner" desc="Fun & Simple Patterns" icon={<Sprout className="w-8 h-8 text-emerald-500" />} color="border-emerald-100 hover:border-emerald-500" onClick={() => handleStartMission('beginner')} badge="Easy" />
          <DifficultyCard title="Intermediate" desc="Brain-Boosting Sequences" icon={<Rocket className="w-8 h-8 text-blue-500" />} color="border-blue-100 hover:border-blue-100" onClick={() => handleStartMission('intermediate')} badge="Tricky" />
          <DifficultyCard title="Advanced" desc="Expert Logic Challenges" icon={<Brain className="w-8 h-8 text-purple-500" />} color="border-purple-100 hover:border-purple-500" onClick={() => handleStartMission('advanced')} badge="Hard" />
          <DifficultyCard title="Genius" desc="Mastermind Lateral Thinking" icon={<Zap className="w-8 h-8 text-amber-500" />} color="border-amber-100 hover:border-amber-500" onClick={() => handleStartMission('genius')} badge="Extreme" />
          <DifficultyCard title="Olympiad" desc="Competition Standard" icon={<Medal className="w-8 h-8 text-yellow-600" />} color="border-yellow-200 hover:border-yellow-500 bg-yellow-50/30" onClick={() => handleStartMission('olympiad')} badge="Elite" isSpecial />
        </div>
      </div>
    );
  }

  const isOlympiad = difficulty === 'olympiad';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={handleReset} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm" title="Back to menu"><ArrowRight className="w-5 h-5 rotate-180" /></button>
          <div><h1 className={`text-2xl font-black flex items-center gap-2 uppercase tracking-tighter ${isOlympiad ? 'text-yellow-600' : 'text-slate-900'}`}>{isOlympiad && <Medal className="w-6 h-6" />} Mission: {difficulty}</h1><p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Neural Training • Brain Lab</p></div>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
           <div className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-3 ${isOlympiad ? 'bg-yellow-50 text-yellow-700' : 'bg-amber-50 text-amber-700'}`}><Trophy className="w-5 h-5" /> Lvl {level}</div>
           <div className="px-5 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-sm flex items-center gap-3"><Stars className="w-5 h-5" /> {xp} XP</div>
        </div>
      </div>

      <div className="space-y-8">
        <div className={`bg-white p-10 rounded-[3rem] border-4 shadow-2xl relative overflow-hidden min-h-[450px] flex flex-col justify-center transition-all ${isOlympiad ? 'border-yellow-100' : (feedback === 'incorrect' ? 'border-red-100 animate-shake' : 'border-slate-50')}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-6"><RefreshCw className={`w-16 h-16 animate-spin ${isOlympiad ? 'text-yellow-600' : 'text-indigo-600'}`} /><p className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">Assembling Neural Puzzle...</p></div>
          ) : currentPuzzle && (
            <div className="animate-in zoom-in-95 duration-500">
              <div className="mb-10">
                <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3 ${isOlympiad ? 'text-yellow-600' : 'text-indigo-400'}`}>
                  <Zap className="w-4 h-4" /> {currentPuzzle.type}
                </h3>
                <p className="text-2xl md:text-3xl font-black text-slate-900 leading-[1.2]">
                  {currentPuzzle.question}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentPuzzle.options.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  let optionStyles = "border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-white text-slate-800";
                  
                  if (isSelected) {
                    if (feedback === 'correct') {
                      optionStyles = "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200";
                    } else if (feedback === 'incorrect') {
                      optionStyles = "border-red-500 bg-red-500 text-white shadow-lg shadow-red-200";
                    } else {
                      optionStyles = isOlympiad ? "border-yellow-600 bg-yellow-600 text-white" : "border-slate-900 bg-slate-900 text-white";
                    }
                  }

                  return (
                    <button 
                      key={i} 
                      disabled={feedback === 'correct'} 
                      onClick={() => handleOptionClick(opt)} 
                      className={`p-6 rounded-[1.5rem] border-2 transition-all text-lg font-bold flex items-center justify-between ${optionStyles}`}
                    >
                      {opt}
                      {isSelected && feedback === 'correct' && <CheckCircle2 className="w-6 h-6" />}
                      {isSelected && feedback === 'incorrect' && <XCircle className="w-6 h-6" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-50">
                <button 
                  onClick={() => setShowHint(true)} 
                  disabled={feedback === 'correct'} 
                  className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-colors disabled:opacity-30 ${showHint ? 'text-amber-600' : 'text-slate-400 hover:text-amber-500'}`}
                >
                  <Lightbulb className="w-4 h-4" /> {showHint ? 'Hint Active' : 'Reveal Logical Hint'}
                </button>

                {feedback === 'correct' ? (
                  <button 
                    onClick={() => fetchNewPuzzle(difficulty)} 
                    className={`px-10 py-5 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center gap-4 ${isOlympiad ? 'bg-yellow-600 shadow-yellow-200' : 'bg-emerald-600 shadow-emerald-200'}`}
                  >
                    Next Mission <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit} 
                    disabled={!selectedOption || loading} 
                    className={`px-10 py-5 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center gap-4 disabled:opacity-20 ${isOlympiad ? 'bg-yellow-600 shadow-yellow-200' : 'bg-slate-900 shadow-slate-200'}`}
                  >
                    Confirm Choice <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {showHint && (
                <div className="mt-6 p-6 bg-amber-50 text-amber-900 rounded-[1.5rem] border border-amber-100 text-sm font-bold flex items-start gap-4 animate-in slide-in-from-top-2">
                  <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{currentPuzzle.hint}</p>
                </div>
              )}

              {feedback === 'incorrect' && (
                <div className="mt-6 p-6 bg-red-50 text-red-900 rounded-[1.5rem] border border-red-100 text-sm font-bold flex items-start gap-4 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>That's not quite right. Look at the hint or try another option!</p>
                </div>
              )}
              
              {feedback === 'correct' && (
                <div className="mt-6 p-6 bg-emerald-50 text-emerald-900 rounded-[1.5rem] border border-emerald-100 text-sm font-black flex items-start gap-4 animate-in zoom-in-95">
                  <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                  <p>EXCELLENT LOGIC! You've successfully navigated this neural node. Ready for the next one?</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
        Neural Engine Powered by EduSphere
      </p>
    </div>
  );
};

const DifficultyCard: React.FC<{ title: string, desc: string, icon: React.ReactNode, color: string, onClick: () => void, badge: string, isSpecial?: boolean }> = ({ title, desc, icon, color, onClick, badge, isSpecial }) => (
  <button onClick={onClick} className={`group p-8 bg-white rounded-[2.5rem] border-2 text-left transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col items-start gap-6 relative overflow-hidden ${color}`}>
    <div className="flex justify-between items-start w-full relative z-10">
      <div className="p-5 bg-white rounded-[1.5rem] shadow-lg border border-slate-50 group-hover:rotate-12 transition-transform">{icon}</div>
      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">{badge}</span>
    </div>
    <div className="relative z-10">
      <h3 className={`text-xl font-black mb-1 ${isSpecial ? 'text-yellow-700' : 'text-slate-900'}`}>{title}</h3>
      <p className="text-slate-400 font-bold text-xs leading-tight">{desc}</p>
    </div>
    {isSpecial && <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none rotate-12"><Medal className="w-32 h-32" /></div>}
  </button>
);

export default KidsCoach;
