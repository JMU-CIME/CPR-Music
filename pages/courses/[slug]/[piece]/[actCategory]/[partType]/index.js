import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
// import ListGroup from 'react-bootstrap/ListGroup';
// import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchSingleStudentAssignment,
  postRecording,
} from '../../../../../../actions';
import Layout from '../../../../../../components/layout';
import Recorder from '../../../../../../components/recorder';

const FlatEditor = dynamic(
  () => import('../../../../../../components/flatEditor'),
  {
    ssr: false,
  }
);

export default function PerformMelody() {
  const router = useRouter();
  const { slug, piece, actCategory, partType } = router.query;
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.currentUser);
  const { items: activities, loaded: loadedActivities } = useSelector(
    (state) => state.activities
  );
  const assignment = useSelector((state) => state.selectedAssignment);
  useEffect(() => {
    if (loadedActivities){
      dispatch(
        fetchSingleStudentAssignment({
          token: userInfo.token,
          slug,
          assignmentId: activities[slug].filter(
            (assn) =>
              assn.part.piece.slug === piece &&
            assn.activity.part_type === partType &&
            assn.activity.activity_type.category === actCategory 

          ),
        })
      );}
  }, [dispatch, slug, userInfo, activities]);

  return (
    <Layout>
      <h1>Perform {partType}{assignment && assignment.id}</h1>
      <FlatEditor />

      <Recorder
        submit={({ audio }) =>
          dispatch(
            postRecording({
              token: userInfo.token,
              slug,
              assignmentId: assignment.id, 
              audio,
            })
          )
        }
      />
    </Layout>
  );
}
