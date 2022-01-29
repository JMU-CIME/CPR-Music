import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Col, ListGroupItem, Row } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaPlus, FaMusic } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  assignPiece,
  fetchActivities,
  fetchEnrollments,
  fetchPieces,
} from '../../../actions';
import AddEditCourse from '../../../components/forms/addEditCourse';
import AddEditStudent from '../../../components/forms/addEditStudent';
import UploadStudents from '../../../components/forms/uploadStudents';
import Layout from '../../../components/layout';

export default function EditCourse() {
  const router = useRouter();
  const { slug } = router.query;
  const enrollments = useSelector((state) => state.enrollments);
  const assignedPieces = useSelector((state) => state.assignedPieces.items[slug]);
  const pieces = useSelector((state) => state.pieces);
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const userInfo = useSelector((state)=>state.currentUser)

  useEffect(() => {
    // TODO
    // we drop these conditions because ...? 
    //    we should fetch based on slugs every time we get here?
    //    even though 2 of these don't pass slug? maybe those should be only once?
    // if (!enrollments.loaded) {
      dispatch(fetchEnrollments(userInfo.token));
    // }
    // if (!activities.loaded) {
      dispatch(fetchActivities({ token: userInfo.token, slug }));
    // }
    // if (!pieces.loaded) {
      dispatch(fetchPieces(userInfo.token));
    // }
  }, [slug, dispatch]);

  const selectedEnrollment = enrollments.items.filter((enrollment) => {
    // console.log('enrollment in filter', enrollment, slug);
    // console.log(enrollment.course.slug === slug);
    return enrollment.course.slug === slug;
  })[0];
  console.log('pieces', pieces);
  console.log('pieces.items', pieces.items);

  return (
    <Layout>
      <h1>Edit {selectedEnrollment?.course?.name}</h1>

      <Link href={`/courses/${slug}/instruments`}>
        <Button variant="primary">
          Set Instrument Assignments <FaMusic/>
        </Button>
      </Link>
      <AddEditCourse />
      <AddEditStudent />
      <UploadStudents />
    </Layout>
  );
}
