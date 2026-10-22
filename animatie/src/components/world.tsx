import React from 'react';
import {C, F} from '../theme';
import {Camera, P3, depth, poly, toScreen} from '../iso';

// Wereld-primitieven. Elk primitief levert een Drawable met een diepte, zodat <World>
// alles van achter naar voren kan tekenen (schildersalgoritme).
export type Drawable = {d: number; node: React.ReactNode};

let keySeq = 0;
const k = () => `w${keySeq++}`;

export const World: React.FC<{items: Drawable[]; overlay?: React.ReactNode}> = ({items, overlay}) => {
  keySeq = 0;
  const sorted = [...items].sort((a, b) => a.d - b.d);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {sorted.map((it, i) => (
        <React.Fragment key={i}>{it.node}</React.Fragment>
      ))}
      {overlay}
    </svg>
  );
};

// ---------- Ruimte ----------

export const ROOM = {x: 8.4, y: 10.8, tile: 0.6};

export const floor = (cam: Camera, opts: {tiles?: boolean; opacity?: number} = {}): Drawable => {
  const {x: X, y: Y, tile} = ROOM;
  const o = opts.opacity ?? 1;
  const lines: React.ReactNode[] = [];
  if (opts.tiles !== false) {
    for (let x = 0; x <= X + 1e-6; x += tile) {
      const [a, b] = [toScreen([x, 0, 0], cam), toScreen([x, Y, 0], cam)];
      lines.push(<line key={`x${x}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.floorLine} strokeWidth={1.2} />);
    }
    for (let y = 0; y <= Y + 1e-6; y += tile) {
      const [a, b] = [toScreen([0, y, 0], cam), toScreen([X, y, 0], cam)];
      lines.push(<line key={`y${y}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.floorLine} strokeWidth={1.2} />);
    }
  }
  return {
    d: -1e6,
    node: (
      <g opacity={o}>
        <polygon points={poly([[0, 0, 0], [X, 0, 0], [X, Y, 0], [0, Y, 0]], cam)} fill={C.floor} />
        {lines}
        {/* vloerrand */}
        <polygon
          points={poly([[0, Y, 0], [X, Y, 0], [X, Y, -0.25], [0, Y, -0.25]], cam)}
          fill="#D5DCE3"
        />
        <polygon
          points={poly([[X, 0, 0], [X, Y, 0], [X, Y, -0.25], [X, 0, -0.25]], cam)}
          fill="#C3CCD6"
        />
      </g>
    ),
  };
};

export const walls = (cam: Camera, opacity = 1): Drawable => {
  const {x: X, y: Y} = ROOM;
  const h = 2.8;
  return {
    d: -1e5,
    node: (
      <g opacity={opacity}>
        <polygon points={poly([[0, 0, 0], [X, 0, 0], [X, 0, h], [0, 0, h]], cam)} fill="#E3E8EE" />
        <polygon points={poly([[0, 0, 0], [0, Y, 0], [0, Y, h], [0, 0, h]], cam)} fill="#D9DFE6" />
        <polyline points={poly([[X, 0, h], [0, 0, h], [0, Y, h]], cam)} fill="none" stroke="#C3CCD6" strokeWidth={2} />
      </g>
    ),
  };
};

// Doos met de drie zichtbare vlakken (boven, +x, +y)
export const box = (
  cam: Camera,
  o: P3,
  s: P3,
  fill: {top: string; x: string; y: string},
  extra?: {opacity?: number; stroke?: string; strokeWidth?: number; children?: React.ReactNode},
): Drawable => {
  const [x0, y0, z0] = o;
  const [x1, y1, z1] = [x0 + s[0], y0 + s[1], z0 + s[2]];
  const st = extra?.stroke ?? 'rgba(0,0,0,0.25)';
  const sw = extra?.strokeWidth ?? 1;
  return {
    d: depth([(x0 + x1) / 2, (y0 + y1) / 2, z0], cam),
    node: (
      <g opacity={extra?.opacity ?? 1}>
        <polygon points={poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], cam)} fill={fill.y} stroke={st} strokeWidth={sw} />
        <polygon points={poly([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], cam)} fill={fill.x} stroke={st} strokeWidth={sw} />
        <polygon points={poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], cam)} fill={fill.top} stroke={st} strokeWidth={sw} />
        {extra?.children}
      </g>
    ),
  };
};

// ---------- Rack ----------

export const RACK = {w: 0.6, d: 1.2, h: 2.0};

export type RackProps = {
  x0: number;
  y0: number; // begin van de rij (rack beslaat y0..y0+1.2)
  facing: 1 | -1; // +1 = front naar +y
  flip?: number; // 0..1 draaiing van 180°
  opacity?: number;
  outline?: string;
  dz?: number; // optillen (bijv. bij plaatsen)
};

export const rack = (cam: Camera, p: RackProps): Drawable => {
  const flip = p.flip ?? 0;
  const ang = Math.PI * flip;
  const c = Math.cos(ang);
  const dd = Math.max(0.03, RACK.d * Math.abs(c));
  const yc = p.y0 + RACK.d / 2;
  const ya = yc - dd / 2;
  const yb = yc + dd / 2;
  const lift = 0.35 * Math.sin(ang) + (p.dz ?? 0);
  const facingNow = (c >= 0 ? p.facing : -p.facing) as 1 | -1;
  const x0 = p.x0 + 0.01;
  const x1 = p.x0 + RACK.w - 0.01;
  const zb = lift;
  const zt = lift + RACK.h;

  const details: React.ReactNode[] = [];
  if (facingNow === 1) {
    // front: geperforeerde deur met servers
    for (let z = zb + 0.18; z < zt - 0.1; z += 0.16) {
      const a = toScreen([x0 + 0.06, yb, z], cam);
      const b = toScreen([x1 - 0.06, yb, z], cam);
      const led = toScreen([x1 - 0.1, yb, z + 0.05], cam);
      details.push(
        <g key={k()}>
          <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#4C627A" strokeWidth={2 * cam.zoom} />
          <circle cx={led[0]} cy={led[1]} r={1.6 * cam.zoom} fill={C.teal} />
        </g>,
      );
    }
  } else {
    // achterkant: A- en B-PDU
    const pdu = (x: number, col: string) => {
      const a = toScreen([x, yb, zb + 0.15], cam);
      const b = toScreen([x, yb, zt - 0.15], cam);
      return <line key={k()} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={3.5 * cam.zoom} strokeLinecap="round" />;
    };
    details.push(pdu(x0 + 0.1, C.sideA), pdu(x1 - 0.1, C.sideB));
    for (let z = zb + 0.3; z < zt - 0.2; z += 0.3) {
      const a = toScreen([x0 + 0.16, yb, z], cam);
      const b = toScreen([x1 - 0.16, yb, z], cam);
      details.push(<line key={k()} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#3A4757" strokeWidth={1.5 * cam.zoom} />);
    }
  }
  // frontmarkering op de bovenkant
  const fy0 = facingNow === 1 ? yb - 0.1 : ya;
  const fy1 = facingNow === 1 ? yb : ya + 0.1;
  details.push(
    <polygon key={k()} points={poly([[x0, fy0, zt], [x1, fy0, zt], [x1, fy1, zt], [x0, fy1, zt]], cam)} fill="#9FB0C2" />,
  );

  const b = box(
    cam,
    [x0, ya, zb],
    [x1 - x0, yb - ya, RACK.h],
    {top: C.rackTop, x: C.rackSide, y: C.rackFront},
    {
      opacity: p.opacity,
      stroke: p.outline ?? 'rgba(0,0,0,0.35)',
      strokeWidth: p.outline ? 3.5 : 1,
      children: details,
    },
  );
  return {d: depth([p.x0 + RACK.w / 2, yc, 0], cam), node: b.node};
};

// Koelunit langs de kopse wand (x=0), blaast naar +x
export const crah = (cam: Camera, y0: number, opacity = 1): Drawable => {
  const grille: React.ReactNode[] = [];
  for (let z = 0.3; z < 1.9; z += 0.12) {
    const a = toScreen([1.0, y0 + 0.15, z], cam);
    const b = toScreen([1.0, y0 + 1.65, z], cam);
    grille.push(<line key={k()} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#AEB9C6" strokeWidth={1.5 * cam.zoom} />);
  }
  return box(cam, [0.1, y0, 0], [0.9, 1.8, 2.0], {top: '#F4F6F8', x: '#DCE2E8', y: '#C9D1DA'}, {opacity, children: grille});
};

// Vloerzone (bijv. koude/warme gang), optioneel met een doorzichtig luchtvolume
export const zone = (
  cam: Camera,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  o: {floor?: number; volume?: number; h?: number} = {},
): Drawable => {
  const h = o.h ?? 2.0;
  const fo = o.floor ?? 0.35;
  const vo = o.volume ?? 0;
  return {
    d: depth([(x0 + x1) / 2, (y0 + y1) / 2, 0], cam),
    node: (
      <g>
        <polygon points={poly([[x0, y0, 0.01], [x1, y0, 0.01], [x1, y1, 0.01], [x0, y1, 0.01]], cam)} fill={color} opacity={fo} />
        {vo > 0 && (
          <g opacity={vo}>
            <polygon points={poly([[x0, y1, 0], [x1, y1, 0], [x1, y1, h], [x0, y1, h]], cam)} fill={color} />
            <polygon points={poly([[x1, y0, 0], [x1, y1, 0], [x1, y1, h], [x1, y0, h]], cam)} fill={color} />
            <polygon points={poly([[x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h]], cam)} fill={color} />
          </g>
        )}
      </g>
    ),
  };
};

// Geperforeerde vloertegel
export const perfTile = (cam: Camera, x0: number, y0: number, color: string = C.teal, opacity = 1, dz = 0): Drawable => {
  const t = ROOM.tile;
  const z = 0.01 + dz;
  const dots: React.ReactNode[] = [];
  for (let i = 1; i < 5; i++)
    for (let j = 1; j < 5; j++) {
      const [sx, sy] = toScreen([x0 + (i * t) / 5, y0 + (j * t) / 5, z + 0.002], cam);
      dots.push(<circle key={`${i}-${j}`} cx={sx} cy={sy} r={1.8 * cam.zoom} fill={C.navy} opacity={0.55} />);
    }
  return {
    d: dz > 0 ? depth([x0 + t / 2, y0 + t / 2, 0], cam) : -1e4,
    node: (
      <g opacity={opacity}>
        <polygon
          points={poly([[x0 + 0.02, y0 + 0.02, z], [x0 + t - 0.02, y0 + 0.02, z], [x0 + t - 0.02, y0 + t - 0.02, z], [x0 + 0.02, y0 + t - 0.02, z]], cam)}
          fill={color}
          opacity={0.75}
        />
        {dots}
      </g>
    ),
  };
};

// ---------- Overlay: lucht, maten ----------

// Bewegende luchtpijlen langs een pad
export const AirStream: React.FC<{
  cam: Camera;
  path: P3[];
  color: string;
  t: number; // seconden
  count?: number;
  speed?: number; // m/s
  opacity?: number;
  size?: number;
}> = ({cam, path, color, t, count = 4, speed = 0.9, opacity = 1, size = 1}) => {
  const seg: number[] = [];
  let L = 0;
  for (let i = 1; i < path.length; i++) {
    const [a, b] = [path[i - 1], path[i]];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    seg.push(l);
    L += l;
  }
  const at = (s: number): P3 => {
    let i = 0;
    while (i < seg.length - 1 && s > seg[i]) {
      s -= seg[i];
      i++;
    }
    const f = Math.min(1, s / seg[i]);
    const [a, b] = [path[i], path[i + 1]];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  };
  const out: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const s = (((t * speed + (i * L) / count) % L) + L) % L;
    const p = at(s);
    const q = at(Math.min(L, s + 0.05));
    const [px, py] = toScreen(p, cam);
    const [qx, qy] = toScreen(q, cam);
    const ang = (Math.atan2(qy - py, qx - px) * 180) / Math.PI;
    const fade = Math.sin((Math.PI * s) / L);
    const r = 11 * size * Math.sqrt(cam.zoom);
    out.push(
      <g key={i} transform={`translate(${px} ${py}) rotate(${ang})`} opacity={opacity * Math.min(1, fade * 1.6)}>
        <path d={`M ${-r} ${-r * 0.8} L ${r * 0.6} 0 L ${-r} ${r * 0.8} L ${-r * 0.55} 0 Z`} fill={color} stroke="white" strokeWidth={1.2} />
      </g>,
    );
  }
  return <g>{out}</g>;
};

// Maatlijn tussen twee wereldpunten met label in IBM Plex Mono
export const Dim: React.FC<{cam: Camera; a: P3; b: P3; label: string; opacity?: number; color?: string}> = ({
  cam,
  a,
  b,
  label,
  opacity = 1,
  color = C.orange,
}) => {
  const [ax, ay] = toScreen(a, cam);
  const [bx, by] = toScreen(b, cam);
  const ang = Math.atan2(by - ay, bx - ax);
  const nx = -Math.sin(ang) * 12;
  const ny = Math.cos(ang) * 12;
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const w = label.length * 22 + 28;
  return (
    <g opacity={opacity}>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={4} />
      <line x1={ax - nx} y1={ay - ny} x2={ax + nx} y2={ay + ny} stroke={color} strokeWidth={4} />
      <line x1={bx - nx} y1={by - ny} x2={bx + nx} y2={by + ny} stroke={color} strokeWidth={4} />
      <rect x={mx - w / 2} y={my - 26} width={w} height={52} rx={8} fill={color} />
      <text x={mx} y={my + 12} textAnchor="middle" fontFamily={F.mono} fontSize={34} fontWeight={500} fill="white">
        {label}
      </text>
    </g>
  );
};

// Luchtstroom als Drawable, zodat racks ervoor/erachter correct overlappen
export const air = (cam: Camera, props: Omit<React.ComponentProps<typeof AirStream>, 'cam'>): Drawable => {
  const mid = props.path[Math.floor((props.path.length - 1) / 2)];
  const end = props.path[props.path.length - 1];
  const m: P3 = [(mid[0] + end[0]) / 2, (mid[1] + end[1]) / 2, 0];
  return {d: depth(m, cam) + 0.0005, node: <AirStream cam={cam} {...props} />};
};
