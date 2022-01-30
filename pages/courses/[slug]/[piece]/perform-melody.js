import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
// import ListGroup from 'react-bootstrap/ListGroup';
// import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import { useSelector, useDispatch } from 'react-redux';
import { postRecording } from '../../../../actions';
import Layout from '../../../../components/layout';
// import { postRecording, selectAssignment } from '../../../../actions';
import Recorder from '../../../../components/recorder';
const FlatEditor = dynamic(() => import('../../../../components/flatEditor'), {
  ssr: false,
});

export default function PerformMelody() {
  const router = useRouter();
  const { slug, piece } = router.query;
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.currentUser);

  // is this the right approach or more probably I should just hit backend for exactly this assignment?
  // TODO: need piece slug here
  // const assignments = useSelector((state) => state.assignments);
  // useEffect(() => {
  //   dispatch(
  //     selectAssignment(
  //       assignments.filter((assn) => assn.part.piece.slug === piece)[0]
  //     )
  //   );
  // }, [slug, piece]);

  return (
    <Layout>
      <h1>Perform Melody</h1>
      <FlatEditor />
      <Recorder
        submit={({ audio }) =>
          dispatch(
            postRecording({
              token: userInfo.token,
              slug,
              assignmentId: 1,
              submissionId: 1,
              audio,
            })
          )
        }
      />
    </Layout>
  );
}
