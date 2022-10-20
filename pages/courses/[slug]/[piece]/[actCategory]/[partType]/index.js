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
  const assignment = useSelector((state) => state.selectedAssignment);
  useEffect(() => {
    if (loadedActivities) {
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
      );
    }
  }, [slug, loadedActivities, activities, partType]);

  useEffect(() => {
    const score = assignment?.part?.transpositions?.filter(
      (partTransposition) =>
        partTransposition.transposition.name ===
        assignment?.instrument?.transposition
    )?.[0]?.flatio;
    console.log('assignment no score', assignment);
    if (score) {
      setParsedScore(JSON.parse(score));
    }
  }, [assignment]);

  // TODO: maybe I should let studentAssignment render anyway but then handle missing things at a lower level
  // return assignment && assignment?.id && assignment?.part ? (
  return (
    <StudentAssignment assignment={assignment}>
      {parsedScore === undefined ? (
        <Alert variant="danger">
          <Alert.Heading>
            We don't have a score for this piece for your instrument.
          </Alert.Heading>
          <p>Please ask your teacher to contact us.</p>
          <p>
            If you already have the music from your teacher,{' '}
            <strong>
              you can still record your performance and submit it.
            </strong>
          </p>
        </Alert>
      ) : (
        <FlatEditor score={parsedScore} />
      )}
      {partType && (
        <Recorder
          accompaniment={assignment?.part?.piece?.accompaniment}
          submit={({ audio, submissionId }) =>
            dispatch(
              postRecording({
                token: userInfo.token,
                slug,
                assignmentId: assignment.id,
                audio,
                submissionId,
              })
            )
          }
        />
      )}
    </StudentAssignment>
  );
  // ) : (
  //   <Spinner
  //     as="span"
  //     animation="border"
  //     size="sm"
  //     role="status"
  //     aria-hidden="true"
  //   >
  //     <span className="visually-hidden">Loading...</span>
  //   </Spinner>
  // );
}
