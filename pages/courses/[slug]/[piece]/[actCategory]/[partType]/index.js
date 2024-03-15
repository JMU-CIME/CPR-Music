import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchActivities,
  fetchSingleStudentAssignment,
  postRecording,
} from '../../../../../../actions';
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

  const assignment = useSelector(
    (state) => state.selectedAssignment
  );
  useEffect(() => {
    if (loadedActivities) {
      dispatch(
        fetchSingleStudentAssignment({
          slug,
          assignmentId: activities[slug].filter(
            (assn) =>
              assn.piece_slug === piece &&
              assn.part_type === partType &&
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
        <>
          <FlatEditor score={parsedScore} />
          {assignment?.part?.sample_audio && (
            <dl>
              <dt>Sample Recording</dt>
              <dd>
                <audio controls src={assignment.part.sample_audio} />
              </dd>
            </dl>
          )}
        </>
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
}
