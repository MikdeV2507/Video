// Schrijft de Engelse ondertitels (.srt) en de YouTube-hoofdstukken voor aflevering 1.2.
import {mkdirSync, writeFileSync} from 'node:fs';
import {chapters, cues, SCENES, sceneStart, WPM} from '../src/episodes/ep12/script';

const ts = (s: number, sep = ',') => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${p(h)}:${p(m)}:${p(sec)}${sep}${p(r, 3)}`;
};

// Controle: past de voice-over binnen elke scène?
for (const s of SCENES) {
  if (!s.vo) continue;
  const need = (s.voDelay ?? 0.5) + (s.vo.split(/\s+/).length / WPM) * 60 + 0.5;
  if (need > s.dur) console.warn(`LET OP: VO van scène '${s.id}' duurt ${need.toFixed(1)} s, scène is ${s.dur} s`);
}

mkdirSync('../export', {recursive: true});
const srt = cues()
  .map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`)
  .join('\n');
writeFileSync('../export/ep1.2-rows-and-aisles.en.srt', srt);

const ch = chapters()
  .map((c) => {
    const m = Math.floor(c.t / 60);
    const s = Math.floor(c.t % 60);
    return `${m}:${String(s).padStart(2, '0')} ${c.title}`;
  })
  .join('\n');
writeFileSync('../export/ep1.2-youtube-chapters.txt', ch + '\n');
console.log(ch);
console.log(`Ondertitels: ${cues().length} regels; totale duur ${sceneStart('next') + SCENES[SCENES.length - 1].dur} s`);
