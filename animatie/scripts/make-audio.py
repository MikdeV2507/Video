#!/usr/bin/env python3
"""Genereert de muziekondergrond + geluidseffecten voor aflevering 1.2.

Alles wordt hier zelf gesynthetiseerd (geen samples, geen licenties nodig).
De muziek ligt bewust laag in de mix, zodat de voice-over er later bovenop past.
Timing volgt src/episodes/ep12/script.ts en de animaties in Ep12.tsx.

Gebruik: python3 scripts/make-audio.py   ->  public/audio/ep12-bed.wav
"""
import re
import wave
from pathlib import Path

import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(12)

# ---------- scène-starts uit script.ts ----------
script = (ROOT / 'src/episodes/ep12/script.ts').read_text()
scenes = [(m.group(1), int(m.group(2))) for m in re.finditer(r"id: '(\w+)',\s*dur: (\d+)", script)]
START, t = {}, 0
for sid, dur in scenes:
    START[sid] = t
    t += dur
TOTAL = t
N = int(TOTAL * SR)


def env_adsr(n, a=0.01, r=0.2):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def lowpass_fast(x, cutoff):
    # FFT-gebaseerde low-pass voor lange signalen
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def note(freq):
    return 440.0 * 2 ** ((freq - 69) / 12)


# ---------- muziek: rustige pad met akkoordenschema ----------
# A-mineur, Am - F - C - G, 4 maten van 4 tellen op 76 bpm
bpm = 76
bar = 4 * 60 / bpm
chords = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]]
music = np.zeros(N)
tt = np.arange(N) / SR
for k in range(int(TOTAL / bar) + 1):
    t0 = k * bar
    ch = chords[k % 4]
    n0 = int(t0 * SR)
    n1 = min(N, int((t0 + bar + 1.5) * SR))  # overlap voor zachte overgang
    if n0 >= N: break
    seg = np.arange(n1 - n0) / SR
    env = np.minimum(1, seg / 1.2) * np.minimum(1, (seg[-1] - seg + 1e-9) / 1.5)
    for m in ch:
        f = note(m)
        for det in (-0.12, 0.12):  # licht ontstemd voor breedte
            ff = f * 2 ** (det / 12)
            music[n0:n1] += env * (np.sin(2 * np.pi * ff * seg) + 0.25 * np.sin(4 * np.pi * ff * seg)) * 0.05
    # bas
    fb = note(ch[0] - 12)
    music[n0:n1] += env * np.sin(2 * np.pi * fb * seg) * 0.09
# zachte puls (8e noten) op de grondtoon, voor beweging
step = 60 / bpm / 2
for k in range(int(TOTAL / step)):
    t0 = k * step
    ch = chords[int(t0 / bar) % 4]
    f = note(ch[(k % 3) + 1] + 12)
    n0 = int(t0 * SR)
    n = int(0.35 * SR)
    if n0 + n > N: break
    s = np.arange(n) / SR
    music[n0:n0 + n] += np.sin(2 * np.pi * f * s) * np.exp(-s * 9) * 0.035
music = lowpass_fast(music, 2600)
# in- en uitfaden
fade = np.ones(N)
fade[: int(2 * SR)] = np.linspace(0, 1, int(2 * SR))
fade[-int(4 * SR):] = np.linspace(1, 0, int(4 * SR))
music *= fade

# ---------- geluidseffecten ----------
sfx = np.zeros(N)


def add(sig, at, gain=1.0):
    n0 = int(at * SR)
    if n0 >= N: return
    n1 = min(N, n0 + len(sig))
    sfx[n0:n1] += sig[: n1 - n0] * gain


def whoosh(dur=1.0, f0=300, f1=2500):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    s = np.arange(n) / SR
    # filter-sweep via meerdere low-passes in blokken
    out = np.zeros(n)
    blocks = 24
    for b in range(blocks):
        a, z = b * n // blocks, (b + 1) * n // blocks
        fc = f0 + (f1 - f0) * np.sin(np.pi * (b + 0.5) / blocks)
        out[a:z] = lowpass_fast(noise, fc)[a:z]
    env = np.sin(np.pi * s / dur) ** 2
    return out * env * 0.5


def thud(f=70):
    n = int(0.35 * SR)
    s = np.arange(n) / SR
    pitch = f * (1 + 1.5 * np.exp(-s * 30))
    return np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-s * 14) * 0.9


def tick(f=1800):
    n = int(0.12 * SR)
    s = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * s) + 0.5 * np.sin(2 * np.pi * f * 1.5 * s)) * np.exp(-s * 40) * 0.35


def chime(freqs, dur=1.6, gain=0.25):
    n = int(dur * SR)
    s = np.arange(n) / SR
    out = sum(np.sin(2 * np.pi * f * s) * np.exp(-s * (2.5 + i)) for i, f in enumerate(freqs))
    return out * env_adsr(n, 0.005, 0.3) * gain


def blip_low():
    n = int(0.28 * SR)
    s = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * 180 * s)) * np.exp(-s * 12) * 0.12


S = START
# 1 intro
add(chime([note(69), note(76), note(81)], 2.4, 0.3), 0.05)
# 2 zaal: aanvliegen + racks die landen
add(whoosh(3.0, 200, 1400), S['hall'] + 0.2, 0.6)
for i in range(8):
    add(thud(), S['hall'] + 8 + i * 0.35 + 0.18, 0.55)
# 3 airflow
add(whoosh(1.6, 300, 1800), S['airflow'] + 0.2, 0.45)
# 4 probleem: hoofdstuk + rijen B, C, D
add(whoosh(1.0), S['problem'] + 0.1, 0.5)
for r in (1, 2, 3):
    add(thud(60), S['problem'] + 2.5 + (3 - r) * 0.6 + 0.2, 0.7)
for k in range(4):
    add(tick(900 + k * 150), S['problem'] + 8 + k * 1.6, 0.6)
# 5 principe: hoofdstuk + rijen draaien
add(whoosh(1.0), S['principle'] + 0.1, 0.5)
add(whoosh(1.6, 400, 3000), S['principle'] + 2.0, 0.45)
add(whoosh(1.6, 400, 3000), S['principle'] + 2.4, 0.35)
add(chime([note(64), note(69)], 1.2, 0.18), S['principle'] + 6.5)
# 6 grid: hoofdstuk, tegels, tegel verplaatsen
add(whoosh(1.0), S['grid'] + 0.1, 0.5)
for k in range(16):
    add(tick(2200), S['grid'] + 4.5 + k * 0.15, 0.25)
add(whoosh(2.4, 300, 1200), S['grid'] + 16.3, 0.4)
add(thud(90), S['grid'] + 19.0, 0.35)
# 7 don't/do
add(whoosh(1.0), S['dontdo'] + 0.1, 0.5)
for s in (3.5, 9, 14.5):
    add(blip_low(), S['dontdo'] + s, 1.0)
add(chime([note(72), note(76), note(79)], 1.8, 0.28), S['dontdo'] + 19)
# 8 checklist: vinkjes
add(whoosh(1.0), S['checklist'] + 0.1, 0.4)
for i in range(4):
    add(tick(1600 + i * 120), S['checklist'] + 2.4 + i * 2.7 + 0.5, 0.9)
# 9 recap
for i in range(3):
    add(tick(1200 + i * 200), S['recap'] + 1.4 + i * 2.4 + 0.1, 0.8)
# 10 volgende
add(whoosh(2.0, 200, 900), S['next'] + 1.0, 0.45)
add(chime([note(57), note(64), note(69), note(76)], 3.5, 0.28), S['next'] + 5.0)

# ---------- mix ----------
mix = music * 0.55 + sfx * 0.6
peak = np.max(np.abs(mix))
mix = mix / peak * 0.85  # headroom; de voice-over komt er later bovenop
stereo = np.stack([mix, mix], axis=1)
# klein beetje breedte op de muziek
stereo[:, 0] += np.roll(music, 240) * 0.02
stereo[:, 1] -= np.roll(music, 240) * 0.02
pcm = (np.clip(stereo, -1, 1) * 32767).astype('<i2')

out = ROOT / 'public/audio/ep12-bed.wav'
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f'{out} — {TOTAL} s')
