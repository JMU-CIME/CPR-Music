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

const FlatEditor = dynamic(() => import('../../flatEditor'), {
  ssr: false,
});

const bucketColors = {tonic:'#E75B5C', subdominant:'#265C5C', dominant:'#4390E2'};

export default function CreativityActivity() {
  const tonicNotes = notes(tonicScoreJSON);
  
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

  // const origJSON
  return flatIOScoreForTransposition ? (
    <>
      <FlatEditor score={scoreJSON} giveJSON={setMelodyJson} />
      <Accordion className="cpr-create" defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Step 1</Accordion.Header>
          <Accordion.Body>
            Create a melody four measures in length using only the pitches from
            corresponding colors. You can use rests or note durations from 1/8 -
            1/2.
            <div className="row">
              <div className="col-md-4">
                <FlatEditor
                  height={150}
                  score={{
                    scoreId: '65241135b67581e78952d1b1',
                    sharingKey:
                      '223faaebf63c6ff5c964fb74737554f58d86b99262bc62bac15195b66d3ee566f8ff923f6d094e611a610105b3d9582cea55e183cf60ab8683986fc29d7a1f37',
                  }}
                  colors={[bucketColors.tonic]}
                />
              </div>
              <div className="col-md-4">
                <FlatEditor
                  height={150}
                  score={{
                    scoreId: '6524114afc390c181375fdc8',
                    sharingKey:
                      'ea5a2d5bdb5b8c570cb0796add8188d50757c7a06d2636f1b7c088b905aa7716b8a8eaf0a0b12802d8a02852691b0420bff1adef17e7250bbe6f03b442131fda',
                  }}
                  colors={[bucketColors.subdominant]}
                />
              </div>
              <div className="col-md-4">
                <FlatEditor
                  height={150}
                  score={{
                    scoreId: '6524114e605572ddb1c1090f',
                    sharingKey:
                      '895d5f93344d05f47252535852e3f9f9ec638b94b3237278508cf6b085671dc56791d83fba37fc1c0285fec49a70a417a461d49f4ec48c520a96a6b076bab21f',
                  }}
                  colors={[bucketColors.dominant]}
                />
              </div>
            </div>
            <FlatEditor
              edit
              score={{
                scoreId: '652420e274458c7c5d131dbc',
                sharingKey:
                  'bfba3331ca100567830b5e824103ba64071f753818a513b6660756a4578b1cfd51e8b6478b7e7b86b0277dc45bd7e16707033d42414a64a2b60eb4e508b5f8d6',
              }}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Step 2</Accordion.Header>
          <Accordion.Body>
            Create a melody four measures in length using only the pitches from
            corresponding colors. You can use rests or note durations from 1/8 -
            1/2.
            <div className="row">
              <div className="col-md-4">
                <FlatEditor
                  height={150}
                  score={{
                    scoreId: '65241135b67581e78952d1b1',
                    sharingKey:
                      '223faaebf63c6ff5c964fb74737554f58d86b99262bc62bac15195b66d3ee566f8ff923f6d094e611a610105b3d9582cea55e183cf60ab8683986fc29d7a1f37',
                  }}
                  colors={[bucketColors.tonic]}
                />
              </div>
              <div className="col-md-4">
                <FlatEditor
                  height={150}
                  score={{
                    scoreId: '6524114afc390c181375fdc8',
                    sharingKey:
                      'ea5a2d5bdb5b8c570cb0796add8188d50757c7a06d2636f1b7c088b905aa7716b8a8eaf0a0b12802d8a02852691b0420bff1adef17e7250bbe6f03b442131fda',
                  }}
                  colors={[bucketColors.subdominant]}
                />
              </div>
              <div className="col-md-4">
                <FlatEditor
                  height={150}
                  score={{
                    scoreId: '6524114e605572ddb1c1090f',
                    sharingKey:
                      '895d5f93344d05f47252535852e3f9f9ec638b94b3237278508cf6b085671dc56791d83fba37fc1c0285fec49a70a417a461d49f4ec48c520a96a6b076bab21f',
                  }}
                  colors={[bucketColors.dominant]}
                />
              </div>
            </div>
            <FlatEditor
              edit
              score={{
                scoreId: 'blank',
              }}
              orig={melodyJson}
              trim={4}
              colors={[
                bucketColors.tonic,
                bucketColors.subdominant,
                bucketColors.dominant,
                bucketColors.tonic,
              ]}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Step 3</Accordion.Header>
          <Accordion.Body>...</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Step 4</Accordion.Header>
          <Accordion.Body>...</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>Step 5 - Combined</Accordion.Header>
          <Accordion.Body>
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
            />
          </Accordion.Body>
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
