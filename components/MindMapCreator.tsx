
import React, { useState, useRef, useEffect } from 'react';
import { Network, Search, Loader2, Sparkles, Brain, Info, ArrowRight, MousePointer2 } from 'lucide-react';
import { generateMindMapData } from '../services/geminiService';
import { MindMapNode } from '../types';

const MindMapCreator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const data = await generateMindMapData(topic, content);
      setMindMapData(data);
      setSelectedNode(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 border border-slate-100 shadow-xl">
          <Network className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">MindMap Neural</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Semantic Hierarchies & Logical Mapping</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Central Concept</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                <input 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Quantum Computing..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Base Knowledge</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste complex data to be mapped..."
                className="w-full h-48 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:border-indigo-500 outline-none resize-none font-medium text-slate-700 text-sm leading-relaxed transition-all"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !topic || !content}
              className="w-full py-5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-30 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Construct Neural Map
                </div>
              )}
            </button>
          </div>

          {selectedNode && (
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl animate-in slide-in-from-left-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-4">Node Insights</h4>
              <h3 className="text-xl font-black mb-3">{selectedNode.label}</h3>
              <p className="text-sm font-bold opacity-80 leading-relaxed italic">
                {selectedNode.description || "Synthesizing deep semantic context for this node branch..."}
              </p>
            </div>
          )}
        </div>

        {/* Map Visualization Area */}
        <div className="lg:col-span-8 bg-white/40 backdrop-blur-md rounded-[3rem] border border-slate-100 shadow-inner min-h-[600px] relative overflow-hidden flex items-center justify-center p-12">
          {mindMapData ? (
            <div className="relative animate-in zoom-in-95 duration-1000 w-full h-full flex items-center justify-center">
              <RecursiveTree 
                node={mindMapData} 
                onNodeClick={setSelectedNode} 
                selectedId={selectedNode?.id} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-6 opacity-30">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50">
                 <Brain className="w-8 h-8 text-slate-200" />
               </div>
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.5em]">Awaiting Knowledge Synthesis</p>
            </div>
          )}
          
          <div className="absolute bottom-8 right-8 flex items-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-widest bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/50">
             <MousePointer2 className="w-3 h-3" /> Click nodes to explore branches
          </div>
        </div>
      </div>
    </div>
  );
};

const RecursiveTree: React.FC<{ 
  node: MindMapNode; 
  onNodeClick: (node: MindMapNode) => void;
  selectedId?: string;
  depth?: number;
}> = ({ node, onNodeClick, selectedId, depth = 0 }) => {
  return (
    <div className="flex flex-col items-center gap-12 group">
      {/* Current Node */}
      <button 
        onClick={() => onNodeClick(node)}
        className={`relative z-10 p-5 min-w-[140px] text-center rounded-[1.5rem] border-2 transition-all duration-500 hover:scale-105 active:scale-95 ${
          selectedId === node.id 
            ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-110' 
            : depth === 0 
              ? 'bg-white text-slate-900 border-indigo-600 shadow-xl' 
              : 'bg-white text-slate-600 border-slate-100 shadow-sm hover:border-indigo-400'
        }`}
      >
        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedId === node.id ? 'text-indigo-300' : 'text-slate-300'} block mb-1`}>
          {depth === 0 ? 'Nucleus' : `Branch ${depth}`}
        </span>
        <span className="font-bold tracking-tight block">{node.label}</span>
      </button>

      {/* Children Container */}
      {node.children && node.children.length > 0 && (
        <div className="flex items-start gap-8 relative pt-4">
          {/* SVG Connectors */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none -translate-y-12">
             <svg className="w-full h-full overflow-visible">
                {node.children.map((child, i) => (
                  <ConnectorLine key={i} total={node.children!.length} index={i} />
                ))}
             </svg>
          </div>
          
          {node.children.map((child) => (
            <RecursiveTree 
              key={child.id} 
              node={child} 
              onNodeClick={onNodeClick} 
              selectedId={selectedId} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ConnectorLine: React.FC<{ total: number; index: number }> = ({ total, index }) => {
  const isOnly = total === 1;
  const startX = 50;
  const startY = 0;
  const endY = 48;
  const endX = isOnly ? 50 : (index / (total - 1)) * 100;
  
  return (
    <path 
      d={`M ${startX}% ${startY} C ${startX}% ${startY + 24}, ${endX}% ${endY - 24}, ${endX}% ${endY}`} 
      fill="none" 
      stroke="rgba(99, 102, 241, 0.1)" 
      strokeWidth="2"
      className="transition-all duration-1000 animate-in fade-in"
    />
  );
};

export default MindMapCreator;
