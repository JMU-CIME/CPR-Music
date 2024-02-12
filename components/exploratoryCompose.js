import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import {
  trimScore,
  pitchesToRests,
} from '../lib/flat'

function ExploratoryCompose({
  height=300,
  width='100%',
  onUpdate,
  referenceScoreJSON,
  trim,
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
    mode: 'edit'
  };

  useEffect(() => {
    const allParams = {
      height: `${height}`,
      width: width,
      embedParams,
    };
    setEmbed(new Embed(editorRef.current, allParams));
  }, [height]);
  

  function createJsonFromReference(reference) {
    let result = pitchesToRests(JSON.parse(reference));
    result = trim ? trimScore(result, trim) : result;
    return result;
  }

  useEffect(() => {
    if (!embed) return; 
    
    embed
      .ready()
      .then(() => {
        if (!referenceScoreJSON) return embed;
        
        const result = createJsonFromReference(referenceScoreJSON)

        return (
          embed.loadJSON(result).then(() => {
            embed.off('noteDetails');
            embed.on('noteDetails', () => {
              embed.getJSON().then((jd) => {
                const jsonData = jd;
                if (onUpdate) {
                  onUpdate(JSON.stringify(jsonData));
                }
              });
            });
          })
        );
      })
    }, [referenceScoreJSON, embed]);

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


export default React.memo(ExploratoryCompose)
