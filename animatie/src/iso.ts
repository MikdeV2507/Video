// Axonometrische projectie met instelbare kijkrichting.
// Wereldcoördinaten in metres: x = langs de rij, y = dwars op de rijen, z = omhoog.
// De kijker kijkt vanuit +x/+y/+z; az = draaiing om z, el = kijkhoek omlaag.

export type P3 = [number, number, number];
export type P2 = [number, number];

export const SCALE = 60; // pixels per metre bij zoom 1

export type Camera = {
  focus: P3;
  zoom: number;
  az: number; // graden; 45 = klassiek isometrisch, hoger = meer langs de rijen kijken
  el: number; // graden
};

const rad = (d: number) => (d * Math.PI) / 180;

export const toScreen = ([x, y, z]: P3, cam: Camera): P2 => {
  const a = rad(cam.az);
  const e = rad(cam.el);
  const [fx, fy, fz] = cam.focus;
  const dx = x - fx;
  const dy = y - fy;
  const dz = z - fz;
  const sx = dx * Math.cos(a) - dy * Math.sin(a);
  const sy = (dx * Math.sin(a) + dy * Math.cos(a)) * Math.sin(e) - dz * Math.cos(e);
  return [960 + sx * SCALE * cam.zoom, 540 + sy * SCALE * cam.zoom];
};

// Diepte voor het schildersalgoritme: groter = dichter bij de kijker
export const depth = ([x, y, z]: P3, cam: Camera) => {
  const a = rad(cam.az);
  return x * Math.sin(a) + y * Math.cos(a) + z * 0.001;
};

export const poly = (ps: P3[], cam: Camera) =>
  ps.map((p) => toScreen(p, cam).map((v) => v.toFixed(1)).join(',')).join(' ');

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: P3, b: P3, t: number): P3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export const lerpCam = (a: Camera, b: Camera, t: number): Camera => ({
  focus: lerp3(a.focus, b.focus, t),
  zoom: a.zoom * Math.pow(b.zoom / a.zoom, t),
  az: lerp(a.az, b.az, t),
  el: lerp(a.el, b.el, t),
});
