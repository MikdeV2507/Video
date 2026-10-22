// Rendert losse frames (seconden als argumenten) voor een snelle visuele controle.
// Gebruik: node scripts/preview.mjs <uitmap> 12 45.5 90
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {existsSync} from 'node:fs';
import path from 'node:path';

const [outDir, ...secs] = process.argv.slice(2);
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = existsSync(shell) ? shell : undefined;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const inputProps = {burnCaptions: true};
const composition = await selectComposition({serveUrl, id: 'Ep12RowsAndAisles', inputProps, browserExecutable});
for (const s of secs) {
  await renderStill({composition, serveUrl, output: `${outDir}/s${s}.png`, frame: Math.round(Number(s) * 30), inputProps, scale: 0.5, browserExecutable});
}
console.log('klaar');
