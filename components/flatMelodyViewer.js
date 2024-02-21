import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';

function FlatMelodyViewer({
  height=300,
  width='100%',
  score,
  onLoad,
  debugMsg
}) {
  const [embed, setEmbed] = useState();
  const editorRef = React.createRef();

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

  useEffect(() => {
    const allParams = {
      height: `${height}`,
      width: width,
      embedParams,
    };
    setEmbed(new Embed(editorRef.current, allParams));
  }, [height]);
  
  useEffect(() => {
    if (!embed) return; 
    const loadParams = {
      score: score.scoreId,
    };
    if (score.sharingKey) {
      loadParams.sharingKey = score.sharingKey;
    }
    embed
      .ready()
      .then(
        () => 
          embed
            .loadFlatScore(loadParams)
            .then(() => {
              embed
                .getJSON()
                .then(
                  (jsonData) => onLoad && onLoad(JSON.stringify(jsonData))
                );
            })
            .catch((e) => {
              if (e && e.message) {
                e.message = `flat error: ${e?.message}, not loaded from scoreId, score: ${JSON.stringify(score)}`;
                if (debugMsg){
                  e.message = `${e?.message}, debugMsg: ${debugMsg}`;
                }
              } else if(debugMsg) {
                console.error('debugMsg', debugMsg);
                if (score){console.error('score', score);}
              }
              console.error('score not loaded from scoreId');
              console.error('score', score);
              throw e;
            })
      );
    }, [embed]);

  return (
    <>
      <Row>
        <Col>
          <div ref={editorRef} />
        </Col>
      </Row>
    </>
  );
}


export default React.memo(FlatMelodyViewer)
