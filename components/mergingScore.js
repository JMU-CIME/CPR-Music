import React, { useEffect, useState } from 'react';
import Embed from 'flat-embed';
import { mergeScores } from '../lib/flat';

function MergingScore({
  height,
  instrumentName,
  scores,
  giveJSON,
}) {
  const [embed, setEmbed] = useState();
  const [refId, setRefId] = useState('0');
  const editorRef = React.createRef();
  useEffect(() => {
    console.log('got in here');
    const mergedScore = mergeScores(scores, instrumentName);
    if (giveJSON) {
      giveJSON(mergedScore);
    }
    const embedParams = {
      appId: '60a51c906bcde01fc75a3ad0',
      layout: 'responsive',
      branding: false,
      themePrimary: '#450084',
      controlsDisplay: false,
      controlsPlay: false,
      controlsFullscreen: false,
      controlsZoom: false,
      controlsPrint: false,
      toolsetId: '64be80de738efff96cc27edd',
    };
    let computedHeight = 300;
    if (height) {
      computedHeight = height;
    }

    const allParams = {
      height: `${computedHeight}`,
      width: '100%',
      embedParams,
    };
    const createdEmbed = new Embed(editorRef.current, allParams);
    setEmbed(createdEmbed);
    if (createdEmbed) {
      createdEmbed.ready().then(() => {
        createdEmbed.loadJSON(mergedScore);
      });
    }
  }, [height, scores]);

  return <div ref={editorRef} />
}

export default React.memo(MergingScore);
