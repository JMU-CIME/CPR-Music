import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import { pitchesToRests, trimScore } from '../lib/flat';
import {
  elevenVariations,
  mwMelodicShift,
  mwRhythmicMelodicShift,
  mwRhythmicShift,
  reverseFlatScore,
} from '../lib/variations';

function VariationsFromMotiveScore({
  height,
  colors,
  referenceScoreJSON, //original motive from student
  // chordScaleBucket,
  instrumentName,
}) {
  console.log('got in variations', referenceScoreJSON);
  // console.log('flat io embed log', scoreJSON, orig);
  // const [json, setJson] = useState('');
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
    console.log('got in here');
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
    console.log('create embed');
    const createdEmbed = new Embed(editorRef.current, allParams);
    setEmbed(createdEmbed);
    if (createdEmbed) {
      createdEmbed.ready().then(() => {
        console.log('ready hereeeee');
        createdEmbed.loadJSON(elevenVariations(referenceScoreJSON));
      });
    }
    // const reversed = reverseFlatScore(referenceScoreJSON)
    // const rhymic1 = mwRhythmicShift(referenceScoreJSON, 1)
    // const rhymic2 = mwRhythmicShift(referenceScoreJSON, 2)
    // const rhymic3 = mwRhythmicShift(referenceScoreJSON, 3)
    // const melodic1 = mwMelodicShift(referenceScoreJSON, 1);
    // const melodic2 = mwMelodicShift(referenceScoreJSON, 2);
    // const melodic3 = mwMelodicShift(referenceScoreJSON, 3);
    // const rhythmicMelodic1 = mwRhythmicMelodicShift(referenceScoreJSON, 1);
    // const rhythmicMelodic2 = mwRhythmicMelodicShift(referenceScoreJSON, 2);
    // const rhythmicMelodic3 = mwRhythmicMelodicShift(referenceScoreJSON, 3);
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
