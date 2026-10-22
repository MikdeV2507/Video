import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';

// Gebruik de vooraf geïnstalleerde headless Chromium als die er is (cloudomgeving);
// lokaal downloadt Remotion zelf een browser.
const localShell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (existsSync(localShell)) {
  Config.setBrowserExecutable(localShell);
}

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
