import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import {
  fetchActivities,
  fetchSingleStudentAssignment,
  postRespond,
} from '../../actions';
import RTE from '../teacher/grade/rte';

export default function RespondActivity() {
  const router = useRouter();
  const { slug, piece, actCategory } = router.query;

  const [reflection, setReflection] = useState('');
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.currentUser);
  useEffect(() => {
    console.log('RespondActivity::may fetch activities', slug, userInfo.token);
    if (slug && userInfo.token) {
      console.log(
        'RespondActivity::will fetch activities',
        slug,
        userInfo.token
      );
      dispatch(fetchActivities({ slug }));
    }
  }, [slug, userInfo.token]);
  const { items: activities, loaded: loadedActivities } = useSelector(
    (state) => state.activities
  );
  console.log('RespondActivity::activities', activities);
  // const assignment = useSelector((state) => state.selectedAssignment);
  const assignmentId =
    loadedActivities &&
    activities &&
    activities?.[slug] &&
    activities?.[slug].filter(
      (assn) =>
        assn.piece_slug === piece && assn.activity_type_category === actCategory
    )?.[0]?.id;
  console.log('RespondActivity::assignmentid', assignmentId);
  useEffect(() => {
    // console.log('useeffect: slug, userInfo, activities, loadedActivities', slug, userInfo, activities, loadedActivities)
    if (loadedActivities && assignmentId) {
      // console.log('activities', activities)
      // console.log('piece, partType, actCategory', piece, partType, actCategory)
      dispatch(
        fetchSingleStudentAssignment({
          slug,
          assignmentId,
        })
      );
    }
  }, [slug, loadedActivities, activities]);

  const submitAction = ({ r, t, e, grader }) => {
    dispatch(
      postRespond({
        slug,
        assignmentId,
        response: { r, t, e, reflection },
      })
    );
  };
  return (
    <>
      <textarea
        name="response"
        className="response-form"
        id="response"
        rows="10"
        onChange={(e) => {
          setReflection(e.target.value);
        }}
        style={{ width: '100%' }}
      />
      <RTE submission={{ id: assignmentId }} submitAction={submitAction} />
      <h3>Rating Scales</h3>
      <Accordion defaultActiveKey="0" alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Rhythm</Accordion.Header>
          <Accordion.Body>
            Mark the highest level of achievement you reached.
            <ol>
              <li>
                My tempo was inconsistent and I did not perform with a clear
                sense of meter.
              </li>
              <li>
                I was sometimes able to maintain a consistent tempo and sense of
                meter.
              </li>
              <li>
                My tempo was consistent, I performed with a sense of meter, but
                not all of my rhythms were accurate.
              </li>
              <li>
                Except for a few missed rhythms, my performance was nearly
                accurate.
              </li>
              <li>
                My performance was accurate with consistent tempo, sense of
                meter, and accurate rhythms.
              </li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Tone</Accordion.Header>
          <Accordion.Body>
            Mark the highest level of achievement you reached.
            <ol>
              <li>I was unable to start and end on the correct note.</li>
              <li>
                I performed with a sense of tonality, but my pitches were not
                centered.
              </li>
              <li>
                My pitches were mostly centered, and my performance of phrase
                endings was accurate.
              </li>
              <li>
                My pitches were centered and overall performance was nearly
                accurate.
              </li>
              <li>
                My performance was accurate with a sense of tonality and
                centered pitches throughout.
              </li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Expression</Accordion.Header>
          <Accordion.Body>
            Give yourself one point for each skill you achieved.
            <ol>
              <li>I performed with accurate articulation.</li>
              <li>I performed with a sense of phrasing, tension, and release.</li>
              <li>I performed with characteristic tone quality.</li>
              <li>I performed with appropriate dynamics.</li>
              <li>I performed with a sense of movement that can be felt by listeners.</li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
