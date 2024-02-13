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
import { notes, tonicScoreJSON } from '../../../lib/flat';
import { sub } from 'date-fns';
import { Col, Row } from 'react-bootstrap';

const FlatEditor = dynamic(() => import('../../flatEditor'), {
  ssr: false,
});

const MergingScore = dynamic(() => import('../../mergingScore'), {
  ssr: false,
});

const ChordScaleBucketScore = dynamic(
  () => import('../../chordScaleBucketScore'),
  {
    ssr: false,
  }
);

const MEASURES_PER_STEP = 4;

const bucketColors = {
  tonic: '#E75B5C',
  subdominant: '#265C5C',
  dominant: '#4390E2',
};

export default function CreativityActivity() {
  const tonicNotes = notes(tonicScoreJSON);

  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const router = useRouter();
  const { slug, piece } = router.query;
  const actCategory = 'Create';
  const [melodyJson, setMelodyJson] = useState('');

  // let's just store the calculated 4 measure slices of
  // the score and the corresponding colors
  const [subScores, setSubScores] = useState([]);
  const [subColors, setSubColors] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [totalScoreJSON, setTotalScoreJSON] = useState('');
  const [isDoneComposing, setIsDoneComposing] = useState(false);

  // const userInfo = useSelector((state) => state.currentUser);

  const {
    isLoading: loaded,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });

  //only when melodyJson is updated, calculate the steps
  useEffect(() => {
    if (melodyJson && melodyJson.length > 0) {
      const referenceScoreObj = JSON.parse(melodyJson);
      let partialScores = [];
      let partialColors = [];

      let initialScoreData = [];
      const measureCount = referenceScoreObj['score-partwise'].part[0].measure.length;
      for (let i = 0; i < measureCount; i += MEASURES_PER_STEP) {
        const slice = JSON.parse(melodyJson);
        slice['score-partwise'].part[0].measure = slice['score-partwise'].part[0].measure.slice(i, i + MEASURES_PER_STEP);
        slice['score-partwise'].part[0].measure[0].attributes[0].clef = referenceScoreObj['score-partwise'].part[0].measure[0].attributes[0].clef;
        slice['score-partwise'].part[0].measure[0].attributes[0].key = referenceScoreObj['score-partwise'].part[0].measure[0].attributes[0].key;
        
        slice['score-partwise'].part[0].measure[0].attributes[0].divisions = referenceScoreObj['score-partwise'].part[0].measure[0].attributes[0].divisions
        slice['score-partwise'].part[0].measure[0].attributes[0].time = referenceScoreObj['score-partwise'].part[0].measure[0].attributes[0].time
        slice['score-partwise'].part[0].measure[0].attributes[0]['staff-details'] = referenceScoreObj['score-partwise'].part[0].measure[0].attributes[0]['staff-details']
        
        partialScores.push(JSON.stringify(slice));

        const colorSlice = currentAssignment?.part?.chord_scale_pattern?.slice(i, i+MEASURES_PER_STEP).map(
          (color) => bucketColors[color]
        )
        partialColors.push(colorSlice);
        initialScoreData.push({});
      }
      setSubScores(partialScores);
      setScoreData(initialScoreData);
      setSubColors(partialColors);
    }

  }, [melodyJson]);

  // const assignment = useSelector((state) => state.selectedAssignment);

  // useEffect(() => {
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
  // }

  const mutation = useMutation(mutateCreateSubmission({ slug }));

  let composition = ''; // FIXME: why isn't this useState???
  const currentAssignment =
    assignments &&
    Object.values(assignments)
      .reduce((prev, current) => [...prev, ...current], [])
      .filter((assn) => {
        return (
          assn.piece_slug === piece &&
          assn.activity_type_category === actCategory
        );
      })?.[0];
  const currentTransposition = currentAssignment?.transposition;
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
  let scoreJSON;
  if (flatIOScoreForTransposition) {
    scoreJSON = JSON.parse(flatIOScoreForTransposition);
  }

  
  // the child component has finished merging the array of "subscores" into the single "score"
  const onMerged = useCallback(mergedData=> {
    setTotalScoreJSON(mergedData);
  }, [setTotalScoreJSON])



  // const origJSON
  return flatIOScoreForTransposition ? (
    <>
      <FlatEditor score={scoreJSON} giveJSON={setMelodyJson} debugMsg='error in rendering the melody score in create: theoretical'/>
      {
        // subScores.slice(0, 1).map((subScore, idx) => {
        subScores && subScores.map((subScore, idx) => {
          // FIXME: adam says we probably don't care about this useCallback unless we memoize flateditor (to which we're passing the useCallback result below)
          // const onSubScoreEdited = useCallback((data) => {
          //   scoreData[idx] = data;
          // })
          // scoreData[idx] = {};
          console.log('subScore', idx);
          return (
            <div key={idx}>
              <h2 id={`step-${idx + 1}`}>Step {idx + 1}</h2>
              <Row>
                <Col md>
                  <ChordScaleBucketScore
                    height={150}
                    referenceScoreJSON={melodyJson}
                    chordScaleBucket="tonic"
                    colors={bucketColors.tonic}
                    instrumentName={currentAssignment?.instrument}
                  />
                </Col>
                <Col md><ChordScaleBucketScore
              height={150}
              referenceScoreJSON={melodyJson}
              chordScaleBucket="subdominant"
              colors={bucketColors.subdominant}
              instrumentName={currentAssignment?.instrument}
            /></Col>
                <Col md><ChordScaleBucketScore
              height={150}
              referenceScoreJSON={melodyJson}
              chordScaleBucket="dominant"
              colors={bucketColors.dominant}
              instrumentName={currentAssignment?.instrument}
            /></Col>
              </Row>
              <FlatEditor
                edit
                score={{
                  scoreId: 'blank',
                }}
                onSubmit={(data) => {
                  const score = scoreData;
                  score[idx] = data;
                  setScoreData(score);
                }}
                submittingStatus={mutation.status}
                // onUpdate={onSubScoreEdited}
                // onUpdate={(data) => {
                //   const score = scoreData;
                //   score[idx] = data;
                //   setScoreData(score);
                // }}
                orig={subScore}
                colors={subColors[idx]}
                debugMsg={`error in rendering the subScore[${idx}]`}
              />
            </div>
          );
        })
      }
      <Button onClick={()=>{console.log('clicked done', isDoneComposing); setIsDoneComposing(true)}}>Done Composing</Button>
      <h2>Step {subScores.length + 1} - Combined</h2>
      {scoreData && scoreData.length > 0 && isDoneComposing && <MergingScore giveJSON={onMerged} scores={scoreData} />}

      {/* 
        map runs 4 times
          (displaying 4 FlatEditors)
          each first load of these flateditors results in its onUpdate being called, 
          that onUpdate makes scoreData satisfy the show condition of the mergingscore (even though it's not intersting yet)
          mergescore sees this garbage data and merges it and sends it to the parent (this component)
          the parent then 
       */}
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
