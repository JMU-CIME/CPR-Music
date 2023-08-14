import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import { getStudentAssignments, mutateCreateSubmission } from '../../../api';
import Recorder from '../../recorder';
import { postRecording } from '../../../actions';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'bootstrap';

const FlatEditor = dynamic(() => import('../../flatEditor'), {
  ssr: false,
});

export default function CreativityActivity() {
  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const router = useRouter();
  const { slug, piece } = router.query;
  const actCategory = 'Create';

  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });

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

  let composition = ''; // FIXME: why isn't this useState???
  // const currentAssignment = assignments && assignments?.filter((assn) => assn.part.piece.slug === piece && assn.activity.activity_type.category === actCategory)?.[0]
  const currentAssignment =
    assignments &&
    Object.values(assignments)
      .reduce((prev, current) => [...prev, ...current], [])
      .filter(
        (assn) =>
          assn.part.piece.slug === piece &&
          assn.activity.activity_type.category === actCategory
      )?.[0];
  const currentTransposition = currentAssignment?.instrument.transposition;
  console.log('currentAssignment', currentAssignment);
  console.log('currentTransposition', currentTransposition);
  const flatIOScoreForTransposition =
    currentAssignment?.part.transpositions.filter(
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

  return (
    // <>
    //   <FlatEditor score={JSON.parse(flatIOScoreForTransposition)} />
    //   {/* TODO: if the student has already submitted this, do we show their submission here? if so how would they start over? */}
    //   <FlatEditor
    //     edit
    //     score={{
    //       scoreId: '62689806be1cd400126c158a',
    //       sharingKey:
    //         'fc580b58032c2e32d55543ad748043c3fd7f5cd90d764d3cbf01355c5d79a7acdd5c0944cd2127ef6f0b47138a074477c337da654712e73245ed674ffc944ad8',
    //     }}
    //     onSubmit={setJsonWrapper}
    //     submittingStatus={mutation.status}
    //     onUpdate={(data) => {
    //       composition = data;
    //     }}
    //   />
    //   <Recorder
    //     submit={submitCreativity}
    //     accompaniment={currentAssignment?.part?.piece?.accompaniment}
    //   />
    // </>
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Tonic Motive</Accordion.Header>
        <Accordion.Body>
          Tonic Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Subdominant Motive</Accordion.Header>
        <Accordion.Body>
          Subdominant Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
          ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Dominant Motive</Accordion.Header>
        <Accordion.Body>
          Dominant Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>Compose</Accordion.Header>
        <Accordion.Body>
          {/* TODO: in some create pices there will be 4 buckets instead of onky 3!??!?!?!?!?! */}
          <Tabs
            defaultActiveKey="profile"
            id="fill-tab-example"
            className="mb-3"
            fill
          >
            <Tab eventKey="tonic-measures" title="Tonic">
              Tonic Measures
            </Tab>
            <Tab eventKey="subdominant-measures" title="Subdominant">
              Subdominant Measures
            </Tab>
            <Tab eventKey="dominant-measures" title="Dominant">
              Dominant Measures
            </Tab>
          </Tabs>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  // return <p>Creativity</p>
}
