import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux"
import dynamic from "next/dynamic";
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';
import { getStudentAssignments, mutateCreateSubmission } from "../../api";
import Recorder from "../recorder";
import { postRecording } from "../../actions";

const FlatEditor = dynamic(() => import('../flatEditor'), {
  ssr: false,
});

export default function CreativityActivity() {
  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const router = useRouter();
  const { slug, piece, actCategory } = router.query;

  const { isLoading, error: assignmentsError, data: assignments } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug
  })

  
const mutation = useMutation(mutateCreateSubmission({ slug }));

  if (isLoading) {
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

  let composition = '' // FIXME: why isn't this useState???
  const currentAssignment = assignments && assignments?.filter((assn) => assn.part.piece.slug === piece && assn.activity.activity_type.category === actCategory)?.[0]
  console.log('currentassignment', currentAssignment)
  const currentTransposition = currentAssignment?.instrument.transposition;
  const flatIOScoreForTransposition = currentAssignment?.part.transpositions.filter((partTransposition) => partTransposition.transposition.name === currentTransposition)?.[0]?.flatio
  
  
  const setJsonWrapper = (data) => {
    mutation.mutate({
      submission: { content: data },
      assignmentId: currentAssignment.id,
    });
  }
  const submitCreativity = ({ audio }) =>
    dispatch(
      postRecording({
        slug,
        assignmentId: currentAssignment.id, 
        audio,
        composition
      })
    )
      
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
          console.log('updated composition', data);
          composition = data;
        }}
      />
      <Recorder
        submit={submitCreativity}
        accompaniment={currentAssignment?.part?.piece?.accompaniment}
      />
    </>
  );

  // return <p>Creativity</p>
}