import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Embed from 'flat-embed';
import { Spinner } from 'react-bootstrap';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';

function FlatEditor({
  edit = false,
  height = 450,
  score = {
    // scoreId: '61e09029dffcd50014571a80',
    sharingKey:
      '169f2baebaa5721b4442b124fc984cce26f7e63312fb597d187f9c4d0e3aa1897df093c3bec76af250eb3ca0f36eb4f645ac70f470a695ccd217a1ce0cd52120',
  },
  onSubmit,
  submittingStatus = 'idle'
}) {
  const [json, setJson] = useState('');
  const editorRef = React.createRef();
  let embed;
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
    console.log('flatioscore param', score)

    const embedParams = {
      sharingKey: score.sharingKey,
      appId: '60a51c906bcde01fc75a3ad0',
      controlsPosition: 'bottom',
      // controlsDisplay: false, // these are paid embed features?? https://flat.io/embed#pricing
      // controlsPlay: false,
    };
    if (edit) {
      embedParams.mode = 'edit';
    }
    const allParams = {
      // score: score.scoreId,
      height: `${height}`,
      width: '100%',
      embedParams,
    }
    if(score.scoreId) {
      allParams.score = score.scoreId;
      console.log('got scoreId', allParams)
    }
    if (typeof window !== "undefined") {
      embed = new Embed(editorRef.current, allParams);
    }
  }, []);

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
            <pre style={{ whiteSpace: 'pre-wrap' }}>{json}</pre>
          </Col>
        </Row>
      )}
    
    </>
  );
}

export default FlatEditor;
