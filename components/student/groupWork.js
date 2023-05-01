import { useRouter } from 'next/router';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import { FaPause, FaStop, FaPlay } from 'react-icons/fa';
import { getStudentAssignments, getTelephoneGroup } from '../../api';
import { useSelector } from 'react-redux';


export default function GroupWork({ currentAssignment }) {
  const [sortedTelephoneGroup, setSortedTelephoneGroup] = useState([]);
  const [currentTake, setCurrentTake] = useState(-1);
  const { groupIsLoading, error, data: telephoneGroup } = useQuery('telephoneGroup', getTelephoneGroup);
  const [isPlaying, setIsPlaying] = useState(false);
  const oldAudioRefs = useRef([]);
  const selectedTakeRef = useRef(null);
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
      oldAudioRefs?.current?.forEach((audio) => {
        audio?.play();
      });
      selectedTakeRef?.current?.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAll = () => {
    if (isPlaying) {
      oldAudioRefs?.current?.forEach((audio) => {
        audio?.pause();
      });
      selectedTakeRef?.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleStopAll = () => {
    oldAudioRefs?.current?.forEach((audio) => {
      audio?.pause();
      audio.currentTime = 0;
    });
    selectedTakeRef?.current?.pause();
    if(selectedTakeRef?.current?.currentTime)
      selectedTakeRef.current.currentTime = 0;
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

  function currentTakeDropdown() {
    console.log("oldAudioRefs", oldAudioRefs);
    return (
      <Dropdown>
        <Dropdown.Toggle className="dropdown-itm" id="currentTakeDropdown">
          {currentTake == -1 ? "Pick Your Current Take" : "Take " + (currentTake + 1)}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {takes.map((take, index) => (
            <Dropdown.Item onClick={(() => {
              console.log('take', take);
              console.log('index', index);
              setCurrentTake(index);
            })}
            key={`take-${index}`}>Take {index + 1}</Dropdown.Item>
          ))}
          {/* <DropdownDivider /> */}
          <Dropdown.Item onClick={(() => {setCurrentTake(-1);})}>None</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  //   console.log('currentAssignment.enrollment.user.username', currentAssignment.enrollment.user.username);
  // console.log('takes', takes);
  return (
    <>
      <h2>Listen to Your Group's Submissions</h2>
      {/* {currentAssignment.enrollment.user.username === sortedTelephoneGroup?.[0]?.user?.username ? '' : */}
      {/* Display the audio for the previous student's submission */}
      {sortedTelephoneGroup.map((student, index) => (
        <div key={index}>
          {student.audio ? <strong>Listen to {student.user.name}'s {(student.act_type).toLowerCase()}.</strong> :
            <strong>{student.user.name} has not submitted their {(student.act_type).toLowerCase()} yet.</strong>}
          <br />
          {/* {student.audio && <audio controls key={student.act_type} src={student.audio} ref={e => (oldAudioRefs.current[student.act_type] = e)} />} */}
          {student.audio && <audio
            controls key={index}
            src={student.audio}
            preload='auto'
            ref={e => (oldAudioRefs.current[index] = e)} />}
        </div>
      ))
      }

      {takes.length > 0 && 
      <>
        {currentTakeDropdown()}
        {currentTake > -1 &&
        <audio controls src={takes[currentTake].url} ref={selectedTakeRef} preload='auto'></audio>}
        {/* ref={`currentTake${currentTake}`} */}
      </>
      }
      <br />

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
