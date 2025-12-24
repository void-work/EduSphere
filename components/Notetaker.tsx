
import React, { useState, useEffect } from 'react';
import { PenTool, Calendar, Star, Search, Trash2, Clock, Sparkles, Loader2, Plus, Brain, CheckCircle, BrainCircuit, AlertCircle, ChevronRight } from 'lucide-react';
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
    if (saved) { setNotes(JSON.parse(saved)); }
    else {
      const defaultNotes: Note[] = [{ id: '1', title: 'Welcome Note', content: 'AI-powered notes help you remember more.', date: new Date().toLocaleDateString(), nextReviewDate: Date.now() }];
      setNotes(defaultNotes);
      localStorage.setItem('edu_notes', JSON.stringify(defaultNotes));
    }
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId);
  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    const updated = notes.map(n => n.id === id ? { ...n, ...updates } : n);
    setNotes(updated);
    localStorage.setItem('edu_notes', JSON.stringify(updated));
  };

  const handleEnhanceWithAI = async () => {
    if (!activeNote || !activeNote.content.trim()) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceNote(activeNote.content);
      handleUpdateNote(activeNote.id, { enhancement: result });
      if (onEnhance) onEnhance(75);
    } catch (err) { console.error(err); } finally { setIsEnhancing(false); }
  };

  const isReviewDue = (ts: number) => ts < Date.now();
  const dueTodayNotes = notes.filter(n => isReviewDue(n.nextReviewDate));
  const libraryNotes = notes.filter(n => !isReviewDue(n.nextReviewDate));

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600"><PenTool className="w-7 h-7" /></div><div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart Notetaker</h1><p className="text-slate-500 font-bold">Adaptive AI review engine.</p></div></div><button onClick={() => { const n = { id: Date.now().toString(), title: 'Untitled', content: '', date: new Date().toLocaleDateString(), nextReviewDate: Date.now() + 86400000 }; setNotes([n, ...notes]); setActiveNoteId(n.id); }} className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest"><Plus className="w-5 h-5" /> New Note</button></div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[calc(100vh-220px)] overflow-hidden">
        <div className="md:col-span-4 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col"><div className="p-6 border-b border-slate-100"><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold" /></div><div className="flex-1 overflow-y-auto p-3 space-y-6">
          {dueTodayNotes.length > 0 && (<div className="space-y-1">{dueTodayNotes.map(n => (<NoteListItem key={n.id} note={n} isActive={activeNoteId === n.id} isDue onClick={() => setActiveNoteId(n.id)} />))}</div>)}
          <div className="space-y-1">{libraryNotes.map(n => (<NoteListItem key={n.id} note={n} isActive={activeNoteId === n.id} isDue={false} onClick={() => setActiveNoteId(n.id)} />))}</div>
        </div></div>
        <div className="md:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">{activeNote ? (<><div className="p-8 border-b border-slate-100 flex items-center justify-between"><input value={activeNote.title} onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })} className="text-2xl font-black text-slate-900 outline-none w-full" /><div className="flex gap-3"><button onClick={handleEnhanceWithAI} disabled={isEnhancing} className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-widest">{isEnhancing ? '...' : 'AI Enhance'}</button></div></div><div className="flex-1 p-8 overflow-y-auto"><textarea value={activeNote.content} onChange={(e) => handleUpdateNote(activeNote.id, { content: e.target.value })} className="w-full h-full outline-none text-slate-700 text-lg leading-relaxed resize-none font-medium" /></div></>) : <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">Select a node to begin insight capture.</div>}</div>
      </div>
    </div>
  );
};

const NoteListItem: React.FC<{ note: Note, isActive: boolean, isDue: boolean, onClick: () => void }> = ({ note, isActive, isDue, onClick }) => (
  <button onClick={onClick} className={`w-full p-5 text-left rounded-2xl mb-2 transition-all ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}><h3 className="font-black truncate text-sm">{note.title || 'Untitled'}</h3><p className={`text-[10px] line-clamp-1 opacity-70`}>{note.content || 'Empty...'}</p></button>
);

export default Notetaker;
