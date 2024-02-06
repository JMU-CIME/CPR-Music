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
import { notes, tonicScoreJSON } from '../../../lib/flat';
import { sub } from 'date-fns';

const FlatEditor = dynamic(() => import('../../flatEditor'), {
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
  // const [score1JSON, setScore1JSON] = useState('');
  // const [score2JSON, setScore2JSON] = useState('');
  // const [score3JSON, setScore3JSON] = useState('');
  // const [score4JSON, setScore4JSON] = useState('');
  // const [totalScoreJSON, setTotalScoreJSON] = useState('');

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
      const measureCount = referenceScoreObj['score-partwise'].part[0].measure.length;
      for (let i = 0; i < measureCount; i += MEASURES_PER_STEP) {
        const slice = JSON.parse(melodyJson);
        slice['score-partwise'].part[0].measure = slice['score-partwise'].part[0].measure.slice(i, i + MEASURES_PER_STEP);
        slice['score-partwise'].part[0].measure[0].attributes[0].divisions = '8';
        slice['score-partwise'].part[0].measure[0].attributes[0].time = { beats: '4', 'beat-type': '4' };
        slice['score-partwise'].part[0].measure[0].attributes[0].clef = { sign: 'G', line: '2' };
        slice['score-partwise'].part[0].measure[0].attributes[0].key = { fifths: '-3' };
        slice['score-partwise'].part[0].measure[0].attributes[0]['staff-details'] = { 'staff-lines': '5' };
        partialScores.push(JSON.stringify(slice));

        const colorSlice = currentAssignment?.part?.chord_scale_pattern?.slice(i, i+MEASURES_PER_STEP).map(
          (color) => bucketColors[color]
        )
        partialColors.push(colorSlice);
      }
      setSubScores(partialScores);
      setSubColors(partialColors);
      console.log('partialScores', partialScores);
      console.log('partialColors', partialColors);
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
  let scoreData = [];


  // const origJSON
  return flatIOScoreForTransposition ? (
    <>
      <FlatEditor score={scoreJSON} giveJSON={setMelodyJson} debugMsg='error in rendering the melody score in create: theoretical'/>
      {
        // subScores.slice(0, 1).map((subScore, idx) => {
        subScores.map((subScore, idx) =>{
        scoreData[idx] = {};
        console.log('subScore', idx);
        return (
          <div key={idx}>
            <h2 id={`step-${idx + 1}`}>Step {idx + 1}</h2>
            <FlatEditor
              edit
              score={{
                scoreId: 'blank',
              }}
              onSubmit={setJsonWrapper}
              submittingStatus={mutation.status}
              onUpdate={(data) => {
                scoreData[idx] = data;
              }}
              orig={subScore}
              colors={subColors[idx]}
              debugMsg={`error in rendering the subScore[${idx}]`}
            />
          </div>
        );
      })}
      {/* <h2>Step 5 - Combined</h2>
      <FlatEditor
        edit
        score={{
          scoreId: '652420e274458c7c5d131dbc',
          sharingKey:
            'bfba3331ca100567830b5e824103ba64071f753818a513b6660756a4578b1cfd51e8b6478b7e7b86b0277dc45bd7e16707033d42414a64a2b60eb4e508b5f8d6',
        }}
      />
      <Recorder
        submit={submitCreativity}
        accompaniment={currentAssignment?.part?.piece?.accompaniment}
      /> */}
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
