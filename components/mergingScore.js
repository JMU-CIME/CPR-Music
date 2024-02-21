import { useEffect, useRef, useState } from 'react';
import Embed from 'flat-embed';
import { mergeScores } from '../lib/flat';

function MergingScore({
  height,
  instrumentName,
  scores,
  giveJSON,
}) {
  // const [embed, setEmbed] = useState();
  const embedRef = useRef();
  const editorRef = useRef();
  useEffect(() => {
    console.log('got in here');
    // const mergedScore = mergeScores(scores, instrumentName);
    if (giveJSON) {
      // giveJSON(mergedScore);
      giveJSON(JSON.stringify(scores[0]));
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
    embedRef.current = new Embed(editorRef.current, allParams);
    // setEmbed(createdEmbed);
    if (embedRef.current) {
      embedRef.current.ready().then(() => {
        createdEmbed.loadJSON(mergedScore);
        console.log('createdEmbed.loadJSON(mergedScore);')
      });
    }
  }, [scores, height, instrumentName, giveJSON]);
  console.log('rendering merging score', scores, height, instrumentName, giveJSON)

  return <div ref={editorRef} />
}

export default React.memo(MergingScore);
