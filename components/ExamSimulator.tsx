
import React, { useState, useEffect, useRef } from 'react';
import { 
  ClipboardCheck, 
  RefreshCcw, 
  CheckCircle, 
  Clock, 
  History, 
  ChevronLeft, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Lightbulb 
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { ExamResult, QuizQuestion } from '../types';

const TIME_PER_QUESTION = 60;

const GRADE_LEVELS = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", 
  "Class 11", "Class 12", "University / Higher Ed"
];

interface ExamSimulatorProps {
  onComplete?: (xp: number, topic: string) => void;
}

const ExamSimulator: React.FC<ExamSimulatorProps> = ({ onComplete }) => {
  const [view, setView] = useState<'setup' | 'exam' | 'results' | 'history' | 'review'>('setup');
  const [topic, setTopic] = useState('Algebraic Equations');
  const [selectedGrade, setSelectedGrade] = useState(GRADE_LEVELS[8]); // Default to Class 9
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const timerRef = useRef<number | null>(null);
  const [history, setHistory] = useState<ExamResult[]>([]);
  const [reviewExam, setReviewExam] = useState<ExamResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('edu_exam_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (view === 'exam' && !selectedAnswer && !loading && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [view, currentIndex, selectedAnswer, loading, isPaused]);

  const startExam = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setTimeLeft(TIME_PER_QUESTION);
    setIsPaused(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional academic examiner for a student in ${selectedGrade}. 
        TASK: Generate a 5-question curriculum-standard exam on the topic: "${topic}". 
        
        CRITICAL INSTRUCTIONS:
        1. Difficulty Calibration: The depth and complexity of questions MUST strictly match the ${selectedGrade} level.
        2. Tone: Professional and challenging but appropriate for this age/grade.
        3. Format: Multiple choice with 4 options.
        4. Focus on core curriculum concepts relevant to ${topic} for this grade.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });
      setQuestions(JSON.parse(response.text || "[]"));
      setView('exam');
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleAnswer = (answer: string | null) => {
    if (selectedAnswer || isPaused) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    
    setSelectedAnswer(answer);
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = answer;
    setUserAnswers(updatedAnswers);

    if (answer === questions[currentIndex].correctAnswer) setScore(score + 1);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(TIME_PER_QUESTION);
        setIsPaused(false);
      } else {
        const finalScore = score + (answer === questions[currentIndex].correctAnswer ? 1 : 0);
        saveResults(updatedAnswers, finalScore);
        if (onComplete) onComplete(finalScore * 40, topic);
        setView('results');
      }
    }, 1500);
  };

  const saveResults = (finalAnswers: (string | null)[], finalScore: number) => {
    const result: ExamResult = {
      id: Date.now().toString(),
      topic,
      difficulty: selectedGrade, // Reusing difficulty field for grade in history
      score: finalScore,
      total: questions.length,
      date: new Date().toLocaleString(),
      questions: [...questions],
      userAnswers: finalAnswers
    };
    const newHistory = [result, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('edu_exam_history', JSON.stringify(newHistory));
  };

  const progressPercentage = (timeLeft / TIME_PER_QUESTION) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Examination Engine</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Protocol Version 2.3 • Grade Calibrated</p>
          </div>
        </div>
        {view === 'setup' && (
          <button onClick={() => setView('history')} className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <History className="w-4 h-4" /> History
          </button>
        )}
        {(view === 'results' || view === 'history' || view === 'review') && (
          <button onClick={() => setView('setup')} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg">
            <ChevronLeft className="w-4 h-4" /> New Exam
          </button>
        )}
      </div>

      {view === 'setup' && (
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-10 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Grade Level / Class
              </label>
              <div className="relative">
                <select 
                  value={selectedGrade} 
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                >
                  {GRADE_LEVELS.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Exam Topic
              </label>
              <input 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="e.g. Linear Equations, World War II..." 
                className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" 
              />
            </div>
          </div>
          
          <button 
            onClick={startExam} 
            disabled={loading || !topic} 
            className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-30 active:scale-[0.98]"
          >
            {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <>Start Grade {selectedGrade.split(' ')[1] || ''} Exam <ArrowRight className="w-5 h-5" /></>}
          </button>
        </div>
      )}

      {view === 'history' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          {history.length === 0 ? (
            <div className="text-center py-24 bg-white/40 rounded-[2.5rem] border border-slate-100">
              <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No previous sessions found</p>
            </div>
          ) : (
            history.map((h) => (
              <div key={h.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${h.score / h.total >= 0.6 ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'}`}>
                    <span className="text-lg">{h.score}</span>
                    <span className="text-[10px] opacity-40">/{h.total}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{h.topic}</h3>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{h.difficulty} • {h.date}</p>
                  </div>
                </div>
                <button onClick={() => { setReviewExam(h); setView('review'); }} className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shrink-0">Review</button>
              </div>
            ))
          )}
        </div>
      )}

      {view === 'review' && reviewExam && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('history')} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6 text-slate-400" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{reviewExam.topic}</h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{reviewExam.difficulty} • Score: {reviewExam.score}/{reviewExam.total}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border ${reviewExam.score / reviewExam.total >= 0.8 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
              {reviewExam.score / reviewExam.total >= 0.8 ? 'Excellent Performance' : 'Keep Practicing'}
            </div>
          </div>

          <div className="space-y-6">
            {reviewExam.questions.map((q, idx) => {
              const userAnswer = reviewExam.userAnswers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              
              return (
                <div key={idx} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-lg animate-in fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex items-start gap-5 mb-8">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-lg ${isCorrect ? 'bg-emerald-500 shadow-emerald-100' : 'bg-red-400 shadow-red-100'}`}>
                      {idx + 1}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 pt-1 leading-tight">{q.question}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {q.options.map((opt) => {
                      let style = "bg-slate-50 border-slate-50 text-slate-400";
                      const isUserChoice = opt === userAnswer;
                      const isCorrectChoice = opt === q.correctAnswer;

                      if (isCorrectChoice) {
                        style = "bg-emerald-50 border-emerald-500/30 text-emerald-800 ring-2 ring-emerald-500/10";
                      } else if (isUserChoice && !isCorrect) {
                        style = "bg-red-50 border-red-500/30 text-red-800";
                      }

                      return (
                        <div key={opt} className={`p-5 border-2 rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${style}`}>
                          <span className="flex-1 pr-4">{opt}</span>
                          {isCorrectChoice && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                          {isUserChoice && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-6 md:p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex items-start gap-5 group transition-all hover:bg-indigo-50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Lightbulb className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Academic Explanation</p>
                      <p className="text-sm md:text-base font-bold text-slate-700 leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'exam' && (
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden relative">
          <div className="h-2 bg-slate-50 w-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ease-linear ${timeLeft > 30 ? 'bg-slate-900' : timeLeft > 10 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="p-8 md:p-12 space-y-12">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <div className="flex items-center gap-4">
                <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">QUESTION {currentIndex + 1} OF {questions.length}</span>
                <span className="text-indigo-600">CALIBRATION: {selectedGrade}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-black">
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            </div>
            <div className={`space-y-10 ${isPaused ? 'blur-2xl' : ''}`}>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{questions[currentIndex].question}</h3>
              <div className="grid grid-cols-1 gap-4">
                {questions[currentIndex].options.map((opt) => (
                  <button 
                    key={opt} 
                    onClick={() => handleAnswer(opt)} 
                    disabled={!!selectedAnswer || isPaused} 
                    className={`p-6 text-left border-2 rounded-2xl transition-all font-bold text-lg ${selectedAnswer ? (opt === questions[currentIndex].correctAnswer ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : (selectedAnswer === opt ? 'bg-red-50 border-red-300 text-red-800' : 'opacity-20 grayscale')) : 'bg-white border-slate-100 hover:border-indigo-400'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'results' && (
        <div className="bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl text-center space-y-12 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Session Concluded</h2>
            <p className="text-slate-400 font-bold text-base md:text-lg mt-2 uppercase tracking-widest">Academic Success • {selectedGrade} Assessment</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-sm mx-auto">
            <div className="p-6 md:p-8 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Raw Score</p>
              <p className="text-3xl md:text-4xl font-black text-slate-900">{score}/{questions.length}</p>
            </div>
            <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border bg-emerald-50 border-emerald-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">XP Gain</p>
              <p className="text-3xl md:text-4xl font-black text-emerald-600">+{score * 40}</p>
            </div>
          </div>
          <button onClick={() => setView('setup')} className="w-full py-5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all">Start New Simulation</button>
        </div>
      )}
    </div>
  );
};

export default ExamSimulator;
