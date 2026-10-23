import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, FPS} from '../../theme';
import {Camera, P3, lerpCam, toScreen} from '../../iso';
import {
  AirStream,
  air,
  Dim,
  Drawable,
  RACK,
  ROOM,
  World,
  box,
  crah,
  floor,
  perfTile,
  rack,
  walls,
  zone,
} from '../../components/world';
import {Caption, ChapterTitle, HetsMark, Locator, Tag, TickList, clamp, fadeWin, useSec} from '../../components/ui';
import {SCENES, cues, sceneStart} from './script';

// ---------- Indeling van de demo-zaal ----------

const ROW_Y = [1.2, 3.6, 6.0, 8.4]; // begin van rij A..D (rack-diepte 1.2 m)
const N_RACKS = 8;
const RACK_X0 = 2.4;
const rackX = (i: number) => RACK_X0 + i * RACK.w;
const ROW_X1 = rackX(N_RACKS);
const CORRECT: (1 | -1)[] = [1, -1, 1, -1];
const CRAH_Y = [1.0, 4.4, 7.8];

const frontY = (r: number, facing: 1 | -1) => (facing === 1 ? ROW_Y[r] + RACK.d : ROW_Y[r]);
const backY = (r: number, facing: 1 | -1) => (facing === 1 ? ROW_Y[r] : ROW_Y[r] + RACK.d);

const OVERVIEW: Camera = {focus: [4.6, 5.4, 0.6], zoom: 1.7, az: 62, el: 52};

const ease = Easing.inOut(Easing.cubic);
const ramp = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});

const base = (cam: Camera, o = 1): Drawable[] => [floor(cam, {opacity: o}), walls(cam, o), ...CRAH_Y.map((y) => crah(cam, y, o))];

type RowOpts = {
  flip?: (i: number) => number;
  opacity?: (i: number) => number;
  dz?: (i: number) => number;
  outline?: (i: number) => string | undefined;
  facing?: (i: number) => 1 | -1;
  skip?: number[];
};

const row = (cam: Camera, r: number, facing: 1 | -1, o: RowOpts = {}): Drawable[] => {
  const out: Drawable[] = [];
  for (let i = 0; i < N_RACKS; i++) {
    if (o.skip?.includes(i)) continue;
    const op = o.opacity ? o.opacity(i) : 1;
    if (op <= 0.001) continue;
    out.push(
      rack(cam, {
        x0: rackX(i),
        y0: ROW_Y[r],
        facing: o.facing ? o.facing(i) : facing,
        flip: o.flip?.(i),
        opacity: op,
        dz: o.dz?.(i),
        outline: o.outline?.(i),
      }),
    );
  }
  return out;
};

// Lucht in de front en uit de achterkant van een rack (als Drawables)
type AirOpts = {opacity?: number; inColor?: string; outColor?: string; z?: number};
const rackAir = (cam: Camera, r: number, i: number, facing: 1 | -1, t: number, o: AirOpts = {}): Drawable[] => {
  const {opacity = 1, inColor = C.cold, outColor = C.hot, z = 1.0} = o;
  if (opacity <= 0.001) return [];
  const xc = rackX(i) + RACK.w / 2;
  const fy = frontY(r, facing);
  const by = backY(r, facing);
  return [
    air(cam, {t, color: inColor, opacity, count: 3, path: [[xc, fy + facing * 1.0, z], [xc, fy + facing * 0.05, z]]}),
    air(cam, {t, color: outColor, opacity, count: 3, path: [[xc, by - facing * 0.05, z], [xc, by - facing * 1.0, z]]}),
  ];
};

const Bg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #F7F9FB 0%, #E4EAF0 100%)'}}>{children}</AbsoluteFill>
);

const NavyBg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 30% 20%, ${C.navy2} 0%, ${C.navy} 70%)`}}>{children}</AbsoluteFill>
);

// ---------- Scène 1: intro-bumper ----------

const Bumper: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const a = spring({frame: f, fps, config: {damping: 200}});
  const b = spring({frame: f - 8, fps, config: {damping: 200}});
  const out = interpolate(t, [2.6, 3], [1, 0], clamp);
  return (
    <NavyBg>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 24 * a, background: C.orange}} />
      <div style={{position: 'absolute', left: 200, top: 330, opacity: out}}>
        <div style={{opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>
          <HetsMark size={90} />
        </div>
        <div style={{marginTop: 60, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, fontFamily: F.sans}}>
          <div style={{fontSize: 40, fontWeight: 600, color: '#9FB0C2', letterSpacing: 6}}>DATA CENTER WHITESPACE</div>
          <div style={{fontSize: 96, fontWeight: 700, color: C.white, marginTop: 12}}>
            <span style={{fontFamily: F.mono, color: C.orange, marginRight: 32}}>1.2</span>Rows and Aisles
          </div>
        </div>
      </div>
    </NavyBg>
  );
};

// ---------- Scène 2: de zaal ----------

const Hall: React.FC = () => {
  const t = useSec();
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const cam = lerpCam({focus: [4.2, 5.4, 0], zoom: 0.8, az: 30, el: 70}, OVERVIEW, ramp(t, 0, 7));
  const items = [
    ...base(cam, ramp(t, 0, 1.2)),
    ...row(cam, 0, 1, {
      opacity: (i) => (t > 8 + i * 0.35 ? 1 : 0),
      dz: (i) => 2.5 * (1 - spring({frame: f - (8 + i * 0.35) * fps, fps, config: {damping: 14, mass: 0.6}})),
    }),
  ];
  return (
    <Bg>
      <World items={items} />
      <Tag cam={cam} at={[7.8, 9.6, 0]} text="600 × 600 mm grid" mono size={34} color={C.navy} opacity={fadeWin(t, 2.5, 7.5)} />
      <Tag cam={cam} at={[0.55, 1.9, 2.2]} text="CRAH" mono size={30} color={C.muted} opacity={fadeWin(t, 3.5, 7.5)} />
      <Tag cam={cam} at={[4.8, 1.8, 2.5]} text="Row A" size={36} opacity={fadeWin(t, 11, 16.6)} />
      <Locator label="Rows and aisles" opacity={ramp(t, 2, 3)} />
    </Bg>
  );
};

// ---------- Scène 3: front-to-back ----------

const Airflow: React.FC = () => {
  const t = useSec();
  const focusRack = 4;
  const cam = lerpCam(OVERVIEW, {focus: [rackX(focusRack) + 0.3, 1.9, 1.0], zoom: 3.4, az: 28, el: 24}, ramp(t, 0, 3.5));
  const dim = 1 - 0.8 * ramp(t, 1, 3);
  const items = [...base(cam, 1), ...row(cam, 0, 1, {opacity: (i) => (i === focusRack ? 1 : dim)})];
  const airOn = ramp(t, 3.5, 4.5);
  const xc = rackX(focusRack) + 0.3;
  for (const z of [0.5, 1.0, 1.5]) items.push(...rackAir(cam, 0, focusRack, 1, t, {z, opacity: airOn}));
  return (
    <Bg>
      <World items={items} />
      <Tag cam={cam} at={[xc, 3.6, 1.95]} text="FRONT · cool air in" color={C.cold} size={38} opacity={fadeWin(t, 5, 17.6)} />
      <Tag cam={cam} at={[xc, 0.3, 1.95]} text="BACK · hot air out" color={C.hot} size={38} opacity={fadeWin(t, 7, 17.6)} />
      <Tag cam={cam} at={[xc, 1.9, 0]} text="front-to-back airflow" mono size={32} dy={70} opacity={fadeWin(t, 10, 17.6)} />
      <Locator label="Rows and aisles" opacity={1} highlight={{x: rackX(focusRack), y: 1.2, w: 0.6, h: 1.2}} />
    </Bg>
  );
};

// ---------- Scène 4: het probleem (klaslokaal-opstelling) ----------

const TEMPS = [34, 30, 26, 22]; // illustratief: rij A..D
const tempColor = (c: number) => (c <= 23 ? C.cold : c <= 27 ? '#F59E0B' : C.hot);

const Problem: React.FC = () => {
  const t = useSec();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = lerpCam(
    {focus: [rackX(4) + 0.3, 1.9, 1.0], zoom: 3.4, az: 28, el: 24},
    OVERVIEW,
    ramp(t, 0, 3),
  );
  const items = [...base(cam)];
  for (let r = 0; r < 4; r++) {
    const s0 = 2.5 + (3 - r) * 0.6;
    items.push(
      ...row(cam, r, 1, {
        opacity: (i) => (r === 0 ? 1 : t > s0 + i * 0.05 ? 1 : 0),
        dz: (i) => (r === 0 ? 0 : 2.5 * (1 - spring({frame: f - (s0 + i * 0.05) * fps, fps, config: {damping: 16, mass: 0.6}}))),
      }),
    );
  }
  const airOn = ramp(t, 5, 6.5);
  for (let r = 0; r < 4; r++) {
    for (const i of [1, 4, 7]) {
      // intake: rij D uit de open ruimte (koud), de rest uit de uitblaas van de rij erachter
      const inColor = r === 3 ? C.cold : tempColor(TEMPS[r + 1] + 2);
      items.push(...rackAir(cam, r, i, 1, t + r * 0.3, {opacity: airOn, inColor}));
    }
  }
  return (
    <Bg>
      <World items={items} />
      {[3, 2, 1, 0].map((r, k) => (
        <Tag
          key={r}
          cam={cam}
          at={[ROW_X1 + 0.2, ROW_Y[r] + 1.4, 2.4]}
          text={`${TEMPS[r]} °C`}
          mono
          size={40}
          color={tempColor(TEMPS[r])}
          opacity={fadeWin(t, 8 + k * 1.6, 25.6)}
        />
      ))}
      <Tag cam={cam} at={[0.5, 5.4, 3.0]} text="over-cooling the whole room" size={34} color={C.navy} opacity={fadeWin(t, 17.5, 25.6)} />
      <Locator label="Classroom layout" opacity={1} />
      <ChapterTitle text="The problem" start={0.2} dur={3.2} />
    </Bg>
  );
};

// ---------- Scène 5: warme en koude gang ----------

const coldAisles = (cam: Camera, o: number, vol = 0.12): Drawable[] => [
  zone(cam, RACK_X0, 2.4, ROW_X1, 3.6, C.cold, {floor: 0.35 * o, volume: vol * o}),
  zone(cam, RACK_X0, 7.2, ROW_X1, 8.4, C.cold, {floor: 0.35 * o, volume: vol * o}),
];
const hotAisles = (cam: Camera, o: number, vol = 0.1): Drawable[] => [
  zone(cam, RACK_X0, 4.8, ROW_X1, 6.0, C.hot, {floor: 0.3 * o, volume: vol * o}),
  zone(cam, RACK_X0, 0.0, ROW_X1, 1.2, C.hot, {floor: 0.2 * o}),
  zone(cam, RACK_X0, 9.6, ROW_X1, 10.8, C.hot, {floor: 0.2 * o}),
];

const Principle: React.FC = () => {
  const t = useSec();
  const cam = lerpCam(OVERVIEW, {...OVERVIEW, az: 70, zoom: 1.55}, ramp(t, 0, 26));
  const flip = (r: number) => (i: number) => (r === 1 || r === 3 ? ramp(t, 2 + i * 0.12 + (r === 3 ? 0.4 : 0), 3.2 + i * 0.12 + (r === 3 ? 0.4 : 0)) : 0);
  const zonesOn = ramp(t, 6, 7.5);
  const items = [...base(cam), ...coldAisles(cam, zonesOn), ...hotAisles(cam, zonesOn)];
  for (let r = 0; r < 4; r++) items.push(...row(cam, r, 1, {flip: flip(r)}));

  const airOn = ramp(t, 8, 9);
  for (let r = 0; r < 4; r++) for (const i of [1, 4, 7]) items.push(...rackAir(cam, r, i, CORRECT[r], t, {opacity: airOn}));
  // retour naar de koelunits en aanvoer vanuit de koelunits
  const retOn = ramp(t, 16, 17);
  const ret: React.ReactNode[] = [5.4, 0.6].map((y) => (
    <AirStream key={`r${y}`} cam={cam} t={t} color={C.hot} opacity={retOn} count={6} speed={1.6} path={[[5, y, 1.6], [5, y, 2.6], [1.2, y < 3 ? 1.9 : 5.3, 2.6], [1.05, y < 3 ? 1.9 : 5.3, 2.1]]} />
  ));
  const sup: React.ReactNode[] = [3.0, 7.8].map((y) => (
    <AirStream key={`s${y}`} cam={cam} t={t} color={C.cold} opacity={retOn} count={6} speed={1.6} path={[[1.05, y < 5 ? 5.3 : 8.7, 0.3], [2.0, y, 0.15], [7.0, y, 0.15]]} />
  ));
  return (
    <Bg>
      <World items={items} overlay={<g>{ret}{sup}</g>} />
      <Tag cam={cam} at={[ROW_X1 + 0.5, 3.0, 0.2]} text="COLD AISLE" color={C.cold} size={36} opacity={fadeWin(t, 9.5, 25.6)} />
      <Tag cam={cam} at={[ROW_X1 + 0.5, 7.8, 0.2]} text="COLD AISLE" color={C.cold} size={36} opacity={fadeWin(t, 10, 25.6)} />
      <Tag cam={cam} at={[ROW_X1 + 0.5, 5.4, 0.2]} text="HOT AISLE" color={C.hot} size={36} opacity={fadeWin(t, 12, 25.6)} />
      <Tag cam={cam} at={[0.55, 3.2, 3.0]} text="return to CRAH" mono size={30} color={C.navy} opacity={fadeWin(t, 17, 25.6)} />
      <Locator label="Hot / cold aisle" opacity={1} />
      <ChapterTitle text="Hot and cold aisles" start={0.2} dur={3.2} />
    </Bg>
  );
};

// ---------- Scène 6: uitlijnen op het grid ----------

const Grid: React.FC = () => {
  const t = useSec();
  const cam = lerpCam(OVERVIEW, {focus: [4.8, 3.0, 0.4], zoom: 2.7, az: 52, el: 62}, ramp(t, 0, 3));
  const items = [...base(cam), ...coldAisles(cam, 0.35 * (1 - ramp(t, 3, 4)), 0)];
  // geperforeerde tegels: 2 × 8 in de koude gang
  const moving = {from: 6.6, to: 3.0, y: 3.0};
  for (let k = 0; k < 16; k++) {
    const x = RACK_X0 + (k % 8) * ROOM.tile;
    const y = 2.4 + Math.floor(k / 8) * ROOM.tile;
    const on = ramp(t, 4.5 + k * 0.15, 5 + k * 0.15);
    const isMoving = Math.abs(x - moving.from) < 0.01 && Math.abs(y - moving.y) < 0.01;
    if (isMoving) {
      const m = ramp(t, 16, 19);
      const lift = Math.sin(Math.PI * m) * 0.5;
      items.push(perfTile(cam, x + (moving.to - moving.from) * m, y, C.teal, on, lift));
    } else if (!(Math.abs(x - moving.to) < 0.01 && Math.abs(y - moving.y) < 0.01)) {
      items.push(perfTile(cam, x, y, C.teal, on));
    }
  }
  for (let r = 0; r < 4; r++) items.push(...row(cam, r, CORRECT[r]));
  return (
    <Bg>
      <World
        items={items}
        overlay={
          <g>
            <Dim cam={cam} a={[ROW_X1 + 0.3, 2.4, 0.02]} b={[ROW_X1 + 0.3, 3.6, 0.02]} label="1.2 m = 2 tiles" opacity={ramp(t, 9, 10)} />
          </g>
        }
      />
      <EdgeHighlight cam={cam} y={[2.4, 3.6]} opacity={fadeWin(t, 1.5, 9, 0.6)} />
      <Tag cam={cam} at={[ROW_X1 + 0.3, 2.4, 0]} text="rack front on tile edge" size={32} color={C.orange} dx={150} dy={10} opacity={fadeWin(t, 2.5, 9)} />
      <Tag cam={cam} at={[5.0, 3.0, 0.1]} text="full perforated tiles" size={32} color={C.teal} dy={-80} opacity={fadeWin(t, 11, 15.5)} />
      <Tag cam={cam} at={[4.8, 3.0, 0.6]} text="move a tile — no cutting" size={32} color={C.teal} dy={-80} opacity={fadeWin(t, 16, 22.6)} />
      <Locator label="Grid alignment" opacity={1} highlight={{x: 2.4, y: 2.4, w: 4.8, h: 1.2}} />
      <ChapterTitle text="Grid alignment" start={0.2} dur={3.2} />
    </Bg>
  );
};

const EdgeHighlight: React.FC<{cam: Camera; y: number[]; opacity: number}> = ({cam, y, opacity}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}} opacity={opacity}>
    {y.map((yy) => {
      const a = toS(cam, [RACK_X0 - 0.3, yy, 0.02]);
      const b = toS(cam, [ROW_X1 + 0.3, yy, 0.02]);
      return <line key={yy} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.orange} strokeWidth={6} strokeDasharray="18 10" />;
    })}
  </svg>
);

const toS = (cam: Camera, p: P3) => toScreen(p, cam);

// ---------- Scène 7: zo niet / zo wel ----------

const PANEL_CAM: Camera = {focus: [5.2, 3.4, 0.6], zoom: 2.2, az: 56, el: 55};

const Panel: React.FC<{good: boolean; t: number}> = ({good, t}) => {
  const cam = PANEL_CAM;
  const items = [...base(cam)];
  // rij A en B, met fouten in de linker versie
  const wrong = 5; // rack dat verkeerd om staat (rij B)
  const gap = 3; // ontbrekend rack in rij A
  items.push(...row(cam, 0, 1, {skip: good ? [] : [gap]}));
  items.push(
    ...row(cam, 1, -1, {
      facing: (i) => (!good && i === wrong ? 1 : -1),
      outline: (i) => (!good && i === wrong && t > 3.5 ? C.dont : undefined),
    }),
  );
  // koude gang tegels
  for (let k = 0; k < 8; k++) items.push(perfTile(cam, RACK_X0 + k * 0.6, 3.0, C.teal));
  if (!good) items.push(perfTile(cam, rackX(5), 5.4, C.dont), perfTile(cam, rackX(2), 5.4, C.dont));
  else items.push(...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => perfTile(cam, RACK_X0 + k * 0.6, 2.4, C.teal)));
  items.push(
    zone(cam, RACK_X0, 2.4, ROW_X1, 3.6, C.cold, {floor: 0.2}),
    zone(cam, RACK_X0, 4.8, ROW_X1, 6.0, C.hot, {floor: 0.2}),
  );

  for (const i of [1, 4, 6]) {
    items.push(...rackAir(cam, 0, i, 1, t));
    if (good || i !== wrong) items.push(...rackAir(cam, 1, i, -1, t));
  }
  if (!good) {
    // verkeerd om: blaast heet in de koude gang
    items.push(...rackAir(cam, 1, wrong, 1, t, {inColor: C.hot, outColor: C.hot, opacity: ramp(t, 3.5, 4.5)}));
    // gat: warme lucht kringelt terug
    const gx = rackX(gap) + 0.3;
    items.push(air(cam, {t, color: C.hot, count: 4, opacity: ramp(t, 9, 10), path: [[gx, 0.5, 1.2], [gx, 1.8, 1.2], [gx, 3.2, 1.0]]}));
    // tegel in de warme gang: koude lucht verdwijnt
    for (const x of [rackX(5), rackX(2)])
      items.push(air(cam, {t, color: C.cold, count: 3, opacity: ramp(t, 14.5, 15.5), path: [[x + 0.3, 5.7, 0.05], [x + 0.3, 5.7, 2.4]]}));
  }
  const marks = good
    ? []
    : [
        {at: [rackX(wrong) + 0.3, 4.2, 2.6] as P3, s: 3.5},
        {at: [rackX(gap) + 0.3, 1.8, 2.6] as P3, s: 9},
        {at: [rackX(3.5), 5.7, 0.4] as P3, s: 14.5},
      ];
  return (
    <>
      <World items={items} />
      {marks.map((m, n) => (
        <Tag key={n} cam={cam} at={m.at} text={`${n + 1}`} size={44} color={C.dont} opacity={ramp(t, m.s, m.s + 0.5)} />
      ))}
    </>
  );
};

const DontDo: React.FC = () => {
  const t = useSec();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inn = spring({frame: f, fps, config: {damping: 200}});
  const goodOn = ramp(t, 19, 20);
  const half = (good: boolean) => (
    <div
      style={{
        position: 'absolute',
        top: 40,
        bottom: 40,
        left: good ? 980 : 40,
        width: 900,
        overflow: 'hidden',
        borderRadius: 14,
        border: `8px solid ${good ? C.do : C.dont}`,
        background: 'linear-gradient(180deg, #F7F9FB 0%, #E4EAF0 100%)',
        opacity: good ? goodOn : inn,
      }}
    >
      <div style={{position: 'absolute', left: -510, top: -60, width: 1920, height: 1080, transform: 'scale(1)'}}>
        <Panel good={good} t={t} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: good ? C.do : C.dont,
          color: 'white',
          fontFamily: F.sans,
          fontWeight: 700,
          fontSize: 48,
          padding: '6px 24px',
          borderRadius: 8,
        }}
      >
        {good ? '✓ DO' : "✕ DON'T"}
      </div>
    </div>
  );
  const items = ['Rack turned the wrong way', 'Open gap in a row', 'Perforated tile in the hot aisle'];
  return (
    <AbsoluteFill style={{background: C.navy}}>
      {half(false)}
      {half(true)}
      <div style={{position: 'absolute', left: 1020, top: 300, fontFamily: F.sans, opacity: 1 - goodOn}}>
        <div style={{color: '#9FB0C2', fontSize: 34, fontWeight: 600, letterSpacing: 4, marginBottom: 28}}>COMMON MISTAKES</div>
        {items.map((it, n) => {
          const s = [3.5, 9, 14.5][n];
          return (
            <div key={n} style={{display: 'flex', gap: 24, alignItems: 'center', marginBottom: 30, opacity: ramp(t, s, s + 0.5)}}>
              <div style={{background: C.dont, color: 'white', fontWeight: 700, fontSize: 44, width: 72, height: 72, borderRadius: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                {n + 1}
              </div>
              <div style={{color: 'white', fontSize: 50, fontWeight: 600, lineHeight: 1.15}}>{it}</div>
            </div>
          );
        })}
      </div>
      <ChapterTitle text="Don't / Do" start={0.2} dur={3} />
    </AbsoluteFill>
  );
};

// ---------- Scène 8 en 9: checklist en recap ----------

const Checklist: React.FC = () => (
  <NavyBg>
    <TickList
      title="On-site checklist"
      start={2.4}
      step={2.7}
      items={['All fronts face the cold aisle', 'Rows aligned to the floor grid', 'Perforated tiles only in the cold aisle', 'Every gap in a row closed']}
    />
  </NavyBg>
);

const Recap: React.FC = () => (
  <NavyBg>
    <TickList
      title="Recap"
      numbered
      start={1.4}
      step={2.4}
      items={['Alternate rows into hot and cold aisles', 'Align rows to the floor grid', 'Keep hot and cold air apart']}
    />
  </NavyBg>
);

// ---------- Scène 10: vooruitblik en eindscherm ----------

const Next: React.FC = () => {
  const t = useSec();
  const cam = lerpCam(OVERVIEW, {...OVERVIEW, az: 66, zoom: 1.6}, ramp(t, 0, 5));
  const items = [...base(cam), ...coldAisles(cam, 1, 0.08), ...hotAisles(cam, 0.6, 0)];
  for (let r = 0; r < 4; r++) items.push(...row(cam, r, CORRECT[r]));
  // teaser: warmegangafsluiting (dak + deuren)
  const roof = ramp(t, 1, 3);
  items.push(box(cam, [RACK_X0, 4.8, 2.0 + (1 - roof) * 1.5], [ROW_X1 - RACK_X0, 1.2, 0.06], {top: 'rgba(239,68,68,0.35)', x: 'rgba(239,68,68,0.5)', y: 'rgba(239,68,68,0.5)'}, {opacity: roof}));
  items.push(box(cam, [ROW_X1, 4.8, 0], [0.05, 1.2, 2.0], {top: '#9FB0C2', x: 'rgba(160,176,194,0.75)', y: '#9FB0C2'}, {opacity: ramp(t, 2.5, 3.5)}));
  const endOn = ramp(t, 5, 6);
  return (
    <AbsoluteFill>
      <Bg>
        <World items={items} />
        <Tag cam={cam} at={[5, 5.4, 2.6]} text="next up: containment" size={34} color={C.hot} opacity={fadeWin(t, 2.5, 5.4)} />
      </Bg>
      <AbsoluteFill style={{background: C.navy, opacity: endOn}}>
        <div style={{position: 'absolute', left: 120, top: 120}}>
          <HetsMark size={64} />
        </div>
        <div style={{position: 'absolute', left: 120, top: 260, fontFamily: F.sans, color: 'white'}}>
          <div style={{fontSize: 34, color: '#9FB0C2', fontWeight: 600, letterSpacing: 4}}>NEXT EPISODE</div>
          <div style={{fontSize: 72, fontWeight: 700, marginTop: 8}}>
            <span style={{fontFamily: F.mono, color: C.orange, marginRight: 24}}>1.3</span>Zones and Functions
          </div>
          <div style={{fontSize: 40, color: '#C9D1DA', marginTop: 16}}>Where the MDA, HDA and EDA belong</div>
        </div>
        {/* vrije vlakken voor YouTube-eindschermelementen (video + playlist) */}
        <div style={{position: 'absolute', left: 120, top: 560, width: 780, height: 440, border: '3px dashed rgba(255,255,255,0.18)', borderRadius: 12}} />
        <div style={{position: 'absolute', left: 1020, top: 560, width: 780, height: 440, border: '3px dashed rgba(255,255,255,0.18)', borderRadius: 12}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Compositie ----------

const SCENE_COMPONENTS: Record<string, React.FC> = {
  bumper: Bumper,
  hall: Hall,
  airflow: Airflow,
  problem: Problem,
  principle: Principle,
  grid: Grid,
  dontdo: DontDo,
  checklist: Checklist,
  recap: Recap,
  next: Next,
};

const CUES = cues();

export type Ep12Props = {burnCaptions: boolean};

export const Ep12: React.FC<Ep12Props> = ({burnCaptions}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cue = burnCaptions ? CUES.find((c) => t >= c.start && t < c.end) : undefined;
  return (
    <AbsoluteFill style={{background: C.navy}}>
      {SCENES.map((s) => {
        const Comp = SCENE_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={Math.round(sceneStart(s.id) * FPS)} durationInFrames={Math.round(s.dur * FPS)} name={s.id}>
            <Comp />
          </Sequence>
        );
      })}
      {burnCaptions && <Caption text={cue?.text ?? null} />}
    </AbsoluteFill>
  );
};
