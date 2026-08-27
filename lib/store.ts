import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, ProjectMeta, Track, Clip, Guideline, Transform } from './types';

interface EditorState {
  project: ProjectData;
  activeClipId: string | null;
  playhead: number;
  guidelines: Guideline[];
  isPlaying: boolean;
  
  initProject: (meta: ProjectMeta) => void;
  addTrack: (type: Track['type'], name: string) => void;
  addTextClip: (trackId: string, text: string) => void;
  updateClipTransform: (clipId: string, transform: Partial<Transform>) => void;
  setActiveClip: (clipId: string | null) => void;
  deleteActiveClip: () => void;
  setPlayhead: (time: number) => void;
  togglePlayback: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: { version: '1.0.0', meta: null, tracks: [] },
  activeClipId: null,
  playhead: 0,
  guidelines: [],
  isPlaying: false,

  initProject: (meta) => set((state) => ({ project: { ...state.project, meta, tracks: [] } })),
  
  addTrack: (type, name) => set((state) => ({
    project: { 
      ...state.project, 
      tracks: [...state.project.tracks, { id: uuidv4(), type, name, clips: [], isLocked: false, isVisible: true, isMuted: false }] 
    }
  })),
  
  addTextClip: (trackId, text) => set((state) => {
    const trackIndex = state.project.tracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) return state;
    
    const newClip: Clip = {
      id: uuidv4(), trackId, type: 'text', name: 'Title Block', start: state.playhead, duration: 50, sourceStart: 0, sourceEnd: 50,
      textContent: text,
      transform: { x: (state.project.meta?.width || 1920) / 2, y: (state.project.meta?.height || 1080) / 2, scaleX: 1, scaleY: 1, rotation: 0, opacity: 1 },
      textStyle: { fontFamily: 'Inter', fontWeight: 700, fillColor: '#FFFFFF', strokeColor: '#000000', strokeWidth: 2, isFilled: true, isStroked: false },
      keyframes: []
    };
    
    const newTracks = [...state.project.tracks];
    newTracks[trackIndex] = { ...newTracks[trackIndex], clips: [...newTracks[trackIndex].clips, newClip] };
    return { project: { ...state.project, tracks: newTracks } };
  }),
  
  updateClipTransform: (clipId, transformUpdate) => set((state) => {
    const newTracks = state.project.tracks.map(track => ({
      ...track,
      clips: track.clips.map(clip => clip.id === clipId ? { ...clip, transform: { ...clip.transform, ...transformUpdate } } : clip)
    }));
    return { project: { ...state.project, tracks: newTracks } };
  }),
  
  setActiveClip: (clipId) => set({ activeClipId: clipId }),
  
  deleteActiveClip: () => set((state) => {
    if (!state.activeClipId) return state;
    const newTracks = state.project.tracks.map(track => ({
      ...track,
      clips: track.clips.filter(clip => clip.id !== state.activeClipId)
    }));
    return { project: { ...state.project, tracks: newTracks }, activeClipId: null };
  }),
  
  setPlayhead: (time) => set({ playhead: time }),
  
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
