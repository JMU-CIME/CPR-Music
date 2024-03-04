const CHORD_SCALE_COLORS = {
  tonic: '#E75B5C',
  subdominant: '#265C5C',
  dominant: '#4390E2',
  applied: '#CBA338',
};

function colorMap (color) {
  return CHORD_SCALE_COLORS[color];
}


const pitchesToRests = (pieceScoreJSON) => {
  // overwrite divisions
  // ensure that duration and timePos reflect the updated divisions
  const getMeasureTimeSignature = (measure, current) => {
    let duration = 8; // default to 8 because i reasoned it might be a quarter in some cases
    let maxRests = 4; // bc 4 is a common denominator for musicians
    let updated = false;
    if (measure.attributes) {
      measure.attributes.forEach((attribute) => {
        if (attribute.divisions) {
          console.log('p2Rests::getMTimeSig:divisions', attribute.divisions)
          duration = attribute.divisions;
          updated = true;
        }
        if (attribute.time) {
          if (attribute.time.beats) {
            maxRests = attribute.time.beats;
            updated = true;
          }
        }
      });
    }
    if (updated) {
      return { duration, maxRests };
    }
    return current;
  };
  // console.log('pieceScoreJSON', pieceScoreJSON);
  const composeScoreJSON = pieceScoreJSON;
  // nathan!
  const duration = 8; // default to 8 becasue i reasoned it might be a quarter in some cases
  const maxRests = 4; // bc 4 is a common denominator for musicians

  let currentTimeSig = {
    duration,
    maxRests,
  };
  // if (composeScoreJSON["score-partwise"].part[0].measure[0]) {
  //   const firstMeasure = composeScoreJSON["score-partwise"].part[0].measure[0];

  // }
  composeScoreJSON['score-partwise'].part[0].measure.forEach((measure) => {
    if (measure.attributes && measure.attributes[0].divisions) {
      measure.attributes[0].divisions = 2;
    }
    currentTimeSig = getMeasureTimeSignature(measure, currentTimeSig); // FIXME: this overwrites later measures with the default
    if (measure.direction) {
      measure.direction.forEach((directionObj) => {
        if (directionObj['direction-type']) {
          directionObj['direction-type'] = undefined;
        }
        if (directionObj.sound) {
          directionObj.sound = undefined;
        }
      });
    }


    // measure.note = Array(currentTimeSig.maxRests).fill({rest: {}, duration:currentTimeSig.duration})
    measure.note = Array.from({ length: currentTimeSig.maxRests }, (i, j) => ({
      rest: {},
      duration: currentTimeSig.duration.toString(),
      '$adagio-location': {
        timePos: j * duration,
      },
      // '$color': bucketColors[j%bucketColors.length],
    }));

    // measure.note.forEach((note) => {
    //   note.rest = {}
    //   note.pitch = undefined
    //   note.beam = undefined;
    //   note.dot = undefined;
    //   note.tie = undefined;
    //   note.notations = undefined;
    // })
  });
  // console.log('composeScoreJSON', composeScoreJSON);
  return composeScoreJSON;
};

const trimScore = (scoreJson, measures) => {
  const trimmed = JSON.parse(JSON.stringify(scoreJson));
  trimmed['score-partwise'].part[0].measure = trimmed[
    'score-partwise'
  ].part[0].measure.slice(0, measures);
  return trimmed;
};

const sliceScore = (scoreJson, [inclStart, exclStop]) => {
  const trimmed = JSON.parse(JSON.stringify(scoreJson));
  trimmed['score-partwise'].part[0].measure = trimmed[
    'score-partwise'
  ].part[0].measure.slice(inclStart, exclStop);
  return trimmed;
}

const nthScoreSlice = (scoreJson, idx) => {
  return sliceScore(scoreJson, nthSliceIdxs(scoreJson, idx));
};

const nthSliceIdxs = (scoreJson, idx) => {
  const measureCount = scoreJson['score-partwise'].part[0].measure.length;
  const quarter = Math.floor(measureCount/4);
  return [quarter*idx, quarter*idx + quarter];
}

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

function getChordScaleInKey(chordScale, keyObj) {
  const key = keyObj.repr;
  let alter = 'sharp';
  if (key.includes('b') || key === 'F') {
    alter = 'flat';
  }

  const tonicBucketIntervals = [
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

  const firstPitchIdx = noteToScaleIdx[key];
  const firstPitchObj = chromaticScale[firstPitchIdx];
  let octave = keyObj.minOctave;
  const mapped = chordScaleIntervals[chordScale].map((interval) => {
    if (
      Math.floor((firstPitchIdx + interval.offset) / chromaticScale.length) > 0
    ) {
      octave = keyObj.minOctave + 1;
    }

    const result =
      chromaticScale[(firstPitchIdx + interval.offset) % chromaticScale.length][
        alter
      ];
    result.octave = '' + octave;
    return result;
  });
  return mapped;
}

const notes = (score) => score['score-partwise'].part[0].measure[0].note;

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

function colorNotes(notes, color) {
  for (let i = 0; i < notes.length; i++) {
    notes[i].$color = color;
  }
}

function measureNotes(score, measureIdx) {
  console.log('measureNotes(score, measureIdx)', score, measureIdx)
  console.log('score has score-partwise?', score['score-partwise'])
  return score['score-partwise'].part[0].measure[measureIdx].note;
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
        colorNotes(measures[i].note, CHORD_SCALE_COLORS[colorSpecs[i]]);
      } else if (!Array.isArray(colorSpecs)) {
        colorNotes(measures[i].note, CHORD_SCALE_COLORS[colorSpecs]);
      }
    } else {
      colorNotes(measures[i], BLACK);
    }
  }
  return measures;
};

function mergeScores(scores, instrumentName) {
  console.log('flat.js::mergeScores:scores:', scores, 'instrumentName:', instrumentName)
  let result;
  if (scores && scores?.length > 0) {
    result = JSON.parse(scores[0]);
    if (instrumentName) {
      result['score-partwise']['part-list']['score-part'][0]['part-name'] = instrumentName;
    }
    try {
      //pieceScoreJSON['score-partwise'].part[0].measure[0]
      if (scores.length > 1) {
        scores.slice(1).forEach((score, i) => {
          result['score-partwise'].part[0].measure = result[
            'score-partwise'
          ].part[0].measure.concat(JSON.parse(score)['score-partwise'].part[0].measure);
        });
      }
      result = JSON.stringify(result);
    } catch (e) {
      console.log('error merging scores. result:', result, e);
    }
  }
  return result;
}

export {
  pitchesToRests,
  trimScore,
  // notes, // seems unused
  sliceScore,
  nthScoreSlice,
  nthSliceIdxs,
  getChordScaleInKey,
  keyFromScoreJSON,
  colorMeasures,
  colorNotes,
  mergeScores,
  // CHORD_SCALE_COLORS, //not used externally
  colorMap,
  measureNotes
};
