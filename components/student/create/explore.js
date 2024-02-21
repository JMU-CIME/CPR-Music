import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const FlatMelodyViewer = dynamic(() => import('../../flatMelodyViewer'), {
  ssr: false,
})

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

export default function CreativityActivity() {
  // console.log('got into aural component');
  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const router = useRouter();
  const { slug, piece } = router.query;
  const actCategory = 'Create';
  const [melodyJson, setMelodyJson] = useState('');

  const composition = useRef('');

  const tonicJson = useRef('');
  const subdominantJson = useRef('');
  const dominantJson = useRef('');

  const [startedVariationGeneration, setStartedVariationGeneration] = useState(false);

  // const [selectedTonicMeasure, setSelectedTonicMeasure] = useState(-1);
  // const [selectedDominantMeasure, setSelectedDominantMeasure] = useState(-1);
  // const [selectedSubdominantMeasure, setSelectedSubdominantMeasure] = useState(-1);

  // const selectedTonicMeasureNotes = useRef(-1);
  // function setSelectedTonicMeasureNotes(notes) {
  //   selectedTonicMeasureNotes.current = notes;
  // }  
  // const selectedDominantMeasureNotes = useRef(-1);
  // function setSelectedDominantMeasureNotes(notes) {
  //   selectedDominantMeasureNotes.current = notes;
  // }  
  // const selectedSubdominantMeasureNotes = useRef(-1);
  // function setSelectedSubdominantMeasureNotes(notes) {
  //   selectedSubdominantMeasureNotes.current = notes;
  // }

  const selectedMeasure = useRef({});
  function setSelectedMeasure(measure) {
    console.log('setSelectedMeasure(notes)', measure)
    selectedMeasure.current = measure;
  }

  const userInfo = useSelector((state) => state.currentUser);
    
  const {
    isLoading: loaded,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });
  
  const mutation = useMutation(mutateCreateSubmission({ slug }));

  // let composition = ''; // FIXME: why isn't this useState???

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
        composition: composition.current,
        submissionId,
      })
    );
  // console.log('flatIOScoreForTransposition', flatIOScoreForTransposition);
  let scoreJSON;
  if (flatIOScoreForTransposition) {
    scoreJSON = JSON.parse(flatIOScoreForTransposition);
  }

  function handleTonicUpdate(data) {
    tonicJson.current = data;
  }
  
  function handleSubdominantUpdate(data) {
    subdominantJson.current = data;
  }

  function handleDominantUpdate(data) {
    dominantJson.current = data;
  }

  const handleMelodyLoad = useCallback((data) => {
    setMelodyJson(data)
  }, [setMelodyJson])

  function generateVariations() {
    if (startedVariationGeneration) return;
    setStartedVariationGeneration(true); 
  } 

  return flatIOScoreForTransposition ? (
    <div className="cpr-create">
      <FlatMelodyViewer score={scoreJSON} onLoad={handleMelodyLoad} />
      <div className="row">
        <div className="col-md-6">
          Create a melody one measure in length using only these 5 pitches. You
          can use rests or note durations from 1/8 - 1/2.
          <ChordScaleBucketScore
            height={150}
            referenceScoreJSON={melodyJson}
            chordScaleBucket="tonic"
            colors='tonic'
            instrumentName={currentAssignment?.instrument}
          />
        </div>
        <div className="col-md-6">
          <ExploratoryCompose
            referenceScoreJSON={melodyJson} 
            trim={1}
            onUpdate={handleTonicUpdate}
            colors='tonic'
          />    
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          Create a melody one measure in length using only these 5 pitches. You
          can use rests or note durations from 1/8 - 1/2.
          <ChordScaleBucketScore
            height={150}
            referenceScoreJSON={melodyJson}
            chordScaleBucket="subdominant"
            colors='subdominant'
            instrumentName={currentAssignment?.instrument}
          />
        </div>
        <div className="col-md-6">
          <ExploratoryCompose 
            referenceScoreJSON={melodyJson}
            trim={1}
            onUpdate={handleSubdominantUpdate}
            colors='subdominant'
          />
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          Create a melody one measure in length using only these 5 pitches. You
          can use rests or note durations from 1/8 - 1/2.
          <ChordScaleBucketScore
            height={150}
            referenceScoreJSON={melodyJson}
            chordScaleBucket="dominant"
            colors='dominant'
            instrumentName={currentAssignment?.instrument}
          />
        </div>
        <div className="col-md-6">
          <ExploratoryCompose 
            referenceScoreJSON={melodyJson}
            trim={1}
            onUpdate={handleDominantUpdate}
            colors='dominant'
          />
        </div>
      </div>
      
      <Button variant="primary" onClick={generateVariations}>
        Begin Composing
      </Button>

    {startedVariationGeneration && (
      <div>
        <Tabs
          defaultActiveKey="tonic-palette"
          id="justify-tab-example"
          className="mb-3"
          justify
          variant="underline"
        >
          <Tab eventKey="tonic-palette" title='Tonic' className="tonic">
              <VariationsFromMotiveScore
                referenceScoreJSON={tonicJson.current}
                height={300}
                width={700}
                onSelect={setSelectedMeasure}
              />
          </Tab>
          <Tab
            eventKey="subdominant-palette"
            title='Subdominant'
            className="subdominant"
          >
              <VariationsFromMotiveScore
                referenceScoreJSON={subdominantJson.current}
                height={300}
                width={700}
                onSelect={setSelectedMeasure}
              />
          </Tab>
          <Tab eventKey="dominant-palette" title='Dominant' className="dominant">
              <VariationsFromMotiveScore
                referenceScoreJSON={dominantJson.current}
                height={300}
                width={700}
                onSelect={setSelectedMeasure}
              />
          </Tab>
          
        </Tabs>
        <FlatEditor
          edit
          score={{
            scoreId: 'blank',
          }}
          // onSubmit={setJsonWrapper}
          onUpdate={(data) => {
            composition.current = data;
            console.log('composition updated', data)
          }}
          submittingStatus={mutation.status}
          orig={melodyJson}
          colors={currentAssignment?.part?.chord_scale_pattern}
          selectedMeasure={selectedMeasure}
          debugMsg='final explore composition flateditor instance'
        />
        <Recorder
          submit={submitCreativity}
          accompaniment={currentAssignment?.part?.piece?.accompaniment}
        />
      </div>
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
