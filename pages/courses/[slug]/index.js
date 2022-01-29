import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentAssignments } from '../../../actions';
import { FaPlus } from 'react-icons/fa';
import { Button, Col, ListGroupItem, Row } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Layout from '../../../components/layout';
import {
  assignPiece,
  fetchActivities,
  fetchEnrollments,
  fetchPieces,
} from '../../../actions';

export default function CourseDetails() {
  // get assignments/activities
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { items: assignments, loaded: loadedAssignments } = useSelector(
    (state) => state.assignments
  );
  const router = useRouter();
  const { slug } = router.query;

  const enrollments = useSelector((state) => state.enrollments);
  const assignedPieces = useSelector((state) => state.assignedPieces.items[slug]);
  const pieces = useSelector((state) => state.pieces);

  useEffect(() => {
    if (session) {
      dispatch(fetchStudentAssignments({ token: session.djangoToken, slug }));
    }
    if (session) {
      dispatch(fetchActivities({ token: session.djangoToken, slug }));
    }
    if (session) {
      dispatch(fetchPieces(session.djangoToken));
    }

  }, [slug, session, dispatch]);

  const postAssignPiece = (pieceId) => (ev) =>
    dispatch(
      assignPiece({ djangoToken: session.djangoToken, slug, piece: pieceId })
    );

  return (
    <Layout>
      <h1>Course Details</h1>
      <Row>
        <Col>
          <h2>Assign New Piece</h2>
          <ListGroup>
            {pieces.items &&
              pieces.items.filter((piece) => assignedPieces && assignedPieces.findIndex((assignedPiece) => assignedPiece.id == piece.id) == -1
              ).map((piece) => (
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
