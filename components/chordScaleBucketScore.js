import React, { useEffect, useState } from 'react';
import Embed from 'flat-embed';
import { colorNotes, getChordScaleInKey, keyFromScoreJSON, colorMap} from '../lib/flat';

function ChordScaleBucketScore({
  height,
  colors,
  referenceScoreJSON,
  chordScaleBucket,
  instrumentName,
  className,
}) {
  const [embed, setEmbed] = useState();
  const editorRef = React.createRef();

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
      ({ alter, octave, step, $color = '#000000' }) => {
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
    const resultTransposed = transposeEmbed
      .ready()
      .then(() => transposeEmbed.loadJSON(template));
    return resultTransposed;
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
      displayFirstLinePartsNames: false,
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
        let mappedColors = colors;
        if(Array.isArray(colors) && colors.length > 0) {
          mappedColors = colors.map(colorMap);
        } else {
          mappedColors = colorMap(colors);
        }
        colorNotes(bucket, mappedColors);
      }

      // current issue: our octaves are all defaulted to 0; however, to fix this issue if we comment out our else statement in our keyFromScoreJSON it fixes.
      embedTransposed(bucket, embed, keySignature, instrumentName);
    }
  }, [referenceScoreJSON, chordScaleBucket, embed]);

  return (
    <div className={className} ref={editorRef} />
  );
}

export default ChordScaleBucketScore;
