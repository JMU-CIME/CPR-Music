import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
// import ListGroup from 'react-bootstrap/ListGroup';
// import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchActivities,
  fetchSingleStudentAssignment,
  postRecording,
} from '../../../../../../actions';
import Layout from '../../../../../../components/layout';
import Recorder from '../../../../../../components/recorder';
import StudentAssignment from '../../../../../../components/student/assignment';

const FlatEditor = dynamic(
  () => import('../../../../../../components/flatEditor'),
  {
    ssr: false,
  }
);

export default function PerformMelody() {
  const router = useRouter();
  const { slug, piece, actCategory, partType } = router.query;
  const dispatch = useDispatch();
  const [parsedScore, setParsedScore] = useState()
  
  const userInfo = useSelector((state) => state.currentUser);
  useEffect(() => {
    dispatch(fetchActivities({ slug }));
  }, [slug])
  const { items: activities, loaded: loadedActivities } = useSelector(
    (state) => state.activities
  );
  const assignment = useSelector((state) => state.selectedAssignment);
  useEffect(() => {
    // console.log('useeffect: slug, userInfo, activities, loadedActivities', slug, userInfo, activities, loadedActivities)
    if (loadedActivities){
      // console.log('activities', activities)
      // console.log('piece, partType, actCategory', piece, partType, actCategory)
      dispatch(
        fetchSingleStudentAssignment({
          slug,
          assignmentId: activities[slug].filter(
            (assn) =>
              assn.part.piece.slug === piece &&
            assn.activity.part_type === partType &&
            assn.activity.activity_type.category === actCategory 

          )?.[0]?.id,
        })
      );}
  }, [slug, loadedActivities, activities, partType]);

  // console.log('assignment.instrument.transposition', assignment?.instrument?.transposition, assignment?.part?.transpositions)
  
  useEffect(()=>{
    console.log('assignment', assignment)
    const score = assignment?.part?.transpositions?.filter((partTransposition) => partTransposition.transposition.name === assignment?.instrument?.transposition)?.[0]?.flatio
    console.log('score, score && true', score, score && true)
    if (score) {
      setParsedScore(JSON.parse(score))
      console.log('parsedScore', parsedScore)
    }
  },[assignment])

  console.log('assignment', assignment)
  console.log('parsedScore', parsedScore)
  return assignment && assignment?.id && assignment?.part ? (
    <StudentAssignment assignment={assignment}>
      {parsedScore !== undefined && <FlatEditor score={parsedScore} />}

      <Recorder
        submit={({ audio }) =>
          dispatch(
            postRecording({
              token: userInfo.token,
              slug,
              assignmentId: assignment.id,
              audio,
            })
          )
        }
      />
    </StudentAssignment>
  ) : (
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
