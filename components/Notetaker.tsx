
import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Search, 
  Plus, 
  Sparkles, 
  Loader2, 
  Clock, 
  Trash2, 
  ChevronRight, 
  Calendar, 
  Tag,
  BookOpen,
  Layout,
  AlertCircle
} from 'lucide-react';
import { enhanceNote, NoteEnhancement } from '../services/geminiService';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  nextReviewDate: number;
  enhancement?: NoteEnhancement;
}

interface NotetakerProps {
  onEnhance?: (xp: number) => void;
}

const Notetaker: React.FC<NotetakerProps> = ({ onEnhance }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edu_notes');
    if (saved) { 
      const parsedNotes = JSON.parse(saved);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) setActiveNoteId(parsedNotes[0].id);
    } else {
      const defaultNotes: Note[] = [{ 
        id: '1', 
        title: 'Quantum Computing Basics', 
        content: 'Quantum computing is a type of computation whose operations can harness the phenomena of quantum mechanics, such as superposition, interference, and entanglement.', 
        date: new Date().toLocaleDateString(), 
        nextReviewDate: Date.now() 
      }];
      setNotes(defaultNotes);
      setActiveNoteId('1');
      localStorage.setItem('edu_notes', JSON.stringify(defaultNotes));
    }
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    const updated = notes.map(n => n.id === id ? { ...n, ...updates } : n);
    setNotes(updated);
    localStorage.setItem('edu_notes', JSON.stringify(updated));
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('edu_notes', JSON.stringify(updated));
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!activeNote || !activeNote.content.trim()) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceNote(activeNote.content);
      handleUpdateNote(activeNote.id, { enhancement: result });
      if (onEnhance) onEnhance(75);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsEnhancing(false); 
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isReviewDue = (ts: number) => ts <= Date.now();
  const dueTodayNotes = filteredNotes.filter(n => isReviewDue(n.nextReviewDate));
  const libraryNotes = filteredNotes.filter(n => !isReviewDue(n.nextReviewDate));

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart Notetaker</h1>
            <p className="text-slate-600 font-bold text-sm">Adaptive AI review engine & insight generator.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            const n = { 
              id: Date.now().toString(), 
              title: 'New Insight', 
              content: '', 
              date: new Date().toLocaleDateString(), 
              nextReviewDate: Date.now() + 86400000 
            };
            setNotes([n, ...notes]);
            setActiveNoteId(n.id);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus className="w-5 h-5" /> New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[calc(100vh-220px)] overflow-hidden">
        {/* Sidebar - List of Notes */}
        <div className="md:col-span-4 flex flex-col gap-6 overflow-hidden">
          <div className="relative shrink-0">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search concepts..." 
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900" 
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
            {dueTodayNotes.length > 0 && (
              <div className="space-y-3">
                <h3 className="px-4 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Priority Review
                </h3>
                {dueTodayNotes.map(n => (
                  <NoteListItem 
                    key={n.id} 
                    note={n} 
                    isActive={activeNoteId === n.id} 
                    isDue={true} 
                    onClick={() => setActiveNoteId(n.id)} 
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}

            <div className="space-y-3">
              <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Layout className="w-3 h-3" /> Knowledge Base
              </h3>
              {libraryNotes.length === 0 && dueTodayNotes.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">No matching insights</p>
                </div>
              ) : (
                libraryNotes.map(n => (
                  <NoteListItem 
                    key={n.id} 
                    note={n} 
                    isActive={activeNoteId === n.id} 
                    isDue={false} 
                    onClick={() => setActiveNoteId(n.id)} 
                    onDelete={handleDeleteNote}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="md:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
          {activeNote ? (
            <>
              {/* Editor Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex-1">
                  <input 
                    value={activeNote.title} 
                    onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })} 
                    className="text-2xl font-black text-slate-900 outline-none w-full placeholder:text-slate-200"
                    placeholder="Enter heading..."
                  />
                  <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {activeNote.date}</span>
                    <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> Level {activeNote.enhancement?.suggestedDifficulty || 1} Cognitive Load</span>
                  </div>
                </div>
                <button 
                  onClick={handleEnhanceWithAI} 
                  disabled={isEnhancing} 
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    isEnhancing 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white shadow-sm'
                  }`}
                >
                  {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isEnhancing ? 'Analyzing...' : 'AI Enhance'}
                </button>
              </div>

              {/* Editor Body */}
              <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                {activeNote.enhancement && (
                  <div className="px-8 pt-8 animate-in slide-in-from-top-4">
                    <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] space-y-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 text-indigo-100 group-hover:text-indigo-200 transition-colors">
                        <Sparkles className="w-16 h-16 rotate-12" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> AI Cognitive Summary
                        </h4>
                        <p className="text-indigo-900 font-bold text-sm leading-relaxed mb-6">
                          {activeNote.enhancement.summary}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeNote.enhancement.keyConcepts.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-white border border-indigo-100 text-indigo-700 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 p-8 min-h-[400px]">
                  <textarea 
                    value={activeNote.content} 
                    onChange={(e) => handleUpdateNote(activeNote.id, { content: e.target.value })} 
                    className="w-full h-full outline-none text-slate-800 text-lg leading-[1.8] resize-none font-medium placeholder:text-slate-200" 
                    placeholder="Start capturing your thoughts and insights here..."
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <PenTool className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Workspace Empty</h3>
              <p className="text-slate-500 font-bold text-sm max-w-xs mx-auto">Select a node from your library or create a new insight to begin semantic capture.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NoteListItem: React.FC<{ 
  note: Note, 
  isActive: boolean, 
  isDue: boolean, 
  onClick: () => void,
  onDelete: (e: React.MouseEvent, id: string) => void
}> = ({ note, isActive, isDue, onClick, onDelete }) => (
  <button 
    onClick={onClick} 
    className={`w-full p-5 text-left rounded-[1.5rem] mb-2 transition-all group relative border ${
      isActive 
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-2' 
        : 'bg-white border-slate-100 text-slate-900 hover:bg-slate-50 hover:border-slate-200'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {isDue && (
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-indigo-600'} animate-pulse`} />
        )}
        <h3 className="font-black truncate text-sm max-w-[140px] tracking-tight">{note.title || 'Untitled Insight'}</h3>
      </div>
      <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
        {note.date}
      </span>
    </div>
    <p className={`text-[10px] font-bold line-clamp-2 leading-relaxed ${isActive ? 'text-indigo-100' : 'text-slate-600 opacity-80'}`}>
      {note.content || 'Awaiting thought capture...'}
    </p>
    
    <button 
      onClick={(e) => onDelete(e, note.id)}
      className={`absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-xl transition-all ${
        isActive 
          ? 'bg-white/10 text-white hover:bg-white/20' 
          : 'bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white'
      }`}
    >
      <Trash2 className="w-4 h-4" />
    </button>

    {isActive && (
      <div className="absolute left-[-10px] top-1/2 -translate-y-1/2">
        <div className="w-1.5 h-10 bg-indigo-600 rounded-full" />
      </div>
    )}
  </button>
);

export default Notetaker;
