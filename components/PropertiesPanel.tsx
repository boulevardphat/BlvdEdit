'use client';

import { useEditorStore } from '@/lib/store';
import { Type, Box, Move } from 'lucide-react';
import { useEffect } from 'react';

export default function PropertiesPanel() {
  const { project, activeClipId, updateClipTransform } = useEditorStore();
  const clip = project.tracks.flatMap(t => t.clips).find(c => c.id === activeClipId);

  useEffect(() => {
    if (clip?.type === 'text' && clip.textStyle?.fontFamily) {
      const font = clip.textStyle.fontFamily.replace(/ /g, '+');
      const linkId = `font-${font}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.href = `https://fonts.googleapis.com/css2?family=${font}:wght@100;300;400;700;900&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }
  }, [clip?.textStyle?.fontFamily]);

  if (!clip) {
    return (
      <aside className="w-80 shrink-0 bg-[#1e1f22] flex items-center justify-center text-sm text-zinc-500">
        <div className="flex flex-col items-center gap-2">
          <Box className="w-8 h-8 text-[#2b2d31]" />
          No element selected
        </div>
      </aside>
    );
  }

  const { transform, textStyle } = clip;
  
  const handleTransformChange = (key: keyof typeof transform, value: number) => {
    updateClipTransform(clip.id, { [key]: value });
  };

  const handleTextStyleChange = (update: Partial<typeof textStyle>) => {
    useEditorStore.setState(state => ({
      project: {
        ...state.project,
        tracks: state.project.tracks.map(t => ({
          ...t,
          clips: t.clips.map(c => c.id === clip.id ? { ...c, textStyle: { ...c.textStyle!, ...update } } : c)
        }))
      }
    }));
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="border-b border-[#2b2d31] p-4">
       <div className="flex items-center gap-2 mb-4 text-white font-semibold text-sm tracking-wide">
         <Icon className="w-4 h-4 text-cyan-400" /> {title}
       </div>
       {children}
    </div>
  );

  const Input = ({ label, value, onChange, type = 'number', step }: any) => (
     <div className="flex items-center gap-2">
        <label className="text-[10px] uppercase font-bold text-zinc-500 w-12 shrink-0">{label}</label>
        <input 
          type={type} step={step} value={value} onChange={onChange} 
          className="w-full bg-[#141517] border border-[#2b2d31] rounded-md px-2 py-1.5 text-xs text-white focus:border-cyan-500 outline-none transition-colors" 
        />
     </div>
  );

  return (
    <aside className="w-80 shrink-0 bg-[#1e1f22] flex flex-col h-full overflow-y-auto">
      <div className="h-10 flex items-center px-4 border-b border-[#2b2d31] font-semibold text-sm text-white sticky top-0 bg-[#1e1f22] z-10 shrink-0">
        Properties
      </div>

      <Section title="Transform" icon={Move}>
         <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Input label="X Pos" value={Math.round(transform.x)} onChange={(e:any) => handleTransformChange('x', Number(e.target.value))} />
            <Input label="Y Pos" value={Math.round(transform.y)} onChange={(e:any) => handleTransformChange('y', Number(e.target.value))} />
            <Input label="Scale X" step="0.1" value={transform.scaleX.toFixed(2)} onChange={(e:any) => handleTransformChange('scaleX', Number(e.target.value))} />
            <Input label="Scale Y" step="0.1" value={transform.scaleY.toFixed(2)} onChange={(e:any) => handleTransformChange('scaleY', Number(e.target.value))} />
         </div>
      </Section>

      {clip.type === 'text' && textStyle && (
        <Section title="Text & Style" icon={Type}>
           <div className="space-y-5">
             <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Font Family</label>
                <select 
                  value={textStyle.fontFamily} onChange={(e) => handleTextStyleChange({ fontFamily: e.target.value })}
                  className="w-full bg-[#141517] border border-[#2b2d31] rounded-md px-2 py-2 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer"
                >
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Oswald</option>
                  <option>Playfair Display</option>
                  <option>Dancing Script</option>
                </select>
             </div>
             <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Weight</label>
                  <span className="text-[10px] text-zinc-400 bg-[#141517] px-1.5 py-0.5 rounded">{textStyle.fontWeight}</span>
                </div>
                <input type="range" min="100" max="900" step="100" value={textStyle.fontWeight} onChange={(e) => handleTextStyleChange({ fontWeight: Number(e.target.value) })} className="w-full accent-cyan-500" />
             </div>
             
             <div className="bg-[#141517] p-3 rounded-md border border-[#2b2d31] space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-medium text-white cursor-pointer select-none">
                    <input type="checkbox" checked={textStyle.isFilled} onChange={(e) => handleTextStyleChange({ isFilled: e.target.checked })} className="accent-cyan-500 w-4 h-4 cursor-pointer" />
                    Color Fill
                  </label>
                  {textStyle.isFilled && <input type="color" value={textStyle.fillColor} onChange={(e) => handleTextStyleChange({ fillColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-0 p-0" />}
                </div>
                
                <div className="h-px bg-[#2b2d31]" />
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-medium text-white cursor-pointer select-none">
                      <input type="checkbox" checked={textStyle.isStroked} onChange={(e) => handleTextStyleChange({ isStroked: e.target.checked })} className="accent-cyan-500 w-4 h-4 cursor-pointer" />
                      Stroke
                    </label>
                    {textStyle.isStroked && <input type="color" value={textStyle.strokeColor} onChange={(e) => handleTextStyleChange({ strokeColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-0 p-0" />}
                  </div>
                  {textStyle.isStroked && (
                    <div className="flex items-center gap-3 pl-6">
                       <span className="text-[10px] text-zinc-500 uppercase font-bold w-12">Width</span>
                       <input type="range" min="1" max="20" value={textStyle.strokeWidth} onChange={(e) => handleTextStyleChange({ strokeWidth: Number(e.target.value) })} className="w-full accent-cyan-500" />
                       <span className="text-[10px] text-white w-4">{textStyle.strokeWidth}</span>
                    </div>
                  )}
                </div>
             </div>
           </div>
        </Section>
      )}
    </aside>
  );
}
