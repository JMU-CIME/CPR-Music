import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import { Spinner } from 'react-bootstrap';
import { getStudentAssignments, mutateCreateSubmission, getTelephoneGroup } from '../../api';
import Recorder from '../recorder';
import { postRecording } from '../../actions';
import GroupWork from './groupWork';

const FlatEditor = dynamic(() => import('../flatEditor'), {
  ssr: false,
});

export default function TelephoneActivity() {
  const [sortedTelephoneGroup, setSortedTelephoneGroup] = useState([]);
  const { groupIsLoading, error, data: telephoneGroup } = useQuery('telephoneGroup', getTelephoneGroup);
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug, piece, actCategory } = router.query;

  useEffect(() => {
    if (telephoneGroup && sortedTelephoneGroup)
      setSortedTelephoneGroup(Object.entries(telephoneGroup)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([act_type, value]) => ({ ...value, act_type })));
    // console.log('sortedTelephoneGroup', Object.entries(telephoneGroup)
    // .sort(([, a], [, b]) => a.order - b.order)
    // .map(([act_type, value]) => ({ ...value, act_type })));
  }, [telephoneGroup]);

  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });

  const mutation = useMutation(mutateCreateSubmission({ slug }));

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

  let composition = ''; // FIXME: why isn't this useState???
  // const currentAssignment = assignments && assignments?.filter((assn) => assn.part.piece.slug === piece && assn.activity.activity_type.category === actCategory)?.[0]
  const currentAssignment =
    assignments &&
    Object.values(assignments)
      .reduce((prev, current) => [...prev, ...current], [])
      .filter(
        (assn) =>
          assn.part.piece.slug === piece &&
          assn.activity.activity_type.category === actCategory
      )?.[0];

  console.log('currentAssignment', currentAssignment);
  const currentTransposition = currentAssignment?.instrument.transposition;
  console.log('currentTransposition', currentTransposition);

  const flatIOScoreForTransposition =
    currentAssignment?.part.transpositions.filter(
      (partTransposition) =>
        partTransposition.transposition.name === currentTransposition
    )?.[0]?.flatio;

  const setJsonWrapper = (data) => {
    mutation.mutate({
      submission: { content: data },
      assignmentId: currentAssignment.id,
    });
  };
  const submitCreativity = ({ audio, submissionId }) => {
    // setCreativityUploadStatus(UploadStatusEnum.Active);
    return dispatch(
      postRecording({
        slug,
        assignmentId: currentAssignment.id,
        audio,
        composition,
        submissionId,
      })
    );
  };

  console.log('currentAssignment.enrollment.user.username', currentAssignment.enrollment.user.username);
  return (
    <>
      <FlatEditor score={JSON.parse(flatIOScoreForTransposition)} />
      {/* TODO: if the student has already submitted this, do we show their submission here? if so how would they start over? */}
      <Recorder
        submit={submitCreativity}
        accompaniment={currentAssignment?.part?.piece?.accompaniment}
      />
      <br />
      <GroupWork currentAssignment={currentAssignment} />

    </>
  );
}
