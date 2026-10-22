# Strategie & plan — Videoserie "Whitespace inrichten in het datacenter"

> Status: **concept v0.1** — om samen verder aan te scherpen. Open vragen staan onderaan.

---

## 1. Doel en doelgroep

**Doel:** een herbruikbare serie korte video's/animaties die de *werkwijze* en *principes*
van het inrichten van de whitespace (de IT-ruimte) helder en eenduidig uitlegt.

**Doelgroep:** professionals die al in de datacenter- en computerruimtebranche werken:
installateurs, monteurs (bekabeling, elektra, koeling), projectleiders, werkvoorbereiders,
engineers, DC-operators en accountmanagers.

**Wat dat betekent voor het niveau:**

- Geen basisuitleg van "wat is een server"; vakjargon (U, PDU, MDA, CAC, 2N) mag, maar wordt
  bij eerste gebruik kort gedefinieerd in beeld.
- Focus op het **waarom** achter keuzes (principes) en het **hoe** (werkwijze, volgorde, controlepunten).
- Verwijzen naar normen (EN 50600, ISO/IEC 11801-5, TIA-942, TIA-606, ASHRAE TC9.9) zonder normteksten voor te lezen.
- Praktijkvoorbeelden en veelgemaakte fouten ("zo niet / zo wel") boven theorie.

**Leerresultaat na de hele serie:** de kijker kan een whitespace-indeling lezen, beoordelen
en de logische volgorde van ontwerp → installatie → oplevering uitleggen en toepassen.

---

## 2. Didactische principes

| Principe | Uitwerking |
|---|---|
| **Microlearning** | Afleveringen van **3–6 minuten**, één onderwerp per video. Goed op telefoon, tussendoor op locatie. |
| **Eén vaste opbouw per aflevering** | Herkenbaarheid verlaagt de cognitieve belasting (zie §4). |
| **Van grof naar fijn** | Gebouw → zaal → rij → rack → kabel/poort. Elke aflevering laat zien *waar* we zijn in die zoom. |
| **Eén doorlopend voorbeeld-datacenter** | Eén fictieve zaal ("DC Demo-zaal 1") die in elke aflevering verder wordt ingericht. De kijker ziet de whitespace letterlijk groeien. |
| **Visueel boven tekst** | Animatie toont het principe; tekst in beeld alleen voor kernbegrippen en getallen. |
| **Zo niet / zo wel** | Elke aflevering minstens één herkenbare fout en de correcte oplossing. |
| **Toetsbaar** | Per aflevering 3 kernpunten + optioneel 2–3 controlevragen (voor LMS of PDF-kaart). |

---

## 3. Serie-opbouw (curriculum)

De serie volgt de logische volgorde waarin een whitespace wordt ontworpen en ingericht.
Indeling in **seizoenen/modules**, zodat je met module 1–2 al live kunt gaan.

### Module 0 — Kader (2 afleveringen)
| # | Titel | Kern |
|---|---|---|
| 0.1 | Wat is whitespace? | Whitespace vs. grey space, ruimtes en functies, rollen in een project |
| 0.2 | Normen & ontwerpklassen | EN 50600 beschikbaarheidsklassen, Tier-denken, waarom normen de werkwijze sturen |

### Module 1 — Ruimtelijke indeling (4)
| # | Titel | Kern |
|---|---|---|
| 1.1 | Het grid | Vloerraster (600×600), kolommen, vrije hoogte, vloerbelasting, verhoogde vloer vs. dichte vloer |
| 1.2 | Rijen en gangpaden | Warme/koude gang, hartafstanden, minimale vrije ruimte voor & achter rack, vluchtwegen |
| 1.3 | Zones en functies | Entrance room, MDA, HDA/IDA, ZDA, EDA — waar staat wat en waarom |
| 1.4 | Van eisen naar layout | Capaciteit (kW/rack, aantal racks), groeiscenario's, fasering |

### Module 2 — Koeling & luchtstromen (4)
| # | Titel | Kern |
|---|---|---|
| 2.1 | Hoe lucht door de zaal beweegt | Front-to-back, bypass en recirculatie, ASHRAE-bandbreedtes |
| 2.2 | Containment | Koude- vs. warmegangafsluiting, doors/roofs, keuzecriteria |
| 2.3 | De kleine dingen die het verschil maken | Blindplaten, borstelinvoeren, kabeldoorvoeren afdichten, geperforeerde tegels plaatsen |
| 2.4 | Hoge dichtheid | In-row, rear door, direct liquid cooling — wat verandert er in de inrichting? |

### Module 3 — Energievoorziening (3)
| # | Titel | Kern |
|---|---|---|
| 3.1 | A- en B-voeding | Redundantie N, N+1, 2N tot in het rack, voedingspaden gescheiden houden |
| 3.2 | Distributie in de zaal | Busbar/railsysteem vs. onder-vloer, tap-off-units, rack-PDU's |
| 3.3 | Aarding & potentiaalvereffening | Mesh-bonding, rackaarding, waarom dit vaak misgaat |

### Module 4 — Gestructureerde bekabeling (5)
| # | Titel | Kern |
|---|---|---|
| 4.1 | De bekabelingshiërarchie | Backbone vs. horizontaal, MDA → HDA → EDA, ster-topologie |
| 4.2 | Kabelgoten en routes | Bovenlangs vs. onder de vloer, scheiding sterk-/zwakstroom, vullingsgraad, buigradius |
| 4.3 | Precabling | Voorbekabelen van trunks, de bekabelingsmatrix, panelindeling, waarom dit tijd en fouten scheelt |
| 4.4 | Glas & koper in de praktijk | MPO/MTP, polariteit, OM4/OS2, Cat6A — kiezen en toepassen |
| 4.5 | Labelen & documenteren | TIA-606-systematiek, labels op kabel/paneel/rack, as-built |

### Module 5 — Het rack (3)
| # | Titel | Kern |
|---|---|---|
| 5.1 | U-planning | Gewicht onderin, patch-/switchposities, ruimte voor groei |
| 5.2 | Kabelmanagement in het rack | Verticale/horizontale geleiding, servicelussen, airflow vrijhouden |
| 5.3 | Rack-inbouw stap voor stap | Plaatsen, waterpas, koppelen, aarden, blindplaten |

### Module 6 — Veiligheid & beheer (3)
| # | Titel | Kern |
|---|---|---|
| 6.1 | Brand & detectie | VESDA, blussystemen, wat dit betekent voor de inrichting |
| 6.2 | Toegang & fysieke beveiliging | Zones, kooien, rackslot |
| 6.3 | Monitoring & DCIM | Sensoren op de juiste plek, capaciteitsbeheer |

### Module 7 — Werkwijze van project tot oplevering (4)
| # | Titel | Kern |
|---|---|---|
| 7.1 | De projectvolgorde | Eisen → ontwerp → werkvoorbereiding → installatie → test → oplevering |
| 7.2 | Werkvoorbereiding & logistiek | Materiaalstaten, levering, schoon werken in een live omgeving |
| 7.3 | Testen & meten | Certificeren koper, OTDR/insertion loss glas, rapportage |
| 7.4 | Oplevering & change management | As-built, overdracht, werken in een operationele zaal (MOP/MOS) |

**Totaal: ~28 afleveringen.** Plus per module een **samenvattingsvideo** (60–90 s) als trailer/opfrisser.

---

## 4. Vaste opbouw van één aflevering (3–6 min)

```
0:00  Intro-bumper (3 s)            — vaste herkenningsanimatie + modulekleur
0:03  Waar zijn we?  (10 s)         — zoom in de demo-zaal naar het onderwerp
0:13  Het probleem / de vraag (20 s)— waarom doet dit ertoe? (risico, kosten, storing)
0:35  Principe uitgelegd (1,5–3 min)— animatie, stap voor stap opgebouwd
      Zo niet / zo wel (30–45 s)    — herkenbare fout + correcte uitvoering
      Werkwijze / checklist (30 s)  — de stappen in de praktijk
      Samenvatting: 3 kernpunten (15 s)
      Vooruitblik volgende aflevering (5 s)
```

---

## 5. Beeldtaal en huisstijl

- **Stijl:** schone isometrische 2.5D-animatie (vector). Leest goed op klein scherm, is
  goedkoper te produceren en te wijzigen dan 3D of filmopnames, en blijft lang actueel.
- **Vaste kleurcodes (overal hetzelfde):**
  - Koude lucht **blauw**, warme lucht **rood/oranje**
  - Voeding **A = rood/oranje-tint, B = blauw-tint** (of conform klantstandaard)
  - Glas **aqua/geel**, koper **grijs/blauw**, aarding **groen-geel**
  - "Zo niet" = rood kruis, "zo wel" = groen vinkje
- **Iconenset & bibliotheek:** één set herbruikbare assets (rack, tegel, CRAH, busbar, kabelgoot, patchpaneel, mens voor schaal).
- **Typografie:** één schreefloos font, minimaal **5 % van de beeldhoogte** voor tekst in beeld (leesbaar op telefoon).
- **Voice-over:** rustige, zakelijke Nederlandse stem; optioneel Engelse versie.

---

## 6. Geschikt voor computer, iPad én telefoon

| Aandachtspunt | Keuze |
|---|---|
| **Beeldverhouding** | Master in **16:9 (1920×1080)**. Alle belangrijke inhoud binnen een *centrale safe zone*, zodat een **9:16 of 1:1**-uitsnede voor social/teasers mogelijk is. |
| **Leesbaarheid** | Groot lettertype, weinig tekst, hoog contrast, geen fijne lijnen < 3 px. |
| **Ondertiteling** | Altijd **ondertitels (NL, optioneel EN)** als losse `.vtt` — veel kijkers kijken zonder geluid op locatie. |
| **Bestandsformaat** | MP4 (H.264/AAC), daarnaast adaptieve streaming (HLS) via het afspeelplatform zodat het ook op 4G goed loopt. |
| **Afspeelomgeving** | Een eenvoudige **responsieve webpagina/portal** per module (werkt in elke browser, tablet en telefoon), of een bestaand LMS / Vimeo / YouTube (niet-openbaar). |
| **Navigatie** | Hoofdstukmarkeringen per aflevering, zodat kijkers naar "zo wel / zo niet" of de checklist kunnen springen. |
| **Naslag** | Per aflevering een **1-pagina PDF-kaart** (kernpunten + checklist) om op locatie te gebruiken. |

---

## 7. Productiewerkwijze (pipeline)

Per aflevering:

1. **Inhoudsbrief** (½ A4) — leerdoel, 3 kernpunten, zo-niet/zo-wel, normverwijzing.
2. **Script** — voice-overtekst met tijdscodes (~130 woorden per minuut).
3. **Vakinhoudelijke review** — door een expert (bijv. projectleider/engineer).
4. **Storyboard** — schetsen per scène op basis van de assetbibliotheek.
5. **Animatie** — opbouwen met de vaste assets.
6. **Voice-over & ondertitels**.
7. **Review-ronde** (max. 2) op inhoud én leesbaarheid op een telefoon.
8. **Publicatie** — MP4 + VTT + PDF-kaart op het platform.

**Tooling — twee realistische routes:**

| Route | Wanneer kiezen |
|---|---|
| **A. Code-gebaseerde animatie** (bijv. *Remotion* of *Motion Canvas*) in deze repository | Veel afleveringen in dezelfde stijl, herbruikbare componenten (rack, rij, kabel), eenvoudig aan te passen en te versioneren. Ik kan hier direct in meebouwen. |
| **B. Klassieke tools** (After Effects / Adobe Express / Vyond) | Als een vormgever of bureau de animatie maakt; deze repo bevat dan scripts, storyboards en de planning. |

*Voorstel:* route A, omdat de serie sterk leunt op terugkerende technische objecten en één
doorlopende demo-zaal — dat is precies waar componenten in code sterk in zijn.

---

## 8. Fasering

| Fase | Inhoud | Resultaat |
|---|---|---|
| **1. Fundament** | Doelgroep, curriculum en huisstijl vastleggen; assetbibliotheek; demo-zaal ontwerpen | Goedgekeurde stijlgids + aflevering-template |
| **2. Pilot** | Aflevering **1.2 "Rijen en gangpaden"** volledig produceren | Eén complete video + PDF-kaart, getest op telefoon/iPad/pc |
| **3. Evaluatie** | Pilot voorleggen aan 5–10 collega's/klanten uit de doelgroep | Bijgestelde template en tempo |
| **4. Module 0–1** | Kader + ruimtelijke indeling | Eerste publiceerbare module |
| **5. Doorproductie** | Modules 2–7, in ritme van bijv. 2 afleveringen per maand | Volledige serie |

---

## 9. Voorgestelde repository-structuur

```
/STRATEGIE.md                 ← dit document
/curriculum/                  ← per aflevering een inhoudsbrief (.md)
/scripts/                     ← voice-overteksten
/storyboards/
/huisstijl/                   ← kleuren, fonts, iconen, stijlgids
/animatie/                    ← (route A) broncode van de animaties + gedeelde componenten
/export/                      ← MP4, VTT, PDF-kaarten (niet in git; via release/opslag)
```

---

## 10. Open vragen (om samen te beslissen)

1. **Afzender en huisstijl:** wordt dit in de HETS-huisstijl gemaakt, of neutraal/white-label voor klanten?
2. **Taal:** alleen Nederlands, of ook Engels (ondertiteld of ingesproken)?
3. **Inhoudelijke scope:** ligt de nadruk op het complete whitespace-plaatje, of vooral op **bekabeling en precabling** (module 4) met de rest als context?
4. **Productieroute:** code-gebaseerd in deze repo (route A) of via een vormgever/klassieke tools (route B)?
5. **Voice-over:** eigen stem, professionele stem of AI-stem?
6. **Distributie:** eigen webpagina/portal, LMS, YouTube/Vimeo, of intern (SharePoint/Teams)?
7. **Pilot:** akkoord met aflevering 1.2 als pilot, of liever een onderwerp dichter bij jullie dagelijkse praktijk (bijv. 4.3 Precabling)?
8. **Normkader:** primair EN 50600 (Europees), of ook TIA-942 (internationale klanten)?
