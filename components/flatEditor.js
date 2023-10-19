import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Embed from 'flat-embed';
import { pitchesToRests, trimScore } from '../lib/flat';

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
}) {
  // console.log('flat io embed log', scoreJSON, orig);
  const [json, setJson] = useState('');
  const [embed, setEmbed] = useState();
  const [refId, setRefId] = useState('0');
  const editorRef = React.createRef();
  const [addingNote, setAddingNote] = useState(false);

  /**
   *  Given a measure, and a string consisting of "rgbgrb..." we match the notes of the corresponding measure to that value.
   *  For example, given a measure (1,2,3) and a string "rgb", the first measure would be colored red, second would be green, third would be green.
   */
  const colorMeasures = (measures, colorSpecs) => {
    /**
     * Colors an array of notes to a given hex color attribute.
     */
    const colorNotes = (notes, color) => {
      for (let i = 0; i < notes.length; i++) {
        notes[i].$color = color;
      }
    };
    const BLACK = '#000000';
    const ORANGE = '#f5bd1f';
    for (let i = 0; i < measures.length; i++) {
      if (colorSpecs && colorSpecs[i]) {
        colorNotes(measures[i].note, colorSpecs[i]);
      } else {
        colorNotes(measures[i], BLACK);
      }
    }
    return measures;
  };

  // const getComposition = () => {
  //   return embed.getJSON().then((jsonData) => {
  //     const data = JSON.stringify(jsonData);
  //     setJson(data);
  //   })
  // }

  const refreshJSON = () => {
    embed.getJSON().then((jsonData) => {
      const data = JSON.stringify(jsonData);
      setJson(data);
      if (onSubmit) {
        onSubmit(data);
      }
    });
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
    if (edit) {
      embedParams.mode = 'edit';
      // console.log('height', height)
      // if (!height) {
      //   computedHeight = 450;
      //   // console.log('set height to 450')
      //   // console.log('flatHeight', computedHeight)
      // }
    } else if (height) {
      // console.log('set height to explicit')
      computedHeight = height;
    }

    // console.log('computedHeight', computedHeight)
    const allParams = {
      height: `${computedHeight}`,
      width: '100%',
      embedParams,
    };
    // console.log('allp', allParams)

    // embed = new Embed(editorRef.current, allParams);
    console.log('allParams', allParams);
    setEmbed(new Embed(editorRef.current, allParams));
  }, [edit, height]);

  useEffect(() => {
    // console.log('flat useeffect:: score: ', score, " embed: ", embed)
    if (
      score.scoreId &&
      (score.scoreId === 'blank' || score.sharingKey) &&
      embed
    ) {
      // console.log('got score as param', score)
      const loadParams = {
        score: score.scoreId,
      };
      if (score.sharingKey) {
        loadParams.sharingKey = score.sharingKey;
      }
      // console.log('loadFlatScore', loadParams);
      embed
        .ready()
        .then(() => {
          if (score.scoreId === 'blank' && orig) {
            // console.log('embed', embed);
            let result = pitchesToRests(JSON.parse(orig));
            if (trim) {
              result = trimScore(result, trim);
            }
            if (colors) {
              result['score-partwise'].part[0].measure = colorMeasures(
                result['score-partwise'].part[0].measure,
                colors
              );
            }
            return (
              // edit &&
              score.scoreId === 'blank' &&
              embed.loadJSON(result).then(() => {
                embed.off('noteDetails');
                embed.on('noteDetails', (info) => {
                  // console.log('noteDetails', info);
                  embed.getJSON().then((jd) => {
                    const jsonData = jd;
                    console.log('on noteDetails', JSON.stringify(jsonData));
                    // console.log('jsonData', jsonData);
                    // console.log(jsonData['score-partwise'].part[0].measure.flatMap((m) => m.note.map((n) => n.$color)))
                    if (
                      colors &&
                      jsonData['score-partwise'].part[0].measure.some((m) =>
                        m.note.some((n) => !n.$color || n.$color === '#000000')
                      )
                    ) {
                      console.log('we need to recolor');
                      jsonData['score-partwise'].part[0].measure =
                        colorMeasures(
                          jsonData['score-partwise'].part[0].measure,
                          colors
                        );
                      embed.getCursorPosition().then((position) => embed
                        .loadJSON(jsonData)
                        .then(() => embed.setCursorPosition(position)));
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
                // console.log('score loaded from scoreId', score.scoreId)
                setRefId(score.scoreId);
              })
              .catch((e) => {
                console.error('score not loaded from scoreId');
                console.error(e);
              })
        )
        .then(() => {
          if (edit) {
            // embed.off('measureDetails');
            // embed.on('measureDetails', (info) => {
            //   console.log('measureDetails', info);
            //   // if (colors && addingNote) {
            //   //   embed.getJSON().then((jd) => {
            //   //     const jsonData = jd;
            //   //     jsonData['score-partwise'].part[0].measure = colorMeasures(
            //   //       jsonData['score-partwise'].part[0].measure,
            //   //       colors
            //   //     );
            //   //     const data = JSON.stringify(jsonData);
            //   //     if (json !== data) {
            //   //       if (addingNote) {
            //   //         setAddingNote(false);
            //   //         embed.loadJSON(jsonData);
            //   //       }
            //   //     }
            //   //   });
            //   //   setAddingNote(true);
            //   // }
            // });
          }
        });
    } else if (scoreJSON && embed) {
      // this is currently for the grade creativity screen
      // console.log('loadJSON', scoreJSON)
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
  }, [score, scoreJSON, embed]);

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
