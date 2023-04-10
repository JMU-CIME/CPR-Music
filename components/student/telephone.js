import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';
import { getStudentAssignments, mutateCreateSubmission, getTelephoneGroup } from '../../api';
import Recorder from '../recorder';
import { postRecording } from '../../actions';
import { UploadStatusEnum } from '../../types';

const FlatEditor = dynamic(() => import('../flatEditor'), {
  ssr: false,
});

export default function TelephoneActivity() {
  const [sortedTelephoneGroup, setSortedTelephoneGroup] = useState([]);
  const { groupIsLoading, error, data: telephoneGroup } = useQuery('telephoneGroup', getTelephoneGroup);
  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
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

      {/* {currentAssignment.activity <FlatEditor
        edit
        score={{
          scoreId: '62689806be1cd400126c158a',
          sharingKey:
            'fc580b58032c2e32d55543ad748043c3fd7f5cd90d764d3cbf01355c5d79a7acdd5c0944cd2127ef6f0b47138a074477c337da654712e73245ed674ffc944ad8',
        }}
        onSubmit={setJsonWrapper}
        submittingStatus={mutation.status}
        onUpdate={(data) => {
          // console.log('updated composition', data);
          composition = data;
        }}
      />} */}
      <Recorder
        submit={submitCreativity}
        accompaniment={currentAssignment?.part?.piece?.accompaniment}
      />
      {/* Check if the current user's assignment is the first in the order */}
      {/* {currentAssignment.enrollment.user.username === sortedTelephoneGroup?.[0]?.user?.username ? '' : */}
        {/* // Display the audio for the previous student's submission */}
       { sortedTelephoneGroup.map((student, index) => (
          <div key={index}>
            {student.audio ? <strong>Listen to {student.user.name}'s {(student.act_type).toLowerCase()}.</strong> :
              <strong>{student.user.name} has not submitted their {(student.act_type).toLowerCase()} yet.</strong>}
            <br />
            {student.audio && <audio controls src={student.audio} />}
          </div>
        ))
      }
    </>
  );
}
