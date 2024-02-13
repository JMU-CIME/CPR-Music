const tonicScoreJSON = {
  'score-partwise': {
    $version: '3.1',
    'part-list': {
      'score-part': [
        {
          'part-name': 'Piccolo',
          voiceMapping: {
            0: [0],
          },
          staffMapping: [
            {
              mainVoiceIdx: 0,
              voices: [0],
              staffUuid: 'ebf5e0b5-2865-87bb-8dde-2f98ab69c5ea',
            },
          ],
          voiceIdxToUuidMapping: {
            0: '37ebabb9-a367-0bc8-4bf0-bf3b9a3b45cd',
          },
          voiceUuidToIdxMapping: {
            '37ebabb9-a367-0bc8-4bf0-bf3b9a3b45cd': 0,
          },
          'part-abbreviation': 'Picc.',
          'score-instrument': {
            'instrument-name': 'Piccolo',
            $id: 'P1-I1',
          },
          'midi-instrument': {
            volume: '100',
            'midi-program': 73,
            $id: 'P1-I1',
            'midi-channel': '1',
          },
          $id: 'P1',
          uuid: 'ca26e132-61b3-27ab-2e64-508c94c82a31',
        },
      ],
    },
    'measure-list': {
      'score-measure': [
        {
          uuid: '5ab14634-c45c-60ef-c51c-a1d47a42218a',
        },
      ],
    },
    part: [
      {
        measure: [
          {
            note: [
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'E',
                  alter: '-1',
                },
                '$adagio-location': {
                  timePos: 0,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'F',
                },
                '$adagio-location': {
                  timePos: 1,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'G',
                },
                '$adagio-location': {
                  timePos: 2,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'B',
                  alter: '-1',
                },
                '$adagio-location': {
                  timePos: 3,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '5',
                  step: 'C',
                },
                '$adagio-location': {
                  timePos: 4,
                },
                type: 'quarter',
              },
            ],
            harmony: [],
            $number: '1',
            barline: {
              $location: 'right',
              'bar-style': 'light-heavy',
              '$adagio-location': {
                dpq: 1,
                timePos: 5,
              },
              noteBefore: 4,
            },
            attributes: [
              {
                divisions: '1',
                time: {
                  beats: '5',
                  'beat-type': '4',
                },
                clef: {
                  sign: 'G',
                  line: '2',
                },
                key: {
                  fifths: '-3',
                },
                transpose: {
                  chromatic: '0',
                  'octave-change': '1',
                },
                'staff-details': {
                  'staff-lines': '5',
                },
                '$adagio-time': {
                  beats: '5',
                  'beat-type': '4',
                },
                noteBefore: -1,
                '$adagio-location': {
                  timePos: 0,
                  dpq: 1,
                },
              },
            ],
            sound: [
              {
                '$adagio-swing': {
                  swing: false,
                },
                noteBefore: -1,
                '$adagio-location': {
                  timePos: 0,
                  dpq: 1,
                },
              },
              {
                $tempo: '80',
                noteBefore: -1,
                '$adagio-location': {
                  timePos: 0,
                  dpq: 1,
                },
              },
            ],
            direction: [
              {
                $placement: 'above',
                staff: '1',
                '$adagio-location': {
                  timePos: 0,
                },
                'direction-type': {
                  metronome: {
                    'per-minute': '80',
                    'beat-unit': 'quarter',
                  },
                },
                noteBefore: -1,
                '$adagio-isFirst': true,
              },
            ],
            '$adagio-beatsList': [1, 1, 1, 1, 1],
          },
        ],
        $id: 'P1',
        uuid: 'ca26e132-61b3-27ab-2e64-508c94c82a31',
      },
    ],
    defaults: {
      scaling: {
        millimeters: '7',
        tenths: '40',
      },
      'page-layout': {
        'page-height': '1596.5714285714287',
        'page-width': '1233.7142857142858',
        'page-margins': {
          $type: 'both',
          'top-margin': '38.857142857142854',
          'bottom-margin': '38.857142857142854',
          'left-margin': '38.857142857142854',
          'right-margin': '38.857142857142854',
        },
      },
      'system-layout': {
        'system-distance': '115.2',
      },
      'staff-layout': {
        'staff-distance': '72.57142857142857',
      },
      '$adagio-measureNumberingStart': 1,
      'word-font': {
        '$font-family': 'Century Schoolbook L',
      },
      '$adagio-systemBreakPolicy': {
        maxNbMeasuresPerLine: 4,
        forbiddenCounts: {},
      },
    },
    '$adagio-formatVersion': 55,
    credit: [
      {
        'credit-type': 'title',
        'credit-words': 'E♭ Tonic Chord Scale Bucket',
      },
    ],
    work: {
      'work-title': 'E♭ Tonic Chord Scale Bucket',
    },
    identification: {
      encoding: {
        software: 'Flat',
        'encoding-date': '2023-09-16',
      },
      source:
        'https://flat.io/score/64c0993a9638a82f130dc549-e-tonic-chord-scale-bucket?sharingKey=bd6ef69e50c7822c1f2fc5b262c553b048cf1f60add3ee9cdb1e85536b8f0d18de20b69fe6089b40e4910ba68d762c4218f00410d5d07368f021ae7298fb99c7',
    },
  },
};
const subdominantScoreJSON = {
  'score-partwise': {
    $version: '3.1',
    'part-list': {
      'score-part': [
        {
          'part-name': 'Piccolo',
          voiceMapping: {
            0: [0],
          },
          staffMapping: [
            {
              mainVoiceIdx: 0,
              voices: [0],
              staffUuid: '8de6d8ff-b816-8d59-ac60-d8fd60709b13',
            },
          ],
          voiceIdxToUuidMapping: {
            0: '7fbec95f-e09e-edc8-32fa-9222af710a4c',
          },
          voiceUuidToIdxMapping: {
            '7fbec95f-e09e-edc8-32fa-9222af710a4c': 0,
          },
          'part-abbreviation': 'Picc.',
          'score-instrument': {
            'instrument-name': 'Piccolo',
            $id: 'P1-I1',
          },
          'midi-instrument': {
            'midi-program': 73,
            volume: '100',
            $id: 'P1-I1',
            'midi-channel': '1',
          },
          $id: 'P1',
          uuid: 'f5ffdbb0-ec2b-d8cb-1dee-167d8f7cd6a6',
        },
      ],
    },
    'measure-list': {
      'score-measure': [
        {
          uuid: '32e0dceb-6014-dfe2-b464-de9d587e7f1e',
        },
      ],
    },
    part: [
      {
        measure: [
          {
            note: [
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'F',
                },
                '$adagio-location': {
                  timePos: 0,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'A',
                  alter: '-1',
                },
                '$adagio-location': {
                  timePos: 1,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'B',
                  alter: '-1',
                },
                '$adagio-location': {
                  timePos: 2,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '5',
                  step: 'C',
                },
                '$adagio-location': {
                  timePos: 3,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '5',
                  step: 'E',
                  alter: '-1',
                },
                '$adagio-location': {
                  timePos: 4,
                },
                type: 'quarter',
              },
            ],
            harmony: [],
            $number: '1',
            barline: {
              $location: 'right',
              'bar-style': 'light-heavy',
              '$adagio-location': {
                dpq: 1,
                timePos: 5,
              },
              noteBefore: 4,
            },
            attributes: [
              {
                divisions: '1',
                time: {
                  beats: '5',
                  'beat-type': '4',
                },
                clef: {
                  sign: 'G',
                  line: '2',
                },
                key: {
                  fifths: '-3',
                },
                transpose: {
                  chromatic: '0',
                  'octave-change': '1',
                },
                'staff-details': {
                  'staff-lines': '5',
                },
                '$adagio-time': {
                  beats: '5',
                  'beat-type': '4',
                },
                noteBefore: -1,
                '$adagio-location': {
                  timePos: 0,
                  dpq: 1,
                },
              },
            ],
            sound: [
              {
                '$adagio-swing': {
                  swing: false,
                },
                noteBefore: -1,
                '$adagio-location': {
                  timePos: 0,
                  dpq: 1,
                },
              },
              {
                $tempo: '80',
                noteBefore: -1,
                '$adagio-location': {
                  timePos: 0,
                  dpq: 1,
                },
              },
            ],
            direction: [
              {
                $placement: 'above',
                staff: '1',
                '$adagio-location': {
                  timePos: 0,
                },
                'direction-type': {
                  metronome: {
                    'per-minute': '80',
                    'beat-unit': 'quarter',
                  },
                },
                noteBefore: -1,
                '$adagio-isFirst': true,
              },
            ],
            '$adagio-beatsList': [1, 1, 1, 1, 1],
          },
        ],
        $id: 'P1',
        uuid: 'f5ffdbb0-ec2b-d8cb-1dee-167d8f7cd6a6',
      },
    ],
    defaults: {
      scaling: {
        millimeters: '7',
        tenths: '40',
      },
      'page-layout': {
        'page-height': '1596.5714285714287',
        'page-width': '1233.7142857142858',
        'page-margins': {
          $type: 'both',
          'top-margin': '38.857142857142854',
          'bottom-margin': '38.857142857142854',
          'left-margin': '38.857142857142854',
          'right-margin': '38.857142857142854',
        },
      },
      'system-layout': {
        'system-distance': '115.2',
      },
      'staff-layout': {
        'staff-distance': '72.57142857142857',
      },
      '$adagio-measureNumberingStart': 1,
      'word-font': {
        '$font-family': 'Century Schoolbook L',
      },
      '$adagio-systemBreakPolicy': {
        maxNbMeasuresPerLine: 4,
        forbiddenCounts: {},
      },
    },
    '$adagio-formatVersion': 55,
    credit: [
      {
        'credit-type': 'title',
        'credit-words': 'E♭ Subdominant Chord Scale Bucket',
      },
    ],
    work: {
      'work-title': 'E♭ Subdominant Chord Scale Bucket',
    },
    identification: {
      encoding: {
        software: 'Flat',
        'encoding-date': '2023-09-16',
      },
      source:
        'https://flat.io/score/64c099d94d7650a3d9ba7598-e-subdominant-chord-scale-bucket?sharingKey=19663d1b0e19b5f9ff11ad28b80c45546693499c94ed5d7c992bdeb9f7c58e968a219144a3aabaa05845947089607d51d25a37fe94a3ca6fcf14e67cff361c3d',
    },
  },
};

const dominantScoreJSON = {
  'score-partwise': {
    $version: '3.1',
    'part-list': {
      'score-part': [
        {
          'part-name': 'Piccolo',
          voiceMapping: {
            0: [0],
          },
          staffMapping: [
            {
              mainVoiceIdx: 0,
              voices: [0],
              staffUuid: 'b71045f4-b233-6960-f5bb-b4f7938b1b6b',
            },
          ],
          voiceIdxToUuidMapping: {
            0: '64eb968a-7841-c741-d082-2d5fba409f7c',
          },
          voiceUuidToIdxMapping: {
            '64eb968a-7841-c741-d082-2d5fba409f7c': 0,
          },
          'part-abbreviation': 'Picc.',
          'score-instrument': {
            'instrument-name': 'Piccolo',
            $id: 'P1-I1',
          },
          'midi-instrument': {
            'midi-program': 73,
            volume: '100',
            $id: 'P1-I1',
            'midi-channel': '1',
          },
          $id: 'P1',
          uuid: '878f5374-8f99-6297-ac1c-8e9f58827dc0',
        },
      ],
    },
    'measure-list': {
      'score-measure': [
        {
          uuid: '003069e7-b981-1ff6-cdfd-7b3ef6cf83fb',
        },
      ],
    },
    part: [
      {
        measure: [
          {
            note: [
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'D',
                },
                '$adagio-location': {
                  timePos: 0,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'F',
                },
                '$adagio-location': {
                  timePos: 1,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'A',
                  alter: '-1',
                },
                '$adagio-location': {
                  timePos: 2,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '4',
                  step: 'B',
                  alter: '-1',
                },
                '$adagio-location': {
                  timePos: 3,
                },
                type: 'quarter',
              },
              {
                staff: '1',
                voice: '1',
                duration: '1',
                pitch: {
                  octave: '5',
                  step: 'C',
                },
                '$adagio-location': {
                  timePos: 4,
                },
                type: 'quarter',
              },
            ],
            harmony: [],
            $number: '1',
            barline: {
              $location: 'right',
              'bar-style': 'light-heavy',
              '$adagio-location': {
                dpq: 1,
                timePos: 5,
              },
              noteBefore: 4,
            },
            attributes: [
              {
                divisions: '1',
                time: {
                  beats: '5',
                  'beat-type': '4',
                },
                clef: {
                  sign: 'G',
                  line: '2',
                },
                key: {
                  fifths: '-3',
                },
                transpose: {
                  chromatic: '0',
                  'octave-change': '1',
                },
                'staff-details': {
                  'staff-lines': '5',
                },
                '$adagio-time': {
                  beats: '5',
                  'beat-type': '4',
                },
                noteBefore: -1,
                '$adagio-location': {
                  timePos: 0,
                  dpq: 1,
                },
              },
            ],
            sound: [
              {
                '$adagio-swing': {
                  swing: false,
                },
                noteBefore: -1,
                '$adagio-location': {
                  timePos: 0,
                  dpq: 1,
                },
              },
              {
                $tempo: '80',
                noteBefore: -1,
                '$adagio-location': {
                  timePos: 0,
                  dpq: 1,
                },
              },
            ],
            direction: [
              {
                $placement: 'above',
                staff: '1',
                '$adagio-location': {
                  timePos: 0,
                },
                'direction-type': {
                  metronome: {
                    'per-minute': '80',
                    'beat-unit': 'quarter',
                  },
                },
                noteBefore: -1,
                '$adagio-isFirst': true,
              },
            ],
            '$adagio-beatsList': [1, 1, 1, 1, 1],
          },
        ],
        $id: 'P1',
        uuid: '878f5374-8f99-6297-ac1c-8e9f58827dc0',
      },
    ],
    defaults: {
      scaling: {
        millimeters: '7',
        tenths: '40',
      },
      'page-layout': {
        'page-height': '1596.5714285714287',
        'page-width': '1233.7142857142858',
        'page-margins': {
          $type: 'both',
          'top-margin': '38.857142857142854',
          'bottom-margin': '38.857142857142854',
          'left-margin': '38.857142857142854',
          'right-margin': '38.857142857142854',
        },
      },
      'system-layout': {
        'system-distance': '115.2',
      },
      'staff-layout': {
        'staff-distance': '72.57142857142857',
      },
      '$adagio-measureNumberingStart': 1,
      'word-font': {
        '$font-family': 'Century Schoolbook L',
      },
      '$adagio-systemBreakPolicy': {
        maxNbMeasuresPerLine: 4,
        forbiddenCounts: {},
      },
    },
    '$adagio-formatVersion': 55,
    credit: [
      {
        'credit-type': 'title',
        'credit-words': 'E♭ Dominant Chord Scale Bucket',
      },
    ],
    work: {
      'work-title': 'E♭ Dominant Chord Scale Bucket',
    },
    identification: {
      encoding: {
        software: 'Flat',
        'encoding-date': '2023-09-16',
      },
      source:
        'https://flat.io/score/64c09a22168dab0ff8733c35-e-dominant-chord-scale-bucket?sharingKey=adaf25a2ea6be22b81af0658dbff5d0537625d171f9c2fed3406c6ad39a24c3ffaf87cfc662672f5aa11d0d8d9f09989567bde6c8d028586b11873d7596030c0',
    },
  },
};
const pitchesToRests = (pieceScoreJSON) => {
  const getMeasureTimeSignature = (measure, current) => {
    let duration = 8; // default to 8 because i reasoned it might be a quarter in some cases
    let maxRests = 4; // bc 4 is a common denominator for musicians
    let updated = false;
    if (measure.attributes) {
      measure.attributes.forEach((attribute) => {
        if (attribute.divisions) {
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

    // const bucketColors = ['#E75B5C', '#265C5C', '#4390E2'];

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

const nonNegative = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
const negatives = {
  '-1': 'F',
  '-2': 'Bb',
  '-3': 'Eb',
  '-4': 'Ab',
  '-5': 'Db',
  '-6': 'Gb',
  '-7': 'Cb',
};
const CIRCLE_OF_FIFTHS = Object.assign({}, nonNegative, negatives);

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


const chordScaleFromOrig = (origJSON, scaleBucket) => { //scalebucket as a string eg "t"
  const keySignature = keyFromScoreJSON(origJSON); // this is a cheat code: i check the metadata of THIS STUDENT (already accounting for their instrument and the piece's composition key) as a letter like F
  const bucket = getChordScaleInKey(scaleBucket, keySignature);
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


export {
  pitchesToRests,
  trimScore,
  tonicScoreJSON,
  subdominantScoreJSON,
  dominantScoreJSON,
  notes,
  sliceScore,
  nthScoreSlice,
  nthSliceIdxs,
  getChordScaleInKey,
  keyFromScoreJSON,
  colorMeasures,
  colorNotes,
};
