import { useEffect, useRef, useState } from 'react';
import Embed from 'flat-embed';
import { mergeScores } from '../lib/flat';

function MergingScore({
  height,
  instrumentName,
  scores, // array of strings
  giveJSON,
}) {
  console.log('ffs did we get in here or what?')
  // const [embed, setEmbed] = useState();
  const embedRef = useRef();
  const editorRef = useRef();
  const resultScore = useRef('');
  useEffect(() => {
    console.log('got in here');
    resultScore.current = mergeScores(scores.current, instrumentName);
    if (giveJSON) {
      // giveJSON(mergedScore);
      giveJSON(resultScore.current);
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
        embedRef.current.loadJSON(resultScore.current);
        console.log('embedRef.current.loadJSON(resultScore.current);')
      });
    }
  }, [scores, height, instrumentName, giveJSON]);
  console.log('rendering merging score', scores, height, instrumentName, giveJSON)

  return <div ref={editorRef} />
}

export default MergingScore;
// export default React.memo(MergingScore);
