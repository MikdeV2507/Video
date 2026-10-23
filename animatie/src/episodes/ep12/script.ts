// Episode 1.2 — Rows and Aisles.
// Eén bron voor scène-timing, voice-overtekst, ondertitels en YouTube-hoofdstukken.
// Bron van de tekst: curriculum/1.2-rows-and-aisles.md

export type Scene = {
  id: string;
  dur: number; // seconden
  chapter?: string; // YouTube-hoofdstuk dat bij deze scène begint
  vo: string;
  voDelay?: number; // seconden na scènebegin
};

export const WPM = 140;

export const SCENES: Scene[] = [
  {id: 'bumper', dur: 3, chapter: 'Intro', vo: ''},
  {
    id: 'hall',
    dur: 17,
    vo: 'In the last episode we laid out the grid. Now we place the first racks — and the way we line them up decides how well this room can be cooled for the next fifteen years.',
  },
  {
    id: 'airflow',
    dur: 18,
    vo: 'Almost all IT equipment breathes the same way: it draws cool air in at the front and blows hot air out at the back. Every layout decision in the whitespace starts from that simple fact.',
  },
  {
    id: 'problem',
    dur: 26,
    chapter: 'The problem',
    vo: 'Line your rows up like a classroom, all facing the same direction, and the hot exhaust of one row becomes the intake air of the next. Each row runs warmer than the one before. You end up over-cooling the whole room just to keep the last row within limits.',
    voDelay: 1.2,
  },
  {
    id: 'principle',
    dur: 26,
    chapter: 'Hot and cold aisles',
    vo: 'The solution is to alternate. Rows face each other front-to-front, creating a cold aisle, and back-to-back, creating a hot aisle. Cold air is delivered only where equipment takes it in, and hot air is collected where it comes out, and returned to the cooling units.',
    voDelay: 1.2,
  },
  {
    id: 'grid',
    dur: 23,
    chapter: 'Grid alignment',
    vo: 'Now align the rows to the floor grid. Place the rack fronts on a tile edge, so the cold aisle consists of full tiles. That way every perforated tile can be placed exactly where it is needed — and moved later without cutting the floor.',
    voDelay: 1.2,
  },
  {
    id: 'dontdo',
    dur: 27,
    chapter: "Don't / Do",
    vo: 'Three mistakes we see on site: one rack turned the wrong way in an otherwise correct row; an open gap in a row where hot air can wrap around; and perforated tiles placed in the hot aisle. Each one mixes hot and cold air — and wastes the cooling you paid for.',
    voDelay: 1.2,
  },
  {
    id: 'checklist',
    dur: 17,
    chapter: 'On-site checklist',
    vo: 'On site, check four things: all fronts face the cold aisle; rows are aligned to the grid; perforated tiles sit only in the cold aisle; and every gap in a row is closed.',
    voDelay: 0.8,
  },
  {
    id: 'recap',
    dur: 15,
    chapter: 'Recap',
    vo: 'To recap: alternate your rows into hot and cold aisles. Align them to the floor grid. And keep hot and cold air apart — no wrong-way racks, no open gaps.',
    voDelay: 0.6,
  },
  {
    id: 'next',
    dur: 15,
    vo: 'Next: zones and functions — where the MDA, HDA and EDA belong in this room.',
    voDelay: 0.5,
  },
];

export const sceneStart = (id: string) => {
  let t = 0;
  for (const s of SCENES) {
    if (s.id === id) return t;
    t += s.dur;
  }
  throw new Error(`Onbekende scène ${id}`);
};

export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);

export type Cue = {start: number; end: number; text: string};

// Splitst de VO in ondertitelregels (max ~11 woorden, breekt bij leestekens) en
// verdeelt de tijd naar rato van het aantal tekens.
export const cues = (): Cue[] => {
  const out: Cue[] = [];
  for (const s of SCENES) {
    if (!s.vo) continue;
    const t0 = sceneStart(s.id) + (s.voDelay ?? 0.5);
    const words = s.vo.split(/\s+/);
    const voDur = (words.length / WPM) * 60;
    const chunks: string[] = [];
    let cur: string[] = [];
    for (const w of words) {
      cur.push(w);
      const brk = /[.,;:—?!]$/.test(w) || w === '—';
      if ((brk && cur.length >= 4) || cur.length >= 11) {
        chunks.push(cur.join(' '));
        cur = [];
      }
    }
    if (cur.length) chunks.push(cur.join(' '));
    const total = chunks.reduce((a, c) => a + c.length, 0);
    let t = t0;
    for (const c of chunks) {
      const d = (c.length / total) * voDur;
      out.push({start: t, end: t + d, text: c});
      t += d;
    }
  }
  return out;
};

export const chapters = () =>
  SCENES.filter((s) => s.chapter).map((s) => ({t: sceneStart(s.id), title: s.chapter!}));
