import React, { useEffect, useRef } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import {
  mwCreateVariations,
} from '../lib/variations';

function VariationsFromMotiveScore({
  height,
  referenceScoreJSON, //original motive from student
  // chordScaleBucket,
  onSelect
}) {
  const editorRef = React.createRef();
  const variations = useRef();

  useEffect(() => {
    const embedParams = {
      // sharingKey: score.sharingKey,
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
      displayFirstLinePartsNames: false,
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
    if (createdEmbed) {
      createdEmbed.ready().then(() => {
        // listen for cursor position

        variations.current = mwCreateVariations(referenceScoreJSON);
        if (onSelect) {
          createdEmbed.off('cursorPosition');
          createdEmbed.on('cursorPosition', (ev) =>{
            onSelect(variations.current['score-partwise'].part[0].measure[ev.measureIdx]);
          }) ;
          
        }
        createdEmbed.loadJSON(variations.current);
        //TODO: save/set the measures array from this `variations` json obj

      });
    }
  }, [height, referenceScoreJSON]);

  return (
    <Row>
      <Col>
        <div ref={editorRef} />
      </Col>
    </Row>
  );
}

export default VariationsFromMotiveScore;
