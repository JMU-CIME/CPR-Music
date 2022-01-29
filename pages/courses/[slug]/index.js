import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import { Button, Col, ListGroupItem, Row } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { fetchStudentAssignments ,
  assignPiece,
  fetchActivities,
  fetchEnrollments,
  fetchPieces,
  selectCourse,
} from '../../../actions';
import Layout from '../../../components/layout';

export default function CourseDetails() {
  // get assignments/activities
  const userInfo = useSelector((state)=> state.currentUser)
  const dispatch = useDispatch();
  const { items: assignments, loaded: loadedAssignments } = useSelector(
    (state) => state.assignments
  );
  const router = useRouter();
  const { slug } = router.query;

  const enrollments = useSelector((state) => state.enrollments);
  console.log('enrollments', enrollments)

  const assignedPieces = useSelector((state) => state.assignedPieces.items[slug]);
  const pieces = useSelector((state) => state.pieces);

  
  const currentCourse = useSelector((state) => state.selectedCourse);

  useEffect(() => {
    dispatch(fetchStudentAssignments({ token: userInfo.token, slug }));
    dispatch(fetchActivities({ token: userInfo.token, slug }));
    dispatch(fetchPieces(userInfo.token));
    dispatch(
      selectCourse(
        enrollments.items.filter(
          (enrollment) => enrollment.course.slug === slug
        )[0].course
      )
    );
  }, [slug, dispatch]);

  const postAssignPiece = (pieceId) => (ev) =>
    dispatch(
      assignPiece({ djangoToken: userInfo.token, slug, piece: pieceId })
    );

  console.log('assignments', assignments, loadedAssignments)
  console.log(currentCourse)
  return (
    <Layout>
      <h1>{currentCourse.name}</h1>
      <Row>
        <Col>
          <h2>Assign New Piece</h2>
          <ListGroup>
            {pieces.items &&
              pieces.items
                .filter(
                  (piece) =>
                    assignedPieces &&
                    assignedPieces.findIndex(
                      (assignedPiece) => assignedPiece.id === piece.id
                    ) === -1
                )
                .map((piece) => (
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
          <h2>Assigned Pieces</h2>
          <ListGroup>
            {assignedPieces && assignedPieces.length > 0 ? (
              assignedPieces.map((piece) => (
                <ListGroupItem key={piece.id}>{piece.name}</ListGroupItem>
              ))
            ) : (
              <p>There are no pieces assigned to this course.</p>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Layout>
  );
}
