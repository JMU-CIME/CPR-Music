import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';
import { getStudentAssignments, mutateCreateSubmission } from '../../api';
import Recorder from '../recorder';
import {
  fetchActivities,
  fetchSingleStudentAssignment,
  postRecording,
} from '../../actions';
import { UploadStatusEnum } from '../../types';

const FlatEditor = dynamic(() => import('../flatEditor'), {
  ssr: false,
});

export default function CreativityActivity() {
  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const router = useRouter();
  const { slug, piece, actCategory } = router.query;

  const userInfo = useSelector((state) => state.currentUser);
  
  useEffect(() => {
    if (slug && userInfo.token) {
      // console.log('dispatching getStudentAssignments ', slug);
      dispatch(getStudentAssignments(slug));
    }
  }, [slug, userInfo.token]);
  const { items: assignments, loaded: loadedAssignments } = useSelector(
    (state) => state.assignments
  );

  const assignment = useSelector(
    (state) => state.selectedAssignment
  );

  useEffect(() => {
    if (loadedAssignments) {
      console.log('dispatch', activities);
      dispatch(
        fetchSingleStudentAssignment({
          slug,
          assignmentId: assignment.id,
        })
      );
    }
  }, [slug, loadedAssignments, assignment]);

  const mutation = useMutation(mutateCreateSubmission({ slug }));

  let composition = ''; // FIXME: why isn't this useState???
 
  const currentTransposition = assignment?.instrument.transposition;
  const flatIOScoreForTransposition =
  assignment?.part.transpositions.filter(
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
        assignmentId: assignment.id,
        audio,
        composition,
        submissionId,
      })
    );
  };

  return (
    <>
      <FlatEditor score={JSON.parse(flatIOScoreForTransposition)} />
      {/* TODO: if the student has already submitted this, do we show their submission here? if so how would they start over? */}
      <FlatEditor
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
      />
      <Recorder
        submit={submitCreativity}
        accompaniment={assignment?.part?.piece?.accompaniment}
      />
    </>
  );

  // return <p>Creativity</p>
}
