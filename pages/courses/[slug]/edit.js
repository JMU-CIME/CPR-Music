import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button, Col, ListGroupItem, Row } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaPlus } from 'react-icons/fa';
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
  const enrollments = useSelector((state) => state.enrollments);
  const activities = useSelector((state) => state.activities);
  const pieces = useSelector((state) => state.pieces);
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const { data: session } = useSession();
  const djangoToken = session?.djangoToken;
  useEffect(() => {
    if (!enrollments.loaded) {
      console.log('djangoToken', djangoToken);
      dispatch(fetchEnrollments(djangoToken));
    }
    if (!activities.loaded) {
      console.log('djangoToken', djangoToken);
      dispatch(fetchActivities({ token: djangoToken, slug }));
    }
    if (!pieces.loaded) {
      console.log('djangoToken', djangoToken);
      dispatch(fetchPieces(djangoToken));
    }
  }, [slug, djangoToken]);

  const selectedEnrollment = enrollments.items.filter((enrollment) => {
    console.log('enrollment in filter', enrollment, slug);
    console.log(enrollment.course.slug === slug);
    return enrollment.course.slug === slug;
  })[0];
  console.log('pieces', pieces);
  console.log('pieces.items', pieces.items);

  const postAssignPiece = (pieceId) => (ev) =>
    dispatch(assignPiece({ djangoToken, slug, piece: pieceId }));
  return (
    <Layout>
      <h1>Edit {selectedEnrollment?.course?.name}</h1>
      <Row>
        <Col>
          <h2>Assign New Piece</h2>
          <ListGroup>
            {pieces.items &&
              pieces.items.map((piece) => (
                <ListGroupItem
                  key={piece.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>{piece.name}</div>
                  <Button onClick={postAssignPiece(piece.id)}>
                    Assign <FaPlus />
                  </Button>
                </ListGroupItem>
              ))}
          </ListGroup>
        </Col>
        <Col>
          <h2>Assignments</h2>
          <ListGroup>
            {activities.items && activities.items.length > 0 ? (
              activities.items.map((activity) => (
                <ListGroupItem key={activity.id}>{activity.name}</ListGroupItem>
              ))
            ) : (
              <p>There are no activities assigned for this course.</p>
            )}
          </ListGroup>
        </Col>
      </Row>

      <AddEditCourse />
      <AddEditStudent />
      <UploadStudents />
    </Layout>
  );
}
