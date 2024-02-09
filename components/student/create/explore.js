import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
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

const ExploratoryCompose = dynamic(
  () => import('../../exploratoryCompose'),
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
    
  // Current JSON representation of one measure editors
  const [tonicJson, setTonicJson] = useState('');
  const [subdominantJson, setSubdominantJson] = useState('');
  const [dominantJson, setDominantJson] = useState('');
  
  // Final JSON representation which is used to generate variations
  const [finalTonicJson, setFinalTonicJson] = useState('');
  const [finalSubdominantJson, setFinalSubdominantJson] = useState('');
  const [finalDominantJson, setFinalDominantJson] = useState('');

  const [startedVariationGeneration, setStartedVariationGeneration] = useState(false);

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
  
  const mutation = useMutation(mutateCreateSubmission({ slug }));

  let composition = ''; // FIXME: why isn't this useState???

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

  const handleTonicUpdate = useCallback((data) => {
    setTonicJson(data) 
  }, [setTonicJson]);
  
  const handleSubdominantUpdate = useCallback((data) => {
    setSubdominantJson(data);
  }, [setSubdominantJson])

  const handleDominantUpdate = useCallback((data) => {
    setDominantJson(data)
  }, [setDominantJson])

  function generateVariations() {
    if (startedVariationGeneration) return;
     
    setFinalTonicJson(tonicJson);
    setFinalSubdominantJson(subdominantJson);
    setFinalDominantJson(dominantJson);
    setStartedVariationGeneration(true); 
  }

  return flatIOScoreForTransposition ? (
    <div className="cpr-create">
      <FlatEditor score={scoreJSON} giveJSON={setMelodyJson} />
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
      <ExploratoryCompose
        referenceScoreJSON={melodyJson} 
        trim={1}
        onUpdate={handleTonicUpdate}
      />
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
      <ExploratoryCompose 
        referenceScoreJSON={melodyJson}
        trim={1}
        onUpdate={handleSubdominantUpdate}
      />
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
      <ExploratoryCompose 
        referenceScoreJSON={melodyJson}
        trim={1}
        onUpdate={handleDominantUpdate}
      />
      <Button variant="primary" onClick={generateVariations}>
        Begin Composing
      </Button>

    {startedVariationGeneration && (
      <Tabs
        defaultActiveKey="tonic-palette"
        id="justify-tab-example"
        className="mb-3"
        justify
        variant="underline"
      >
        <Tab eventKey="tonic-palette" title={`Tonic ${selectedTonicMeasure}`} className="tonic">
            <VariationsFromMotiveScore
              referenceScoreJSON={finalTonicJson}
              height={300}
              width={700}
              onSelect={setSelectedTonicMeasure}
            />
        </Tab>
        <Tab
          eventKey="subdominant-palette"
          title={`Subdominant ${selectedSubdominantMeasure}`}
          className="subdominant"
        >
            <VariationsFromMotiveScore
              referenceScoreJSON={finalSubdominantJson}
              height={300}
              width={700}
              onSelect={setSelectedSubdominantMeasure}
            />
        </Tab>
        <Tab eventKey="dominant-palette" title={`Dominant ${selectedDominantMeasure}`} className="dominant">
            <VariationsFromMotiveScore
              referenceScoreJSON={finalDominantJson}
              height={300}
              width={700}
              onSelect={setSelectedDominantMeasure}
            />
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
        </Tab>
      </Tabs>
    )}
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
