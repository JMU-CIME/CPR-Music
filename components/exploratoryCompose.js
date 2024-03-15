import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import {
  trimScore,
  pitchesToRests,
  colorMeasures,
} from '../lib/flat'

function ExploratoryCompose({
  height=300,
  width='100%',
  onUpdate,
  referenceScoreJSON,
  trim,
  colors,
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
    displayFirstLinePartsNames: false,
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
  

  function createJsonFromReference(reference, colors) {
    let result = pitchesToRests(JSON.parse(reference));
    result = trim ? trimScore(result, trim) : result;
    if (colors && colors.length > result['score-partwise'].part[0].measure.length) {
      let measures = result['score-partwise'].part[0].measure;
      result['score-partwise'].part[0].measure = colorMeasures(measures, colors);
      // result['score-partwise'].part[0].measure
    }
    return result;
  }

  useEffect(() => {
    if (!embed) return; 
    
    embed
      .ready()
      .then(() => {
        if (!referenceScoreJSON) return embed;
        
        const result = createJsonFromReference(referenceScoreJSON, colors);

        return (
          embed.loadJSON(result).then(() => {
            embed.off('noteDetails');
            embed.on('noteDetails', (ev) => {
              embed.getJSON().then((jd) => {
                const jsonData = jd;
                if (
                  colors &&
                  jsonData['score-partwise'].part[0].measure.some((m) =>
                    m.note.some((n) => !n.$color || n.$color === '#000000')
                  )
                ) {
                  jsonData['score-partwise'].part[0].measure =
                    colorMeasures(
                      jsonData['score-partwise'].part[0].measure,
                      colors
                    );
                  embed.getCursorPosition().then((position) =>
                    embed.loadJSON(jsonData).then(() => {
                        embed.setCursorPosition(position);
                    })
                  );
                }
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
