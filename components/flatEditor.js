import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Embed from 'flat-embed';

function FlatEditor(props) {
  const [json, setJson] = useState('');
  const editorRef = React.createRef();
  let embed;
  const refreshJSON = () => {
    embed.getJSON().then((jsonData) => setJson(JSON.stringify(jsonData)));
  };

  const scores = {
    'Air for Band - Melody - Bb': {
      score: '61e09029dffcd50014571a80',
      sharingKey:
        '169f2baebaa5721b4442b124fc984cce26f7e63312fb597d187f9c4d0e3aa1897df093c3bec76af250eb3ca0f36eb4f645ac70f470a695ccd217a1ce0cd52120',
    },
  };

  const currentPiece = 'Air for Band';
  const currentPart = 'Melody';
  const currentTransposition = 'Bb';

  const currentPath = [currentPiece, currentPart, currentTransposition].join(
    ' - '
  );

  useEffect(() => {
    embed = new Embed(editorRef.current, {
      score: scores[currentPath].score,
      height: '450',
      width: '100%',
      embedParams: {
        mode: 'edit',
        sharingKey: scores[currentPath].sharingKey,
        appId: '60a51c906bcde01fc75a3ad0',
        controlsPosition: 'bottom',
      },
    });
  }, []);

  return (
    <Row>
      <Col>
        <div ref={editorRef} />
      </Col>
      <Col style={{ maxWidth: '40%', whiteSpace: 'pre-wrap' }}>
        <Button onClick={refreshJSON}>Refresh JSON</Button>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{json}</pre>
      </Col>
    </Row>
  );
}

export default FlatEditor;
