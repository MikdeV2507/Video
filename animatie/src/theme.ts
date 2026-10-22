import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import '@fontsource/ibm-plex-mono/500.css';

// HETS-huisstijl (zie huisstijl/STIJLGIDS.md)
export const C = {
  navy: '#16202B',
  navy2: '#223142',
  orange: '#E07B0A',
  teal: '#1FA9A3',
  floor: '#EEF1F4',
  floorLine: '#C9D1DA',
  white: '#FFFFFF',
  muted: '#6B7A8C',
  // vaste technische kleurcodes
  cold: '#3B82F6',
  hot: '#EF4444',
  sideA: '#D93A3A',
  sideB: '#2E9E4F',
  mm: '#22C1D6',
  sm: '#F2C230',
  utp: '#8B5CF6',
  dont: '#E0312B',
  do: '#1FA9A3',
  // rack
  rackTop: '#3A4A5C',
  rackSide: '#26323F',
  rackFront: '#1C2632',
} as const;

export const F = {
  sans: 'Archivo, sans-serif',
  mono: '"IBM Plex Mono", monospace',
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;
