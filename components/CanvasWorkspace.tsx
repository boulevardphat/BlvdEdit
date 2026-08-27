'use client';

import { useEditorStore } from '@/lib/store';
import { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Maximize, Volume2, Crop } from 'lucide-react';

export default function CanvasWorkspace() {
  const { project, activeClipId, setActiveClip, updateClipTransform, isPlaying, togglePlayback } = useEditorStore();
  const meta = project.meta;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'stretchX' | 'stretchY' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialTransform, setInitialTransform] = useState({ x: 0, y: 0, scaleX: 1, scaleY: 1 });

  useEffect(() => {
    if (!containerRef.current || !meta) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      // Add padding
      const scaleX = (width - 40) / meta.width;
      const scaleY = (height - 40) / meta.height;
      setScale(Math.min(scaleX, scaleY));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [meta]);

  if (!meta) return null;

  const visualClips = project.tracks.flatMap(t => t.clips).filter(c => ['text', 'video', 'image'].includes(c.type));

  const handlePointerDown = (e: React.PointerEvent, clipId: string, type: 'move' | 'stretchX' | 'stretchY') => {
    e.stopPropagation();
    setActiveClip(clipId);
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    const clip = visualClips.find(c => c.id === clipId);
    if (clip) setInitialTransform({ ...clip.transform });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !activeClipId || !dragType) return;
    
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;

    if (dragType === 'move') {
      updateClipTransform(activeClipId, { x: initialTransform.x + dx, y: initialTransform.y + dy });
    } else if (dragType === 'stretchX') {
      updateClipTransform(activeClipId, { scaleX: Math.max(0.1, initialTransform.scaleX + (dx / 100)) });
    } else if (dragType === 'stretchY') {
      updateClipTransform(activeClipId, { scaleY: Math.max(0.1, initialTransform.scaleY + (dy / 100)) });
    }
  };

  const handlePointerUp = () => { setIsDragging(false); setDragType(null); };

  return (
    <div className="flex flex-col flex-1 bg-[#0e0f11] min-w-0 border-r border-[#2b2d31]">
      {/* Top toolbar of canvas */}
      <div className="h-10 bg-[#1e1f22] border-b border-[#2b2d31] flex items-center justify-between px-4 text-xs font-medium text-zinc-400">
         <div className="flex items-center gap-4">
           <span>{meta.width} x {meta.height}</span>
           <span className="text-zinc-600">|</span>
           <button className="hover:text-white transition-colors" title="Crop/Fit"><Crop className="w-3.5 h-3.5" /></button>
         </div>
         <div className="flex items-center gap-3">
           <span className="bg-[#141517] px-2 py-0.5 rounded border border-[#2b2d31]">Fit</span>
           <span>{meta.fps} FPS</span>
         </div>
      </div>

      <div 
        ref={containerRef} 
        className="flex-1 relative overflow-hidden flex items-center justify-center cursor-default"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={() => setActiveClip(null)}
      >
        {/* Checkerboard Pattern for Transparency */}
        <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAHElEQVQYV2NkYGAwYkAC/2Hwk0wK2RjgQEQ/BwBy4wENWp4l0gAAAABJRU5ErkJggg==')] opacity-10 pointer-events-none" />

        <div 
          className="bg-black shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden border border-[#2b2d31]"
          style={{ width: meta.width, height: meta.height, transform: `scale(${scale})`, transformOrigin: 'center center' }}
        >
          {/* Action Safe Zone */}
          <div className="absolute inset-[5%] border border-dashed border-white/20 pointer-events-none z-10" />
          
          {/* Center Guidelines */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/30 pointer-events-none z-10" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-500/30 pointer-events-none z-10" />

          {/* Render Elements */}
          {visualClips.map(clip => {
            const { x, y, scaleX, scaleY, rotation, opacity } = clip.transform;
            const isSelected = activeClipId === clip.id;
            
            return (
              <div
                key={clip.id}
                className="absolute top-0 left-0 flex items-center justify-center z-20"
                style={{ transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scaleX}, ${scaleY}) translate(-50%, -50%)`, opacity }}
              >
                {clip.type === 'text' && (
                  <div 
                    className={`px-4 py-2 cursor-grab active:cursor-grabbing ${isSelected ? 'ring-2 ring-cyan-500 bg-white/5' : 'hover:ring-1 hover:ring-white/30'}`}
                    onPointerDown={(e) => handlePointerDown(e, clip.id, 'move')}
                    style={{ 
                      fontFamily: clip.textStyle?.fontFamily,
                      fontWeight: clip.textStyle?.fontWeight,
                      color: clip.textStyle?.isFilled ? clip.textStyle.fillColor : 'transparent',
                      WebkitTextStroke: clip.textStyle?.isStroked ? `${clip.textStyle.strokeWidth}px ${clip.textStyle.strokeColor}` : 'none',
                      fontSize: '64px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {clip.textContent}
                    
                    {/* Stretch Handles */}
                    {isSelected && (
                      <>
                        <div 
                          className="absolute top-1/2 -right-2 w-3 h-6 bg-cyan-500 border border-white rounded-sm -translate-y-1/2 cursor-ew-resize hover:bg-cyan-400"
                          onPointerDown={(e) => handlePointerDown(e, clip.id, 'stretchX')}
                        />
                        <div 
                          className="absolute -bottom-2 left-1/2 w-6 h-3 bg-cyan-500 border border-white rounded-sm -translate-x-1/2 cursor-ns-resize hover:bg-cyan-400"
                          onPointerDown={(e) => handlePointerDown(e, clip.id, 'stretchY')}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Player Controls */}
      <div className="h-12 bg-[#1e1f22] border-t border-[#2b2d31] flex items-center justify-between px-6 shrink-0 text-zinc-300">
         <div className="flex items-center gap-4 text-xs font-mono w-32 tracking-wider">
            00:00:00.00
         </div>
         <div className="flex items-center gap-4">
            <button className="hover:text-cyan-400 transition-colors"><SkipBack className="w-5 h-5 fill-current" /></button>
            <button onClick={togglePlayback} className="w-8 h-8 flex items-center justify-center bg-cyan-500 text-[#141517] rounded hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(0,229,255,0.2)]">
               {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button className="hover:text-cyan-400 transition-colors"><SkipForward className="w-5 h-5 fill-current" /></button>
         </div>
         <div className="flex items-center gap-4 w-32 justify-end">
            <button className="hover:text-white"><Volume2 className="w-4 h-4" /></button>
            <button className="hover:text-white"><Maximize className="w-4 h-4" /></button>
         </div>
      </div>
    </div>
  );
}
