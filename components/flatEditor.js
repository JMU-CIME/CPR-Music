import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Embed from 'flat-embed';
import { Spinner } from 'react-bootstrap';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';

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
}) {
  console.log('flat io embed log', score)
  const [json, setJson] = useState('');
  const [embed, setEmbed] = useState();
  const [refId, setRefId] = useState('0');
  const editorRef = React.createRef();
  
  const refreshJSON = () => {
    embed.getJSON().then((jsonData) => {
      const data = JSON.stringify(jsonData);
      setJson(data);
      if (onSubmit) {
        onSubmit(data);
      }
    });
  };
  useEffect(()=>{
    const embedParams = {
      // sharingKey: score.sharingKey,
      appId: '60a51c906bcde01fc75a3ad0',
      controlsPosition: 'bottom',
      // controlsDisplay: false, // these are paid embed features?? https://flat.io/embed#pricing
      // controlsPlay: false,
    };
    let computedHeight = 300;
    if (edit) {
      embedParams.mode = 'edit';
      console.log('height', height)
      if (!height) {
        computedHeight = 450;
        console.log('set height to 450')
        console.log('flatHeight', computedHeight)
      }
    } else if (height) {
      console.log('set height to explicit')
      computedHeight = height;
    }

    console.log('computedHeight', computedHeight)
    const allParams = {
      height: `${computedHeight}`,
      width: '100%',
      embedParams,
    }
    console.log('allp', allParams)
    
    // embed = new Embed(editorRef.current, allParams);
    setEmbed(new Embed(editorRef.current, allParams));
  }, [edit, height])

  useEffect(() => {
    console.log('flat useeffect:: score: ', score, " embed: ", embed)
    if(score.scoreId && score.sharingKey && embed) {
      console.log('got score as param', score)
      embed.loadFlatScore({
        score: score.scoreId, 
        sharingKey: score.sharingKey
      })
        .then(()=>{
          console.log('score loaded from scoreId', score.scoreId)
          setRefId(score.scoreId)
        })
        .catch((e) => {
          console.error('score not loaded from scoreId');
          console.error(e);
        })
      
    } else if (scoreJSON && embed) {
      console.log('loadJSON', scoreJSON)
      embed.loadJSON(scoreJSON)
        .then(()=>{
          console.log('score loaded from json')
          setRefId(score.scoreId)
        })
        .catch((e) => {
          console.error('score not loaded from json');
          console.error(e);
        })
    }
    
  }, [score, scoreJSON, embed]);

  return (
    <>
      <Row>
        <Col>
          <div ref={editorRef} />
        </Col>
      </Row>
      {edit && (
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
            {/* <pre style={{ whiteSpace: 'pre-wrap' }}>{json}</pre> */}
          </Col>
        </Row>
      )}
    
    </>
  );
}

export default FlatEditor;
