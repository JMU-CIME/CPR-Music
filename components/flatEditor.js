import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Embed from 'flat-embed';
import { Spinner } from 'react-bootstrap';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';

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
  console.log('pieceScoreJSON', pieceScoreJSON);
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
  console.log('composeScoreJSON', composeScoreJSON);
  return composeScoreJSON;
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
}) {
  console.log('flat io embed log', scoreJSON, orig);
  const [json, setJson] = useState('');
  const [embed, setEmbed] = useState();
  const [refId, setRefId] = useState('0');
  const editorRef = React.createRef();

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
      branding: false,
      themePrimary: '#450084',
      controlsPosition: 'bottom',
      // controlsDisplay: false, // these are paid embed features?? https://flat.io/embed#pricing
      // controlsPlay: false,
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
      console.log('loadFlatScore', loadParams);
      embed
        .ready()
        .then(() => {
          if (score.scoreId === 'blank' && orig) {
            console.log('embed', embed);
            return (
              edit &&
              score.scoreId === 'blank' &&
              embed.loadJSON(pitchesToRests(JSON.parse(orig)))
            );
          }
          return embed;
        })
        .then(() => (
          score.scoreId !== 'blank' &&
            embed
              .loadFlatScore(loadParams)
              .then(() => {
                embed.getJSON().then((jsonData) => {
                  giveJSON(JSON.stringify(jsonData));
                });
                // console.log('score loaded from scoreId', score.scoreId)
                setRefId(score.scoreId);
                if (edit) {
                  embed.off('noteDetails');
                  embed.on('noteDetails', (info) => {
                    // console.log('noteDetails', info);
                    // console.log('pitch', info.pitches)
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
                console.error('score not loaded from scoreId');
                console.error(e);
              })
        ));
    } else if (scoreJSON && embed) {
      // this is currently for the grade creativity screen
      // console.log('loadJSON', scoreJSON)
      embed
        .loadJSON(scoreJSON)
        .then(() => {
          // console.log('score loaded from json')
          setRefId(score.scoreId);
          // console.log(editorRef.current.querySelector('*'))
          // embed.on('playbackPosition', (info) => {
          //   console.log('playbackPosition', info);
          // });
          // embed.on('scoreLoaded', (info) => {
          //   console.log('scoreLoaded', info);
          // });
          // embed.on('cursorPosition', (info) => {
          //   console.log('cursorPosition', info);
          // });
          // embed.on('cursorContext', (info) => {
          //   console.log('cursorContext', info);
          // });
          // embed.on('measureDetails', (info) => {
          //   console.log('measureDetails', info);
          // });
          if (edit) {
            embed.off('noteDetails');
            embed.on('noteDetails', (info) => {
              // console.log('noteDetails', info);
              // console.log('pitch', info.pitches)
              embed.getJSON().then((jsonData) => {
                const data = JSON.stringify(jsonData);
                setJson(data);
                if (onUpdate) {
                  onUpdate(data);
                }
              });
            });
          }
          // embed.on('rangeSelection', (info) => {
          //   console.log('rangeSelection', info);
          // });
          // embed.on('fullscreen', (info) => {
          //   console.log('fullscreen', info);
          // });
          // embed.on('play', (info) => {
          //   console.log('play', info);
          // });
          // embed.on('pause', (info) => {
          //   console.log('pause', info);
          // });
          // embed.on('stop', (info) => {
          //   console.log('stop', info);
          // });
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
      {/* {edit && (
        <Row>
          <Col style={{ maxWidth: '40%', whiteSpace: 'pre-wrap' }}>
            <Button onClick={refreshJSON} disabled={submittingStatus === 'loading'}>
              Submit { submittingStatus === 'loading' && <Spinner as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true">
                <span className="visually-hidden">Loading...</span>
              </Spinner> } { submittingStatus  === 'success' ? 
                <FaCheck /> : submittingStatus === 'error' && <FaFrownOpen />
              }
            </Button>
          </Col>
        </Row>
      )} */}
    </>
  );
}

export default FlatEditor;
