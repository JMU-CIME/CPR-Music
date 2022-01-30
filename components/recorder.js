// with thanks to https://medium.com/front-end-weekly/recording-audio-in-mp3-using-reactjs-under-5-minutes-5e960defaf10

import MicRecorder from 'mic-recorder-to-mp3';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaMicrophoneAlt, FaStop, FaCloudUploadAlt } from 'react-icons/fa';

export default function Recorder({ submit }) {
  // const Mp3Recorder = new MicRecorder({ bitRate: 128 }); // 128 is default already
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blobData, setBlobData] = useState();
  const [recorder, setRecorder] = useState(new MicRecorder());

  const startRecording = (ev) => {
    console.log('startRecording', ev)
    if (isBlocked) {
      console.error('cannot record, microphone permissions are blocked');
    } else {
      recorder.start()
        .then(setIsRecording(true))
        .catch((err) => console.error('problem starting recording', err));
    }
  };

  const stopRecording = (ev) => {
    console.log('stopRecording', ev)
    recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        setBlobData(blob);
        setBlobURL(URL.createObjectURL(blob));
        setIsRecording(false);
      })
      .catch((e) => console.error('error stopping recording', e));
  };

  const submitRecording = (ev) => {
    console.log('blobData', blobData);
    const formData = new FormData(); // TODO: make filename reflect assignment
    formData.append(
      'student_recording',
      new File(blobData, 'student-recoding.mp3', { mimeType: 'audio/mpeg' })
    );
    submit({ audio: formData });
  };

  // check for recording permissions
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator && navigator.getUserMedia) {
      console.log('navigator available')
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
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio src={blobURL} controls="controls" />
      <span>No takes yet. Click the microphone icon to record.</span>
      {isRecording ? (
        <Button onClick={stopRecording}>
          <FaStop />
        </Button>
      ) : (
        <Button onClick={startRecording}>
          <FaMicrophoneAlt />
        </Button>
      )}
      {!isRecording && blobData && (
        <Button onClick={submitRecording}>
          <FaCloudUploadAlt />
        </Button>
      )}
    </>
  );
}
