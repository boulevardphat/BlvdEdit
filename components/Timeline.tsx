'use client';

import { useEditorStore } from '@/lib/store';
import { Split, Trash2, Undo2, Redo2, ZoomIn, ZoomOut, Eye, Lock, Type, Video, Music } from 'lucide-react';

export default function Timeline() {
  const { project, playhead, activeClipId, setActiveClip, addTrack, addTextClip, deleteActiveClip } = useEditorStore();
  const { tracks } = project;

  const handleAddText = () => {
    let textTrack = tracks.find(t => t.type === 'text');
    if (!textTrack) {
      addTrack('text', 'Title Track');
      setTimeout(() => {
        const newTrack = useEditorStore.getState().project.tracks.find(t => t.type === 'text');
        if (newTrack) useEditorStore.getState().addTextClip(newTrack.id, 'NEW TITLE');
      }, 50);
    } else {
      addTextClip(textTrack.id, 'NEW TITLE');
    }
  };

  const getTrackIcon = (type: string) => {
    if (type === 'text') return <Type className="w-4 h-4" />;
    if (type === 'video') return <Video className="w-4 h-4" />;
    return <Music className="w-4 h-4" />;
  };

  return (
    <div className="h-72 shrink-0 border-t border-[#2b2d31] bg-[#141517] flex flex-col font-sans select-none">
      {/* Toolbar */}
      <div className="h-10 bg-[#1e1f22] border-b border-[#2b2d31] flex items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-[#2b2d31] transition-colors"><Undo2 className="w-4 h-4" /></button>
          <button className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-[#2b2d31] transition-colors"><Redo2 className="w-4 h-4" /></button>
          
          <div className="w-px h-4 bg-[#2b2d31] mx-2" />
          
          <button className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-[#2b2d31] transition-colors" title="Split (Ctrl+B)">
            <Split className="w-4 h-4" />
          </button>
          <button 
            onClick={deleteActiveClip} 
            className={`p-1.5 rounded transition-colors ${activeClipId ? 'text-zinc-400 hover:text-red-400 hover:bg-[#2b2d31]' : 'text-zinc-700 cursor-not-allowed'}`} 
            title="Delete (Del)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <div className="w-px h-4 bg-[#2b2d31] mx-2" />
          
          <button onClick={handleAddText} className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold rounded shadow-sm hover:bg-cyan-500/20 hover:border-cyan-400 transition-colors">
            + Add Text
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <ZoomOut className="w-4 h-4 text-zinc-500" />
          <input type="range" className="w-32 accent-cyan-500" />
          <ZoomIn className="w-4 h-4 text-zinc-500" />
        </div>
      </div>

      {/* Timeline Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Headers */}
        <div className="w-56 bg-[#1e1f22] border-r border-[#2b2d31] flex flex-col overflow-y-auto overflow-x-hidden pt-6 relative z-20">
           {tracks.map(track => (
             <div key={track.id} className="h-24 border-b border-[#2b2d31] flex flex-col justify-center px-4 gap-2 group">
               <div className="flex items-center justify-between text-zinc-400">
                 <div className="flex items-center gap-3">
                    {getTrackIcon(track.type)}
                    <span className="text-xs font-bold truncate max-w-[100px] text-zinc-300">{track.name}</span>
                 </div>
                 <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 hover:text-white cursor-pointer" />
                    <Lock className="w-4 h-4 hover:text-white cursor-pointer" />
                 </div>
               </div>
             </div>
           ))}
        </div>

        {/* Tracks Area */}
        <div className="flex-1 bg-[#141517] relative overflow-x-auto overflow-y-auto">
          {/* Ruler */}
          <div className="h-6 sticky top-0 bg-[#1e1f22]/95 backdrop-blur border-b border-[#2b2d31] z-10 shadow-sm">
             {[...Array(60)].map((_, i) => (
               <div key={i} className="absolute top-0 h-full border-l border-zinc-700" style={{ left: `${i * 100}px` }}>
                 <span className="text-[10px] font-mono text-zinc-500 ml-1.5 pt-0.5 inline-block">{i * 5}s</span>
               </div>
             ))}
             {/* Playhead Marker Mock */}
             <div className="absolute top-0 bottom-0 w-px bg-cyan-500 z-50 pointer-events-none shadow-[0_0_5px_rgba(0,229,255,0.5)]" style={{ left: '0px' }}>
                <div className="absolute top-0 -left-1.5 w-3 h-3 bg-cyan-500 rounded-b-sm" />
             </div>
          </div>

          {/* Grid Lines */}
          <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundSize: '100px 100%', backgroundImage: 'linear-gradient(to right, #2b2d31 1px, transparent 1px)' }} />

          {/* Track Content */}
          <div className="relative pt-6">
            {tracks.map(track => (
              <div key={track.id} className="h-24 border-b border-[#2b2d31] relative">
                {track.clips.map(clip => {
                  const isActive = activeClipId === clip.id;
                  return (
                    <div 
                      key={clip.id}
                      onClick={() => setActiveClip(clip.id)}
                      className={`absolute top-2 bottom-2 rounded border flex flex-col overflow-hidden cursor-pointer shadow-sm transition-colors group
                        ${isActive ? 'border-white bg-cyan-600/90 z-10 ring-1 ring-white/50' : 'border-cyan-800 bg-cyan-900/50 hover:border-cyan-500 hover:bg-cyan-800/80'}`}
                      style={{
                        left: `${(clip.start / 300) * 100}%`,
                        width: `${(clip.duration / 300) * 100}%`,
                        minWidth: '60px'
                      }}
                    >
                      <div className="h-4 bg-black/40 flex items-center px-2 text-[10px] font-bold text-white/90 truncate border-b border-black/20">
                         {clip.name}
                      </div>
                      <div className="flex-1 flex items-center justify-center p-2 text-xs font-semibold text-white truncate shadow-inner">
                         {clip.textContent || 'Media'}
                      </div>
                      {/* Active Clip Handles */}
                      {isActive && (
                        <>
                          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-white/20 cursor-ew-resize hover:bg-white/40 border-r border-white/10" />
                          <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/20 cursor-ew-resize hover:bg-white/40 border-l border-white/10" />
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
