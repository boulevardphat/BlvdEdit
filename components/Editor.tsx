'use client';

import ResourcePanel from './ResourcePanel';
import PropertiesPanel from './PropertiesPanel';
import CanvasWorkspace from './CanvasWorkspace';
import Timeline from './Timeline';
import { Download, MonitorPlay, Settings, User } from 'lucide-react';

export default function Editor() {
  return (
    <div className="flex h-screen w-screen flex-col bg-[#141517] text-[#D1D5DB] overflow-hidden font-sans select-none">
      {/* Topbar */}
      <header className="h-14 border-b border-[#2b2d31] bg-[#1e1f22] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <MonitorPlay className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-lg tracking-wide">WebEdit Pro</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-zinc-400">
            <button className="hover:text-white transition-colors">File</button>
            <button className="hover:text-white transition-colors">Edit</button>
            <button className="hover:text-white transition-colors">View</button>
            <button className="hover:text-white transition-colors">Help</button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2b2d31] transition-colors">
            <Settings className="w-4 h-4 text-zinc-400" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2b2d31] transition-colors">
            <User className="w-4 h-4 text-zinc-400" />
          </button>
          <button className="flex items-center gap-2 rounded bg-cyan-500 px-5 py-1.5 text-sm font-bold text-[#141517] hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(0,229,255,0.3)]">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ResourcePanel />
        <CanvasWorkspace />
        <PropertiesPanel />
      </div>

      {/* Bottom Timeline */}
      <Timeline />
    </div>
  );
}
