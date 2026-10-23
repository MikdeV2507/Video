import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from '../../theme';
import {Camera} from '../../iso';
import {World, crah, floor, rack, walls, zone} from '../../components/world';
import {HetsMark} from '../../components/ui';

// YouTube-thumbnail (1280×720): vaste template — links titel, rechts beeld uit de aflevering
export const Ep12Thumbnail: React.FC = () => {
  const cam: Camera = {focus: [4.8, 5.4, 0.8], zoom: 1.25, az: 64, el: 50};
  const ys = [1.2, 3.6, 6.0, 8.4];
  const facing: (1 | -1)[] = [1, -1, 1, -1];
  const items = [
    floor(cam),
    walls(cam),
    ...[1.0, 4.4, 7.8].map((y) => crah(cam, y)),
    zone(cam, 2.4, 2.4, 7.2, 3.6, C.cold, {floor: 0.5, volume: 0.15}),
    zone(cam, 2.4, 7.2, 7.2, 8.4, C.cold, {floor: 0.5, volume: 0.15}),
    zone(cam, 2.4, 4.8, 7.2, 6.0, C.hot, {floor: 0.45, volume: 0.15}),
  ];
  ys.forEach((y, r) => {
    for (let i = 0; i < 8; i++) items.push(rack(cam, {x0: 2.4 + i * 0.6, y0: y, facing: facing[r]}));
  });
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #F7F9FB 0%, #DDE4EB 100%)'}}>
      <div style={{position: 'absolute', left: 260, top: -180, transform: 'scale(1)'}}>
        <div style={{position: 'relative', width: 1920, height: 1080}}>
          <World items={items} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 560, background: C.navy, padding: '56px 48px', boxSizing: 'border-box'}}>
        <HetsMark size={48} />
        <div style={{fontFamily: F.mono, color: C.orange, fontSize: 64, marginTop: 70}}>1.2</div>
        <div style={{fontFamily: F.sans, color: 'white', fontWeight: 700, fontSize: 96, lineHeight: 1.0}}>
          Rows &amp;
          <br />
          Aisles
        </div>
        <div style={{fontFamily: F.sans, color: '#9FB0C2', fontWeight: 600, fontSize: 30, letterSpacing: 3, marginTop: 40}}>
          DATA CENTER
          <br />
          WHITESPACE
        </div>
      </div>
      <div style={{position: 'absolute', left: 560, top: 0, bottom: 0, width: 14, background: C.orange}} />
    </AbsoluteFill>
  );
};
