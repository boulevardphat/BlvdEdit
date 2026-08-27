export type AspectRatio = '16:9' | '9:16' | '1:1' | 'custom';
export type Resolution = 'HD' | 'FHD' | '4K' | 'custom';

export interface ProjectMeta {
  title: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
}

export interface Transform {
  x: number;
  y: number;
  scaleX: number; // Important for stretch
  scaleY: number; // Important for stretch
  rotation: number;
  opacity: number;
}

export interface Keyframe {
  id: string;
  time: number; // local time within the clip
  properties: Partial<Transform>;
}

export interface TextStyle {
  fontFamily: string;
  fontWeight: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  isFilled: boolean;
  isStroked: boolean;
}

export interface Clip {
  id: string;
  trackId: string;
  type: 'video' | 'audio' | 'text' | 'image';
  name: string;
  start: number; // start time on timeline
  duration: number;
  sourceStart: number;
  sourceEnd: number;
  transform: Transform;
  textStyle?: TextStyle;
  textContent?: string;
  keyframes: Keyframe[];
}

export interface Track {
  id: string;
  type: 'video' | 'audio' | 'text';
  name: string;
  clips: Clip[];
  isLocked: boolean;
  isVisible: boolean;
  isMuted: boolean;
}

export interface ProjectData {
  version: string;
  meta: ProjectMeta | null;
  tracks: Track[];
}

export interface Guideline {
  id: string;
  axis: 'x' | 'y';
  position: number;
}
