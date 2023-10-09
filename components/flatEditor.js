import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Embed from 'flat-embed';
import { Spinner } from 'react-bootstrap';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';
import { pitchesToRests, trimScore } from '../lib/flat';

const validateScore = (proposedScore, permittedPitches) => {
  const result = {ok:true, errors:[]}
  proposedScore["score-partwise"].forEach((part, i) => {
    part.measure.forEach((measure, j) => {
      measure.note.forEach((note, k) => {
        if (note.pitch && !permittedPitches.includes(note.pitch.step)) {
          result.ok = false
          result.errors.push({note, part:i, measure:j, note:k})
        }  
      })
    })
  })
  return result

}



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
      console.log('loadFlatScore', loadParams);
      embed
        .ready()
        .then(() => {
          if (score.scoreId === 'blank' && orig) {
            console.log('embed', embed);
            return (
              // edit &&
              score.scoreId === 'blank' &&
              embed.loadJSON(trimScore(pitchesToRests(JSON.parse(orig)), 1))
            );
          }
          return embed;
        })
        .then(() => (
          score.scoreId !== 'blank' &&
            embed
              .loadFlatScore(loadParams)
              .then(() => {
                embed.getJSON().then((jsonData) => giveJSON && giveJSON(JSON.stringify(jsonData)));
                // console.log('score loaded from scoreId', score.scoreId)
                setRefId(score.scoreId);
                
              })
              .catch((e) => {
                console.error('score not loaded from scoreId');
                console.error(e);
              })
        )).then(()=>{
          if (edit) {
            console.log('edit mode');
            embed.off('measureDetails');
            embed.on('measureDetails', (info) => {
              console.log('measureDetails', info);
              // embed.getJSON().then((jsonData) => {
              //   const data = JSON.stringify(jsonData);
              //   setJson(data);
              //   if (onUpdate) {
              //     onUpdate(data);
              //   }
              // });
            })
            embed.off('noteDetails');
            embed.on('noteDetails', (info) => {
              console.log('noteDetails', info);
              console.log('pitch', info.pitches);
              embed.getJSON().then((jsonData) => {

                const data = JSON.stringify(jsonData);
                // validateScore(jsonData, [])
                setJson(data);
                if (onUpdate) {
                  onUpdate(data);
                }
              });
            });
          }
        })
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