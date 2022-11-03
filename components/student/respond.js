import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
      console.log('RespondActivity::will fetch activities', slug, userInfo.token);
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
        assn.part.piece.slug === piece &&
        assn.activity.activity_type.category === actCategory
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
        className='response-form'
        id="response"
        rows="10"
        onChange={(e) => {
          setReflection(e.target.value);
        }}
        style={{ width: '100%' }}
      />
      <RTE submission={{id:assignmentId}} submitAction={submitAction} />
    </>
  );
}
