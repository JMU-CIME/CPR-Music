// with thanks to https://medium.com/front-end-weekly/recording-audio-in-mp3-using-reactjs-under-5-minutes-5e960defaf10

import MicRecorder from 'mic-recorder-to-mp3';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaMicrophone, FaStop, FaCloudUploadAlt, FaSpinner, FaTimesCircle, FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useRouter } from 'next/router';
import { UploadStatusEnum } from '../types';

export default function Recorder({ submit, accompaniment }) {
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

  const accompanimentRef = useRef(null);

  const router = useRouter();
  const { slug, piece, actCategory, partType } = router.query;

  const {uploadStatus} = useSelector((state) => state.selectedAssignment);
  console.log('uploadStatus', uploadStatus)
  // const uploadStatus = 1; // 0 = not started, 1 = in progress, 2 = success, 3 = error
  // const UploadStatusEnum = {
  //   Inactive: 0,
  //   Active: 1,
  //   Success: 2,
  //   Erroneous: 3,
  // }


  useEffect(() => {
    setBlobInfo([]);
    setBlobURL('');
    setBlobData();
  }, [partType]);

  const startRecording = (ev) => {
    console.log('startRecording', ev);
    if (isBlocked) {
      console.error('cannot record, microphone permissions are blocked');
    } else {
      accompanimentRef.current.play();
      recorder
        .start()
        .then(setIsRecording(true))
        .catch((err) => console.error('problem starting recording', err));
    }
  };

  const stopRecording = (ev) => {
    console.log('stopRecording', ev);
    accompanimentRef.current.pause();
    accompanimentRef.current.load();
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
    if (
      typeof window !== 'undefined' &&
      navigator &&
      navigator.mediaDevices.getUserMedia
    ) {
      console.log('navigator available');
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          console.log('Permission Granted');
          setIsBlocked(false);
        })
        .catch(() => {
          console.log('Permission Denied');
          setIsBlocked(true);
        });
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSecond(sec + 1);
        if (sec === 59) {
          setMinute(min + 1);
          setSecond(0);
        }
        if (min === 99) {
          setMinute(0);
          setSecond(0);
        }
      }, 1000);
    } else if (!isRecording && sec !== 0) {
      setMinute(0);
      setSecond(0);
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRecording, sec]);

  return (
    <Row>
      <Col>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio src={accompaniment} ref={accompanimentRef} />
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
                {/* eslint-disable no-nested-ternary */}
                {uploadStatus === UploadStatusEnum.Active ? (
                  <FaSpinner
                    className={
                      uploadStatus === UploadStatusEnum.Active
                        ? 'fa-spin'
                        : 'hiding'
                    }
                  />
                ) : uploadStatus === UploadStatusEnum.Erroneous ? (
                  <FaTimesCircle
                    className={
                      uploadStatus === UploadStatusEnum.Erroneous
                        ? 'show-out'
                        : 'hiding'
                    }
                  />
                ) : uploadStatus === UploadStatusEnum.Success ? (
                  <FaCheck
                    className={
                      uploadStatus === UploadStatusEnum.Success
                        ? 'show-out'
                        : 'hiding'
                    }
                  />
                ) : null}
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
            <FaStop /> {String(min).padStart(2, '0')}:
            {String(sec).padStart(2, '0')}
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
