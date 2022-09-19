import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchActivities,
  fetchSingleStudentAssignment,
  postConnect,
  postRespond,
} from '../../actions';
import RTE from '../teacher/grade/rte';

export default function ConnectActivity() {
  const router = useRouter();
  const { slug, piece, actCategory } = router.query;

  const [reflection, setReflection] = useState('');
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.currentUser);
  useEffect(() => {
    console.log('ConnectActivity::may fetch activities', slug, userInfo.token);
    if (slug && userInfo.token) {
      console.log('ConnectActivity::will fetch activities', slug, userInfo.token);
      dispatch(fetchActivities({ slug }));
    }
  }, [slug, userInfo.token]);
  const { items: activities, loaded: loadedActivities } = useSelector(
    (state) => state.activities
  );
  console.log('ConnectActivity::activities', activities);
  // const assignment = useSelector((state) => state.selectedAssignment);
  const assignment =
    loadedActivities &&
    activities &&
    activities?.[slug] &&
    activities?.[slug].filter(
      (assn) =>
        assn.part.piece.slug === piece &&
        assn.activity.activity_type.category.startsWith(actCategory)
    )?.[0];
  const assignmentId = assignment?.id;
  console.log('ConnectActivity::assignmentid', assignmentId);
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

  const submitAction = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(
      postConnect({
        slug,
        assignmentId,
        response: reflection,
      })
    );
  };

  return (
    <>
      {assignment && assignment?.part?.piece?.video && (
        <iframe
          src={assignment.part.piece.video}
          width="560"
          height="315"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
      <Form id="connect-form" onSubmit={submitAction}>
        <textarea
          name="response"
          id="response"
          rows="10"
          onChange={(e) => {
            setReflection(e.target.value);
          }}
          style={{ width: '100%' }}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
}
