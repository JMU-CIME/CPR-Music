import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
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
} from '../../../../../actions';
import Layout from '../../../../../components/layout';
import Recorder from '../../../../../components/recorder';
import StudentAssignment from '../../../../../components/student/assignment';
import ConnectActivity from "../../../../../components/student/connect";
import CreativityActivity from "../../../../../components/student/creativity";
import RespondActivity from "../../../../../components/student/respond";

const FlatEditor = dynamic(
  () => import('../../../../../components/flatEditor'),
  {
    ssr: false,
  }
);

export default function PerformMelody() {
  const router = useRouter();
  const { slug, piece, actCategory, partType } = router.query;
  const dispatch = useDispatch();
  const [parsedScore, setParsedScore] = useState();

  const userInfo = useSelector((state) => state.currentUser);
  useEffect(() => {
    if (slug && userInfo.token) {
      dispatch(fetchActivities({ slug }));
    }
  }, [slug, userInfo.token]);
  const { items: activities, loaded: loadedActivities } = useSelector(
    (state) => state.activities
  );

  const assignment = useSelector(
    (state) => state.selectedAssignment
  );
  useEffect(() => {
    if (loadedActivities) {
      console.log('dispatch', activities);
      dispatch(
        fetchSingleStudentAssignment({
          slug,
          assignmentId: activities[slug].filter(
            (assn) =>
              assn.piece_slug === piece &&
              assn.activity_type_category === actCategory
          )?.[0]?.id,
        })
      );
    }
  }, [slug, loadedActivities, activities, partType]);

  useEffect(() => {
    const score = assignment?.part?.transpositions?.filter(
      (partTransposition) =>
        partTransposition.transposition.name ===
        assignment?.instrument?.transposition
    )?.[0]?.flatio;
    // console.log('assignment no score', assignment);
    if (score) {
      setParsedScore(JSON.parse(score));
    }
  }, [assignment]);

  return assignment ? <StudentAssignment assignment={assignment}>
    {actCategory === 'Create' ? <CreativityActivity/> : actCategory === 'Respond' ? <RespondActivity/> : <ConnectActivity />}
  </StudentAssignment> : <Spinner as="span"
    animation="border"
    size="sm"
    role="status"
    aria-hidden="true">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
}