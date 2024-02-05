import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import {
  trimScore,
  pitchesToRests,
  colorMeasures,
  nthSliceIdxs,
  nthScoreSlice,
  sliceScore
} from '../lib/flat'

function ExploratoryCompose({
  height=300,
  width='100%',
  onUpdate,
  melodyJson,
  trim,
  colors,
  slice,
  sliceIdx,
}) {
  const [embed, setEmbed] = useState();
  const editorRef = React.createRef();
  const score = {
    scoreId: 'blank'
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
  

  function createJsonFromMelody(melodyJson) {
    let result = pitchesToRests(JSON.parse(melodyJson));
    
    result = trim ? trimScore(result, trim) : result;
    result = slice ? sliceScore(result, slice) : result;

    let colorStart = 0;
    let colorStop = colors?.length;

    if (sliceIdx !== undefined) {
      [colorStart, colorStop] = nthSliceIdxs(result, sliceScore);
      result = nthScoreSlice(result, sliceIdx);
    }

    if (colors) {
      result['score-partwise'].part[0].measure = colorMeasures(
        result['score-partise'].part[0].measure,
        colors.slice(colorStart, colorStop)
      );
    }
    return result;
  }

  useEffect(() => {
    if (!embed) return; 
    
    embed
      .ready()
      .then(() => {
        if (!melodyJson) return embed;
        
        const result = createJsonFromMelody(melodyJson)

        return (
          // if a user adds a note that is black or does not have a color assigned to it, then we apply the color from the chord scale pattern to match.
          embed.loadJSON(result).then(() => {
            embed.off('noteDetails');
            embed.on('noteDetails', () => {
              embed.getJSON().then((jd) => {
                const jsonData = jd;
                let scorePartwise = jsonData['score-partwise'].part[0]
                //try to let the outer context know when this thing has data
                if (colors && scorePartwise.measure.some((m) => 
                  m.note.some((n) => !n.$color || n.$color === '#000000'))
                ) {
                  scorePartwise.measure = colorMeasures(scorePartwise.measure, colors);
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
    }, [score, embed]);

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
