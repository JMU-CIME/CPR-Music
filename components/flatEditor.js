import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import {
  pitchesToRests,
  trimScore,
  sliceScore,
  nthScoreSlice,
  nthSliceIdxs,
  keyFromScoreJSON,
  getChordScaleInKey,
  colorNotes,
  colorMeasures
} from '../lib/flat';

const validateScore = (proposedScore, permittedPitches) => {
  const result = { ok: true, errors: [] };
  proposedScore['score-partwise'].forEach((part, i) => {
    part.measure.forEach((measure, j) => {
      measure.note.forEach((note, k) => {
        if (note.pitch && !permittedPitches.includes(note.pitch.step)) {
          result.ok = false;
          result.errors.push({ note, part: i, measure: j, note: k });
        }
      });
    });
  });
  return result;
};

function FlatEditor({
  edit = false,
  height,
  width='100%',
  score = {
    // scoreId: '61e09029dffcd50014571a80',
    // sharingKey:
    //   '169f2baebaa5721b4442b124fc984cce26f7e63312fb597d187f9c4d0e3aa1897df093c3bec76af250eb3ca0f36eb4f645ac70f470a695ccd217a1ce0cd52120',
  },
  onSubmit,
  submittingStatus = 'idle',
  scoreJSON,
  onUpdate,
  orig,
  giveJSON,
  trim,
  colors,
  referenceScoreJSON,
  chordScaleBucket,
  instrumentName,
  slice,
  sliceIdx,
  debugMsg
}) {
  const [json, setJson] = useState('');
  const [embed, setEmbed] = useState();
  const [refId, setRefId] = useState('0');
  const editorRef = React.createRef();
  const [addingNote, setAddingNote] = useState(false);

  // *FIX* Need to get rid of arrow, make it a normal function as we did with keyFromScoreJSON, and getChordScaleInKey below.
  const embedTransposed = (
    bucket,
    embed,
    // templt,
    keySig,
    instrName,
    octaveShift
  ) => {
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
    scorePart['part-name'] = instrName; //embed.instrumentName;
    scorePart['part-abbreviation'] = instrName; //embed.instrumentAbbreviation;
    scorePart['score-instrument']['instrument-name'] = instrName; //embed.instrumentName;

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
          //FIXME
          element.key.fifths = keySig.keyAsJSON.fifths;
        }
        if (element.clef) {
          //FIXME
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

    const resultTransposed = embed.ready().then(() => {
      return embed.loadJSON(template);
    });
    return resultTransposed;
  };

  useEffect(() => {
    if (referenceScoreJSON !== '' && referenceScoreJSON !== undefined) {
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

      //console.log('bucket', bucket); // current issue: our octaves are all defaulted to 0; however, to fix this issue if we comment out our else statement in our keyFromScoreJSON it fixes.
      embedTransposed(bucket, embed, keySignature, instrumentName);
    }
  }, [referenceScoreJSON, chordScaleBucket]);

  useEffect(() => {
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
    };
    let computedHeight = 300;
    if (edit) {
      embedParams.mode = 'edit';
    } else if (height) {
      computedHeight = height;
    }

    const allParams = {
      height: `${computedHeight}`,
      width: width,
      embedParams,
    };
    // console.log('allParams', allParams);
    setEmbed(new Embed(editorRef.current, allParams));
  }, [edit, height]);

  useEffect(() => {
    if (
      score.scoreId &&
      (score.scoreId === 'blank' || score.sharingKey) &&
      embed
    ) {
      const loadParams = {
        score: score.scoreId,
      };
      if (score.sharingKey) {
        loadParams.sharingKey = score.sharingKey;
      }
      embed
        .ready()
        .then(() => {
          if (score.scoreId === 'blank' && orig) {
            let result = pitchesToRests(JSON.parse(orig));
            if (trim) {
              result = trimScore(result, trim);
            }
            if (slice) {
              result = sliceScore(result, slice)
            } // FIXME: should slice and sliceIdx be mutually exclusive?
            if (sliceIdx !== undefined) {
              const [colorStart, colorStop] = nthSliceIdxs(result, sliceIdx);
              result = nthScoreSlice(result, sliceIdx);
              if (colors) {
                result['score-partwise'].part[0].measure = colorMeasures(
                  result['score-partwise'].part[0].measure,
                  colors.slice(colorStart, colorStop)
                );
              }
            }
            else if (colors) {
              result['score-partwise'].part[0].measure = colorMeasures(
                result['score-partwise'].part[0].measure,
                colors
              );
            }
            return (
              // if a user adds a note that is black or does not have a color assigned to it, then we apply the color from the chord scale pattern to match.
              score.scoreId === 'blank' &&
              embed.loadJSON(result).then(() => {
                embed.off('noteDetails');
                embed.on('noteDetails', (info) => {
                  // console.log('noteDetails', info);
                  embed.getJSON().then((jd) => {
                    const jsonData = jd;
                    //try to let the outer context know when this thing has data
                    
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
                          if (edit) {
                            embed.setCursorPosition(position);
                          }
                        })
                      );
                    }
                    const data = JSON.stringify(jsonData);
                    // validateScore(jsonData, [])
                    setJson(data);
                    if (onUpdate) {
                      onUpdate(data);
                    }
                  });
                });
              })
            );
          }
          return embed;
        })
        .then(
          () =>
            score.scoreId !== 'blank' &&
            embed
              .loadFlatScore(loadParams)
              .then(() => {
                embed
                  .getJSON()
                  .then(
                    (jsonData) => giveJSON && giveJSON(JSON.stringify(jsonData))
                  );
                setRefId(score.scoreId);
              })
              .catch((e) => {

                // **** Hi - even with optional chaining, line 654 causing runtime errors (I *think* when scores get locked). 
                // Otherwise chaining resolves rare, seemingly random errors accessing message property

                // e?.message = `flat error: ${e.message}, not loaded from scoreId, score: ${JSON.stringify(score)}, orig: ${orig}, colors: ${colors}`;
                if (debugMsg){
                  console.error(`debugMsg: ${debugMsg}`;
                  // e.message = `${e.message}, debugMsg: ${debugMsg}`;
                }
                console.error('score not loaded from scoreId');
                console.error('score', score);
                console.error('orig', orig);
                console.error('colors', colors);
                // console.error(e);
                throw e;
              })
        );
    } else if (scoreJSON && embed) {
      // this is currently for the grade creativity screen
      embed
        .loadJSON(scoreJSON)
        .then(() => {
          // console.log('score loaded from json')
          setRefId(score.scoreId);
          if (edit) {
            embed.off('noteDetails');
            embed.on('noteDetails', (info) => {
              embed.getJSON().then((jsonData) => {
                const data = JSON.stringify(jsonData);
                setJson(data);
                if (onUpdate) {
                  onUpdate(data);
                }
              });
            });
          }
        })
        .catch((e) => {
          console.error('score not loaded from json');
          console.error(e);
        });
    }
  }, [score, scoreJSON, chordScaleBucket, embed]);

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

export default FlatEditor;
