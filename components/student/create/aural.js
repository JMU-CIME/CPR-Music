import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getStudentAssignments, mutateCreateSubmission } from '../../../api';
import Recorder from '../../recorder';
import {
  fetchActivities,
  fetchSingleStudentAssignment,
  postRecording,
} from '../../../actions';
import { UploadStatusEnum } from '../../../types';

const FlatEditor = dynamic(() => import('../../flatEditor'), {
  ssr: false,
});

const ChordScaleBucketScore = dynamic(() => import('../../chordScaleBucketScore'), {
  ssr: false,
});

const bucketColors = {
  tonic: '#E75B5C',
  subdominant: '#265C5C',
  dominant: '#4390E2',
  applied: '#CBA338',
};

export default function CreativityAuralActivity() {
  // console.log('got into aural component');
  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const router = useRouter();
  const { slug, piece } = router.query;
  const actCategory = 'Create';
  const [json, setJson] = useState('');
  const composition = useRef('');


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

  // const currentAssignment = assignments && assignments?.filter((assn) => assn.part.piece.slug === piece && assn.activity.activity_type.category === actCategory)?.[0]
  const currentAssignment =
    assignments &&
    Object.values(assignments)
      .reduce((prev, current) => [...prev, ...current], [])
      .filter((assn) => {
        // console.log('assn', assn);
        return (
          assn.piece_slug === piece &&
          assn.activity_type_category === actCategory
        );
      })?.[0];
  const currentTransposition = currentAssignment?.transposition;
  // console.log('currentAssignment', currentAssignment);
  // console.log('currentTransposition', currentTransposition);
  const flatIOScoreForTransposition =
    currentAssignment?.part?.transpositions?.filter(
      (partTransposition) =>
        partTransposition.transposition.name === currentTransposition
    )?.[0]?.flatio;

  const submitCreativity = ({ audio, submissionId }) =>
    dispatch(
      postRecording({
        slug,
        assignmentId: currentAssignment.id,
        audio,
        composition: composition.current,
        submissionId,
      })
    );
  // console.log('flatIOScoreForTransposition', flatIOScoreForTransposition);
  let scoreJSON;
  if (flatIOScoreForTransposition) {
    scoreJSON = JSON.parse(flatIOScoreForTransposition);
  }
  // console.log(scoreJSON)
  // const origJSON

  return flatIOScoreForTransposition ? (
    <>
      <FlatEditor score={scoreJSON} giveJSON={setJson} />

      {/**Testing row */}
      <Row>
        <Col md={4}>
          <ChordScaleBucketScore
            height={150}
            referenceScoreJSON={json}
            chordScaleBucket="tonic"
            colors='tonic'
            instrumentName={currentAssignment?.instrument}
          />
        </Col>
        <Col md={4}>
          <ChordScaleBucketScore
            height={150}
            referenceScoreJSON={json}
            chordScaleBucket="subdominant"
            colors='subdominant'
            instrumentName={currentAssignment?.instrument}
          />
        </Col>
        <Col md={4}>
          <ChordScaleBucketScore
            height={150}
            referenceScoreJSON={json}
            chordScaleBucket="dominant"
            colors='dominant'
            instrumentName={currentAssignment?.instrument}
          />
        </Col>
      </Row>

      {/* TODO: if the student has already submitted this, do we show their submission here? if so how would they start over? */}
      <FlatEditor
        edit
        score={{
          scoreId: 'blank',
        }}
        // onSubmit={setJsonWrapper}
        submittingStatus={mutation.status}
        onUpdate={(data) => {
          composition.current = data;
          console.log('composition updated', data)
        }}
        orig={json}
        colors={currentAssignment?.part?.chord_scale_pattern}
      />
      <Recorder
        submit={submitCreativity}
        accompaniment={currentAssignment?.part?.piece?.accompaniment}
      />
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
