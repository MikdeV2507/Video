# Animaties — HETS Data Centre Whitespace

Code-gebaseerde animaties (route A uit `STRATEGIE.md`) met [Remotion](https://www.remotion.dev):
React-componenten die naar MP4 renderen.

## Snel starten

```bash
cd animatie
npm install
npm run studio          # live voorbeeld in de browser, met tijdlijn
npm run render:review   # MP4 met ingebrande ondertitels (voor de review-ronde)
npm run render:pilot    # schone MP4 voor YouTube (ondertitels gaan als .srt mee)
npm run render:thumb    # YouTube-thumbnail 1280×720
npm run captions        # .srt + YouTube-hoofdstukken naar ../export/
```

Exports komen in `../export/` (staat niet in git).

## Opbouw

| Pad | Inhoud |
|---|---|
| `src/theme.ts` | HETS-kleuren, fonts (Archivo, IBM Plex Mono), formaat |
| `src/iso.ts` | Axonometrische projectie en camera (`focus`, `zoom`, `az`, `el`) |
| `src/components/world.tsx` | De demo-zaal: vloer, wanden, CRAH, rack, zones, perforatietegels, luchtstromen, maatlijnen |
| `src/components/ui.tsx` | Logo, hoofdstuktitels, labels, locator-kaart, ondertitels, checklist |
| `src/episodes/ep12/script.ts` | **Leidend** voor scène-duur, voice-overtekst, ondertitels en hoofdstukken |
| `src/episodes/ep12/Ep12.tsx` | De scènes van aflevering 1.2 |

Een nieuwe aflevering = een nieuwe map in `src/episodes/` met een `script.ts` en scènes die de
gedeelde wereld-componenten hergebruiken.

## Muziek en geluidseffecten

`python3 scripts/make-audio.py` genereert `public/audio/ep12-bed.wav` (muziekondergrond + effecten,
getimed op `script.ts`). Draai het opnieuw na een wijziging in de scène-duur en render daarna opnieuw.

## Voice-over toevoegen

Zodra de professionele opname er is (WAV per scène, zie stijlgids):
1. Zet de bestanden in `public/vo/ep12/<scene-id>.wav`.
2. Voeg per scène `<Audio src={staticFile(...)} />` toe in `Ep12.tsx`.
3. Pas `dur` / `voDelay` in `script.ts` aan op de werkelijke lengte; `npm run captions` waarschuwt als een tekst niet in de scène past.

## Licentie

Remotion is gratis voor individuen en bedrijven tot 3 medewerkers; daarboven is een
[company license](https://www.remotion.pro) nodig.
