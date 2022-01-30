// with thanks to https://medium.com/front-end-weekly/recording-audio-in-mp3-using-reactjs-under-5-minutes-5e960defaf10

import MicRecorder from 'mic-recorder-to-mp3';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaMicrophone, FaStop, FaCloudUploadAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function Recorder({ submit }) {
  // const Mp3Recorder = new MicRecorder({ bitRate: 128 }); // 128 is default already
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [blobData, setBlobData] = useState();
  const [blobInfo, setBlobInfo] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [recorder, setRecorder] = useState(new MicRecorder());
  const dispatch = useDispatch();

  const startRecording = (ev) => {
    console.log('startRecording', ev);
    if (isBlocked) {
      console.error('cannot record, microphone permissions are blocked');
    } else {
      recorder
        .start()
        .then(setIsRecording(true))
        .catch((err) => console.error('problem starting recording', err));
    }
  };

  const stopRecording = (ev) => {
    console.log('stopRecording', ev);
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        console.log('blob', blob);
        setBlobData(blob);
        const url = URL.createObjectURL(blob);
        setBlobURL(url);
        setBlobInfo([
          ...blobInfo,
          {
            url,
            data: blob,
          },
        ]);
        setIsRecording(false);
      })
      .catch((e) => console.error('error stopping recording', e));
  };

  const submitRecording = (i) => {
    console.log('blobData', blobData);
    const formData = new FormData(); // TODO: make filename reflect assignment
    formData.append(
      'student_recording',
      new File([blobInfo[i].data], 'student-recoding.mp3', {
        mimeType: 'audio/mpeg',
      })
    );
    // dispatch(submit({ audio: formData }));
    submit({ audio: formData });
  };

  // check for recording permissions
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator && navigator.getUserMedia) {
      console.log('navigator available');
      navigator.getUserMedia(
        { audio: true },
        () => {
          console.log('Permission Granted');
          setIsBlocked(false);
        },
        () => {
          console.log('Permission Denied');
          setIsBlocked(true);
        }
      );
    }
  }, []);

  return (
    <Row>
      <Col>
        {' '}
        {blobInfo.length === 0 ? (
          <span>No takes yet. Click the microphone icon to record.</span>
        ) : (
          <ListGroup as="ol" numbered>
            {blobInfo.map((take, i) => (
              <ListGroupItem
                key={take.url}
                as="li"
                className="d-flex justify-content-between align-items-start"
                style={{ fontSize: '1.5rem' }}
              >
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio style={{ height: '2.25rem' }} src={take.url} controls />
                <Button onClick={() => submitRecording(i)}>
                  <FaCloudUploadAlt />
                </Button>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio src={blobURL} />

        {isRecording ? (
          <Button onClick={stopRecording}>
            <FaStop />
          </Button>
        ) : (
          <Button onClick={startRecording}>
            <FaMicrophone />
          </Button>
        )}
      </Col>
    </Row>
  );
}
