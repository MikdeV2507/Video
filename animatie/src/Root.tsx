import React from 'react';
import {Composition, Still} from 'remotion';
import {FPS, H, W} from './theme';
import {Ep12} from './episodes/ep12/Ep12';
import {Ep12Thumbnail} from './episodes/ep12/Thumbnail';
import {TOTAL} from './episodes/ep12/script';

export const Root: React.FC = () => (
  <>
    <Composition
      id="Ep12RowsAndAisles"
      component={Ep12}
      durationInFrames={Math.round(TOTAL * FPS)}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{burnCaptions: false}}
    />
    <Still id="Ep12Thumbnail" component={Ep12Thumbnail} width={1280} height={720} />
  </>
);
