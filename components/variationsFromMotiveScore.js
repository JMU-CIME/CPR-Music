import React, { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import {
  mwCreateVariations,
} from '../lib/variations';
import { measureNotes } from '../lib/flat';

function VariationsFromMotiveScore({
  height,
  colors,
  referenceScoreJSON, //original motive from student
  // chordScaleBucket,
  instrumentName,
  onSelect
}) {
  // console.log('got in variations', referenceScoreJSON);
  // console.log('flat io embed log', scoreJSON, orig);
  // const [json, setJson] = useState('');
  const [embed, setEmbed] = useState();
  const [refId, setRefId] = useState('0');
  const editorRef = React.createRef();
  const [addingNote, setAddingNote] = useState(false);
  const variations = useRef();


  useEffect(() => {
    // console.log('got in here');
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
    // console.log('create embed');
    const createdEmbed = new Embed(editorRef.current, allParams);
    setEmbed(createdEmbed);
    if (createdEmbed) {
      createdEmbed.ready().then(() => {
        // listen for cursor position

        variations.current = mwCreateVariations(referenceScoreJSON);
        if (onSelect) {
          createdEmbed.off('cursorPosition');
          createdEmbed.on('cursorPosition', (ev) =>{
            console.log('curosrpos', ev, ev.measureIdx)
            onSelect(variations.current['score-partwise'].part[0].measure[ev.measureIdx]);
          }) ;
          
        }
        console.log('algorithmically generated variations', variations);
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
