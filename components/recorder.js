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
  const [min, setMinute] = useState(0);
  const [sec, setSecond] = useState(0);

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
      'file',
      new File([blobInfo[i].data], 'student-recoding.mp3', {
        mimeType: 'audio/mpeg',
      })
    );
    // dispatch(submit({ audio: formData }));
    submit({ audio: formData });
  };

  // check for recording permissions
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator && navigator.mediaDevices.getUserMedia) {
      console.log('navigator available');
      navigator.mediaDevices.getUserMedia(
        { audio: true }).then(
          () => {
            console.log('Permission Granted');
            setIsBlocked(false);
          }).catch(
            () => {
              console.log('Permission Denied');
              setIsBlocked(true);
            }
          );
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSecond(sec => sec + 1);
        if (sec == 59) {
          setMinute(min => min + 1);
          setSecond(sec => 0);
        }
        if (min == 99) {
          setMinute(min => 0);
          setSecond(sec => 0);
        }
      }, 1000);
    } else if (!isRecording && sec !== 0) {
      setMinute(min => 0);
      setSecond(sec => 0);
      clearInterval(interval);
    }
    return () => { clearInterval(interval); };
  }, [isRecording, sec]);

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
            <FaStop /> {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
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
