'use client';

import { useState } from 'react';
import { ProjectMeta } from '@/lib/types';
import { useEditorStore } from '@/lib/store';

export default function NewProjectDialog() {
  const initProject = useEditorStore(state => state.initProject);
  
  const [title, setTitle] = useState('My Awesome Project');
  const [resolutionPreset, setResolutionPreset] = useState<'HD' | 'FHD' | '4K' | 'Custom'>('FHD');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [fps, setFps] = useState(30);

  const handlePresetChange = (preset: 'HD' | 'FHD' | '4K' | 'Custom') => {
    setResolutionPreset(preset);
    if (preset === 'HD') { setWidth(1280); setHeight(720); }
    if (preset === 'FHD') { setWidth(1920); setHeight(1080); }
    if (preset === '4K') { setWidth(3840); setHeight(2160); }
  };

  const handleCreate = () => {
    const meta: ProjectMeta = {
      title,
      width,
      height,
      fps,
      duration: 300 // default 5 mins timeline
    };
    initProject(meta);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-white">Create New Project</h2>
        
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Project Name</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Resolution</label>
            <div className="mb-3 flex gap-2">
              {['HD', 'FHD', '4K', 'Custom'].map(preset => (
                <button
                  key={preset}
                  onClick={() => handlePresetChange(preset as any)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                    resolutionPreset === preset 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-zinc-500">Width (px)</label>
                <input 
                  type="number" 
                  value={width}
                  onChange={(e) => { setWidth(Number(e.target.value)); setResolutionPreset('Custom'); }}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col justify-end pb-2 text-zinc-500">x</div>
              <div className="flex-1">
                <label className="mb-1 block text-xs text-zinc-500">Height (px)</label>
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => { setHeight(Number(e.target.value)); setResolutionPreset('Custom'); }}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Framerate (FPS)</label>
            <div className="flex gap-2">
              {[24, 30, 60].map(f => (
                <button
                  key={f}
                  onClick={() => setFps(f)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                    fps === f 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {f} fps
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
