import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import { pitchesToRests, trimScore } from '../lib/flat';

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

  function keyFromScoreJSON(pieceScoreJSON) {
    const nonNegative = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#']; // moved from global scope.
    const negatives = {
      '-1': 'F',
      '-2': 'Bb',
      '-3': 'Eb',
      '-4': 'Ab',
      '-5': 'Db',
      '-6': 'Gb',
      '-7': 'Cb',
    };
    const CIRCLE_OF_FIFTHS = { ...nonNegative, ...negatives };
    const minOctave = pieceScoreJSON['score-partwise'].part[0].measure.reduce(
      // Gets the min octave within all the measures.
      (measureMinOctave, measure) => {
        const minForMeasure = measure.note.reduce((noteMinOctave, note) => {
          // Gets the min octave within a measure.
          if (note.pitch && note.pitch.octave !== undefined) {
            // *FIX* Without this statement we get undefined values. Set a default to 0.

            const thisOctave = parseInt(note.pitch.octave, 10);
            if (thisOctave < noteMinOctave) {
              return thisOctave;
            }
            return noteMinOctave;
          }
          // If we get rid of this statement it moves all our octaves up to almost our result. The notes are now off by approx. 1 line.
          return 100;
        }, 100);

        if (minForMeasure < measureMinOctave) {
          return minForMeasure;
        }
        return measureMinOctave;
      },
      100
    ); // TODO: what if octave can be higher than 10?
    const keySignature = {
      repr: CIRCLE_OF_FIFTHS[
        pieceScoreJSON['score-partwise'].part[0].measure[0].attributes[0].key
          .fifths
      ],
      keyAsJSON:
        pieceScoreJSON['score-partwise'].part[0].measure[0].attributes[0].key,
      clef: pieceScoreJSON['score-partwise'].part[0].measure[0].attributes[0]
        .clef,
      minOctave,
    };
    return keySignature;
  }
  function getChordScaleInKey(chordScale, keyObj) {
    const tonicBucketIntervals = [
      // musical facts.
      { name: '1', offset: 0 }, // Unison
      { name: '2', offset: 2 }, // Major 2nd
      { name: '3', offset: 4 }, // Major 3rd
      { name: '5', offset: 7 }, // Perfect 5th
      { name: '6', offset: 9 }, // Major 6th
    ];

    const subdominantBucketIntervals = [
      { name: '1', offset: 0 }, // Unison
      { name: '2', offset: 2 }, // Major 2nd
      { name: '4', offset: 5 }, // Perfect 4th
      { name: '5', offset: 7 }, // Perfect 5th
      { name: '6', offset: 9 }, // Major 6th
    ];

    const dominantBucketIntervals = [
      { name: '2', offset: 2 }, // Major 2nd
      { name: '4', offset: 5 }, // Perfect 4th
      { name: '5', offset: 7 }, // Perfect 5th
      { name: '6', offset: 9 }, // Major 6th
      { name: '7', offset: 11 }, // 7th
    ];

    const chordScaleIntervals = {
      tonic: tonicBucketIntervals,
      subdominant: subdominantBucketIntervals,
      dominant: dominantBucketIntervals,
    };

    const noteToScaleIdx = {
      C: 0,
      'C#': 1,
      Db: 1,
      D: 2,
      'D#': 3,
      Eb: 3,
      E: 4,
      F: 5,
      'F#': 6,
      Gb: 6,
      G: 7,
      'G#': 8,
      Ab: 8,
      A: 9,
      'A#': 10,
      Bb: 10,
      B: 11,
      Cb: 11,
    };

    const chromaticScale = [
      {
        sharp: {
          step: 'C',
          alter: '',
        },
        flat: {
          step: 'C',
          alter: '',
        },
      },
      {
        sharp: {
          repr: 'C#',
          alter: '1',
          step: 'C',
        },
        flat: {
          repr: 'Db',
          alter: '-1',
          step: 'D',
        },
      },
      {
        sharp: {
          repr: 'D',
          alter: '',
          step: 'D',
        },
        flat: {
          repr: 'D',
          alter: '',
          step: 'D',
        },
      },
      {
        sharp: {
          repr: 'D#',
          alter: '1',
          step: 'D',
        },
        flat: {
          repr: 'Eb',
          alter: '-1',
          step: 'E',
        },
      },
      {
        sharp: {
          repr: 'E',
          alter: '',
          step: 'E',
        },
        flat: {
          repr: 'E',
          alter: '',
          step: 'E',
        },
      },
      {
        sharp: {
          repr: 'F',
          alter: '',
          step: 'F',
        },
        flat: {
          repr: 'F',
          alter: '',
          step: 'F',
        },
      },
      {
        sharp: {
          repr: 'F#',
          alter: '1',
          step: 'F',
        },
        flat: {
          repr: 'Gb',
          alter: '-1',
          step: 'G',
        },
      },
      {
        sharp: {
          repr: 'G',
          alter: '',
          step: 'G',
        },
        flat: {
          repr: 'G',
          alter: '',
          step: 'G',
        },
      },
      {
        sharp: {
          repr: 'G#',
          alter: '1',
          step: 'G',
        },
        flat: {
          repr: 'Ab',
          alter: '-1',
          step: 'A',
        },
      },
      {
        sharp: {
          repr: 'A',
          alter: '',
          step: 'A',
        },
        flat: {
          repr: 'A',
          alter: '',
          step: 'A',
        },
      },
      {
        sharp: {
          repr: 'A#',
          alter: '1',
          step: 'A',
        },
        flat: {
          repr: 'Bb',
          alter: '-1',
          step: 'B',
        },
      },
      {
        sharp: {
          repr: 'B',
          alter: '',
          step: 'B',
        },
        flat: {
          repr: 'Cb',
          alter: '-1',
          step: 'C',
        },
      },
    ];

    const key = keyObj.repr;
    let alter = 'sharp';
    if (key.includes('b') || key === 'F') {
      // musician said so (that F is also flat, and that all else are sharp)
      alter = 'flat';
    }
    const firstPitchIdx = noteToScaleIdx[key];
    const firstPitchObj = chromaticScale[firstPitchIdx];
    let octave = keyObj.minOctave;

    // start from the pitch that represents the key of the score and find the 5 pitches with the corresponsing relationship from the chordScaleIntervals
    const mapped = chordScaleIntervals[chordScale].map((interval) => {
      if (
        // if we reach the end of the array, go back to the front (circular array essentially) and increment octave
        Math.floor((firstPitchIdx + interval.offset) / chromaticScale.length) >
        0
      ) {
        octave = keyObj.minOctave + 1;
      }

      const result =
        chromaticScale[
          (firstPitchIdx + interval.offset) % chromaticScale.length
        ][alter];
      result.octave = `${octave}`;
      return result;
    });
    return mapped;
  }

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
