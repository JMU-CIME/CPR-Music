import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import { getStudentAssignments, mutateCreateSubmission } from '../../../api';
import Recorder from '../../recorder';
import {
  fetchActivities,
  fetchSingleStudentAssignment,
  postRecording,
} from '../../../actions';
import { UploadStatusEnum } from '../../../types';
import { notes, tonicScoreJSON } from '../../../lib/flat';

const FlatEditor = dynamic(() => import('../../flatEditor'), {
  ssr: false,
});

export default function CreativityActivity() {
  const tonicNotes = notes(tonicScoreJSON);
  
  console.log('got into aural component');
  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const router = useRouter();
  const { slug, piece } = router.query;
  const actCategory = 'Create';
  const [melodyJson, setMelodyJson] = useState('');
  const [tonicJson, setTonicJson] = useState('');
  const [subdominantJson, setSubdominantJson] = useState('');
  const [DominantJson, setDominantJson] = useState('');

  const userInfo = useSelector((state) => state.currentUser);

  const {
    isLoading: loaded,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });

  // const assignment = useSelector((state) => state.selectedAssignment);

  // useEffect(() => {
  //   console.log('does assignment have id?', assignment)
  //   if (loaded) {
  //     dispatch(
  //       fetchSingleStudentAssignment({
  //         slug,
  //         assignmentId: assignment.id,
  //       })
  //     );
  //   }
  // }, [slug, loaded, assignment]);

  // if (assignments) {
  //   console.log('assignments', assignments);
  // }

  const mutation = useMutation(mutateCreateSubmission({ slug }));

  const composition = ''; // FIXME: why isn't this useState???
  // const currentAssignment = assignments && assignments?.filter((assn) => assn.part.piece.slug === piece && assn.activity.activity_type.category === actCategory)?.[0]
  const currentAssignment =
    assignments &&
    Object.values(assignments)
      .reduce((prev, current) => [...prev, ...current], [])
      .filter((assn) => {
        console.log('assn', assn);
        return (
          assn.piece_slug === piece &&
          assn.activity_type_category === actCategory
        );
      })?.[0];
  const currentTransposition = currentAssignment?.transposition;
  console.log('currentAssignment', currentAssignment);
  console.log('currentTransposition', currentTransposition);
  const flatIOScoreForTransposition =
    currentAssignment?.part?.transpositions?.filter(
      (partTransposition) =>
        partTransposition.transposition.name === currentTransposition
    )?.[0]?.flatio;

  const setJsonWrapper = (data) => {
    mutation.mutate({
      submission: { content: data },
      assignmentId: currentAssignment.id,
    });
  };
  const submitCreativity = ({ audio, submissionId }) =>
    dispatch(
      postRecording({
        slug,
        assignmentId: currentAssignment.id,
        audio,
        composition,
        submissionId,
      })
    );
  console.log('flatIOScoreForTransposition', flatIOScoreForTransposition);
  let scoreJSON;
  if (flatIOScoreForTransposition) {
    scoreJSON = JSON.parse(flatIOScoreForTransposition);
  }

  // const origJSON
  return flatIOScoreForTransposition ? (
    <>
      <FlatEditor score={scoreJSON} giveJSON={setMelodyJson} />
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Step 1 - Tonic</Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-md-6">
                Create a melody one measure in length using only these 5
                pitches. You can use rests or note durations from 1/8 - 1/2.
              </div>
              <div className="col-md-6">
                <FlatEditor
                  height={150}
                  score={{
                    scoreId: 'blank',
                  }}
                  orig={melodyJson}
                />
              </div>
            </div>
            <FlatEditor
              edit
              score={{
                scoreId: 'blank',
              }}
              onSubmit={setJsonWrapper}
              submittingStatus={mutation.status}
              orig={melodyJson}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Step 2 - Subdominant</Accordion.Header>
          <Accordion.Body>Lorem ipsum dolor sit amet</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Step 3 - Dominant</Accordion.Header>
          <Accordion.Body>Lorem ipsum dolor sit amet</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Step 4 - Combo</Accordion.Header>
          <Accordion.Body>Lorem ipsum dolor sit amet</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
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

  // return <p>Creativity</p>
}
