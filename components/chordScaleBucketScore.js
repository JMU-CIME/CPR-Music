import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import { getChordScaleInKey, keyFromScoreJSON } from '../lib/flat';

function ChordScaleBucketScore({
  height,
  colors,
  referenceScoreJSON,
  chordScaleBucket,
  instrumentName,
}) {
  // console.log('flat io embed log', scoreJSON, orig);
  const [json, setJson] = useState('');
  const [embed, setEmbed] = useState();
  const [refId, setRefId] = useState('0');
  const editorRef = React.createRef();
  const [addingNote, setAddingNote] = useState(false);

  // *FIX* Need to get rid of arrow, make it a normal function as we did with keyFromScoreJSON, and getChordScaleInKey below.
  function embedTransposed (
    bucket,
    transposeEmbed,
    // templt,
    keySig,
    instrName,
    octaveShift
  ) {
    const template = JSON.parse(
      JSON.stringify({
        'score-partwise': {
          'part-list': {
            'score-part': [
              {
                'part-name': '',
                voiceMapping: { 0: [0] },
                staffMapping: [
                  {
                    mainVoiceIdx: 0,
                    voices: [0],
                    staffUuid: 'staffUuid',
                  },
                ],
                voiceIdxToUuidMapping: {
                  0: 'voiceUuid',
                },
                voiceUuidToIdxMapping: {
                  voiceUuid: 0,
                },
                'part-abbreviation': '',
                'score-instrument': {
                  'instrument-name': '',
                  $id: 'P1-I1',
                },

                $id: 'P1',
                uuid: 'P1',
              },
            ],
          },
          part: [
            {
              measure: [
                {
                  note: [],
                  $number: '1',
                  barline: {
                    'bar-style': 'light-heavy',
                    noteBefore: 4,
                  },
                  attributes: [
                    {
                      time: { beats: '5', 'beat-type': '4' },
                      clef: {},
                      key: {},
                      'staff-details': { 'staff-lines': '5' },
                    },
                  ],
                },
              ],
              $id: 'P1',
              uuid: 'P1',
            },
          ],
        },
      })
    );
    // change the notes in the score from whatever they are in tonic and eb to what we're given
    const scorePart =
      template?.['score-partwise']?.['part-list']?.['score-part']?.[0];
    scorePart['part-name'] = instrName;
    scorePart['part-abbreviation'] = instrName;
    scorePart['score-instrument']['instrument-name'] = instrName;

    // start from bucket, create the notes, add them to measure
    template['score-partwise'].part[0].measure[0].note = bucket.map(
      ({ alter, octave, step, $color = '#00000' }) => {
        const note = {
          staff: '1',
          voice: '1',
          duration: '1',
          pitch: { octave, step },
          type: 'quarter',
          $color,
        };
        if (alter !== '') {
          note.pitch.alter = alter;
        }
        return note;
      }
    );

    // change the key signature in the score from whatever it is in tonic and eb to what we're given
    template?.['score-partwise']?.part?.[0]?.measure?.[0]?.attributes?.forEach(
      (element) => {
        if (element.key) {
          // FIXME
          element.key.fifths = keySig.keyAsJSON.fifths;
        }
        if (element.clef) {
          // FIXME
          element.clef = keySig.clef;
        }
      }
    );

    if (octaveShift !== 0) {
      template?.[
        'score-partwise'
      ]?.part?.[0]?.measure?.[0]?.attributes?.forEach((element) => {
        element.transpose = {
          chromatic: '0',
          'octave-change': `${octaveShift}`,
        };
      });
    }
    console.log('chord scale bucket generated json scoure output', template)
    const resultTransposed = transposeEmbed
      .ready()
      .then(() => transposeEmbed.loadJSON(template));
    return resultTransposed;
  };

  function colorNotes(notes, color) {
    for (let i = 0; i < notes.length; i++) {
      notes[i].$color = color;
    }
  }
  /**
   *  Given a measure, and a string consisting of "rgbgrb..." we match the notes of the corresponding measure to that value.
   *  For example, given a measure (1,2,3) and a string "rgb", the first measure would be colored red, second would be green, third would be green.
   */
  const colorMeasures = (measures, colorSpecs) => {
    /**
     * Colors an array of notes to a given hex color attribute.
     */
    const BLACK = '#000000';
    const ORANGE = '#f5bd1f';
    for (let i = 0; i < measures.length; i++) {
      if (colorSpecs) {
        if (Array.isArray(colorSpecs) && colorSpecs[i]) {
          colorNotes(measures[i].note, colorSpecs[i]);
        } else if (!Array.isArray(colorSpecs)) {
          colorNotes(measures[i].note, colorSpecs);
        }
      } else {
        colorNotes(measures[i], BLACK);
      }
    }
    return measures;
  };
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
    setEmbed(new Embed(editorRef.current, allParams));
  }, [height]);

  useEffect(() => {
    if (referenceScoreJSON !== '' && referenceScoreJSON !== undefined && embed) {
      // Makes sure we don't accidentally run this code and prevents runtime error.
      const copyJSON = JSON.parse(referenceScoreJSON); // Creates our JSON object to use in our functions below.

      const keySignature = keyFromScoreJSON(copyJSON);
      let bucket;
      if (
        chordScaleBucket === 'tonic' ||
        chordScaleBucket === 'subdominant' ||
        chordScaleBucket === 'dominant'
      ) {
        bucket = getChordScaleInKey(chordScaleBucket, keySignature);
      } else {
        bucket = getChordScaleInKey('tonic', keySignature);
      }

      if (colors) {
        colorNotes(bucket, colors);
      }

      console.log('current JSON', copyJSON);
      console.log('bucket', bucket); // current issue: our octaves are all defaulted to 0; however, to fix this issue if we comment out our else statement in our keyFromScoreJSON it fixes.
      embedTransposed(bucket, embed, keySignature, instrumentName);
    }
  }, [referenceScoreJSON, chordScaleBucket, embed]);

  return (
    <Row>
      <Col>
        <div ref={editorRef} />
      </Col>
    </Row>
  );
}

export default ChordScaleBucketScore;
