import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {Camera, P3, toScreen} from '../iso';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0→1 over [start, start+dur] seconden, met ease-in-out
export const useT = (start: number, dur: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return interpolate(f / fps, [start, start + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
};

export const useSec = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

// In- en uitfaden binnen een venster (seconden)
export const fadeWin = (t: number, a: number, b: number, d = 0.4) =>
  interpolate(t, [a, a + d, b - d, b], [0, 1, 1, 0], clamp);

// ---------- Logo (voorlopig woordmerk; vervangen door officieel HETS-logo zodra beschikbaar) ----------

export const HetsMark: React.FC<{size?: number; light?: boolean}> = ({size = 64, light = true}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.25}}>
    <div style={{display: 'flex', gap: size * 0.08}}>
      <div style={{width: size * 0.32, height: size * 0.8, background: C.orange, borderRadius: 3}} />
      <div style={{width: size * 0.32, height: size * 0.8, background: C.teal, borderRadius: 3}} />
    </div>
    <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: size, letterSpacing: size * 0.04, color: light ? C.white : C.navy}}>
      HETS
    </div>
  </div>
);

// ---------- Hoofdstuktitel ----------

export const ChapterTitle: React.FC<{text: string; start: number; dur?: number}> = ({text, start, dur = 3}) => {
  const t = useSec();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inn = spring({frame: f - start * fps, fps, config: {damping: 200}});
  const out = interpolate(t, [start + dur - 0.4, start + dur], [1, 0], clamp);
  if (t < start || t > start + dur) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 96,
        top: 760,
        transform: `translateX(${(1 - inn) * -80}px)`,
        opacity: inn * out,
        display: 'flex',
        alignItems: 'stretch',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div style={{width: 18, background: C.orange}} />
      <div style={{background: C.navy, color: C.white, fontFamily: F.sans, fontWeight: 600, fontSize: 64, padding: '18px 36px'}}>
        {text}
      </div>
    </div>
  );
};

// ---------- Label aan een wereldpunt ----------

export const Tag: React.FC<{
  cam: Camera;
  at: P3;
  text: string;
  color?: string;
  opacity?: number;
  size?: number;
  mono?: boolean;
  dx?: number;
  dy?: number;
}> = ({cam, at, text, color = C.navy, opacity = 1, size = 44, mono, dx = 0, dy = 0}) => {
  const [x, y] = toScreen(at, cam);
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x + dx,
        top: y + dy,
        transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * opacity})`,
        opacity,
        background: color,
        color: C.white,
        fontFamily: mono ? F.mono : F.sans,
        fontWeight: mono ? 500 : 700,
        fontSize: size,
        letterSpacing: mono ? 0 : 2,
        padding: '8px 22px',
        borderRadius: 8,
        whiteSpace: 'nowrap',
        boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
      }}
    >
      {text}
    </div>
  );
};

// ---------- Locator-minikaart (linksboven) ----------

export const Locator: React.FC<{label: string; opacity: number; highlight?: {x: number; y: number; w: number; h: number}}> = ({
  label,
  opacity,
  highlight,
}) => {
  // plattegrond 8.4 × 10.8 m, liggend getekend (y horizontaal)
  const s = 14;
  const rows = [1.2, 3.6, 6.0, 8.4];
  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        top: 40,
        opacity,
        background: 'rgba(22,32,43,0.92)',
        borderRadius: 10,
        padding: '14px 18px',
        display: 'flex',
        gap: 18,
        alignItems: 'center',
      }}
    >
      <svg width={10.8 * s} height={8.4 * s}>
        <rect width={10.8 * s} height={8.4 * s} fill={C.navy2} rx={3} />
        {rows.map((r) => (
          <rect key={r} x={r * s} y={2.4 * s} width={1.2 * s} height={4.8 * s} fill="#8696A8" />
        ))}
        {[1.0, 4.4, 7.8].map((c) => (
          <rect key={c} x={c * s} y={0.1 * s} width={1.8 * s} height={0.9 * s} fill="#C9D1DA" />
        ))}
        {highlight && (
          <rect x={highlight.y * s} y={highlight.x * s} width={highlight.h * s} height={highlight.w * s} fill="none" stroke={C.orange} strokeWidth={3} />
        )}
      </svg>
      <div style={{fontFamily: F.sans, color: C.white}}>
        <div style={{fontSize: 22, color: '#9FB0C2', fontWeight: 600, letterSpacing: 2}}>HETS DEMO HALL</div>
        <div style={{fontSize: 30, fontWeight: 600}}>{label}</div>
      </div>
    </div>
  );
};

// ---------- Ondertitels (alleen in reviewversie; op YouTube via .srt) ----------

export const Caption: React.FC<{text: string | null}> = ({text}) =>
  text ? (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          maxWidth: 1500,
          background: 'rgba(0,0,0,0.78)',
          color: 'white',
          fontFamily: F.sans,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.3,
          padding: '10px 26px',
          borderRadius: 6,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </div>
  ) : null;

// ---------- Lijst met vinkjes (checklist / recap) ----------

export const TickList: React.FC<{
  title: string;
  items: string[];
  start: number;
  step: number;
  numbered?: boolean;
}> = ({title, items, start, step, numbered}) => {
  const t = useSec();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 240, right: 240, top: 170, fontFamily: F.sans}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 48}}>
        <div style={{width: 14, height: 64, background: C.orange, borderRadius: 3}} />
        <div style={{fontSize: 76, fontWeight: 700, color: C.white}}>{title}</div>
      </div>
      {items.map((it, i) => {
        const s0 = start + i * step;
        const p = spring({frame: f - s0 * fps, fps, config: {damping: 200}});
        const tick = spring({frame: f - (s0 + 0.5) * fps, fps, config: {damping: 12}});
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              marginBottom: 30,
              opacity: t < s0 ? 0 : p,
              transform: `translateY(${(1 - p) * 30}px)`,
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 12,
                background: numbered ? C.orange : C.teal,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 48,
                fontWeight: 700,
                flexShrink: 0,
                transform: numbered ? undefined : `scale(${0.6 + 0.4 * tick})`,
              }}
            >
              {numbered ? i + 1 : '✓'}
            </div>
            <div style={{fontSize: 56, fontWeight: 600, color: C.white, lineHeight: 1.2}}>{it}</div>
          </div>
        );
      })}
    </div>
  );
};
