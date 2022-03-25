import { useDispatch, useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import { useRouter } from 'next/router';
import { assignPiece, unassignPiece } from '../../actions';

export default function TeacherCourseView({
  assignedPieces,
  pieces,
  assignments,
}) {
  const dispatch = useDispatch();

  const router = useRouter();
  const { slug } = router.query;
  const userInfo = useSelector((state) => state.currentUser);
  const postAssignPiece = (piece) => (ev) =>
    dispatch(
      assignPiece({ djangoToken: userInfo.token, slug, piece: piece })
    );
  const unassign = (piece) => (ev) => {
    dispatch(unassignPiece({ piece, slug, djangoToken: userInfo.token }));
  };
  console.log('assignedPieces', assignedPieces);
  return (
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
                  <Button onClick={postAssignPiece(piece)}>
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
              <ListGroupItem
                key={piece.id}
                className="d-flex justify-content-between"
              >
                {piece.name}
                <Button variant="danger" onClick={unassign(piece)}>
                  Delete
                </Button>
              </ListGroupItem>
            ))
          ) : (
            <p>There are no pieces assigned to this course.</p>
          )}
        </ListGroup>
      </Col>
    </Row>
  );
}
