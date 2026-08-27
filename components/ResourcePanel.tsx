'use client';

import { FileVideo, Type, Music, Sparkles, Image as ImageIcon, FolderPlus } from 'lucide-react';
import { useState } from 'react';

export default function ResourcePanel() {
  const [activeTab, setActiveTab] = useState('media');
  
  const tabs = [
    { id: 'media', icon: FileVideo, label: 'Media' },
    { id: 'audio', icon: Music, label: 'Audio' },
    { id: 'titles', icon: Type, label: 'Titles' },
    { id: 'transitions', icon: Sparkles, label: 'Transition' },
    { id: 'effects', icon: ImageIcon, label: 'Effects' },
  ];

  return (
    <div className="flex w-80 shrink-0 border-r border-[#2b2d31] bg-[#1e1f22]">
      {/* Tab Strip */}
      <div className="w-16 flex flex-col items-center py-2 bg-[#141517] border-r border-[#2b2d31]">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex flex-col items-center justify-center py-3 gap-1 relative ${activeTab === tab.id ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {activeTab === tab.id && <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-cyan-400 rounded-r-full" />}
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-10 border-b border-[#2b2d31] flex items-center px-4 font-semibold text-sm text-white">
          {tabs.find(t => t.id === activeTab)?.label}
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'media' && (
            <div className="flex flex-col gap-4">
              <button className="w-full h-24 border-2 border-dashed border-[#2b2d31] rounded-lg flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors bg-[#141517]">
                <FolderPlus className="w-6 h-6" />
                <span className="text-xs font-medium">Import Media</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-video bg-[#141517] rounded border border-[#2b2d31] relative group overflow-hidden cursor-pointer hover:border-cyan-500 transition-colors">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileVideo className="w-6 h-6 text-zinc-600" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[9px] text-white">00:05</div>
                   </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'titles' && (
            <div className="grid grid-cols-2 gap-2">
               {[...Array(8)].map((_,i) => (
                  <div key={i} className="aspect-video bg-[#141517] rounded border border-[#2b2d31] flex items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors text-xs font-bold text-white group relative overflow-hidden">
                     <span className="relative z-10 drop-shadow-md">Aa</span>
                     <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[9px] text-zinc-400">Preset {i+1}</div>
                  </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
