import { useRouter } from 'next/router';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { FaPause, FaStop, FaPlay } from 'react-icons/fa';
import { getStudentAssignments, getTelephoneGroup } from '../../api';
import { useSelector } from 'react-redux';


export default function GroupWork({ currentAssignment }) {
  const [sortedTelephoneGroup, setSortedTelephoneGroup] = useState([]);
  const { groupIsLoading, error, data: telephoneGroup } = useQuery('telephoneGroup', getTelephoneGroup);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef([]);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (telephoneGroup && sortedTelephoneGroup)
      setSortedTelephoneGroup(Object.entries(telephoneGroup)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([act_type, value]) => ({ ...value, act_type })));
    // console.log('sortedTelephoneGroup', Object.entries(telephoneGroup)
    // .sort(([, a], [, b]) => a.order - b.order)
    // .map(([act_type, value]) => ({ ...value, act_type })));
  }, [telephoneGroup]);

  const handlePlayAll = () => {
    if (!isPlaying) {
      audioRefs.current.forEach((audio) => {
        audio.play();
      });
      setIsPlaying(true);
    }
  };

  const handlePauseAll = () => {
    if (isPlaying) {
      audioRefs.current.forEach((audio) => {
        audio.pause();
      });
      setIsPlaying(false);
    }
  };

  const handleStopAll = () => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setIsPlaying(false);
  };

  const takes = useSelector((state) => state.telephone.takes);

  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });

  if (isLoading || groupIsLoading) {
    return (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  //   console.log('currentAssignment.enrollment.user.username', currentAssignment.enrollment.user.username);
  console.log('takes', takes);
  return (
    <>
      <h2>Listen to Your Group's Submissions</h2>
      {/* Check if the current user's assignment is the first in the order */}
      {/* {currentAssignment.enrollment.user.username === sortedTelephoneGroup?.[0]?.user?.username ? '' : */}
      {/* Display the audio for the previous student's submission */}
      {sortedTelephoneGroup.map((student, index) => (
        <div key={index}>
          {student.audio ? <strong>Listen to {student.user.name}'s {(student.act_type).toLowerCase()}.</strong> :
            <strong>{student.user.name} has not submitted their {(student.act_type).toLowerCase()} yet.</strong>}
          <br />
          {/* {student.audio && <audio controls key={student.act_type} src={student.audio} ref={e => (audioRefs.current[student.act_type] = e)} />} */}
          {student.audio && <audio
            controls key={index}
            src={student.audio}
            preload='auto'
            ref={e => (audioRefs.current[index] = e)} />}
        </div>
      ))
      }
      {/* <Button onClick={handlePlayAll} disabled={!allLoaded}>{isPlaying ? "Stop All" : "Play All"}</Button> */}
      {/* <Button onClick={handlePlayAll} >{isPlaying ? <FaPause>Pause All</FaPause> : <FaPlay />}</Button> */}
      {isPlaying ?
        <>
          <Button onClick={handlePauseAll} ><FaPause /> Pause</Button >
        </>
        :
        <Button onClick={handlePlayAll} ><FaPlay /> Play</Button >
      }
      <Button onClick={handleStopAll} style={{ marginLeft: '20px' }}><FaStop /> Stop</Button >

    </>
  );
}
