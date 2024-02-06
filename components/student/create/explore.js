import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { FaCheck, FaFrownOpen } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
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

const ChordScaleBucketScore = dynamic(
  () => import('../../chordScaleBucketScore'),
  {
    ssr: false,
  }
);

const VariationsFromMotiveScore = dynamic(
  () => import('../../variationsFromMotiveScore'),
  {
    ssr: false,
  }
);

const bucketColors = {
  tonic: '#E75B5C',
  subdominant: '#265C5C',
  dominant: '#4390E2',
};

export default function CreativityActivity() {
  // console.log('got into aural component');
  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const router = useRouter();
  const { slug, piece } = router.query;
  const actCategory = 'Create';
  const [melodyJson, setMelodyJson] = useState('');
  const [tonicJson, setTonicJson] = useState('');
  const [subdominantJson, setSubdominantJson] = useState('');
  const [dominantJson, setDominantJson] = useState('');
  const [startedVariationGeneration, setStartedVariationGeneration] =
    useState(false);
  const [someVar, setSomeVar] = useState(false);

  const [selectedTonicMeasure, setSelectedTonicMeasure] = useState(-1);
  const [selectedDominantMeasure, setSelectedDominantMeasure] = useState(-1);
  const [selectedSubdominantMeasure, setSelectedSubdominantMeasure] = useState(-1);

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

  let composition = ''; // FIXME: why isn't this useState???
  let tonicMotiveScore = '';
  let subdominantMotiveScore = '';
  let dominantMotiveScore = '';
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
  // console.log('flatIOScoreForTransposition', flatIOScoreForTransposition);
  let scoreJSON;
  if (flatIOScoreForTransposition) {
    scoreJSON = JSON.parse(flatIOScoreForTransposition);
  }

  function generateVariations() {
    doneTonic();
    doneSubdominant();
    doneDominant();
    // console.log('generate', tonicMotiveScore && startedVariationGeneration);
    setTonicJson(tonicMotiveScore);
    setStartedVariationGeneration(true);
    console.log('generate', tonicMotiveScore && startedVariationGeneration);
    // console.log('tonicMotiveScore', tonicMotiveScore);
    console.log('tonicJson', tonicJson);
    // setSomeVar(true);
    // console.log(
    //   'scores',
    //   tonicMotiveScore,
    //   subDominantMotiveScore,
    //   dominantMotiveScore
    // );
  }

  function doneTonic() {
    // console.log('doneTonic', tonicMotiveScore);
    setTonicJson(tonicMotiveScore);
  }

  function doneSubdominant() {
    // console.log('doneSubdominant', subdominantMotiveScore);
    setSubdominantJson(subdominantMotiveScore);
  }

  function doneDominant() {
    // console.log('doneDominant', dominantMotiveScore);
    setDominantJson(dominantMotiveScore);
  }

  // console.log('\n\n\n\ntonicJson\n\n\n===========', tonicJson);
  // const origJSON
  return flatIOScoreForTransposition ? (
    <div className="cpr-create">
      <FlatEditor score={scoreJSON} giveJSON={setMelodyJson} />
      {/* <Accordion className="cpr-create" defaultActiveKey="0" alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Step 1 - Tonic</Accordion.Header>
          <Accordion.Body> */}
      <div className="row">
        <div className="col-md-6">
          Create a melody one measure in length using only these 5 pitches. You
          can use rests or note durations from 1/8 - 1/2.
        </div>
        <div className="col-md-6">
          <ChordScaleBucketScore
            height={150}
            referenceScoreJSON={melodyJson}
            chordScaleBucket="tonic"
            colors={bucketColors.tonic}
            instrumentName={currentAssignment?.instrument}
          />
        </div>
      </div>
      <FlatEditor
        edit
        score={
          tonicJson
            ? {}
            : {
                scoreId: 'blank',
              }
        }
        scoreJSON={tonicJson}
        onSubmit={setJsonWrapper}
        submittingStatus={mutation.status}
        orig={melodyJson}
        trim={1}
        onUpdate={(data) => {
          // console.log('data', data);
          tonicMotiveScore = data;
          // console.log('tonicMotiveScore', tonicMotiveScore);
        }}
      />
      {/* <Button variant="primary" onClick={doneTonic}>
              Next
            </Button> */}
      {/* </Accordion.Body>
        </Accordion.Item> */}

      <div className="row">
        <div className="col-md-6">
          Create a melody one measure in length using only these 5 pitches. You
          can use rests or note durations from 1/8 - 1/2.
        </div>
        <div className="col-md-6">
          <ChordScaleBucketScore
            height={150}
            referenceScoreJSON={melodyJson}
            chordScaleBucket="subdominant"
            colors={bucketColors.subdominant}
            instrumentName={currentAssignment?.instrument}
          />
        </div>
      </div>
      <FlatEditor
        edit
        score={
          subdominantJson
            ? {}
            : {
                scoreId: 'blank',
              }
        }
        scoreJSON={subdominantJson}
        onSubmit={setJsonWrapper}
        submittingStatus={mutation.status}
        orig={melodyJson}
        trim={1}
        onUpdate={(data) => {
          subdominantMotiveScore = data;
          // console.log('subdominantMotiveScore', subdominantMotiveScore);
        }}
      />
      {/* <Button variant="primary" onClick={doneSubdominant}>
                Next
              </Button> */}

      <div className="row">
        <div className="col-md-6">
          Create a melody one measure in length using only these 5 pitches. You
          can use rests or note durations from 1/8 - 1/2.
        </div>
        <div className="col-md-6">
          <ChordScaleBucketScore
            height={150}
            referenceScoreJSON={melodyJson}
            chordScaleBucket="dominant"
            colors={bucketColors.dominant}
            instrumentName={currentAssignment?.instrument}
          />
        </div>
      </div>
      <FlatEditor
        edit
        score={
          dominantJson
            ? {}
            : {
                scoreId: 'blank',
              }
        }
        scoreJSON={dominantJson}
        onSubmit={setJsonWrapper}
        submittingStatus={mutation.status}
        orig={melodyJson}
        trim={1}
        onUpdate={(data) => {
          dominantMotiveScore = data;
          // console.log('dominantMotiveScore', dominantMotiveScore);
        }}
      />
      {/* <Button variant="primary" onClick={doneDominant}>
                Next
              </Button> */}
      <Button variant="primary" onClick={generateVariations}>
        Begin Composing
      </Button>

      {/* <Tabs
        defaultActiveKey="tonic-palette"
        id="justify-tab-example"
        className="mb-3"
        justify
        variant="underline"
      >
        <Tab eventKey="tonic-palette" title={`Tonic ${selectedTonicMeasure}`} className="tonic"> */}
          {tonicJson && (
            <VariationsFromMotiveScore
              referenceScoreJSON={tonicJson}
              height={300}
              width={700}
              onSelect={setSelectedTonicMeasure}
            />
          )}
        {/* </Tab>
        <Tab
          eventKey="subdominant-palette"
          title={`Subdominant ${selectedSubdominantMeasure}`}
          className="subdominant"
        > */}
          {subdominantJson && (
            <VariationsFromMotiveScore
              referenceScoreJSON={subdominantJson}
              height={300}
              width={700}
              onSelect={setSelectedSubdominantMeasure}
            />
          )}
        {/* </Tab>
        <Tab eventKey="dominant-palette" title={`Dominant ${selectedDominantMeasure}`} className="dominant"> */}
          {dominantJson && (
            <VariationsFromMotiveScore
              referenceScoreJSON={dominantJson}
              height={300}
              width={700}
              onSelect={setSelectedDominantMeasure}
            />
          )}
        {/* </Tab>
      </Tabs> */}

      
        <FlatEditor
          edit
          score={{
            scoreId: 'blank',
          }}
          onSubmit={setJsonWrapper}
          submittingStatus={mutation.status}
          orig={melodyJson}
          colors={currentAssignment?.part?.chord_scale_pattern?.map(
            (color) => bucketColors[color]
          )}
        />

    </div>
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
